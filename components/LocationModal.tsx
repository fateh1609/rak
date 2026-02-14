
import React from 'react';
import { X, MapPin } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Coordinates: 25°44'37"N 56°00'08"E
  const lat = 25.743611;
  const lng = 56.002222;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-deepblue-900/90 backdrop-blur-md animate-fade-in-up"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl h-[80vh] bg-black rounded-2xl overflow-hidden shadow-2xl border border-gold-500/30 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-deepblue-900 px-6 py-4 flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-gold-500 p-2 rounded-full text-white">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="text-white font-serif font-bold text-lg">Project Location</h3>
              <p className="text-gold-400 text-xs tracking-wider font-mono">25°44'37"N 56°00'08"E</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close Map"
            className="text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Map Iframe */}
        <div className="flex-1 relative bg-gray-900">
           {/* Loading state placeholder behind iframe */}
           <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
             Loading Satellite View...
           </div>
           
           <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight={0} 
            marginWidth={0} 
            src={`https://maps.google.com/maps?q=${lat},${lng}&t=k&z=17&ie=UTF8&iwloc=&output=embed`}
            className="w-full h-full relative z-10"
            title="RAK Oasis Location"
            allowFullScreen
          ></iframe>
        </div>
        
        {/* Footer info */}
        <div className="bg-deepblue-900 px-6 py-3 border-t border-white/10 text-center md:text-left">
           <p className="text-gray-400 text-xs">
             *Satellite imagery provides a real-world view of the RAK Oasis development site.
           </p>
        </div>
      </div>
    </div>
  );
};
