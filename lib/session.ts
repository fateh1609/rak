
import { UserProfile } from '../types';

const SECRET_KEY = "RAK_OASIS_ESTATE_SECURE_2026";
const INACTIVITY_LIMIT = 3 * 60 * 60 * 1000; // 3 Hours
const TOKEN_KEY = 'rak_session_token';
const ACTIVITY_KEY = 'rak_last_active';

// Simple XOR Cipher to simulate payload encryption
const xorEncrypt = (text: string, key: string): string => {
  return text.split('').map((char, i) =>
    String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
  ).join('');
};

export const SessionManager = {
  // Generate an "Encrypted" JWT
  createSession: (user: UserProfile) => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWE" }));
    
    const payloadData = {
      ...user,
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000) // Token valid for 24h absolute, but session controlled by inactivity
    };
    
    // Encrypt payload
    const payloadString = JSON.stringify(payloadData);
    const encryptedPayload = btoa(xorEncrypt(payloadString, SECRET_KEY));
    
    // Generate mock signature
    const signature = btoa(xorEncrypt(header + "." + encryptedPayload, SECRET_KEY)).slice(0, 20);
    
    const token = `${header}.${encryptedPayload}.${signature}`;
    
    // Store
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ACTIVITY_KEY, Date.now().toString());
    
    console.log("%c🔐 ENCRYPTED JWT GENERATED:", "color: #C5A028; font-weight: bold; font-size: 12px;");
    console.log(token);
    
    return token;
  },

  // Manual Set Session (e.g. from URL)
  setSession: (token: string) => {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(ACTIVITY_KEY, Date.now().toString());
  },

  // Verify Token String without storage dependency
  verifyToken: (token: string): UserProfile | null => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error("Invalid Token Format");

      const encryptedPayload = parts[1];
      const decryptedString = xorEncrypt(atob(encryptedPayload), SECRET_KEY);
      const data = JSON.parse(decryptedString);

      // Basic structure check
      if (!data.id || !data.role) return null;

      return data as UserProfile;
    } catch (e) {
      console.error("Token verification failed", e);
      return null;
    }
  },

  // Validate and Decrypt Session from Storage
  getSession: (): UserProfile | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    const lastActive = localStorage.getItem(ACTIVITY_KEY);

    if (!token || !lastActive) return null;

    // Check Inactivity
    const timeSinceActive = Date.now() - parseInt(lastActive, 10);
    if (timeSinceActive > INACTIVITY_LIMIT) {
      console.warn("Session expired due to inactivity");
      SessionManager.clearSession();
      return null;
    }

    return SessionManager.verifyToken(token);
  },

  updateActivity: () => {
    if (localStorage.getItem(TOKEN_KEY)) {
      localStorage.setItem(ACTIVITY_KEY, Date.now().toString());
    }
  },

  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ACTIVITY_KEY);
    localStorage.removeItem('mock_user'); // Cleanup legacy
  }
};
