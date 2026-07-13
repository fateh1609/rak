
import React, { useState, useEffect } from 'react';
import {
  Award, Briefcase, DollarSign, Users, Target, CheckCircle,
  TrendingUp, Plus, Network, Copy, ArrowRight
} from 'lucide-react';
import { Button } from '../Button';
import { useCurrency } from '../../contexts/CurrencyContext';
import { api } from '../../lib/api';

const RANK_NAMES: Record<number, string> = {
  1: 'Agent', 2: 'Senior Agent', 3: 'Area Manager', 4: 'Zonal Head', 5: 'President'
};

export const DashboardHome = ({ profile, onChangeView }: any) => {
    const { formatAED, formatUSDT } = useCurrency();
    const [stats, setStats] = useState<any>(null);
    const [commissions, setCommissions] = useState<any[]>([]);
    const [network, setNetwork] = useState<any[]>([]);

    useEffect(() => {
        api.get<{ stats: any }>('/network/stats').then(({ stats: s }) => setStats(s)).catch(() => {});
        api.get<{ commissions: any[] }>('/commissions/my').then(({ commissions: c }) => setCommissions(c)).catch(() => {});
        api.get<{ network: any[] }>('/network/tree').then(({ network: n }) => setNetwork(n)).catch(() => {});
    }, []);

    const rank = stats?.rank || profile?.rank || 1;
    const walletBalance = stats?.wallet_balance ?? Number(profile?.wallet_balance || 0);
    const monthEarnings = stats?.month_earnings || 0;
    const recentCommissions = commissions.slice(0, 5);
    const recentRecruits = network.filter(n => n.role === 'agent').slice(0, 3);

    const unilevelTotal = commissions
        .filter(c => c.type === 'UNILEVEL' && ['approved', 'paid'].includes(c.status))
        .reduce((s, c) => s + Number(c.amount), 0);
    const pendingTotal = stats?.pending_commissions || 0;

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* A. Performance Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-gold-300 hover:shadow-lg transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Award size={64} className="text-gold-500" /></div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1"><Award size={12} /> Current Rank</p>
                        <h3 className="text-2xl font-serif font-bold text-deepblue-900 mt-2 group-hover:text-gold-600 transition-colors">Rank {rank}</h3>
                        <p className="text-sm font-medium text-gray-600 mt-1">{RANK_NAMES[rank]}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer" onClick={() => onChangeView('SALES')}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Briefcase size={64} className="text-blue-500" /></div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1"><Briefcase size={12} /> Direct Sales</p>
                        <h3 className="text-2xl font-serif font-bold text-deepblue-900 mt-2">{stats?.direct_sales ?? '—'} plots</h3>
                        <p className="text-sm font-medium text-gray-600 mt-1">Lifetime</p>
                        <button className="text-xs text-blue-600 font-bold mt-4 hover:underline flex items-center gap-1">View All <ArrowRight size={10} /></button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-green-300 hover:shadow-lg transition-all cursor-pointer" onClick={() => onChangeView('EARNINGS')}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><DollarSign size={64} className="text-green-500" /></div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1"><DollarSign size={12} /> This Month Earnings</p>
                        <h3 className="text-2xl font-serif font-bold text-green-600 mt-2">{formatAED(monthEarnings)}</h3>
                        <p className="text-sm font-medium text-gray-500 mt-1">Wallet: {formatAED(walletBalance)} (≈ {formatUSDT(walletBalance)})</p>
                        <button className="text-xs text-green-700 font-bold mt-4 hover:underline flex items-center gap-1">Request Payout <ArrowRight size={10} /></button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer" onClick={() => onChangeView('NETWORK')}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Users size={64} className="text-purple-500" /></div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1"><Users size={12} /> Total Network</p>
                        <h3 className="text-2xl font-serif font-bold text-deepblue-900 mt-2">{stats?.total_network ?? '—'} members</h3>
                        <p className="text-sm font-medium text-purple-600 mt-1 flex items-center gap-1"><TrendingUp size={14} /> All levels</p>
                        <button className="text-xs text-purple-600 font-bold mt-4 hover:underline flex items-center gap-1">View Team <ArrowRight size={10} /></button>
                    </div>
                </div>
            </div>

            {/* B. Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">👥 Direct Team</p>
                        <p className="text-xl font-bold text-deepblue-900 mt-1">{stats?.direct_team ?? '—'} members</p>
                    </div>
                    <Button variant="outline" className="!py-1.5 !px-3 !text-xs rounded-full" onClick={() => onChangeView('RECRUIT')}>Recruit More</Button>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">🌐 Total Network</p>
                        <p className="text-xl font-bold text-deepblue-900 mt-1">{stats?.total_network ?? '—'} members</p>
                    </div>
                    <Button variant="outline" className="!py-1.5 !px-3 !text-xs rounded-full" onClick={() => onChangeView('NETWORK')}>View Tree</Button>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">🏆 Leaderboard</p>
                        <p className="text-xl font-bold text-gold-600 mt-1">Top Agents</p>
                    </div>
                    <Button variant="outline" className="!py-1.5 !px-3 !text-xs rounded-full" onClick={() => onChangeView('LEADERBOARD')}>View Board</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column (2/3) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* C. Rank Advancement */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-deepblue-900 flex items-center gap-2 text-lg"><Target size={20} className="text-gold-500" /> RANK ADVANCEMENT PROGRESS</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between text-sm mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <div>
                                    <span className="text-blue-500 block text-xs uppercase font-bold mb-1">Current Status</span>
                                    <span className="font-bold text-deepblue-900 text-lg">Rank {rank} ({RANK_NAMES[rank]})</span>
                                </div>
                                {rank < 5 && (
                                <div className="text-right">
                                    <span className="text-blue-500 block text-xs uppercase font-bold mb-1">Next Milestone</span>
                                    <span className="font-bold text-gold-600 text-lg">Rank {rank + 1} ({RANK_NAMES[rank + 1]})</span>
                                </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <ProgressRow label="Sell 1 plot personally" current={stats?.direct_sales || 0} target={1} />
                                <ProgressRow label="Recruit 3 active agents" current={stats?.direct_team || 0} target={3} />
                                <ProgressRow label="Total team volume: 25 sales" current={stats?.direct_sales || 0} target={25} />
                            </div>

                            <p className="text-xs text-gray-500 italic mt-6">
                                Rank upgrades are reviewed and applied by the administration team as targets complete.
                            </p>
                        </div>
                    </div>

                    {/* D. Recent Commissions */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-deepblue-900 flex items-center gap-2"><Briefcase size={18} /> 📊 RECENT COMMISSIONS</h3>
                            <button onClick={() => onChangeView('EARNINGS')} className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">View All <ArrowRight size={12} /></button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white text-gray-500 font-medium border-b border-gray-100 uppercase tracking-wider text-xs">
                                    <tr>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Source</th>
                                        <th className="px-6 py-3">Type / Level</th>
                                        <th className="px-6 py-3">Amount</th>
                                        <th className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentCommissions.length === 0 && (
                                        <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No commissions yet. Start selling!</td></tr>
                                    )}
                                    {recentCommissions.map((c) => (
                                        <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-gray-500">{new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}</td>
                                            <td className="px-6 py-4 font-bold text-deepblue-900">{c.source_client || '—'}</td>
                                            <td className="px-6 py-4 text-gray-600 font-mono text-xs">{c.type}{c.level ? ` L${c.level}` : ''}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{formatAED(Number(c.amount))}</td>
                                            <td className="px-6 py-4 text-xs font-bold">{c.status === 'calculated_pending_approval' ? '⏳ Pending' : c.status === 'approved' ? '✅ Approved' : '✅ Paid'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                {/* Sidebar Column (1/3) */}
                <div className="space-y-8">

                    {/* E. Earnings Summary */}
                    <div className="bg-white p-0 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900 text-sm">💰 EARNINGS SUMMARY</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Approved Unilevel:</span>
                                    <span className="font-bold text-gray-900">{formatAED(unilevelTotal)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Pending Approval:</span>
                                    <span className="font-bold text-gray-900">{formatAED(pendingTotal)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">This Month:</span>
                                    <span className="font-bold text-gray-900">{formatAED(monthEarnings)}</span>
                                </div>
                            </div>

                            <div className="border-t border-double border-gray-300 my-2"></div>

                            <div className="bg-green-50 p-3 rounded border border-green-100 mt-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-green-800 font-bold uppercase text-xs tracking-wider">WALLET BALANCE:</span>
                                    <span className="text-green-800 font-bold text-base">{formatAED(walletBalance)}</span>
                                </div>
                                <div className="text-right text-xs text-green-600 mt-1 font-mono">≈ {formatUSDT(walletBalance)}</div>
                            </div>

                            <div className="flex gap-2">
                                <Button fullWidth className="!py-2 !text-xs !bg-green-600 hover:!bg-green-700" onClick={() => onChangeView('EARNINGS')}>Request USDT Payout</Button>
                            </div>
                        </div>
                    </div>

                    {/* F. Team Highlights */}
                    <div className="bg-white p-0 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900 text-sm">🌟 MY TEAM</h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-2">🎉 RECENT TEAM MEMBERS</p>
                                {recentRecruits.length === 0 ? (
                                    <p className="text-xs text-gray-400">No agents recruited yet.</p>
                                ) : (
                                    <ul className="text-xs text-gray-600 space-y-2">
                                        {recentRecruits.map(r => (
                                            <li key={r.id} className="flex items-center gap-2">
                                                • {r.full_name} ({r.agent_code || 'agent'}) — <span className="text-gray-400">L{r.level}</span>
                                                {r.status === 'pending' && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 rounded">pending</span>}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <button onClick={() => onChangeView('NETWORK')} className="text-[10px] text-blue-600 mt-2 hover:underline">[View Full Network]</button>
                            </div>
                        </div>
                    </div>

                    {/* G. Quick Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => onChangeView('SALES')} className="p-4 bg-deepblue-900 text-white rounded-xl text-xs font-bold hover:bg-deepblue-800 transition flex flex-col items-center gap-2 text-center shadow-lg shadow-deepblue-900/20 group">
                            <Plus size={20} className="text-gold-400 group-hover:scale-110 transition-transform" /> Register New Client
                        </button>
                        <button onClick={() => onChangeView('RECRUIT')} className="p-4 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition flex flex-col items-center gap-2 text-center hover:border-gold-300 group shadow-sm hover:shadow-md">
                            <Users size={20} className="text-blue-500 group-hover:scale-110 transition-transform" /> Recruit Agent
                        </button>
                        <button onClick={() => onChangeView('NETWORK')} className="p-4 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition flex flex-col items-center gap-2 text-center hover:border-gold-300 group shadow-sm hover:shadow-md">
                            <Network size={20} className="text-purple-500 group-hover:scale-110 transition-transform" /> View Genealogy
                        </button>
                        <button onClick={() => onChangeView('MARKETING')} className="p-4 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition flex flex-col items-center gap-2 text-center hover:border-gold-300 group shadow-sm hover:shadow-md">
                            <Copy size={20} className="text-green-500 group-hover:scale-110 transition-transform" /> Share My Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProgressRow = ({ label, current, target }: { label: string; current: number; target: number }) => {
    const done = current >= target;
    const pct = Math.min(100, Math.round((current / target) * 100));
    return (
        <div className="flex items-center gap-4">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm ${done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                <CheckCircle size={14} />
            </div>
            <div className="flex-1">
                <span className="text-sm font-bold text-gray-900">{label}</span>
                <span className="text-xs text-gray-500 block mt-0.5">{done ? `DONE (${current}/${target})` : `Progress: ${current}/${target}`}</span>
                {!done && (
                    <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1">
                        <div className="bg-gold-400 h-1.5 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                )}
            </div>
        </div>
    );
};
