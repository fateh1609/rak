
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { SectionTitle, IndButton, IndTable, StatusTag } from './Shared';
import { api } from '../../lib/api';

export const CommissionsView = () => {
    const [commissions, setCommissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'PENDING' | 'ALL'>('PENDING');
    const [busy, setBusy] = useState<string | null>(null);

    const fetchCommissions = () => {
        setLoading(true);
        api.get<{ commissions: any[] }>('/admin/commissions')
            .then(({ commissions: c }) => setCommissions(c))
            .catch(() => setCommissions([]))
            .finally(() => setLoading(false));
    };

    useEffect(fetchCommissions, []);

    const approve = async (id: string) => {
        setBusy(id);
        try {
            await api.patch(`/admin/commissions/${id}/approve`);
            fetchCommissions();
        } catch (e: any) {
            alert(e?.message || 'Approval failed');
        } finally {
            setBusy(null);
        }
    };

    const pending = commissions.filter(c => c.status === 'calculated_pending_approval');
    const shown = tab === 'PENDING' ? pending : commissions;
    const pendingTotal = pending.reduce((s, c) => s + Number(c.amount), 0);
    const approvedTotal = commissions.filter(c => c.status !== 'calculated_pending_approval').reduce((s, c) => s + Number(c.amount), 0);

    return (
        <div className="space-y-6">
            <SectionTitle
                title="COMMISSION_LEDGER"
                actions={
                    <>
                        <IndButton active={tab === 'PENDING'} onClick={() => setTab('PENDING')}>PENDING ({pending.length})</IndButton>
                        <IndButton active={tab === 'ALL'} onClick={() => setTab('ALL')}>FULL_HISTORY ({commissions.length})</IndButton>
                    </>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-black p-3">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">PENDING APPROVAL</p>
                    <p className="text-xl font-bold text-yellow-700">₹{pendingTotal.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-white border border-black p-3">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">APPROVED / PAID</p>
                    <p className="text-xl font-bold text-green-700">₹{approvedTotal.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-white border border-black p-3">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">RATES</p>
                    <p className="text-xs font-bold mt-1">L1 8% • L2 3% • L3 2% • L4 1% • L5 1%</p>
                </div>
            </div>

            {loading ? (
                <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" size={24} /></div>
            ) : (
                <IndTable headers={['DATE', 'AGENT', 'TYPE', 'LEVEL', 'AMOUNT', 'STATUS', 'ACTION']}>
                    {shown.length === 0 && (
                        <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">NO_RECORDS</td></tr>
                    )}
                    {shown.map(c => (
                        <tr key={c.id} className="hover:bg-gray-50 text-black">
                            <td className="px-3 py-2 text-xs">{new Date(c.created_at).toLocaleDateString('en-GB')}</td>
                            <td className="px-3 py-2 font-bold">{c.agent_name}<br /><span className="text-[10px] text-gray-500 font-normal">{c.agent_code}</span></td>
                            <td className="px-3 py-2 text-xs">{c.type}</td>
                            <td className="px-3 py-2 text-center">{c.level ? `L${c.level}` : '—'}</td>
                            <td className="px-3 py-2 font-bold">₹{Number(c.amount).toLocaleString('en-IN')}</td>
                            <td className="px-3 py-2">
                                <StatusTag status={c.status === 'calculated_pending_approval' ? 'PENDING' : c.status.toUpperCase()} />
                            </td>
                            <td className="px-3 py-2 text-right">
                                {c.status === 'calculated_pending_approval' ? (
                                    <button disabled={busy === c.id} onClick={() => approve(c.id)} className="bg-green-600 text-white px-2 py-1 text-[10px] font-bold hover:bg-green-700 disabled:opacity-50">[APPROVE_&_CREDIT]</button>
                                ) : (
                                    <span className="text-[10px] text-gray-400">CREDITED</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </IndTable>
            )}

            <p className="text-[10px] text-gray-500 font-mono">
                NOTE: Approving a commission credits the agent's wallet balance immediately.
            </p>
        </div>
    );
};
