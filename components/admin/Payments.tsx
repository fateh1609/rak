
import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { SectionTitle, IndButton, IndTable, StatusTag } from './Shared';
import { api } from '../../lib/api';

export const PaymentsView = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'ALL' | 'PENDING'>('PENDING');
    const [search, setSearch] = useState('');
    const [busy, setBusy] = useState<string | null>(null);

    const fetchPayments = () => {
        setLoading(true);
        api.get<{ payments: any[] }>('/admin/payments')
            .then(({ payments: p }) => setPayments(p))
            .catch(() => setPayments([]))
            .finally(() => setLoading(false));
    };

    useEffect(fetchPayments, []);

    const act = async (id: string, action: 'verify' | 'reject') => {
        setBusy(id);
        try {
            await api.patch(`/admin/payments/${id}/verify`, { action });
            fetchPayments();
        } catch (e: any) {
            alert(e?.message || 'Action failed');
        } finally {
            setBusy(null);
        }
    };

    const pendingCount = payments.filter(p => p.status === 'pending').length;
    const filtered = payments.filter(p =>
        (tab === 'ALL' || p.status === 'pending') &&
        (!search ||
            p.client_name?.toLowerCase().includes(search.toLowerCase()) ||
            p.transaction_ref?.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <SectionTitle
                title="PAYMENT_MANAGEMENT"
                actions={
                    <>
                        <IndButton active={tab === 'ALL'} onClick={() => setTab('ALL')}>ALL_PAYMENTS ({payments.length})</IndButton>
                        <IndButton active={tab === 'PENDING'} onClick={() => setTab('PENDING')}>PENDING_VERIFICATION ({pendingCount})</IndButton>
                    </>
                }
            />

            {/* Filters */}
            <div className="flex flex-wrap gap-2 bg-white border border-black p-2 mb-4">
                <div className="flex items-center gap-2 flex-1 border border-gray-300 px-2 bg-gray-50 min-w-[200px]">
                    <Search size={14} className="text-gray-400" />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="SEARCH_CLIENT_OR_TXN..." className="w-full bg-transparent text-xs py-1 outline-none text-black" />
                </div>
            </div>

            {loading ? (
                <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" size={24} /></div>
            ) : (
                <IndTable headers={['DATETIME', 'CLIENT', 'AMOUNT', 'METHOD', 'TXN_REF', 'STATUS', 'ACTION']}>
                    {filtered.length === 0 && (
                        <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">NO_PAYMENTS_IN_QUEUE</td></tr>
                    )}
                    {filtered.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50 text-black">
                            <td className="px-3 py-2 text-xs">{new Date(p.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                            <td className="px-3 py-2 font-bold">{p.client_name}<br /><span className="text-[10px] text-gray-500 font-normal">{p.client_email}</span></td>
                            <td className="px-3 py-2 font-bold">₹{Number(p.amount).toLocaleString('en-IN')}</td>
                            <td className="px-3 py-2 text-xs">{(p.method || '').replace('_', ' ')}</td>
                            <td className="px-3 py-2 text-[10px] font-mono max-w-[120px] truncate">{p.transaction_ref || '—'}</td>
                            <td className="px-3 py-2"><StatusTag status={p.status.toUpperCase()} /></td>
                            <td className="px-3 py-2 text-right">
                                {p.status === 'pending' ? (
                                    <div className="flex gap-1 justify-end">
                                        <button disabled={busy === p.id} onClick={() => act(p.id, 'verify')} className="bg-green-600 text-white px-2 py-1 text-[10px] font-bold hover:bg-green-700 disabled:opacity-50">[VERIFY]</button>
                                        <button disabled={busy === p.id} onClick={() => act(p.id, 'reject')} className="bg-red-600 text-white px-2 py-1 text-[10px] font-bold hover:bg-red-700 disabled:opacity-50">[REJECT]</button>
                                    </div>
                                ) : (
                                    <span className="text-[10px] text-gray-400">PROCESSED</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </IndTable>
            )}

            <p className="text-[10px] text-gray-500 font-mono">
                NOTE: Verifying a payment updates the booking's paid amount and automatically calculates unilevel commissions (L1 8% / L2 3% / L3 2% / L4 1% / L5 1%) for the client's upline.
            </p>
        </div>
    );
};
