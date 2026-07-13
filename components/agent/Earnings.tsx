
import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, CheckCircle, AlertCircle, Wallet, ArrowRight, Calculator, XCircle, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '../Button';
import { useCurrency } from '../../contexts/CurrencyContext';
import { api } from '../../lib/api';

export const EarningsView = () => {
    const [tab, setTab] = useState<'OVERVIEW' | 'HISTORY' | 'PAYOUT' | 'SIMULATOR'>('OVERVIEW');
    const [stats, setStats] = useState<any>(null);
    const [commissions, setCommissions] = useState<any[]>([]);
    const [payouts, setPayouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = () => {
        Promise.all([
            api.get<{ stats: any }>('/network/stats').then(({ stats: s }) => setStats(s)),
            api.get<{ commissions: any[] }>('/commissions/my').then(({ commissions: c }) => setCommissions(c)),
            api.get<{ payouts: any[] }>('/payouts/my').then(({ payouts: p }) => setPayouts(p))
        ]).catch(console.error).finally(() => setLoading(false));
    };

    useEffect(refresh, []);

    if (loading) {
        return <div className="flex justify-center py-24"><Loader2 className="animate-spin text-gold-500" size={32} /></div>;
    }

    return (
        <div className="space-y-6 animate-fade-in-up pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-3xl font-serif font-bold text-deepblue-900">Earnings & Commissions</h2>
                <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto no-scrollbar max-w-full">
                    {[
                        { id: 'OVERVIEW', label: 'Overview' },
                        { id: 'HISTORY', label: 'Commission History' },
                        { id: 'PAYOUT', label: 'Request Payout' },
                        { id: 'SIMULATOR', label: 'Calculator' },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id as any)}
                            className={`px-4 py-2 rounded-md text-xs font-bold transition-all whitespace-nowrap ${tab === t.id ? 'bg-white text-deepblue-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {tab === 'OVERVIEW' && <OverviewTab stats={stats} commissions={commissions} onChangeTab={setTab} />}
            {tab === 'HISTORY' && <HistoryTab commissions={commissions} />}
            {tab === 'PAYOUT' && <PayoutTab stats={stats} payouts={payouts} onDone={refresh} />}
            {tab === 'SIMULATOR' && <SimulatorTab />}
        </div>
    );
};

// --- OVERVIEW ---

const OverviewTab = ({ stats, commissions, onChangeTab }: any) => {
    const { formatAED, formatUSDT } = useCurrency();

    const approved = commissions.filter((c: any) => ['approved', 'paid'].includes(c.status));
    const lifetime = approved.reduce((s: number, c: any) => s + Number(c.amount), 0);
    const pending = stats?.pending_commissions || 0;
    const wallet = stats?.wallet_balance || 0;
    const month = stats?.month_earnings || 0;

    // Monthly chart from approved commissions (last 6 months)
    const chartData = (() => {
        const buckets: Record<string, number> = {};
        const labels: string[] = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            buckets[key] = 0;
            labels.push(d.toLocaleDateString('en-GB', { month: 'short' }));
        }
        approved.forEach((c: any) => {
            const d = new Date(c.created_at);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            if (key in buckets) buckets[key] += Number(c.amount);
        });
        return Object.values(buckets).map((value, i) => ({ name: labels[i], value }));
    })();

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
                    <p className="text-xs text-gray-500 font-bold mb-1">{label}</p>
                    <p className="text-sm font-bold text-gold-600">{formatAED(payload[0].value)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign size={64} /></div>
                    <p className="text-[10px] text-white/80 uppercase font-bold tracking-widest mb-1">Lifetime Earnings</p>
                    <h3 className="text-2xl lg:text-3xl font-bold mb-1">{formatAED(lifetime)}</h3>
                    <p className="text-[10px] opacity-80 font-mono">≈ {formatUSDT(lifetime)}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">This Month</p>
                    <h3 className="text-2xl lg:text-3xl font-bold text-green-600 mb-1">{formatAED(month)}</h3>
                    <p className="text-[10px] text-gray-400 font-mono">≈ {formatUSDT(month)}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Pending Approval</p>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gold-600 mb-1">{formatAED(pending)}</h3>
                    <p className="text-[10px] text-gray-400">Awaiting admin verification</p>
                </div>
                <div className="bg-deepblue-900 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet size={64} /></div>
                    <p className="text-[10px] text-gold-400 uppercase font-bold tracking-widest mb-1">Wallet Balance</p>
                    <h3 className="text-2xl lg:text-3xl font-bold mb-1">{formatAED(wallet)}</h3>
                    <button onClick={() => onChangeTab('PAYOUT')} className="mt-2 text-[10px] font-bold text-gold-400 hover:underline flex items-center gap-1">Request Payout <ArrowRight size={10} /></button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-deepblue-900 mb-6">📈 Earnings Trend (6 Months)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#C5A028" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#C5A028" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="value" stroke="#C5A028" strokeWidth={2} fill="url(#goldGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// --- HISTORY ---

const HistoryTab = ({ commissions }: any) => {
    const { formatAED } = useCurrency();
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-deepblue-900">Commission Ledger</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white text-gray-500 font-bold border-b border-gray-200 uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Source Client</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4 text-center">Level</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {commissions.length === 0 && (
                            <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">No commissions recorded yet.</td></tr>
                        )}
                        {commissions.map((c: any) => (
                            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-gray-500">{new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}</td>
                                <td className="px-6 py-4 font-bold text-gray-900">{c.source_client || '—'}</td>
                                <td className="px-6 py-4 text-xs font-mono">{c.type}</td>
                                <td className="px-6 py-4 text-center">{c.level ? <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">L{c.level}</span> : '—'}</td>
                                <td className="px-6 py-4 font-bold text-deepblue-900">{formatAED(Number(c.amount))}</td>
                                <td className="px-6 py-4">
                                    {c.status === 'calculated_pending_approval'
                                        ? <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 w-fit"><Clock size={10} /> Pending</span>
                                        : <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={10} /> {c.status === 'paid' ? 'Paid' : 'Approved'}</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- PAYOUT ---

const PayoutTab = ({ stats, payouts, onDone }: any) => {
    const { formatAED, formatUSDT } = useCurrency();
    const wallet = Number(stats?.wallet_balance || 0);
    const [amount, setAmount] = useState<string>(wallet >= 10000 ? String(Math.floor(wallet)) : '');
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

    const handleRequest = async () => {
        setMsg(null);
        const amt = Number(amount);
        if (!amt || amt <= 0) { setMsg({ type: 'err', text: 'Enter a valid amount.' }); return; }
        setSubmitting(true);
        try {
            await api.post('/payouts', { amount_inr: amt });
            setMsg({ type: 'ok', text: 'Payout requested. USDT will be sent to your TRC20 wallet after approval.' });
            onDone();
        } catch (e: any) {
            setMsg({ type: 'err', text: e?.message || 'Request failed.' });
        } finally {
            setSubmitting(false);
        }
    };

    const statusBadge = (s: string) => {
        if (s === 'completed') return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={10} /> Completed</span>;
        if (s === 'rejected') return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 w-fit"><XCircle size={10} /> Rejected</span>;
        return <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 w-fit"><Clock size={10} /> {s === 'processing' ? 'Processing' : 'Pending'}</span>;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
            {/* Request Form */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-fit">
                <h3 className="font-bold text-deepblue-900 mb-6 flex items-center gap-2"><Wallet size={18} /> REQUEST USDT PAYOUT</h3>
                <div className="space-y-5">
                    <div className="bg-deepblue-900 text-white p-4 rounded-xl">
                        <p className="text-[10px] text-gold-400 uppercase font-bold tracking-widest">Available Balance</p>
                        <p className="text-2xl font-bold mt-1">{formatAED(wallet)}</p>
                        <p className="text-[10px] font-mono opacity-70 mt-1">≈ {formatUSDT(wallet)}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount (INR)</label>
                        <input type="number" min={10000} value={amount} onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:outline-none text-sm"
                            placeholder="Minimum ₹10,000" />
                    </div>
                    <ul className="text-xs text-gray-500 space-y-1">
                        <li>• Minimum payout: ₹10,000</li>
                        <li>• Paid in USDT (TRC20) to your verified wallet</li>
                        <li>• KYC verification required</li>
                        <li>• Wallet is debited on request; refunded if rejected</li>
                    </ul>
                    {msg && (
                        <div className={`px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${msg.type === 'ok' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                            {msg.type === 'ok' ? <CheckCircle size={16} className="shrink-0" /> : <AlertCircle size={16} className="shrink-0" />}
                            {msg.text}
                        </div>
                    )}
                    <Button fullWidth className="!py-3 !bg-green-600 hover:!bg-green-700" onClick={handleRequest} disabled={submitting}>
                        {submitting ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Request Payout →'}
                    </Button>
                </div>
            </div>

            {/* Payout History */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-fit">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-deepblue-900">Payout History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white text-gray-500 font-bold border-b border-gray-200 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Amount (INR)</th>
                                <th className="px-6 py-4">USDT</th>
                                <th className="px-6 py-4">Network</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">TX Hash</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {payouts.length === 0 && (
                                <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">No payout requests yet.</td></tr>
                            )}
                            {payouts.map((p: any) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">{new Date(p.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}</td>
                                    <td className="px-6 py-4 font-bold text-deepblue-900">₹{Number(p.amount_inr).toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{Number(p.amount_usdt).toLocaleString()} USDT</td>
                                    <td className="px-6 py-4 text-xs">{p.network}</td>
                                    <td className="px-6 py-4">{statusBadge(p.status)}</td>
                                    <td className="px-6 py-4 font-mono text-[10px] text-gray-400 max-w-[120px] truncate">{p.tx_hash || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- SIMULATOR (client-side earnings calculator) ---

const SimulatorTab = () => {
    const { formatAED } = useCurrency();
    const [personal, setPersonal] = useState(5);
    const [agents, setAgents] = useState(8);
    const [agentSales, setAgentSales] = useState(3);

    const PLOT_INR = 3275000;
    const level1 = personal * PLOT_INR * 0.08;
    const level2 = agents * agentSales * PLOT_INR * 0.03;
    const gross = level1 + level2;
    const tds = gross * 0.10;
    const net = gross - tds;

    const Slider = ({ label, value, setValue, max }: any) => (
        <div>
            <div className="flex justify-between text-sm mb-2">
                <span className="font-bold text-gray-700">{label}</span>
                <span className="font-bold text-gold-600">{value}</span>
            </div>
            <input type="range" min={0} max={max} value={value} onChange={(e) => setValue(Number(e.target.value))}
                className="w-full accent-gold-500" />
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
                <h3 className="font-bold text-deepblue-900 flex items-center gap-2"><Calculator size={18} /> EARNINGS SIMULATOR</h3>
                <Slider label="Personal Sales (plots)" value={personal} setValue={setPersonal} max={20} />
                <Slider label="Direct Agents Recruited" value={agents} setValue={setAgents} max={20} />
                <Slider label="Avg. Sales per Agent" value={agentSales} setValue={setAgentSales} max={10} />
                <p className="text-xs text-gray-400 italic">Assumes standard plots at ₹32.75L. Level 1: 8% • Level 2: 3% • TDS: 10%.</p>
            </div>
            <div className="bg-deepblue-900 rounded-2xl shadow-xl p-8 text-white h-fit">
                <p className="text-xs text-gold-400 uppercase font-bold tracking-widest mb-6">Projected Earnings</p>
                <div className="space-y-4 text-sm">
                    <div className="flex justify-between"><span className="opacity-70">Level 1 Commission (8%):</span><span className="font-bold">{formatAED(level1)}</span></div>
                    <div className="flex justify-between"><span className="opacity-70">Level 2 Commission (3%):</span><span className="font-bold">{formatAED(level2)}</span></div>
                    <div className="border-t border-white/20 pt-4 flex justify-between"><span>Gross:</span><span className="font-bold">{formatAED(gross)}</span></div>
                    <div className="flex justify-between text-red-300"><span>TDS (10%):</span><span>- {formatAED(tds)}</span></div>
                    <div className="bg-gold-500 text-deepblue-900 rounded-xl p-4 flex justify-between items-center mt-4">
                        <span className="font-bold uppercase text-xs tracking-wider">Net Projection:</span>
                        <span className="font-bold text-xl">{formatAED(net)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
