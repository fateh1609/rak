import React from 'react';

/**
 * Respectful acknowledgment of Ras Al Khaimah's leadership. Dark topographic
 * grid backdrop (matching the AI advisor section). The Ruler's portrait is a
 * transparent PNG cutout, shown large and anchored flush to the bottom of the
 * section with a soft bottom fade, so it reads as grounded rather than floating.
 *
 * Honorific reference to the emirate's leadership — not a claim of personal
 * endorsement of this development.
 */
export const LeadershipSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gray-900 text-white pt-16 md:pt-24">
      {/* Topographic grid (matches the AI advisor section) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="grid-leadership" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-leadership)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-6 md:min-h-[560px]">
          {/* Text (left) — lifted off the bottom edge */}
          <div className="md:w-1/2 md:pb-28 order-2 md:order-1 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-5">
              <span className="h-px w-10 bg-gold-500"></span>
              <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-semibold">
                Under the Leadership of Ras Al Khaimah
              </span>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              His Highness Sheikh<br className="hidden md:block" /> Saud bin Saqr Al Qasimi
            </h2>

            <p className="text-gold-200 text-base md:text-lg font-medium mb-6">
              Ruler of Ras Al Khaimah &middot; Member of the Supreme Council of the United Arab Emirates
            </p>

            <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
              Guided by a bold and forward-looking vision, Ras Al Khaimah has become one of the
              region's most dynamic destinations for tourism, lifestyle, and investment. RAK Oasis
              is proud to be part of the emirate's remarkable journey of growth and prosperity.
            </p>
          </div>

          {/* Portrait (right) — large, transparent PNG, anchored flush to the bottom */}
          <div className="md:w-1/2 w-full flex justify-center md:justify-end self-end order-1 md:order-2">
            <div className="relative">
              {/* Soft glow so the cutout reads on the dark grid */}
              <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_50%_40%,rgba(197,160,40,0.25),transparent_62%)] blur-2xl"></div>
              <img
                src="/highness.png"
                alt="His Highness Sheikh Saud bin Saqr Al Qasimi"
                className="relative z-10 w-auto h-[380px] md:h-[540px] lg:h-[620px] object-contain object-bottom drop-shadow-[0_25px_50px_rgba(0,0,0,0.55)]"
                style={{
                  WebkitMaskImage: 'linear-gradient(to bottom, black 86%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, black 86%, transparent 100%)',
                }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
