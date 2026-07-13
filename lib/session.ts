import { UserProfile } from '../types';
import { tokenStore } from './api';

const INACTIVITY_LIMIT = 3 * 60 * 60 * 1000; // 3 hours
const ACTIVITY_KEY = 'rak_last_active';
const PROFILE_KEY = 'rak_profile';

/**
 * Thin session store. The JWT itself lives in tokenStore (lib/api.ts);
 * this adds a cached profile and a client-side inactivity timeout.
 */
export const SessionManager = {
  start: (token: string, profile: UserProfile) => {
    tokenStore.set(token);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    localStorage.setItem(ACTIVITY_KEY, Date.now().toString());
  },

  cacheProfile: (profile: UserProfile) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },

  getCachedProfile: (): UserProfile | null => {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as UserProfile; } catch { return null; }
  },

  hasToken: () => !!tokenStore.get(),

  /** True if the session is expired by inactivity (3h). */
  isInactive: (): boolean => {
    const lastActive = localStorage.getItem(ACTIVITY_KEY);
    if (!lastActive) return false;
    return Date.now() - parseInt(lastActive, 10) > INACTIVITY_LIMIT;
  },

  updateActivity: () => {
    if (tokenStore.get()) {
      localStorage.setItem(ACTIVITY_KEY, Date.now().toString());
    }
  },

  clearSession: () => {
    tokenStore.clear();
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(ACTIVITY_KEY);
    // legacy cleanup
    localStorage.removeItem('rak_session_token');
    localStorage.removeItem('mock_user');
  }
};
