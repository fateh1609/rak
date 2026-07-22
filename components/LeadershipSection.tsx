import React from 'react';

/**
 * Respectful acknowledgment of Ras Al Khaimah's leadership. Displays the
 * official portrait with the Ruler's accurate name and title. It is an
 * honorific reference to the emirate's leadership — not a claim of personal
 * endorsement of this development.
 */
export const LeadershipSection: React.FC = () => {
  return (
    <section className="bg-deepblue-900 text-white py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Portrait */}
          <div className="shrink-0">
            <div className="w-44 h-56 md:w-52 md:h-64 rounded-2xl overflow-hidden border border-gold-500/30 bg-deepblue-800 shadow-2xl">
              <img
                src="/highness.png"
                alt="His Highness Sheikh Saud bin Saqr Al Qasimi"
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </div>
          </div>

          {/* Text */}
          <div className="text-center md:text-left">
            <p className="text-gold-400 text-xs uppercase tracking-[0.25em] font-semibold mb-4">
              Ras Al Khaimah
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3 leading-snug">
              His Highness Sheikh Saud bin Saqr Al Qasimi
            </h2>
            <p className="text-blue-200 text-sm md:text-base leading-relaxed">
              Ruler of Ras Al Khaimah and Member of the Supreme Council of the United Arab Emirates.
            </p>
            <div className="w-16 h-0.5 bg-gold-500 rounded-full mx-auto md:mx-0 mt-6"></div>
            <p className="text-white/60 text-sm mt-4 max-w-lg">
              Under the emirate's visionary leadership, Ras Al Khaimah continues its rise as one
              of the region's most dynamic destinations for tourism, lifestyle, and investment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
