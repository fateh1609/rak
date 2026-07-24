import { useEffect } from 'react';

/**
 * Meta (Facebook) Pixel.
 *
 * Loads the pixel base code once, fires the initial PageView, and fires a
 * PageView on each client-side route change (HashRouter). The Pixel ID can be
 * overridden per-environment with VITE_META_PIXEL_ID; otherwise it falls back
 * to the project's default ID below.
 */

const PIXEL_ID: string =
  (import.meta as any).env?.VITE_META_PIXEL_ID || '1046085601192352';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: unknown;
  }
}

export const MetaPixel = () => {
  useEffect(() => {
    if (!PIXEL_ID) return;

    // Standard Meta Pixel base code (loads fbevents.js once).
    if (!window.fbq) {
      /* eslint-disable */
      (function (f: any, b: Document, e: string, v: string, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e) as HTMLScriptElement;
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode!.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */

      window.fbq!('init', PIXEL_ID);
    }

    window.fbq!('track', 'PageView');

    // SPA route changes (HashRouter) → additional PageViews.
    const onRouteChange = () => window.fbq && window.fbq('track', 'PageView');
    window.addEventListener('hashchange', onRouteChange);
    return () => window.removeEventListener('hashchange', onRouteChange);
  }, []);

  return null;
};
