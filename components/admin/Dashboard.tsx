
import React, { useState } from 'react';
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
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

export type AdminSection = 'DASHBOARD' | 'AGENTS' | 'PAYOUTS' | 'COMMISSIONS' | 'PAYMENTS' | 'PLOTS' | 'CLIENTS' | 'CONTENT' | 'REPORTS' | 'SUPPORT' | 'SETTINGS' | 'PAGE_CONTROL';

interface DashboardProps {
  profile: UserProfile | null;
  onLogout: () => void;
  onNavigate: (callback: () => void) => void;
}

export const AdminDashboard: React.FC<DashboardProps> = ({ profile, onLogout, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    onLogout();
  };

  const handleNav = (path: string) => {
    onNavigate(() => {
        navigate(path);
        if (window.innerWidth < 768) setSidebarOpen(false);
    });
  };

  const currentView = location.pathname.split('/').pop()?.toUpperCase() || 'DASHBOARD';

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
            <SidebarItem icon={LayoutDashboard} label="DASHBOARD" active={currentView === 'ADMIN' || currentView === 'DASHBOARD'} onClick={() => handleNav('')} />

            <div className="pt-4 pb-1 px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">MODULES_01</div>
            
            <SidebarGroup icon={Users} label="CLIENTS" active={currentView === 'CLIENTS'}>
                <SidebarSubItem label="> ALL RECORDS" onClick={() => handleNav('clients')} />
                <SidebarSubItem label="> KYC PENDING" onClick={() => handleNav('clients?filter=kyc_pending')} />
                <SidebarSubItem label="> DEFAULTERS" onClick={() => handleNav('clients?filter=defaulters')} />
            </SidebarGroup>

            <SidebarGroup icon={Briefcase} label="AGENTS" active={currentView === 'AGENTS'}>
                <SidebarSubItem label="> ROSTER" onClick={() => handleNav('agents')} />
                <SidebarSubItem label="> APPROVALS" onClick={() => handleNav('agents?filter=pending')} />
            </SidebarGroup>

            <SidebarItem icon={Map} label="PLOTS" active={currentView === 'PLOTS'} onClick={() => handleNav('plots')} />

            <div className="pt-4 pb-1 px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">FINANCE_02</div>

            <SidebarItem icon={CreditCard} label="PAYMENTS" active={currentView === 'PAYMENTS'} onClick={() => handleNav('payments')} />
            <SidebarItem icon={Layers} label="COMMISSIONS" active={currentView === 'COMMISSIONS'} onClick={() => handleNav('commissions')} />
            <SidebarItem icon={Wallet} label="USDT_PAYOUTS" active={currentView === 'PAYOUTS'} onClick={() => handleNav('payouts')} />

            <div className="pt-4 pb-1 px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">SYSTEM_03</div>

            <SidebarItem icon={Shield} label="PAGE CONTROL" active={currentView === 'PAGE_CONTROL'} onClick={() => handleNav('page-control')} />
            <SidebarItem icon={FileText} label="CONTENT" active={currentView === 'CONTENT'} onClick={() => handleNav('content')} />
            <SidebarItem icon={PieChart} label="REPORTS" active={currentView === 'REPORTS'} onClick={() => handleNav('reports')} />
            <SidebarItem icon={HelpCircle} label="TICKETS" active={currentView === 'SUPPORT'} onClick={() => handleNav('support')} />
            <SidebarItem icon={Settings} label="CONFIG" active={currentView === 'SETTINGS'} onClick={() => handleNav('settings')} />
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
            <Routes>
                <Route index element={<AdminHome onViewChange={(view: string) => handleNav(view.toLowerCase().replace('_', '-'))} />} />
                <Route path="agents" element={<AgentsView />} />
                <Route path="payouts" element={<PayoutsView />} />
                <Route path="commissions" element={<CommissionsView />} />
                <Route path="payments" element={<PaymentsView />} />
                <Route path="plots" element={<PlotsView />} />
                <Route path="clients" element={<ClientsView />} />
                <Route path="content" element={<ContentView />} />
                <Route path="reports" element={<ReportsView />} />
                <Route path="support" element={<SupportView />} />
                <Route path="settings" element={<SettingsView />} />
                <Route path="page-control" element={<PageControlView />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Routes>
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
