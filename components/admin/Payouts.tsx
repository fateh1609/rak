
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { SectionTitle, IndButton, IndTable, StatusTag } from './Shared';
import { api } from '../../lib/api';

export const PayoutsView = () => {
    const [payouts, setPayouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'PENDING' | 'ALL'>('PENDING');
    const [busy, setBusy] = useState<string | null>(null);

    const fetchPayouts = () => {
        setLoading(true);
        api.get<{ payouts: any[] }>('/admin/payouts')
            .then(({ payouts: p }) => setPayouts(p))
            .catch(() => setPayouts([]))
            .finally(() => setLoading(false));
    };

    useEffect(fetchPayouts, []);

    const act = async (id: string, action: 'complete' | 'reject') => {
        let tx_hash: string | undefined;
        if (action === 'complete') {
            tx_hash = window.prompt('Enter the USDT transaction hash (TXID):') || undefined;
            if (!tx_hash) return;
        }
        setBusy(id);
        try {
            await api.patch(`/admin/payouts/${id}`, { action, tx_hash });
            fetchPayouts();
        } catch (e: any) {
            alert(e?.message || 'Action failed');
        } finally {
            setBusy(null);
        }
    };

    const pending = payouts.filter(p => ['pending_approval', 'processing'].includes(p.status));
    const shown = tab === 'PENDING' ? pending : payouts;
    const pendingInr = pending.reduce((s, p) => s + Number(p.amount_inr), 0);
    const pendingUsdt = pending.reduce((s, p) => s + Number(p.amount_usdt), 0);

    return (
        <div className="space-y-6">
            <SectionTitle
                title="USDT_PAYOUT_PROCESSING"
                actions={
                    <>
                        <IndButton active={tab === 'PENDING'} onClick={() => setTab('PENDING')}>PENDING ({pending.length})</IndButton>
                        <IndButton active={tab === 'ALL'} onClick={() => setTab('ALL')}>HISTORY ({payouts.length})</IndButton>
                    </>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-black p-3">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">PENDING REQUESTS</p>
                    <p className="text-xl font-bold text-red-600">{pending.length}</p>
                </div>
                <div className="bg-white border border-black p-3">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">PENDING VALUE (INR)</p>
                    <p className="text-xl font-bold">₹{pendingInr.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-white border border-black p-3">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">PENDING VALUE (USDT)</p>
                    <p className="text-xl font-bold text-green-600">{pendingUsdt.toLocaleString()} USDT</p>
                </div>
            </div>

            {loading ? (
                <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" size={24} /></div>
            ) : (
                <IndTable headers={['DATE', 'AGENT', 'AMOUNT_INR', 'USDT', 'NETWORK', 'WALLET', 'STATUS', 'ACTION']}>
                    {shown.length === 0 && (
                        <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-400">QUEUE_EMPTY</td></tr>
                    )}
                    {shown.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50 text-black">
                            <td className="px-3 py-2 text-xs">{new Date(p.created_at).toLocaleDateString('en-GB')}</td>
                            <td className="px-3 py-2 font-bold">{p.agent_code}<br /><span className="text-[10px] text-gray-500 font-normal">{p.agent_name}</span></td>
                            <td className="px-3 py-2 font-bold">₹{Number(p.amount_inr).toLocaleString('en-IN')}</td>
                            <td className="px-3 py-2 font-bold text-green-700">{Number(p.amount_usdt).toLocaleString()}</td>
                            <td className="px-3 py-2 text-xs">{p.network}</td>
                            <td className="px-3 py-2 font-mono text-[10px] max-w-[140px] truncate">{p.wallet_address}</td>
                            <td className="px-3 py-2"><StatusTag status={p.status === 'pending_approval' ? 'PENDING' : p.status.toUpperCase()} /></td>
                            <td className="px-3 py-2 text-right">
                                {['pending_approval', 'processing'].includes(p.status) ? (
                                    <div className="flex gap-1 justify-end">
                                        <button disabled={busy === p.id} onClick={() => act(p.id, 'complete')} className="bg-green-600 text-white px-2 py-1 text-[10px] font-bold hover:bg-green-700 disabled:opacity-50">[MARK_SENT]</button>
                                        <button disabled={busy === p.id} onClick={() => act(p.id, 'reject')} className="bg-red-600 text-white px-2 py-1 text-[10px] font-bold hover:bg-red-700 disabled:opacity-50">[REJECT]</button>
                                    </div>
                                ) : (
                                    <span className="font-mono text-[10px] text-gray-400 max-w-[80px] truncate inline-block">{p.tx_hash || 'DONE'}</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </IndTable>
            )}

            <p className="text-[10px] text-gray-500 font-mono">
                NOTE: [MARK_SENT] records the blockchain TXID and completes the payout. [REJECT] refunds the agent's wallet balance.
            </p>
        </div>
    );
};
