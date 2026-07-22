import React from 'react';

/**
 * Respectful acknowledgment of Ras Al Khaimah's leadership. Uses the same dark
 * grid backdrop as the AI advisor section; the Ruler's portrait (a transparent
 * PNG cutout) sits frameless on the right so the background reads through.
 *
 * Honorific reference to the emirate's leadership — not a claim of personal
 * endorsement of this development.
 */
export const LeadershipSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gray-900 text-white py-16 md:py-24">
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
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12">
          {/* Text (left) */}
          <div className="md:w-1/2 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-5">
              <span className="h-px w-8 bg-gold-500"></span>
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

          {/* Portrait (right) — transparent PNG, frameless */}
          <div className="md:w-1/2 w-full flex justify-center md:justify-end">
            <div className="relative">
              {/* Soft glow so the cutout reads on the dark grid */}
              <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_50%_45%,rgba(197,160,40,0.22),transparent_65%)] blur-xl"></div>
              <img
                src="/highness.png"
                alt="His Highness Sheikh Saud bin Saqr Al Qasimi"
                className="relative z-10 w-auto max-h-[380px] md:max-h-[460px] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.5)]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
