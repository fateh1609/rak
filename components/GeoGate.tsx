import React, { useEffect, useState } from 'react';

/**
 * Client-side India-only fallback.
 *
 * The authoritative gate is the Vercel Edge Middleware (middleware.ts), which
 * runs on the deployed site. This component is a defense-in-depth / local-dev
 * fallback: it detects the visitor's country from a lightweight endpoint and,
 * if it confidently sees a non-India location, sends them to the block page.
 *
 * It FAILS OPEN — on any error, timeout, or unknown result it renders the app —
 * so a flaky geo lookup never locks out a legitimate Indian user (the edge
 * layer already blocks foreign traffic in production).
 */

const BLOCKED_COUNTRY = 'AE';
const LOOKUP_TIMEOUT_MS = 2500;

async function detectCountry(signal: AbortSignal): Promise<string | null> {
  // Cloudflare's trace endpoint is fast, free, unauthenticated, and returns a
  // line like `loc=IN`. No API key or rate-limit concerns.
  const res = await fetch('https://www.cloudflare.com/cdn-cgi/trace', { signal });
  const text = await res.text();
  const match = text.match(/loc=([A-Z]{2})/);
  return match ? match[1] : null;
}

type GateState = 'checking' | 'allowed';

export const GeoGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GateState>('checking');

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), LOOKUP_TIMEOUT_MS);
    let active = true;

    detectCountry(controller.signal)
      .then((country) => {
        if (!active) return;
        if (country && country === BLOCKED_COUNTRY) {
          // Confident UAE result → hand off to the static block page.
          window.location.replace('/blocked.html');
          return; // keep rendering nothing while the navigation happens
        }
        setState('allowed'); // Non-UAE, or unknown → allow (fail open)
      })
      .catch(() => {
        if (active) setState('allowed'); // network error / timeout → fail open
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  // Brief blank while checking (the app's own preloader takes over once allowed).
  if (state === 'checking') return null;
  return <>{children}</>;
};
