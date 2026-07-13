
import React, { useState, useEffect, useRef } from 'react';
import { api } from './lib/api';
import { UserProfile } from './types';
import { ClientDashboard } from './components/client/Dashboard';
import { AdminDashboard } from './components/admin/Dashboard';
import { AgentDashboard } from './components/agent/Dashboard';
import { LandingPage } from './components/LandingPage';
import { Preloader } from './components/Preloader';
import { PageAccessProvider } from './contexts/PageAccessContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { SessionManager } from './lib/session';

// Critical assets to preload
const PRELOAD_ASSETS = [
  "https://iili.io/fQj13Ge.webp", // Logo
  "https://iili.io/fQnWtRe.jpg",  // Hero Image
];

const MIN_LOADER_DURATION = 400; // 0.4 Seconds

// Wrapper component to handle routing logic
const AppContent = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Loading States
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const [areAssetsLoaded, setAreAssetsLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const profileRef = useRef(profile);
  const navigate = useNavigate();

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  // --- INACTIVITY MONITOR ---
  useEffect(() => {
    const handleActivity = () => {
        SessionManager.updateActivity();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    const interval = setInterval(() => {
        if (profileRef.current && SessionManager.isInactive()) {
            console.log("Auto-logout triggered by inactivity");
            handleLogout();
        }
    }, 60000); // Check every minute

    return () => {
        window.removeEventListener('mousemove', handleActivity);
        window.removeEventListener('keydown', handleActivity);
        window.removeEventListener('click', handleActivity);
        window.removeEventListener('scroll', handleActivity);
        clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // 1. Asset Preloading
    const loadAssets = async () => {
      const promises = PRELOAD_ASSETS.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        });
      });
      await Promise.all(promises);
      setAreAssetsLoaded(true);
    };

    // 2. Auth Check: stored JWT -> GET /auth/me
    const checkAuth = async () => {
      try {
        if (SessionManager.hasToken() && !SessionManager.isInactive()) {
          const { profile: me } = await api.get<{ profile: UserProfile }>('/auth/me');
          setProfile(me);
          SessionManager.cacheProfile(me);
          SessionManager.updateActivity();
        } else {
          SessionManager.clearSession();
        }
      } catch (e) {
        console.error("Auth check failed", e);
        SessionManager.clearSession();
      } finally {
        setIsSessionChecked(true);
      }
    };

    // 3. Min Time Timer
    const timer = setTimeout(() => setMinTimeElapsed(true), 2000);

    // 4. Network Listeners
    const handleOnline = async () => {
        setIsReconnecting(true);
        const delayPromise = new Promise(resolve => setTimeout(resolve, MIN_LOADER_DURATION));

        if (profileRef.current) {
            try {
               const { profile: me } = await api.get<{ profile: UserProfile }>('/auth/me');
               setProfile(me);
               SessionManager.cacheProfile(me);
            } catch (e) {
                console.error("Re-link failed", e);
            }
        }

        await delayPromise;
        setIsOnline(true);
        setIsReconnecting(false);
    };

    const handleOffline = () => setIsOnline(false);

    // 5. Global 401 handler (fired by lib/api.ts)
    const handleUnauthorized = () => {
        SessionManager.clearSession();
        setProfile(null);
        navigate('/', { replace: true });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('rak:unauthorized', handleUnauthorized);

    loadAssets();
    checkAuth();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('rak:unauthorized', handleUnauthorized);
    };
  }, []);

  const handleLogin = (token: string, loggedInProfile: UserProfile) => {
    SessionManager.start(token, loggedInProfile);
    setProfile(loggedInProfile);
  };

  const handleLogout = async () => {
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      SessionManager.clearSession();
      setProfile(null);
      navigate('/', { replace: true });

      setIsTransitioning(false);
  }

  const handleNavigate = async (callback: () => void) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, MIN_LOADER_DURATION));
      callback();
      setIsTransitioning(false);
  };

  const refreshProfile = async () => {
      try {
          const { profile: me } = await api.get<{ profile: UserProfile }>('/auth/me');
          setProfile(me);
          SessionManager.cacheProfile(me);
      } catch (e) {
          console.error("Profile refresh failed", e);
      }
  };

  const isInitialLoad = !(isSessionChecked && areAssetsLoaded && minTimeElapsed);
  const shouldShowLoader = isInitialLoad || !isOnline || isTransitioning || isReconnecting;

  let loaderStatus: 'INITIAL' | 'OFFLINE' | 'RECONNECTING' | 'TRANSITION' = 'INITIAL';

  if (!isOnline) loaderStatus = 'OFFLINE';
  else if (isReconnecting) loaderStatus = 'RECONNECTING';
  else if (isTransitioning) loaderStatus = 'TRANSITION';
  else if (isInitialLoad) loaderStatus = 'INITIAL';

  return (
    <>
      <Preloader
        logoUrl={PRELOAD_ASSETS[0]}
        isLoading={shouldShowLoader}
        status={loaderStatus}
      />

      {isSessionChecked && (
        <div className={shouldShowLoader ? 'fixed inset-0 -z-10' : ''}>
           <Routes>
              {/* Landing Page */}
              <Route path="/" element={
                profile ? <Navigate to={`/${profile.role}`} replace /> : <LandingPage onLogin={handleLogin} />
              } />

              {/* Protected Routes */}
              <Route path="/client/*" element={
                profile?.role === 'client' ?
                <ClientDashboard profile={profile} onLogout={handleLogout} onNavigate={handleNavigate} onProfileRefresh={refreshProfile} /> :
                <Navigate to="/" replace />
              } />

              <Route path="/agent/*" element={
                profile?.role === 'agent' ?
                <AgentDashboard profile={profile} onLogout={handleLogout} onNavigate={handleNavigate} onProfileRefresh={refreshProfile} /> :
                <Navigate to="/" replace />
              } />

              <Route path="/admin/*" element={
                profile?.role === 'admin' ?
                <AdminDashboard profile={profile} onLogout={handleLogout} onNavigate={handleNavigate} /> :
                <Navigate to="/" replace />
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
           </Routes>
        </div>
      )}
    </>
  );
};

const App = () => {
  return (
    <HashRouter>
      <PageAccessProvider>
        <CurrencyProvider>
          <AppContent />
          <SpeedInsights />
          <Analytics />
        </CurrencyProvider>
      </PageAccessProvider>
    </HashRouter>
  );
};

export default App;
