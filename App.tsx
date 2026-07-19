
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './lib/supabaseClient';
import { UserProfile, UserRank } from './types';
import { ClientDashboard } from './components/client/Dashboard';
import { AdminDashboard } from './components/admin/Dashboard';
import { AgentDashboard } from './components/agent/Dashboard';
import { LandingPage } from './components/LandingPage';
import { Preloader } from './components/Preloader';
import { PageAccessProvider } from './contexts/PageAccessContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { SessionManager } from './lib/session';
import { GeoGate } from './components/GeoGate';

// Critical assets to preload
const PRELOAD_ASSETS = [
  "https://iili.io/fQj13Ge.webp", // Logo
  "https://iili.io/fQnWtRe.jpg",  // Hero Image
];

const MIN_LOADER_DURATION = 400; // 0.4 Seconds

// Wrapper component to handle routing logic
const AppContent = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Loading States
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const [areAssetsLoaded, setAreAssetsLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const sessionRef = useRef(session);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

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
        const currentUser = SessionManager.getSession();
        // If we think we are logged in (profile exists) but session manager says no (expired), logout
        if (profile && !currentUser && !session?.user?.id.startsWith('sb-')) { // Exclude real supabase sessions from this check
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
  }, [profile, session]);

  useEffect(() => {
    // 1. Asset Preloading
    const loadAssets = async () => {
      const promises = PRELOAD_ASSETS.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve; 
        });
      });
      await Promise.all(promises);
      setAreAssetsLoaded(true);
    };

    // 2. Auth Check
    const checkAuth = async () => {
      try {
        // A. Check for Token in URL (Highest Priority for Mock)
        const urlToken = searchParams.get('token');
        if (urlToken) {
            const user = SessionManager.verifyToken(urlToken);
            if (user) {
                // Initialize Session from URL
                SessionManager.setSession(urlToken);
                setProfile(user);
                setSession({ user: { id: user.id, email: user.email } });
                setIsSessionChecked(true);
                return; // Skip other checks
            } else {
                // Invalid token in URL, clean it up
                setSearchParams({}, { replace: true });
            }
        }

        // B. Check Supabase (Real Auth)
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setSession(session);
          await fetchProfile(session.user.id);
        } else {
          // C. Check Local Storage (Persisted Mock)
          const encryptedUser = SessionManager.getSession();
          if (encryptedUser) {
             setProfile(encryptedUser);
             setSession({ user: { id: encryptedUser.id, email: encryptedUser.email } });
             
             // Ensure URL reflects the token (Restore ?token=...)
             const storedToken = localStorage.getItem('rak_session_token');
             if (storedToken) {
                 setSearchParams({ token: storedToken }, { replace: true });
             }
          }
        }
      } catch (e) {
        console.error("Auth check failed", e);
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
        
        if (sessionRef.current?.user?.id) {
            try {
               await fetchProfile(sessionRef.current.user.id);
               const { data } = await supabase.auth.getSession();
               if(data.session) await supabase.auth.refreshSession(); 
            } catch (e) {
                console.error("Re-link failed", e);
            }
        }

        await delayPromise;
        setIsOnline(true);
        setIsReconnecting(false);
    };

    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadAssets();
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        fetchProfile(session.user.id);
      } else {
        if (!SessionManager.getSession()) {
            setSession(null);
            setProfile(null);
        }
      }
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      subscription.unsubscribe();
    };
  }, []); 

  const fetchProfile = async (userId: string) => {
    try {
        if (userId === 'mock-user-id-123') return;

        const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
        if (data) {
            setProfile(data as UserProfile);
        } else {
            setProfile({
                id: userId,
                full_name: 'Valued Client',
                email: '',
                mobile: '',
                role: 'client',
                rank: UserRank.AGENT,
                wallet_balance: 0,
                kyc_verified: false
            });
        }
    } catch (e) {
        console.error("Error fetching profile", e);
    }
  };

  const handleMockLogin = async (role: 'client' | 'agent' | 'admin', customData?: Partial<UserProfile>) => {
    setIsTransitioning(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const defaultName = role === 'admin' ? 'System Administrator' : role === 'agent' ? 'Rajesh Kumar' : 'Amit Sharma';
    const defaultEmail = `${role}@rakoasis.com`;

    const mockProfile: UserProfile = {
      id: 'mock-user-id-123',
      full_name: customData?.full_name || defaultName,
      email: customData?.email || defaultEmail,
      mobile: customData?.mobile || '+971 50 123 4567',
      role: role,
      agent_code: role === 'agent' ? 'AGT-10523' : role === 'client' ? 'AGT-10523' : undefined,
      rank: role === 'agent' ? UserRank.AREA_MANAGER : UserRank.AGENT,
      wallet_balance: role === 'agent' ? 434047 : 0,
      kyc_verified: true
    };
    
    // Create Session
    const token = SessionManager.createSession(mockProfile);

    // Update URL with Token
    setSearchParams({ token }, { replace: true });

    setProfile(mockProfile);
    setSession({ user: { id: mockProfile.id, email: mockProfile.email } });
    
    setIsTransitioning(false); 
  };

  const handleLogout = async () => {
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 1. Clear Storage
      SessionManager.clearSession();
      
      // 2. Sign out Supabase (if active)
      await supabase.auth.signOut();

      // 3. Clear State
      setSession(null);
      setProfile(null);

      // 4. Remove Token from URL & Navigate Home
      setSearchParams({}, { replace: true });
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
                profile ? <Navigate to={`/${profile.role}`} replace /> : <LandingPage onLogin={handleMockLogin} />
              } />

              {/* Protected Routes */}
              <Route path="/client/*" element={
                profile?.role === 'client' ? 
                <ClientDashboard profile={profile} onLogout={handleLogout} onNavigate={handleNavigate} /> : 
                <Navigate to="/" replace />
              } />
              
              <Route path="/agent/*" element={
                profile?.role === 'agent' ? 
                <AgentDashboard profile={profile} onLogout={handleLogout} onNavigate={handleNavigate} /> : 
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
    <GeoGate>
      <HashRouter>
        <PageAccessProvider>
          <CurrencyProvider>
            <AppContent />
            <SpeedInsights />
            <Analytics />
          </CurrencyProvider>
        </PageAccessProvider>
      </HashRouter>
    </GeoGate>
  );
};

export default App;
