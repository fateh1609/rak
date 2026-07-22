import React from 'react';

/**
 * Prominent, respectful acknowledgment of Ras Al Khaimah's leadership, placed
 * directly after the hero. Displays the official portrait with the Ruler's
 * accurate name and title. It is an honorific reference to the emirate's
 * leadership — not a claim of personal endorsement of this development.
 */
export const LeadershipSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-deepblue-900 text-white py-20 md:py-28">
      {/* Subtle gold glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(197,160,40,0.14),transparent_60%)]"></div>

      <div className="relative container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Portrait */}
          <div className="shrink-0">
            <div className="relative">
              <div className="absolute -inset-2 rounded-[1.75rem] bg-gradient-to-br from-gold-500/40 to-transparent blur-sm"></div>
              <div className="relative w-56 h-72 md:w-64 md:h-80 rounded-3xl overflow-hidden border-2 border-gold-500/50 bg-deepblue-800 shadow-2xl shadow-black/40">
                <img
                  src="/highness.png"
                  alt="His Highness Sheikh Saud bin Saqr Al Qasimi"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="text-center md:text-left flex-1">
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
        </div>
      </div>
    </section>
  );
};
