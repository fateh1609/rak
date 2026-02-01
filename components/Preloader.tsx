import React, { useState } from 'react';

interface PreloaderProps {
  logoUrl: string;
  isLoading: boolean;
}

export const Preloader: React.FC<PreloaderProps> = ({ logoUrl, isLoading }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-deepblue-900 transition-all duration-1000 ease-in-out ${
        isLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Centered Logo Area */}
      <div className="relative flex flex-col items-center justify-center w-full px-4 text-center">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-gold-500/10 rounded-full blur-[100px] animate-pulse"></div>

        {/* Logo with Fallback */}
        <div className="relative z-10">
          {!imgError ? (
            <img 
              src={logoUrl} 
              alt="RAK Oasis" 
              className="h-32 md:h-64 w-auto object-contain drop-shadow-2xl opacity-90 mx-auto"
              onError={() => setImgError(true)}
            />
          ) : (
            // Fallback Typography if image fails
            <div className="flex flex-col items-center animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-widest mb-2 border-b-2 border-gold-500 pb-2">
                RAK OASIS
              </h1>
              <p className="text-gold-400 text-xs md:text-sm tracking-[0.4em] uppercase font-light">
                Premium Estate
              </p>
            </div>
          )}
        </div>
        
      </div>

      {/* Minimal Bottom Loader */}
      <div className="absolute bottom-12 md:bottom-16 flex flex-col items-center gap-4">
        <div className="text-gold-400/80 font-serif tracking-[0.4em] text-[10px] uppercase animate-pulse">
          Loading Experience
        </div>
        {/* Minimal Line */}
        <div className="w-16 h-[1px] bg-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gold-400/50 w-full animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};