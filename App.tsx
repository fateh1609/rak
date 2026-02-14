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

// Critical assets to preload
const PRELOAD_ASSETS = [
  "https://iili.io/fQj13Ge.webp", // Logo
  "https://iili.io/fQnWtRe.jpg",  // Hero Image
];

const MIN_LOADER_DURATION = 400; // 0.4 Seconds

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Loading States
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const [areAssetsLoaded, setAreAssetsLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  // Ref to access latest session in event listeners without re-triggering effects
  const sessionRef = useRef(session);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    // 1. Asset Preloading
    const loadAssets = async () => {
      const promises = PRELOAD_ASSETS.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve; // Resolve even on error to prevent blocking
        });
      });
      await Promise.all(promises);
      setAreAssetsLoaded(true);
    };

    // 2. Auth Check
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session) {
          await fetchProfile(session.user.id);
        }
      } catch (e) {
        console.error("Auth check failed", e);
      } finally {
        setIsSessionChecked(true);
      }
    };

    // 3. Min Time Timer (for branding)
    const timer = setTimeout(() => setMinTimeElapsed(true), 2000);

    // 4. Network Listeners with Re-Link Logic
    const handleOnline = async () => {
        setIsReconnecting(true);
        
        // Wait minimum duration to show the "Reconnecting" state
        const delayPromise = new Promise(resolve => setTimeout(resolve, MIN_LOADER_DURATION));
        
        // Re-establish link to server using current session from ref
        if (sessionRef.current?.user?.id) {
            try {
               await fetchProfile(sessionRef.current.user.id);
               // Optional: Refresh session token if needed (only if real session)
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

    // Execute
    loadAssets();
    checkAuth();

    // Auth Subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        // Only clear profile if we are truly logged out from Supabase context
        // and not in a mock session state that might be managed differently
        // However, for consistency, if Supabase says logout, we logout.
        // Mock login bypasses this by setting state directly.
        setProfile(null);
      }
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs only once

  const fetchProfile = async (userId: string) => {
    try {
        const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
        if (data) {
            setProfile(data as UserProfile);
        } else {
            // Fallback for demo/mock users if not in DB
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
    setIsTransitioning(true); // Trigger transition loader
    
    // Simulate server linking and data fetch delay
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
    
    setProfile(mockProfile);
    setSession({ user: { id: mockProfile.id } });
    
    setIsTransitioning(false); 
  };

  const handleLogout = async () => {
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSession(null);
      setProfile(null);
      setIsTransitioning(false);
  }

  // Global Navigation Handler for Sub-pages
  const handleNavigate = async (callback: () => void) => {
      if (isTransitioning) return;
      
      setIsTransitioning(true);
      // Wait for minimum duration (0.8s)
      await new Promise(resolve => setTimeout(resolve, MIN_LOADER_DURATION));
      
      // Execute the view change
      callback();
      
      setIsTransitioning(false);
  };

  // Determine Loader Status
  const isInitialLoad = !(isSessionChecked && areAssetsLoaded && minTimeElapsed);
  const shouldShowLoader = isInitialLoad || !isOnline || isTransitioning || isReconnecting;
  
  let loaderStatus: 'INITIAL' | 'OFFLINE' | 'RECONNECTING' | 'TRANSITION' = 'INITIAL';
  
  if (!isOnline) loaderStatus = 'OFFLINE';
  else if (isReconnecting) loaderStatus = 'RECONNECTING';
  else if (isTransitioning) loaderStatus = 'TRANSITION';
  else if (isInitialLoad) loaderStatus = 'INITIAL';

  return (
    <PageAccessProvider>
      <CurrencyProvider>
        <Preloader 
          logoUrl={PRELOAD_ASSETS[0]} 
          isLoading={shouldShowLoader} 
          status={loaderStatus} 
        />
        
        {/* Render App Content - Hidden or Behind Preloader until ready */}
        {isSessionChecked && (
          <div className={shouldShowLoader ? 'fixed inset-0 -z-10' : ''}>
             {profile ? (
                profile.role === 'admin' ? (
                    <AdminDashboard profile={profile} onLogout={handleLogout} onNavigate={handleNavigate} />
                ) : profile.role === 'agent' ? (
                    <AgentDashboard profile={profile} onLogout={handleLogout} onNavigate={handleNavigate} />
                ) : (
                    <ClientDashboard profile={profile} onLogout={handleLogout} onNavigate={handleNavigate} />
                )
             ) : (
                <LandingPage onLogin={handleMockLogin} />
             )}
          </div>
        )}
        <SpeedInsights />
        <Analytics />
      </CurrencyProvider>
    </PageAccessProvider>
  );
};

export default App;