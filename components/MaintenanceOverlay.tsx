
import React from 'react';
import { Construction, Clock, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface MaintenanceOverlayProps {
  onBack: () => void;
  title?: string;
}

export const MaintenanceOverlay: React.FC<MaintenanceOverlayProps> = ({ onBack, title = "Under Maintenance" }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[500px] animate-fade-in-up p-8 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 border-4 border-gray-200">
        <Construction size={48} className="text-gold-500" />
      </div>
      
      <h2 className="text-3xl font-serif font-bold text-deepblue-900 mb-3">{title}</h2>
      <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
        We are currently enhancing this module to serve you better. 
        This section is temporarily unavailable but will be back shortly with new features.
      </p>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3 mb-8 max-w-sm mx-auto">
        <Clock size={20} className="text-blue-600" />
        <div className="text-left">
          <p className="text-xs font-bold text-blue-800 uppercase">Estimated Return</p>
          <p className="text-sm text-blue-700">Usually within 24 hours</p>
        </div>
      </div>

      <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
        <ArrowLeft size={16} /> Return to Dashboard
      </Button>
    </div>
  );
};
