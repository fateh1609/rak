import React, { useEffect, useState } from 'react';
import { Tag } from 'lucide-react';
import {
  isPromoActive,
  REGULAR_PRICE_AED,
  PROMO_PRICE_AED,
  PROMO_END,
  PROMO_END_LABEL,
} from '../lib/pricing';

/** Formats the time remaining until the promo ends as "12d 04h 33m". */
const formatRemaining = (ms: number): string => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
};

/**
 * Thin top strip announcing the government promotional price (131 AED/sq.ft,
 * down from 351) with a live countdown. Renders nothing once the promo ends.
 */
export const PromoBanner: React.FC = () => {
  const [remaining, setRemaining] = useState(() => PROMO_END.getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => setRemaining(PROMO_END.getTime() - Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!isPromoActive()) return null;

  return (
    <div className="relative z-50 bg-gold-500 text-deepblue-900">
      <div className="container mx-auto px-4 py-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs sm:text-sm font-semibold">
        <span className="inline-flex items-center gap-1.5">
          <Tag size={14} className="shrink-0" />
          Government Promotional Offer
        </span>
        <span className="hidden sm:inline text-deepblue-900/40">|</span>
        <span>
          <span className="line-through opacity-60 font-normal">AED {REGULAR_PRICE_AED}</span>{' '}
          <span className="font-bold">AED {PROMO_PRICE_AED}/sq.ft</span>
        </span>
        <span className="hidden sm:inline text-deepblue-900/40">|</span>
        <span className="font-bold tabular-nums">Ends in {formatRemaining(remaining)}</span>
        <span className="hidden md:inline text-deepblue-900/70 font-normal">
          (until {PROMO_END_LABEL})
        </span>
      </div>
    </div>
  );
};
