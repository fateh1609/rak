import React, { useState, useEffect } from 'react';
import { Download, Maximize2, X } from 'lucide-react';

/**
 * Master Plan section. Shows the RAK Oasis site layout inline (an optimized
 * WebP rendered from layout.pdf) so visitors can see it without downloading,
 * click to enlarge for detail, and download the original PDF if they want.
 */
export const MasterPlanSection: React.FC = () => {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the lightbox is open; close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <section id="masterplan" className="py-16 md:py-24 bg-[#F9F8F4] scroll-mt-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <p className="text-gold-600 text-xs uppercase tracking-[0.3em] font-semibold mb-3">Master Plan</p>
          <h2 className="text-3xl md:text-5xl font-serif text-deepblue-900 mb-4">The RAK Oasis Master Plan</h2>
          <p className="text-gray-600 leading-relaxed">
            A fully master-planned community — residential plots arranged in phases around a central
            shopping and entertainment hub, with a school, hospital, shopping mall, and dedicated
            commercial zones.
          </p>
        </div>

        {/* Inline plan (click to enlarge) */}
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => setOpen(true)}
            className="relative block w-full rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-white group"
            aria-label="Enlarge the master plan"
          >
            <img src="/masterplan.webp" alt="RAK Oasis master plan" className="w-full h-auto" loading="lazy" />
            <span className="absolute top-3 right-3 md:top-4 md:right-4 inline-flex items-center gap-2 bg-deepblue-900/80 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm group-hover:bg-deepblue-900 transition-colors">
              <Maximize2 size={14} /> Click to enlarge
            </span>
          </button>
        </div>

        {/* Download */}
        <div className="text-center mt-8">
          <a
            href="/layout.pdf"
            download
            className="inline-flex items-center gap-2 bg-deepblue-900 text-white px-6 py-3 rounded-full font-bold hover:bg-deepblue-800 transition-colors shadow-lg"
          >
            <Download size={18} /> Download Master Plan (PDF)
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {open && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col animate-fade-in-up" onClick={() => setOpen(false)}>
          <div className="flex justify-between items-center gap-4 p-4 text-white shrink-0">
            <span className="text-sm font-semibold truncate">RAK Oasis — Master Plan</span>
            <div className="flex items-center gap-2">
              <a
                href="/layout.pdf"
                download
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
              >
                <Download size={14} /> PDF
              </a>
              <button onClick={() => setOpen(false)} aria-label="Close" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={22} />
              </button>
            </div>
          </div>
          {/* Scroll/pan to inspect plot detail */}
          <div className="flex-1 overflow-auto p-2 md:p-6" onClick={(e) => e.stopPropagation()}>
            <img
              src="/masterplan.webp"
              alt="RAK Oasis master plan (full detail)"
              className="max-w-none h-auto mx-auto"
              style={{ width: 'min(2978px, 220vw)' }}
            />
          </div>
          <p className="text-center text-white/50 text-xs pb-3 shrink-0">Scroll to explore · Esc to close</p>
        </div>
      )}
    </section>
  );
};
