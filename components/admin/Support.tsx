
import React, { useState, useEffect } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { SectionTitle, IndButton, IndTable, StatusTag } from './Shared';
import { api } from '../../lib/api';

export const SupportView = () => {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'open' | 'in_progress' | 'closed' | 'all'>('open');
    const [selected, setSelected] = useState<any>(null);
    const [reply, setReply] = useState('');
    const [busy, setBusy] = useState(false);
    const [search, setSearch] = useState('');

    const fetchTickets = () => {
        setLoading(true);
        api.get<{ tickets: any[] }>('/admin/tickets')
            .then(({ tickets: t }) => setTickets(t))
            .catch(() => setTickets([]))
            .finally(() => setLoading(false));
    };

    useEffect(fetchTickets, []);

    const counts = {
        open: tickets.filter(t => t.status === 'open').length,
        in_progress: tickets.filter(t => t.status === 'in_progress').length,
        closed: tickets.filter(t => t.status === 'closed').length
    };

    const shown = tickets.filter(t =>
        (tab === 'all' || t.status === tab) &&
        (!search || t.subject?.toLowerCase().includes(search.toLowerCase()) || t.full_name?.toLowerCase().includes(search.toLowerCase()))
    );

    const act = async (id: string, body: any) => {
        setBusy(true);
        try {
            await api.patch(`/admin/tickets/${id}`, body);
            setSelected(null);
            setReply('');
            fetchTickets();
        } catch (e: any) {
            alert(e?.message || 'Action failed');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <SectionTitle
                title="SUPPORT_TICKET_MANAGEMENT"
                actions={
                    <>
                        <div className="text-[10px] font-bold mr-4 self-center hidden md:block">
                            OPEN: {counts.open} | IN_PROGRESS: {counts.in_progress} | CLOSED: {counts.closed}
                        </div>
                        <IndButton active={tab === 'open'} onClick={() => setTab('open')}>OPEN</IndButton>
                        <IndButton active={tab === 'in_progress'} onClick={() => setTab('in_progress')}>IN_PROGRESS</IndButton>
                        <IndButton active={tab === 'closed'} onClick={() => setTab('closed')}>CLOSED</IndButton>
                        <IndButton active={tab === 'all'} onClick={() => setTab('all')}>ALL</IndButton>
                    </>
                }
            />

            <div className="flex flex-wrap gap-2 bg-white border border-black p-2">
                <div className="flex items-center gap-2 flex-1 border border-gray-300 px-2 bg-gray-50 min-w-[200px]">
                    <Search size={14} className="text-gray-400" />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="SEARCH TICKETS..." className="w-full bg-transparent text-xs py-1 outline-none text-black" />
                </div>
            </div>

            {loading ? (
                <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" size={24} /></div>
            ) : (
                <IndTable headers={['DATE', 'SUBJECT', 'SOURCE', 'STATUS', 'ACTION']}>
                    {shown.length === 0 && (
                        <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-400">NO_TICKETS</td></tr>
                    )}
                    {shown.map(t => (
                        <tr key={t.id} className="hover:bg-gray-50 text-black cursor-pointer" onClick={() => { setSelected(t); setReply(t.admin_reply || ''); }}>
                            <td className="px-3 py-2 text-xs whitespace-nowrap">{new Date(t.created_at).toLocaleDateString('en-GB')}</td>
                            <td className="px-3 py-2 font-bold">{t.subject}</td>
                            <td className="px-3 py-2 text-xs uppercase">{t.user_role} ({t.full_name})</td>
                            <td className="px-3 py-2"><StatusTag status={t.status.toUpperCase()} /></td>
                            <td className="px-3 py-2 text-right"><button className="text-blue-600 font-bold hover:underline">[VIEW]</button></td>
                        </tr>
                    ))}
                </IndTable>
            )}

            {/* Ticket Detail Modal */}
            {selected && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70" onClick={() => setSelected(null)} />
                    <div className="relative bg-white border-2 border-black w-full max-w-lg font-mono">
                        <div className="bg-black text-white px-3 py-2 text-xs font-bold flex justify-between items-center">
                            <span>TICKET_DETAIL</span>
                            <button onClick={() => setSelected(null)}><X size={14} /></button>
                        </div>
                        <div className="p-4 space-y-3 text-xs">
                            <div className="flex justify-between">
                                <span className="font-bold">{selected.subject}</span>
                                <StatusTag status={selected.status.toUpperCase()} />
                            </div>
                            <p className="text-gray-500">{selected.full_name} ({selected.email}) • {new Date(selected.created_at).toLocaleString('en-GB')}</p>
                            <div className="bg-gray-50 border border-gray-200 p-3 whitespace-pre-wrap">{selected.message}</div>
                            <div>
                                <label className="font-bold block mb-1">ADMIN_REPLY</label>
                                <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={3} className="w-full border border-gray-400 px-2 py-1 outline-none focus:border-black" placeholder="Response to the user..." />
                            </div>
                            <div className="flex gap-2">
                                <button disabled={busy} onClick={() => act(selected.id, { status: 'in_progress', admin_reply: reply || null })} className="flex-1 bg-yellow-500 text-black py-2 font-bold hover:bg-yellow-400 disabled:opacity-50">[IN_PROGRESS]</button>
                                <button disabled={busy} onClick={() => act(selected.id, { status: 'closed', admin_reply: reply || null })} className="flex-1 bg-black text-white py-2 font-bold hover:bg-gray-800 disabled:opacity-50">[RESOLVE_&_CLOSE]</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
