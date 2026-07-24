/**
 * Central pricing config.
 *
 * Regular price is 251 AED/sq.ft. A limited government promotional offer brings
 * it down to 131 AED/sq.ft for 2 months. When the promo window ends, the site
 * automatically reverts to the regular price (no redeploy needed).
 */

export const REGULAR_PRICE_AED = 251;
export const REGULAR_PRICE_INR = 6275; // 251 AED at the 25 INR/AED rate used across the app

export const PROMO_PRICE_AED = 131;
export const PROMO_PRICE_INR = 3275; // 131 AED at 25 INR/AED

// Government promotional window: 2 months from launch (Gulf Standard Time).
export const PROMO_START = new Date('2026-07-14T00:00:00+04:00');
export const PROMO_END = new Date('2026-09-14T23:59:59+04:00');

export const isPromoActive = (now: Date = new Date()): boolean =>
  now >= PROMO_START && now <= PROMO_END;

/** Price in effect right now (promo price while the offer is live). */
export const activePriceAed = (now: Date = new Date()): number =>
  isPromoActive(now) ? PROMO_PRICE_AED : REGULAR_PRICE_AED;

export const activePriceInr = (now: Date = new Date()): number =>
  isPromoActive(now) ? PROMO_PRICE_INR : REGULAR_PRICE_INR;

/** Human-readable end date, e.g. "14 September 2026". */
export const PROMO_END_LABEL = PROMO_END.toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/** Whole days remaining in the promo (0 once expired). */
export const promoDaysLeft = (now: Date = new Date()): number =>
  Math.max(0, Math.ceil((PROMO_END.getTime() - now.getTime()) / 86_400_000));
