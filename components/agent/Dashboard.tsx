
import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { 
  LogOut, Users, Award, DollarSign, Home, Smartphone, User, 
  Globe, Briefcase, Plus, Menu, X, ChevronRight, Bell
} from 'lucide-react';
import { UserProfile } from '../../types';
import { Button } from '../Button';
import { DashboardHome } from './Home';
import { NetworkView } from './Network';
import { SalesView } from './Sales';
import { EarningsView } from './Earnings';
import { LeaderboardView } from './Leaderboard';
import { RecruitAgent } from './Recruit';
import { MarketingView } from './Marketing';
import { ProfileView } from './Profile';
import { SupportView } from './Support';

// --- TYPES ---
export type AgentView = 'DASHBOARD' | 'NETWORK' | 'SALES' | 'EARNINGS' | 'LEADERBOARD' | 'MARKETING' | 'PROFILE' | 'SUPPORT' | 'RECRUIT';

interface DashboardProps {
  profile: UserProfile | null;
  onLogout: () => void;
  onNavigate: (callback: () => void) => void;
}

export const AgentDashboard: React.FC<DashboardProps> = ({ profile, onLogout, onNavigate }) => {
  const [view, setView] = useState<AgentView>('DASHBOARD');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const navigateTo = (newView: AgentView) => {
      onNavigate(() => {
          setView(newView);
          setSidebarOpen(false);
      });
  };

  const renderContent = () => {
      switch(view) {
          case 'NETWORK': return <NetworkView onRecruit={() => navigateTo('RECRUIT')} />;
          case 'RECRUIT': return <RecruitAgent onCancel={() => navigateTo('NETWORK')} onSuccess={() => navigateTo('NETWORK')} />;
          case 'SALES': return <SalesView />;
          case 'EARNINGS': return <EarningsView />;
          case 'LEADERBOARD': return <LeaderboardView />;
          case 'MARKETING': return <MarketingView profile={profile} />;
          case 'PROFILE': return <ProfileView profile={profile} />;
          case 'SUPPORT': return <SupportView />;
          default: return <DashboardHome profile={profile} onChangeView={(v: AgentView) => navigateTo(v)} />;
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[250px] bg-deepblue-900 text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 shadow-2xl flex flex-col border-r border-white/5`}>
         <div className="p-6 border-b border-white/10 flex items-center justify-between">
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center font-serif font-bold text-deepblue-900 text-xl shadow-lg shadow-gold-500/20">R</div>
                 <div>
                     <h1 className="font-serif font-bold text-lg tracking-wide text-white">RAK Oasis</h1>
                     <p className="text-[10px] text-gold-400 uppercase tracking-widest font-medium">Agent Portal</p>
                 </div>
             </div>
             <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/50 hover:text-white transition"><X size={20} /></button>
         </div>

         <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
             <NavItem icon={Home} label="Dashboard" active={view === 'DASHBOARD'} onClick={() => navigateTo('DASHBOARD')} />
             <NavItem icon={Users} label="My Network" active={view === 'NETWORK' || view === 'RECRUIT'} onClick={() => navigateTo('NETWORK')} />
             <NavItem icon={Briefcase} label="Sales" active={view === 'SALES'} onClick={() => navigateTo('SALES')} />
             <NavItem icon={DollarSign} label="Earnings" active={view === 'EARNINGS'} onClick={() => navigateTo('EARNINGS')} />
             <NavItem icon={Award} label="Leaderboard" active={view === 'LEADERBOARD'} onClick={() => navigateTo('LEADERBOARD')} />
             
             <div className="my-4 border-t border-white/10"></div>
             
             <NavItem icon={Globe} label="Marketing" active={view === 'MARKETING'} onClick={() => navigateTo('MARKETING')} />
             <NavItem icon={User} label="Profile" active={view === 'PROFILE'} onClick={() => navigateTo('PROFILE')} />
             <NavItem icon={Smartphone} label="Support" active={view === 'SUPPORT'} onClick={() => navigateTo('SUPPORT')} />
         </nav>

         {/* Rank Progress Widget */}
         <div className="p-5 bg-deepblue-800/50 border-t border-white/10">
             <div className="flex justify-between text-xs text-gray-300 mb-2 font-medium">
                 <span>Rank 3: Area Manager</span>
                 <span className="text-gold-400 font-bold">80%</span>
             </div>
             <div className="w-full bg-deepblue-950 rounded-full h-2 mb-3 overflow-hidden border border-white/5">
                 <div className="bg-gradient-to-r from-gold-600 to-gold-400 h-full rounded-full shadow-[0_0_10px_rgba(197,160,40,0.5)]" style={{ width: '80%' }}></div>
             </div>
             <div className="flex justify-between items-center">
                <p className="text-[10px] text-gray-400">Next: Rank 4</p>
                <button onClick={() => navigateTo('DASHBOARD')} className="text-[10px] text-gold-400 font-bold uppercase tracking-wider hover:text-white transition flex items-center gap-1">
                    Details <ChevronRight size={10} />
                </button>
             </div>
         </div>

         {/* Quick Stats Footer */}
         <div className="p-5 bg-deepblue-900 border-t border-white/10 text-xs text-gray-400 space-y-2">
             <div className="flex justify-between">
                 <span>📦 Direct Team:</span>
                 <span className="text-white font-bold">8</span>
             </div>
             <div className="flex justify-between">
                 <span>🌐 Total Network:</span>
                 <span className="text-white font-bold">43</span>
             </div>
             <div className="flex justify-between">
                 <span>💵 This Month:</span>
                 <span className="text-green-400 font-bold">₹4.8L</span>
             </div>
         </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0 sticky top-0 z-40 shadow-sm">
              <div className="flex items-center gap-4">
                  <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:text-deepblue-900"><Menu size={24} /></button>
                  <h2 className="text-xl font-bold text-deepblue-900 hidden sm:block">
                      Welcome, {profile?.full_name?.split(' ')[0]}!
                  </h2>
              </div>
              <div className="flex items-center gap-3 md:gap-6">
                  <Button className="!py-2 !px-4 !text-xs hidden sm:flex items-center gap-1 shadow-gold-500/20 rounded-full" onClick={() => navigateTo('SALES')}>
                      <Plus size={14} /> Add New Client
                  </Button>
                  <div className="flex items-center gap-4">
                      <button className="relative p-2 text-gray-400 hover:text-deepblue-900 transition">
                          <Bell size={20} />
                          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white flex items-center justify-center text-[8px] font-bold text-white">5</span>
                      </button>
                      <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                      
                      {/* Profile Dropdown Trigger */}
                      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigateTo('PROFILE')}>
                          <div className="text-right hidden sm:block leading-tight">
                              <p className="text-sm font-bold text-gray-900 group-hover:text-gold-600 transition">{profile?.full_name}</p>
                              <p className="text-[10px] text-gray-500 font-mono bg-gray-100 px-1.5 rounded inline-block mt-0.5">{profile?.agent_code || 'AGT-10523'}</p>
                          </div>
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold group-hover:bg-gold-500 group-hover:text-white transition shadow-sm border border-gray-200 overflow-hidden">
                              {profile?.full_name?.charAt(0)}
                          </div>
                          <ChevronRight className="rotate-90 text-gray-400" size={16} />
                      </div>
                      <button onClick={handleSignOut} className="ml-2 text-gray-400 hover:text-red-500"><LogOut size={20} /></button>
                  </div>
              </div>
          </header>

          {/* Scrollable Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
              {renderContent()}
          </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group mb-1 ${
            active 
            ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/20 font-bold border-l-4 border-white' 
            : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
        }`}
    >
        <Icon size={18} className={`group-hover:scale-110 transition-transform ${active ? 'text-white' : 'text-gray-500 group-hover:text-gold-400'}`} /> 
        <span className={active ? '' : 'font-medium tracking-wide text-sm'}>{label}</span>
    </button>
);
