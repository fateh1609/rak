
import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, Loader2 } from 'lucide-react';
import { SectionTitle, IndButton, IndTable, StatusTag } from './Shared';
import { api } from '../../lib/api';
import { useSearchParams } from 'react-router-dom';

export const AgentsView = () => {
    const [searchParams] = useSearchParams();
    const [tab, setTab] = useState<'PENDING' | 'ALL'>(searchParams.get('filter') === 'pending' ? 'PENDING' : 'ALL');
    const [agents, setAgents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [busy, setBusy] = useState<string | null>(null);

    const fetchAgents = () => {
        setLoading(true);
        api.get<{ agents: any[] }>('/admin/agents')
            .then(({ agents: a }) => setAgents(a))
            .catch(() => setAgents([]))
            .finally(() => setLoading(false));
    };

    useEffect(fetchAgents, []);

    const act = async (id: string, body: any) => {
        setBusy(id);
        try {
            await api.patch(`/admin/users/${id}`, body);
            fetchAgents();
        } catch (e: any) {
            alert(e?.message || 'Action failed');
        } finally {
            setBusy(null);
        }
    };

    const pending = agents.filter(a => a.status === 'pending');
    const filtered = agents.filter(a =>
        !search ||
        a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        a.agent_code?.toLowerCase().includes(search.toLowerCase()) ||
        a.email?.toLowerCase().includes(search.toLowerCase())
    );

    const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <div className="space-y-6">
            <SectionTitle
                title="AGENT_REGISTRY_V1"
                actions={
                    <>
                        <IndButton active={tab === 'PENDING'} onClick={() => setTab('PENDING')}>PENDING_QUEUE ({pending.length})</IndButton>
                        <IndButton active={tab === 'ALL'} onClick={() => setTab('ALL')}>MASTER_LIST ({agents.length})</IndButton>
                    </>
                }
            />

            {loading && <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" size={24} /></div>}

            {!loading && tab === 'PENDING' && (
                <div className="space-y-4">
                    {pending.length > 0 ? (
                        <div className="bg-yellow-50 border border-yellow-200 p-2 text-xs text-yellow-800 font-bold flex items-center gap-2">
                            <AlertTriangle size={14} /> ACTION REQUIRED: {pending.length} application(s) pending review.
                        </div>
                    ) : (
                        <div className="bg-green-50 border border-green-200 p-2 text-xs text-green-800 font-bold">QUEUE EMPTY — no pending applications.</div>
                    )}
                    <IndTable headers={['APPLICANT', 'CODE', 'EMAIL', 'SPONSOR', 'DATE', 'ACTIONS']}>
                        {pending.map(a => (
                            <tr key={a.id} className="hover:bg-gray-50 text-black">
                                <td className="px-3 py-2 font-bold">{a.full_name}</td>
                                <td className="px-3 py-2">{a.agent_code}</td>
                                <td className="px-3 py-2">{a.email}</td>
                                <td className="px-3 py-2">{a.sponsor_code || '—'}</td>
                                <td className="px-3 py-2">{fmtDate(a.created_at)}</td>
                                <td className="px-3 py-2 text-right">
                                    <div className="flex gap-1 justify-end">
                                        <button disabled={busy === a.id} onClick={() => act(a.id, { status: 'active' })} className="bg-green-600 text-white px-2 py-1 text-[10px] hover:bg-green-700 font-bold disabled:opacity-50">[APPROVE]</button>
                                        <button disabled={busy === a.id} onClick={() => act(a.id, { status: 'suspended' })} className="bg-red-600 text-white px-2 py-1 text-[10px] hover:bg-red-700 font-bold disabled:opacity-50">[REJECT]</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </IndTable>
                </div>
            )}

            {!loading && tab === 'ALL' && (
                <div className="space-y-4">
                    <div className="flex gap-2 bg-white border border-black p-2">
                        <div className="flex items-center gap-2 flex-1 border border-gray-300 px-2 bg-gray-50">
                            <Search size={14} className="text-gray-400" />
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="SEARCH_QUERY..." className="w-full bg-transparent text-xs py-1 outline-none text-black" />
                        </div>
                    </div>

                    <IndTable headers={['AGENT_ID', 'FULL_NAME', 'EMAIL', 'RANK', 'TEAM', 'KYC', 'WALLET_BAL', 'STATUS', 'ACTIONS']}>
                        {filtered.map(a => (
                            <tr key={a.id} className="hover:bg-gray-50 text-black">
                                <td className="px-3 py-2 font-bold">{a.agent_code}</td>
                                <td className="px-3 py-2">{a.full_name}</td>
                                <td className="px-3 py-2">{a.email}</td>
                                <td className="px-3 py-2 text-center">
                                    <select
                                        value={a.rank}
                                        disabled={busy === a.id}
                                        onChange={(e) => act(a.id, { rank: Number(e.target.value) })}
                                        className="border border-gray-300 text-xs bg-white"
                                    >
                                        {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>R{r}</option>)}
                                    </select>
                                </td>
                                <td className="px-3 py-2 text-center">{a.direct_team}</td>
                                <td className="px-3 py-2 text-center">
                                    <button
                                        disabled={busy === a.id}
                                        onClick={() => act(a.id, { kyc_verified: !a.kyc_verified })}
                                        className={`px-2 py-0.5 text-[10px] font-bold ${a.kyc_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800 hover:bg-green-100'}`}
                                    >
                                        {a.kyc_verified ? 'VERIFIED' : '[VERIFY]'}
                                    </button>
                                </td>
                                <td className="px-3 py-2 text-right">₹{Number(a.wallet_balance).toLocaleString('en-IN')}</td>
                                <td className="px-3 py-2"><StatusTag status={a.status.toUpperCase()} /></td>
                                <td className="px-3 py-2 text-right">
                                    {a.status !== 'suspended' ? (
                                        <button disabled={busy === a.id} onClick={() => act(a.id, { status: 'suspended' })} className="text-red-600 font-bold hover:underline text-[10px]">[SUSPEND]</button>
                                    ) : (
                                        <button disabled={busy === a.id} onClick={() => act(a.id, { status: 'active' })} className="text-green-700 font-bold hover:underline text-[10px]">[REACTIVATE]</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </IndTable>
                </div>
            )}
        </div>
    );
};
