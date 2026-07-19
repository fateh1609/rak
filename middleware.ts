import { rewrite, next } from '@vercel/edge';

/**
 * India-only access gate (Vercel Edge Middleware).
 *
 * Reads Vercel's geo header (`x-vercel-ip-country`) for the true connecting IP
 * and rewrites any request from outside India to the static block page. This
 * runs at the edge BEFORE the app is served, so it cannot be bypassed by
 * disabling JavaScript.
 *
 * Notes:
 * - Only active on Vercel deployments. Local `vite dev` relies on the
 *   client-side fallback (see lib/GeoGate.tsx).
 * - Country-level geolocation only. A VPN/proxy whose exit node is in India
 *   will still appear Indian — blocking those needs a dedicated VPN/proxy
 *   detection service layered on top.
 * - Fails open when the country is unknown (empty header) to avoid wrongly
 *   blocking legitimate Indian users on requests where geo is unavailable.
 */

export const config = {
  // Run on app/navigation requests; skip build assets and the block page itself.
  matcher: ['/((?!assets/|blocked.html|favicon|robots.txt|sitemap.xml|.*\\.[a-zA-Z0-9]+$).*)'],
};

const ALLOWED_COUNTRY = 'IN';

export default function middleware(request: Request) {
  const country = request.headers.get('x-vercel-ip-country') || '';

  if (country && country !== ALLOWED_COUNTRY) {
    return rewrite(new URL('/blocked.html', request.url));
  }

  return next();
}
