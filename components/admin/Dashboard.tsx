
import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { 
  LogOut, Users, Settings, Database, DollarSign, 
  Menu, X, Briefcase, FileText, HelpCircle, Layers, CreditCard,
  ChevronDown, ChevronRight, LayoutDashboard, Map, Wallet, PieChart, Shield
} from 'lucide-react';
import { UserProfile } from '../../types';
import { AdminHome } from './Home';
import { 
  AgentsView, CommissionsView, PayoutsView, PaymentsView, 
  PlotsView, ClientsView, ContentView, ReportsView, 
  SupportView, SettingsView, PageControlView 
} from './Views';

interface DashboardProps {
  profile: UserProfile | null;
  onLogout: () => void;
  onNavigate: (callback: () => void) => void;
}

export type AdminSection = 
  | 'DASHBOARD' 
  | 'CLIENTS' 
  | 'AGENTS' 
  | 'PLOTS' 
  | 'PAYMENTS' 
  | 'COMMISSIONS' 
  | 'PAYOUTS' 
  | 'CONTENT' 
  | 'REPORTS' 
  | 'SUPPORT' 
  | 'SETTINGS'
  | 'PAGE_CONTROL';

export const AdminDashboard: React.FC<DashboardProps> = ({ profile, onLogout, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<AdminSection>('DASHBOARD');

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const navigateTo = (view: AdminSection) => {
    onNavigate(() => {
        setCurrentView(view);
        if (window.innerWidth < 768) setSidebarOpen(false);
    });
  };

  const renderContent = () => {
    switch (currentView) {
      case 'AGENTS': return <AgentsView />;
      case 'PAYOUTS': return <PayoutsView />;
      case 'COMMISSIONS': return <CommissionsView />;
      case 'PAYMENTS': return <PaymentsView />; 
      case 'PLOTS': return <PlotsView />;
      case 'CLIENTS': return <ClientsView />;
      case 'CONTENT': return <ContentView />;
      case 'REPORTS': return <ReportsView />;
      case 'SUPPORT': return <SupportView />;
      case 'SETTINGS': return <SettingsView />;
      case 'PAGE_CONTROL': return <PageControlView />;
      case 'DASHBOARD': default: return <AdminHome onViewChange={(view) => navigateTo(view)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-mono text-sm">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
         <div 
           className="fixed inset-0 z-40 bg-black/80 backdrop-blur-none md:hidden"
           onClick={() => setSidebarOpen(false)}
         />
      )}

      {/* SIDEBAR - INDUSTRIAL */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-black text-gray-400 border-r border-gray-800 transform transition-transform duration-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
        {/* Header */}
        <div className="h-12 border-b border-gray-800 flex justify-between items-center px-4 bg-gray-900">
           <div className="flex items-center gap-2 text-white font-bold tracking-tight">
             <div className="w-3 h-3 bg-red-600 rounded-none"></div>
             <span>RAK_ADMIN_V1.0</span>
           </div>
           <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white"><X size={18} /></button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-px custom-scrollbar">
            <SidebarItem icon={LayoutDashboard} label="DASHBOARD" active={currentView === 'DASHBOARD'} onClick={() => navigateTo('DASHBOARD')} />

            <div className="pt-4 pb-1 px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">MODULES_01</div>
            
            <SidebarGroup icon={Users} label="CLIENTS" active={currentView === 'CLIENTS'}>
                <SidebarSubItem label="> ALL RECORDS" onClick={() => navigateTo('CLIENTS')} />
                <SidebarSubItem label="> KYC PENDING" onClick={() => navigateTo('CLIENTS')} />
                <SidebarSubItem label="> DEFAULTERS" onClick={() => navigateTo('CLIENTS')} />
            </SidebarGroup>

            <SidebarGroup icon={Briefcase} label="AGENTS" active={currentView === 'AGENTS'}>
                <SidebarSubItem label="> ROSTER" onClick={() => navigateTo('AGENTS')} />
                <SidebarSubItem label="> APPROVALS" onClick={() => navigateTo('AGENTS')} />
                <SidebarSubItem label="> NETWORK TREE" onClick={() => navigateTo('AGENTS')} />
            </SidebarGroup>

            <SidebarGroup icon={Map} label="PLOTS" active={currentView === 'PLOTS'}>
                <SidebarSubItem label="> INVENTORY" onClick={() => navigateTo('PLOTS')} />
                <SidebarSubItem label="> SOLD LOG" onClick={() => navigateTo('PLOTS')} />
            </SidebarGroup>

            <div className="pt-4 pb-1 px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">FINANCE_02</div>

            <SidebarGroup icon={CreditCard} label="PAYMENTS" active={currentView === 'PAYMENTS'}>
                <SidebarSubItem label="> INBOUND LOG" onClick={() => navigateTo('PAYMENTS')} />
                <SidebarSubItem label="> RECONCILIATION" onClick={() => navigateTo('PAYMENTS')} />
            </SidebarGroup>

            <SidebarGroup icon={Layers} label="COMMISSIONS" active={currentView === 'COMMISSIONS'}>
                <SidebarSubItem label="> CALC ENGINE" onClick={() => navigateTo('COMMISSIONS')} />
                <SidebarSubItem label="> HISTORY" onClick={() => navigateTo('COMMISSIONS')} />
            </SidebarGroup>

            <SidebarGroup icon={Wallet} label="USDT_PAYOUTS" active={currentView === 'PAYOUTS'}>
                <SidebarSubItem label="> REQUEST QUEUE" onClick={() => navigateTo('PAYOUTS')} />
                <SidebarSubItem label="> PROCESS BATCH" onClick={() => navigateTo('PAYOUTS')} />
            </SidebarGroup>

            <div className="pt-4 pb-1 px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">SYSTEM_03</div>

            <SidebarItem icon={Shield} label="PAGE CONTROL" active={currentView === 'PAGE_CONTROL'} onClick={() => navigateTo('PAGE_CONTROL')} />
            <SidebarItem icon={FileText} label="CONTENT" active={currentView === 'CONTENT'} onClick={() => navigateTo('CONTENT')} />
            <SidebarItem icon={PieChart} label="REPORTS" active={currentView === 'REPORTS'} onClick={() => navigateTo('REPORTS')} />
            <SidebarItem icon={HelpCircle} label="TICKETS" active={currentView === 'SUPPORT'} onClick={() => navigateTo('SUPPORT')} />
            <SidebarItem icon={Settings} label="CONFIG" active={currentView === 'SETTINGS'} onClick={() => navigateTo('SETTINGS')} />
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-900">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gray-800 flex items-center justify-center text-white font-bold border border-gray-700">
                    {profile?.full_name?.charAt(0) || 'A'}
                </div>
                <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{profile?.full_name || 'ROOT'}</p>
                    <p className="text-[10px] text-gray-500 font-mono">ID: {profile?.id?.substring(0, 8) || 'ADMIN'}</p>
                </div>
            </div>
            <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 py-1 border border-red-900 text-red-700 hover:bg-red-900 hover:text-white text-xs font-bold uppercase transition-colors">
                [ LOGOUT ]
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-100">
        {/* Mobile Header */}
        <div className="md:hidden bg-black text-white h-12 flex justify-between items-center px-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
                <button onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
                <span className="font-bold">{currentView}</span>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 md:p-4">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-2 text-xs transition-colors rounded-none ${
            active 
            ? 'bg-white text-black font-bold border-l-4 border-red-600' 
            : 'text-gray-400 hover:text-white hover:bg-gray-900'
        }`}
    >
        <Icon size={14} />
        <span>{label}</span>
    </button>
);

const SidebarGroup = ({ icon: Icon, label, active, children }: any) => {
    const [isOpen, setIsOpen] = useState(active);

    return (
        <div className="select-none">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-2 text-xs transition-colors rounded-none ${
                    active ? 'text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
            >
                <div className="flex items-center gap-3">
                    <Icon size={14} />
                    <span>{label}</span>
                </div>
                {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>
            
            {isOpen && (
                <div className="bg-gray-900/50 py-1 border-l border-gray-800 ml-4 my-1">
                    {children}
                </div>
            )}
        </div>
    );
};

const SidebarSubItem = ({ label, onClick }: any) => (
    <button 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className="w-full text-left px-4 py-1.5 text-[10px] text-gray-500 hover:text-white hover:bg-white/5 transition-colors font-mono"
    >
        {label}
    </button>
);
