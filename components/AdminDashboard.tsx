
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { LogOut, Users, BarChart3, Settings, ShieldAlert, Database, DollarSign, Activity, PieChart, Plus, Menu, X } from 'lucide-react';
import { UserProfile } from '../types';

interface DashboardProps {
  profile: UserProfile | null;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<DashboardProps> = ({ profile, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* MOBILE OVERLAY BACKDROP */}
      {sidebarOpen && (
         <div 
           className="fixed inset-0 z-40 bg-deepblue-900/80 backdrop-blur-sm md:hidden transition-opacity"
           onClick={() => setSidebarOpen(false)}
         />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-deepblue-900 text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 shadow-2xl flex flex-col`}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gold-500 rounded flex items-center justify-center font-bold text-deepblue-900">A</div>
             <span className="font-serif font-bold text-xl tracking-wide">RAK Admin</span>
           </div>
           <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/50 hover:text-white"><X size={20} /></button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg text-white font-medium shadow-inner">
                <BarChart3 size={20} className="text-gold-400" /> Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition">
                <Users size={20} /> User Management
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition">
                <Database size={20} /> Plot Inventory
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition">
                <DollarSign size={20} /> Financials
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition">
                <Settings size={20} /> Settings
            </button>
        </nav>

        <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 font-bold">
                    {profile?.full_name?.charAt(0) || 'A'}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate">{profile?.full_name}</p>
                    <p className="text-xs text-gray-400 truncate">{profile?.email}</p>
                </div>
            </div>
            <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 py-2 border border-white/20 rounded hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition">
                <LogOut size={16} /> Sign Out
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-deepblue-900 text-white p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
            <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
                <span className="font-serif font-bold text-lg">System Overview</span>
            </div>
            <button onClick={handleSignOut} className="text-gray-400 hover:text-red-400"><LogOut size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 hidden md:block">System Overview</h1>
                    <p className="text-gray-500 mt-1 hidden md:block">Real-time metrics for RAK Oasis Estate.</p>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                     <button className="flex items-center gap-2 bg-deepblue-900 text-white px-4 py-2 rounded-lg hover:bg-deepblue-800 transition text-sm">
                        <Plus size={16} /> New Agent
                     </button>
                     <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Last Synced</p>
                        <p className="font-mono text-gray-900 font-bold text-sm">{new Date().toLocaleTimeString()}</p>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-gold-200 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors"><Users size={20} /></div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">1,248</h3>
                    <p className="text-sm text-gray-500">Total Registered Clients</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-gold-200 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors"><Activity size={20} /></div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+5%</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">84</h3>
                    <p className="text-sm text-gray-500">Active Agents</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-gold-200 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-gold-50 text-gold-600 rounded-lg group-hover:bg-gold-500 group-hover:text-white transition-colors"><Database size={20} /></div>
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">Phase 1</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">32%</h3>
                    <p className="text-sm text-gray-500">Inventory Reserved</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-gold-200 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors"><DollarSign size={20} /></div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">42.5M</h3>
                    <p className="text-sm text-gray-500">Projected Revenue (AED)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Registrations Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Recent Registrations</h3>
                        <button className="text-sm text-gold-600 font-semibold hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[1,2,3,4,5].map((i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3 whitespace-nowrap">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                                U{i}
                                            </div>
                                            User_{Math.random().toString(36).substring(7)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">Client</td>
                                        <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Verified</span></td>
                                        <td className="px-6 py-4 text-gray-400 whitespace-nowrap">Feb {10 + i}, 2026</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Health / Alerts */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">System Alerts</h3>
                        <button className="text-gray-400 hover:text-gray-600"><Settings size={18} /></button>
                    </div>
                    <div className="space-y-4 flex-1">
                        <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100 hover:shadow-sm transition-shadow">
                            <ShieldAlert className="text-yellow-600 shrink-0" size={20} />
                            <div>
                                <h4 className="font-bold text-yellow-800 text-sm">High Traffic Warning</h4>
                                <p className="text-xs text-yellow-700 mt-1 leading-relaxed">Landing page traffic has spiked by 300% in the last hour due to the new campaign.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-sm transition-shadow">
                            <PieChart className="text-blue-600 shrink-0" size={20} />
                            <div>
                                <h4 className="font-bold text-blue-800 text-sm">Inventory Update</h4>
                                <p className="text-xs text-blue-700 mt-1 leading-relaxed">15 Garden Facing plots were reserved in the last 24 hours.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100 hover:shadow-sm transition-shadow">
                            <Activity className="text-purple-600 shrink-0" size={20} />
                            <div>
                                <h4 className="font-bold text-purple-800 text-sm">Broker Performance</h4>
                                <p className="text-xs text-purple-700 mt-1 leading-relaxed">Top agent "RAK-BROKER-001" has closed 3 deals this week.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
};
