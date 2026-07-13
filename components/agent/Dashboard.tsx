
import React, { useState } from 'react';
import {
  LogOut, Users, Award, DollarSign, Home, Smartphone, User,
  Globe, Briefcase, Plus, Menu, X, ChevronRight, Bell, GraduationCap
} from 'lucide-react';
import { UserProfile } from '../../types';
import { Button } from '../Button';
import { api } from '../../lib/api';
import { DashboardHome } from './Home';
import { NetworkView } from './Network';
import { SalesView } from './Sales';
import { EarningsView } from './Earnings';
import { LeaderboardView } from './Leaderboard';
import { RecruitAgent } from './Recruit';
import { MarketingView } from './Marketing';
import { TrainingView } from './Training';
import { ProfileView } from './Profile';
import { SupportView } from './Support';
import { usePageAccess } from '../../contexts/PageAccessContext';
import { MaintenanceOverlay } from '../MaintenanceOverlay';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

interface DashboardProps {
  profile: UserProfile | null;
  onLogout: () => void;
  onNavigate: (callback: () => void) => void;
  onProfileRefresh?: () => void;
}

export const AgentDashboard: React.FC<DashboardProps> = ({ profile, onLogout, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const { settings } = usePageAccess();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    api.get<{ stats: any }>('/network/stats')
      .then(({ stats: s }) => setStats(s))
      .catch(() => setStats(null));
  }, []);

  const handleSignOut = () => {
    onLogout();
  };

  const handleNav = (path: string) => {
      onNavigate(() => {
          navigate(path);
          setSidebarOpen(false);
      });
  };

  // Determine current view for highlighting
  // Map paths to setting keys
  const getActiveKey = () => {
      const path = location.pathname.split('/').pop()?.toUpperCase() || 'DASHBOARD';
      if (path === 'AGENT') return 'DASHBOARD';
      if (path === 'RECRUIT') return 'NETWORK';
      return path;
  };
  
  const currentKey = getActiveKey();
  const displayTitle = location.pathname === '/agent' || location.pathname === '/agent/' ? 'Dashboard' : currentKey.charAt(0) + currentKey.slice(1).toLowerCase().replace('_', ' ');

  const navItems = [
      { id: '', label: 'Dashboard', icon: Home, key: 'DASHBOARD' },
      { id: 'network', label: 'My Network', icon: Users, key: 'NETWORK' },
      { id: 'sales', label: 'Sales', icon: Briefcase, key: 'SALES' },
      { id: 'earnings', label: 'Earnings', icon: DollarSign, key: 'EARNINGS' },
      { id: 'leaderboard', label: 'Leaderboard', icon: Award, key: 'LEADERBOARD' },
      { divider: true },
      { id: 'marketing', label: 'Marketing', icon: Globe, key: 'MARKETING' },
      { id: 'training', label: 'Training', icon: GraduationCap, key: 'TRAINING' },
      { id: 'profile', label: 'Profile', icon: User, key: 'PROFILE' },
      { id: 'support', label: 'Support', icon: Smartphone, key: 'SUPPORT' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      {/* MOBILE BACKDROP OVERLAY */}
      {sidebarOpen && (
         <div 
           className="fixed inset-0 z-40 bg-deepblue-900/80 backdrop-blur-sm lg:hidden transition-opacity"
           onClick={() => setSidebarOpen(false)}
         />
      )}

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
             {navItems.map((item, index) => {
                 if (item.divider) return <div key={index} className="my-4 border-t border-white/10"></div>;
                 if (!item.id && item.id !== '') return null; // Should not happen based on array
                 if (item.key && settings.agent[item.key] === 'HIDDEN') return null;
                 
                 const isActive = item.id === '' 
                    ? location.pathname === '/agent' || location.pathname === '/agent/'
                    : location.pathname.includes(`/agent/${item.id}`);

                 return (
                     <NavItem 
                        key={index}
                        icon={item.icon} 
                        label={item.label} 
                        active={isActive} 
                        onClick={() => handleNav(item.id || '')} 
                     />
                 );
             })}
         </nav>

         {/* Rank Progress Widget */}
         {(() => {
             const RANK_NAMES: Record<number, string> = { 1: 'Agent', 2: 'Senior Agent', 3: 'Area Manager', 4: 'Zonal Head', 5: 'President' };
             const rank = stats?.rank || profile?.rank || 1;
             return (
                 <div className="p-5 bg-deepblue-800/50 border-t border-white/10">
                     <div className="flex justify-between text-xs text-gray-300 mb-2 font-medium">
                         <span>Rank {rank}: {RANK_NAMES[rank]}</span>
                     </div>
                     <div className="w-full bg-deepblue-950 rounded-full h-2 mb-3 overflow-hidden border border-white/5">
                         <div className="bg-gradient-to-r from-gold-600 to-gold-400 h-full rounded-full shadow-[0_0_10px_rgba(197,160,40,0.5)]" style={{ width: `${(rank / 5) * 100}%` }}></div>
                     </div>
                     <div className="flex justify-between items-center">
                        <p className="text-[10px] text-gray-400">{rank < 5 ? `Next: ${RANK_NAMES[rank + 1]}` : 'Top Rank Achieved'}</p>
                        <button onClick={() => handleNav('')} className="text-[10px] text-gold-400 font-bold uppercase tracking-wider hover:text-white transition flex items-center gap-1">
                            Details <ChevronRight size={10} />
                        </button>
                     </div>
                 </div>
             );
         })()}

         {/* Quick Stats Footer */}
         <div className="p-5 bg-deepblue-900 border-t border-white/10 text-xs text-gray-400 space-y-2">
             <div className="flex justify-between">
                 <span>📦 Direct Team:</span>
                 <span className="text-white font-bold">{stats?.direct_team ?? '—'}</span>
             </div>
             <div className="flex justify-between">
                 <span>🌐 Total Network:</span>
                 <span className="text-white font-bold">{stats?.total_network ?? '—'}</span>
             </div>
             <div className="flex justify-between">
                 <span>💵 This Month:</span>
                 <span className="text-green-400 font-bold">₹{Number(stats?.month_earnings || 0).toLocaleString('en-IN')}</span>
             </div>
         </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0 sticky top-0 z-30 shadow-sm">
              <div className="flex items-center gap-4">
                  <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:text-deepblue-900"><Menu size={24} /></button>
                  <h2 className="text-xl font-bold text-deepblue-900 hidden sm:block capitalize">
                      {location.pathname === '/agent' || location.pathname === '/agent/' ? `Welcome, ${profile?.full_name?.split(' ')[0]}!` : displayTitle}
                  </h2>
                  <h2 className="text-lg font-bold text-deepblue-900 sm:hidden">RAK Agent</h2>
              </div>
              <div className="flex items-center gap-3 md:gap-6">
                  <Button className="!py-2 !px-4 !text-xs hidden sm:flex items-center gap-1 shadow-gold-500/20 rounded-full" onClick={() => handleNav('sales')}>
                      <Plus size={14} /> Add New Client
                  </Button>
                  <div className="flex items-center gap-4">
                      <button className="relative p-2 text-gray-400 hover:text-deepblue-900 transition">
                          <Bell size={20} />
                          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white flex items-center justify-center text-[8px] font-bold text-white">5</span>
                      </button>
                      <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                      
                      {/* Profile Dropdown Trigger */}
                      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNav('profile')}>
                          <div className="text-right hidden sm:block leading-tight">
                              <p className="text-sm font-bold text-gray-900 group-hover:text-gold-600 transition">{profile?.full_name}</p>
                              <p className="text-[10px] text-gray-500 font-mono bg-gray-100 px-1.5 rounded inline-block mt-0.5">{profile?.agent_code || 'AGT-10523'}</p>
                          </div>
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold group-hover:bg-gold-500 group-hover:text-white transition shadow-sm border border-gray-200 overflow-hidden">
                              {profile?.full_name?.charAt(0)}
                          </div>
                          <ChevronRight className="rotate-90 text-gray-400 hidden sm:block" size={16} />
                      </div>
                      <button onClick={handleSignOut} className="ml-2 text-gray-400 hover:text-red-500"><LogOut size={20} /></button>
                  </div>
              </div>
          </header>

          {/* Scrollable Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
              <Routes>
                  <Route index element={<DashboardHome profile={profile} onChangeView={(v: string) => handleNav(v.toLowerCase())} />} />
                  <Route path="network" element={settings.agent['NETWORK'] === 'DISABLED' ? <MaintenanceOverlay onBack={() => handleNav('')} /> : <NetworkView onRecruit={() => handleNav('recruit')} profile={profile} />} />
                  <Route path="recruit" element={<RecruitAgent onCancel={() => handleNav('network')} onSuccess={() => handleNav('network')} />} />
                  <Route path="sales" element={settings.agent['SALES'] === 'DISABLED' ? <MaintenanceOverlay onBack={() => handleNav('')} /> : <SalesView />} />
                  <Route path="earnings" element={settings.agent['EARNINGS'] === 'DISABLED' ? <MaintenanceOverlay onBack={() => handleNav('')} /> : <EarningsView />} />
                  <Route path="leaderboard" element={settings.agent['LEADERBOARD'] === 'DISABLED' ? <MaintenanceOverlay onBack={() => handleNav('')} /> : <LeaderboardView />} />
                  <Route path="marketing" element={settings.agent['MARKETING'] === 'DISABLED' ? <MaintenanceOverlay onBack={() => handleNav('')} /> : <MarketingView profile={profile} />} />
                  <Route path="training" element={settings.agent['TRAINING'] === 'DISABLED' ? <MaintenanceOverlay onBack={() => handleNav('')} /> : <TrainingView />} />
                  <Route path="profile" element={settings.agent['PROFILE'] === 'DISABLED' ? <MaintenanceOverlay onBack={() => handleNav('')} /> : <ProfileView profile={profile} />} />
                  <Route path="support" element={settings.agent['SUPPORT'] === 'DISABLED' ? <MaintenanceOverlay onBack={() => handleNav('')} /> : <SupportView />} />
                  <Route path="*" element={<Navigate to="" replace />} />
              </Routes>
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
