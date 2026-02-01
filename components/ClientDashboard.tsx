import React from 'react';
import { supabase } from '../lib/supabaseClient';
import { LogOut, User, FileText, Map, ShieldCheck, Home } from 'lucide-react';
import { Button } from './Button';
import { UserProfile } from '../types';

interface DashboardProps {
  profile: UserProfile | null;
  onLogout: () => void;
}

export const ClientDashboard: React.FC<DashboardProps> = ({ profile, onLogout }) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-deepblue-900 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 md:w-10 md:h-10 bg-gold-500 rounded-lg flex items-center justify-center font-serif font-bold text-deepblue-900 text-xl">R</div>
             <span className="font-serif font-bold text-lg md:text-xl tracking-wide">RAK Oasis <span className="text-gold-400 font-sans text-xs uppercase tracking-widest font-normal ml-1">Client Portal</span></span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-bold text-white">{profile?.full_name || 'Valued Client'}</span>
                <span className="text-xs text-gold-400 uppercase tracking-wider">{profile?.role || 'Investor'}</span>
             </div>
             <button 
               onClick={handleSignOut}
               className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white"
               title="Sign Out"
             >
               <LogOut size={20} />
             </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-deepblue-900">Welcome, {profile?.full_name?.split(' ')[0] || 'Client'}</h1>
            <p className="text-gray-500">Here is the status of your investment journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Status Card 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">Account Verified</h3>
                    <p className="text-sm text-gray-500 mt-1">Your identity and agent code have been successfully verified.</p>
                </div>
            </div>

            {/* Status Card 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-deepblue-900 rounded-lg">
                    <FileText size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">Documents</h3>
                    <p className="text-sm text-gray-500 mt-1">Phase 1 Brochure and Payment Plan details are available.</p>
                </div>
            </div>

             {/* Status Card 3 */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="p-3 bg-gold-50 text-gold-600 rounded-lg">
                    <Home size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">My Plots</h3>
                    <p className="text-sm text-gray-500 mt-1">No plots reserved yet. View the masterplan to select.</p>
                </div>
            </div>
        </div>

        {/* Action Area */}
        <div className="bg-deepblue-900 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">Phase 1 is Selling Fast</h2>
                <p className="text-blue-100 mb-8 text-lg">You have successfully registered your interest. Our sales team has been notified and will contact you shortly to finalize your plot allocation.</p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="primary">
                        <Map size={18} /> View Interactive Masterplan
                    </Button>
                    <button className="px-6 py-3 rounded-md font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors">
                        Download Brochure
                    </button>
                </div>
            </div>
            
            {/* Background Decor */}
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#D4AF37" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.3,82.2,22.9,71.3,34.3C60.4,45.7,49.9,54.9,38.3,62.8C26.7,70.7,14,77.3,0.6,76.3C-12.8,75.3,-24.6,66.7,-35.8,58.3C-47,49.9,-57.6,41.7,-65.3,31.2C-73,20.7,-77.8,7.9,-75.7,-3.9C-73.6,-15.7,-64.6,-26.5,-55.1,-35.9C-45.6,-45.3,-35.6,-53.3,-24.5,-62.3C-13.4,-71.3,-1.2,-81.3,12.3,-83.4C25.8,-85.5,41.4,-79.7,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
            </div>
        </div>

      </div>
    </div>
  );
};