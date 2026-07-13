
import React, { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { SectionTitle, IndButton, IndTable } from './Shared';
import { api } from '../../lib/api';

export const ContentView = () => {
    const [updates, setUpdates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNew, setShowNew] = useState(false);

    // New update form
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [audience, setAudience] = useState<'all' | 'client' | 'agent'>('all');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchUpdates = () => {
        setLoading(true);
        api.get<{ updates: any[] }>('/updates')
            .then(({ updates: u }) => setUpdates(u))
            .catch(() => setUpdates([]))
            .finally(() => setLoading(false));
    };

    useEffect(fetchUpdates, []);

    const handlePublish = async () => {
        setError('');
        if (!title || !body) { setError('Title and body are required.'); return; }
        setSubmitting(true);
        try {
            await api.post('/admin/updates', { title, body, audience });
            setShowNew(false);
            setTitle(''); setBody(''); setAudience('all');
            fetchUpdates();
        } catch (e: any) {
            setError(e?.message || 'Publish failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <SectionTitle
                title="CONTENT_MANAGEMENT"
                actions={<IndButton className="bg-black text-white" onClick={() => setShowNew(true)}>+ NEW_UPDATE</IndButton>}
            />

            {loading ? (
                <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" size={24} /></div>
            ) : (
                <IndTable headers={['DATE', 'TITLE', 'BODY', 'AUDIENCE', 'AUTHOR']}>
                    {updates.length === 0 && (
                        <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-400">NO_UPDATES_PUBLISHED</td></tr>
                    )}
                    {updates.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50 text-black">
                            <td className="px-3 py-2 text-xs whitespace-nowrap">{new Date(u.created_at).toLocaleDateString('en-GB')}</td>
                            <td className="px-3 py-2 font-bold">{u.title}</td>
                            <td className="px-3 py-2 text-xs max-w-[300px] truncate">{u.body}</td>
                            <td className="px-3 py-2 text-xs uppercase">{u.audience}</td>
                            <td className="px-3 py-2 text-xs">{u.author || 'SYSTEM'}</td>
                        </tr>
                    ))}
                </IndTable>
            )}

            <p className="text-[10px] text-gray-500 font-mono">
                NOTE: Updates appear in the client portal (Updates page) and agent portal based on the selected audience.
            </p>

            {/* New Update Modal */}
            {showNew && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70" onClick={() => setShowNew(false)} />
                    <div className="relative bg-white border-2 border-black w-full max-w-lg font-mono">
                        <div className="bg-black text-white px-3 py-2 text-xs font-bold flex justify-between items-center">
                            <span>PUBLISH_NEW_UPDATE</span>
                            <button onClick={() => setShowNew(false)}><X size={14} /></button>
                        </div>
                        <div className="p-4 space-y-3 text-xs">
                            <div>
                                <label className="font-bold block mb-1">TITLE *</label>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-400 px-2 py-1 outline-none focus:border-black" placeholder="e.g. Block B Roadwork Complete" />
                            </div>
                            <div>
                                <label className="font-bold block mb-1">BODY *</label>
                                <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="w-full border border-gray-400 px-2 py-1 outline-none focus:border-black" placeholder="Announcement details..." />
                            </div>
                            <div>
                                <label className="font-bold block mb-1">AUDIENCE</label>
                                <select value={audience} onChange={(e) => setAudience(e.target.value as any)} className="w-full border border-gray-400 px-2 py-1 bg-white">
                                    <option value="all">ALL (Clients + Agents)</option>
                                    <option value="client">CLIENTS ONLY</option>
                                    <option value="agent">AGENTS ONLY</option>
                                </select>
                            </div>
                            {error && <div className="bg-red-50 border border-red-600 text-red-700 p-2 font-bold">{error}</div>}
                            <button onClick={handlePublish} disabled={submitting} className="w-full bg-black text-white py-2 font-bold hover:bg-gray-800 disabled:opacity-50">
                                {submitting ? 'PUBLISHING...' : '[PUBLISH_UPDATE]'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
