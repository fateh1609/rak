import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import { Button } from './Button';

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay for animation
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 p-4 md:p-6 flex justify-center animate-fade-in-up">
      <div className="bg-deepblue-900/95 backdrop-blur-md border border-white/10 text-white p-6 rounded-xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row items-center gap-6 justify-between">
        
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gold-500/20 rounded-full text-gold-400 hidden md:block">
            <Cookie size={24} />
          </div>
          <div>
            <h4 className="font-serif font-bold text-lg mb-1">We value your privacy</h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
              By clicking "Accept", you consent to our use of cookies and local storage for faster loading times.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={onDecline}
            className="flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition border border-transparent hover:border-white/10"
          >
            Decline
          </button>
          <Button 
            onClick={onAccept} 
            className="flex-1 md:flex-none !py-2 !px-8 !text-sm"
          >
            Accept
          </Button>
        </div>

      </div>
    </div>
  );
};