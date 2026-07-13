
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { SectionTitle, IndButton, IndTable, StatusTag } from './Shared';
import { api } from '../../lib/api';
import { useSearchParams } from 'react-router-dom';

export const ClientsView = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const filter = searchParams.get('filter') || '';
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [busy, setBusy] = useState<string | null>(null);

    const fetchClients = () => {
        setLoading(true);
        api.get<{ clients: any[] }>(`/admin/clients${filter ? `?filter=${filter}` : ''}`)
            .then(({ clients: c }) => setClients(c))
            .catch(() => setClients([]))
            .finally(() => setLoading(false));
    };

    useEffect(fetchClients, [filter]);

    const toggleKyc = async (id: string, value: boolean) => {
        setBusy(id);
        try {
            await api.patch(`/admin/users/${id}`, { kyc_verified: value });
            fetchClients();
        } catch (e: any) {
            alert(e?.message || 'Action failed');
        } finally {
            setBusy(null);
        }
    };

    const filtered = clients.filter(c =>
        !search ||
        c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <SectionTitle
                title="CLIENT_DATABASE"
                actions={
                    <>
                        <IndButton active={!filter} onClick={() => setSearchParams({})}>ALL ({clients.length})</IndButton>
                        <IndButton active={filter === 'kyc_pending'} onClick={() => setSearchParams({ filter: 'kyc_pending' })}>KYC_PENDING</IndButton>
                        <IndButton active={filter === 'defaulters'} onClick={() => setSearchParams({ filter: 'defaulters' })}>DEFAULTERS</IndButton>
                    </>
                }
            />

            <div className="bg-white border border-black p-4 space-y-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="SEARCH_NAME_OR_EMAIL..."
                        className="border border-gray-400 px-3 py-1 text-xs w-64 outline-none focus:border-black text-black"
                    />
                </div>

                {loading ? (
                    <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" size={24} /></div>
                ) : (
                    <IndTable headers={['CLIENT_NAME', 'EMAIL', 'MOBILE', 'BOOKINGS', 'KYC', 'AGENT_REF', 'JOINED']}>
                        {filtered.length === 0 && (
                            <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">NO_RECORDS</td></tr>
                        )}
                        {filtered.map(c => (
                            <tr key={c.id} className="hover:bg-gray-50 text-black">
                                <td className="px-3 py-2 font-bold">{c.full_name}</td>
                                <td className="px-3 py-2">{c.email}</td>
                                <td className="px-3 py-2">{c.mobile || '—'}</td>
                                <td className="px-3 py-2 text-center">{c.bookings}</td>
                                <td className="px-3 py-2 text-center">
                                    <button
                                        disabled={busy === c.id}
                                        onClick={() => toggleKyc(c.id, !c.kyc_verified)}
                                        className={`px-2 py-0.5 text-[10px] font-bold ${c.kyc_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800 hover:bg-green-100'}`}
                                    >
                                        {c.kyc_verified ? 'VERIFIED' : '[VERIFY]'}
                                    </button>
                                </td>
                                <td className="px-3 py-2">{c.sponsor_code || '—'}</td>
                                <td className="px-3 py-2">{new Date(c.created_at).toLocaleDateString('en-GB')}</td>
                            </tr>
                        ))}
                    </IndTable>
                )}
            </div>
        </div>
    );
};
