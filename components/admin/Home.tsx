
import React, { useState, useEffect } from 'react';
import { AdminSection } from './Dashboard';
import { api } from '../../lib/api';

interface AdminHomeProps {
    onViewChange: (view: AdminSection) => void;
}

const inr = (n: number) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export const AdminHome: React.FC<AdminHomeProps> = ({ onViewChange }) => {
    const [stats, setStats] = useState<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get<{ stats: any }>('/admin/stats')
            .then(({ stats: s }) => setStats(s))
            .catch((e) => setError(e?.message || 'Failed to load stats'));
    }, []);

    return (
        <div className="font-mono text-sm text-black bg-white min-h-screen space-y-4 p-1">

            {/* 1. HEADER */}
            <div className="bg-white border border-black p-2 flex flex-col md:flex-row justify-between items-center shadow-none">
                <div className="font-bold text-lg tracking-tight text-black">RAK OASIS ADMIN</div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600">System Status:</span>
                        <span className={`font-bold flex items-center gap-1 ${error ? 'text-red-700' : 'text-green-700'}`}>● {error ? 'API ERROR' : 'ONLINE'}</span>
                    </div>
                    <div className="text-black">{new Date().toLocaleString('en-GB')}</div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-600 text-red-700 p-2 text-xs font-bold">{error}</div>
            )}

            {/* 2. METRICS */}
            <div className="bg-white border border-black p-0">
                <div className="bg-black text-white px-2 py-1 font-bold text-xs uppercase">SYSTEM METRICS - REAL TIME</div>
                <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-black text-center border-t border-black">
                    <MetricBox label="VERIFIED VOLUME" value={inr(stats?.verified_volume)} sub={`${stats?.payments ?? '—'} TOTAL TXNS`} />
                    <MetricBox label="CLIENTS" value={`${stats?.clients ?? '—'}`} sub="REGISTERED" />
                    <MetricBox label="AGENTS" value={`${stats?.agents ?? '—'}`} sub={`${stats?.pending_agents ?? 0} PENDING`} />
                    <MetricBox label="PLOTS" value={`${stats?.sold_plots ?? '—'}/${stats?.plots ?? '—'} SOLD`} sub="INVENTORY" />
                    <MetricBox label="PENDING PAYMENTS" value={`${stats?.pending_payments ?? '—'}`} sub="NEED VERIFICATION" />
                </div>
            </div>

            {/* 3. PENDING ACTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white border border-black flex flex-col">
                    <div className="bg-gray-200 border-b border-black px-2 py-1 font-bold text-xs text-black">
                        FINANCIAL OVERVIEW
                    </div>
                    <div className="p-3 text-xs leading-relaxed overflow-auto flex-1 text-black space-y-2">
                        <div className="flex justify-between"><span>├─ Verified Collections:</span> <span className="font-bold">{inr(stats?.verified_volume)}</span></div>
                        <div className="flex justify-between"><span>├─ Commissions Awaiting Approval:</span> <span className="font-bold text-yellow-700">{inr(stats?.pending_commission_amount)}</span></div>
                        <div className="flex justify-between"><span>└─ Payout Requests In Queue:</span> <span className="font-bold text-red-700">{stats?.pending_payouts ?? 0}</span></div>
                    </div>
                </div>

                <div className="bg-white border border-black flex flex-col">
                    <div className="bg-gray-200 border-b border-black px-2 py-1 font-bold text-xs text-black">
                        ALERTS & PENDING ACTIONS
                    </div>
                    <div className="p-3 text-xs space-y-2">
                        <AlertRow
                            level={stats?.pending_payments > 0 ? 'HIGH' : 'OK'}
                            text={`${stats?.pending_payments ?? 0} payment(s) awaiting verification`}
                            action="[VERIFY]" onClick={() => onViewChange('PAYMENTS')} />
                        <AlertRow
                            level={stats?.pending_agents > 0 ? 'MED' : 'OK'}
                            text={`${stats?.pending_agents ?? 0} agent application(s) pending`}
                            action="[REVIEW]" onClick={() => onViewChange('AGENTS')} />
                        <AlertRow
                            level={stats?.pending_payouts > 0 ? 'HIGH' : 'OK'}
                            text={`${stats?.pending_payouts ?? 0} USDT payout(s) in queue`}
                            action="[PROCESS]" onClick={() => onViewChange('PAYOUTS')} />
                        <AlertRow
                            level={Number(stats?.pending_commission_amount) > 0 ? 'MED' : 'OK'}
                            text={`${inr(stats?.pending_commission_amount)} commissions to approve`}
                            action="[APPROVE]" onClick={() => onViewChange('COMMISSIONS')} />
                    </div>
                </div>
            </div>

            {/* 4. QUICK NAV */}
            <div className="bg-white border border-black p-0">
                <div className="bg-black text-white px-2 py-1 font-bold text-xs uppercase">QUICK ACCESS</div>
                <div className="grid grid-cols-2 md:grid-cols-6 divide-x divide-gray-300 text-center border-t border-black">
                    {([['CLIENTS', 'CLIENTS'], ['AGENTS', 'AGENTS'], ['PLOTS', 'PLOTS'], ['PAYMENTS', 'PAYMENTS'], ['COMMISSIONS', 'COMMISSIONS'], ['PAYOUTS', 'PAYOUTS']] as [string, AdminSection][]).map(([label, view]) => (
                        <button key={view} onClick={() => onViewChange(view)} className="py-3 text-xs font-bold hover:bg-black hover:text-white transition-colors">
                            {label} →
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const MetricBox = ({ label, value, sub }: { label: string; value: string; sub: string }) => (
    <div className="p-3">
        <div className="text-[10px] text-gray-500 font-bold">{label}</div>
        <div className="text-sm font-bold text-black mt-1">{value}</div>
        <div className="text-[10px] text-gray-500 mt-0.5">{sub}</div>
    </div>
);

const AlertRow = ({ level, text, action, onClick }: any) => (
    <div className="flex justify-between items-center border-b border-gray-100 pb-1">
        <div className="flex items-center gap-2">
            <span className={`px-1 text-[10px] font-bold ${level === 'HIGH' ? 'bg-red-600 text-white' : level === 'MED' ? 'bg-yellow-400 text-black' : 'bg-green-600 text-white'}`}>{level}</span>
            <span>{text}</span>
        </div>
        <button onClick={onClick} className="text-blue-700 font-bold hover:underline">{action}</button>
    </div>
);
