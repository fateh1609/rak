
import React, { useState, useEffect } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { SectionTitle, IndButton, IndTable, StatusTag } from './Shared';
import { api } from '../../lib/api';

export const PlotsView = () => {
    const [plots, setPlots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [blockFilter, setBlockFilter] = useState('');
    const [availableOnly, setAvailableOnly] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [busy, setBusy] = useState<string | null>(null);

    // Add form
    const [newPlot, setNewPlot] = useState({ plot_number: '', block: 'A', type: 'Standard', size_sqft: 1000, price_aed: 131000, price_inr: 3275000 });
    const [addError, setAddError] = useState('');

    const fetchPlots = () => {
        setLoading(true);
        api.get<{ plots: any[] }>('/plots')
            .then(({ plots: p }) => setPlots(p))
            .catch(() => setPlots([]))
            .finally(() => setLoading(false));
    };

    useEffect(fetchPlots, []);

    const updateStatus = async (id: string, status: string) => {
        setBusy(id);
        try {
            await api.patch(`/admin/plots/${id}`, { status });
            fetchPlots();
        } catch (e: any) {
            alert(e?.message || 'Update failed');
        } finally {
            setBusy(null);
        }
    };

    const handleAdd = async () => {
        setAddError('');
        try {
            await api.post('/admin/plots', newPlot);
            setShowAdd(false);
            setNewPlot({ ...newPlot, plot_number: '' });
            fetchPlots();
        } catch (e: any) {
            setAddError(e?.message || 'Failed to add plot');
        }
    };

    const blocks = Array.from(new Set(plots.map(p => p.block))).sort();
    const counts = {
        total: plots.length,
        available: plots.filter(p => p.status === 'AVAILABLE').length,
        sold: plots.filter(p => p.status === 'SOLD').length,
        reserved: plots.filter(p => p.status === 'RESERVED').length
    };
    const filtered = plots.filter(p =>
        (!search || p.plot_number.toLowerCase().includes(search.toLowerCase())) &&
        (!blockFilter || p.block === blockFilter) &&
        (!availableOnly || p.status === 'AVAILABLE')
    );

    return (
        <div className="space-y-6">
            <SectionTitle
                title="MASTER_INVENTORY"
                actions={<IndButton className="bg-black text-white" onClick={() => setShowAdd(true)}>+ ADD_PLOT</IndButton>}
            />

            {/* Stats Strip */}
            <div className="grid grid-cols-4 gap-0 border border-black divide-x divide-black bg-white text-center">
                <div className="p-2">
                    <div className="text-[10px] text-gray-500 font-bold uppercase">TOTAL_UNITS</div>
                    <div className="text-xl font-bold text-black">{counts.total}</div>
                </div>
                <div className="p-2">
                    <div className="text-[10px] text-gray-500 font-bold uppercase">AVAILABLE</div>
                    <div className="text-xl font-bold text-blue-600">{counts.available}</div>
                </div>
                <div className="p-2">
                    <div className="text-[10px] text-gray-500 font-bold uppercase">SOLD</div>
                    <div className="text-xl font-bold text-red-600">{counts.sold}</div>
                </div>
                <div className="p-2">
                    <div className="text-[10px] text-gray-500 font-bold uppercase">RESERVED</div>
                    <div className="text-xl font-bold text-yellow-600">{counts.reserved}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 items-center flex-wrap">
                <div className="flex-1 min-w-[200px] border border-black bg-white px-2 py-1 flex items-center">
                    <Search size={12} className="mr-2 text-black" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full text-xs outline-none text-black" placeholder="SEARCH_PLOT_ID..." />
                </div>
                <IndButton active={!blockFilter} onClick={() => setBlockFilter('')}>ALL_BLOCKS</IndButton>
                {blocks.map(b => (
                    <IndButton key={b} active={blockFilter === b} onClick={() => setBlockFilter(b)}>BLOCK_{b}</IndButton>
                ))}
                <IndButton active={availableOnly} onClick={() => setAvailableOnly(!availableOnly)}>AVAILABLE_ONLY</IndButton>
            </div>

            {/* Table */}
            {loading ? (
                <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" size={24} /></div>
            ) : (
                <IndTable headers={['PLOT_ID', 'BLOCK', 'TYPE', 'SIZE_SQFT', 'PRICE_AED', 'PRICE_INR', 'STATUS', 'CONFIG']}>
                    {filtered.length === 0 && (
                        <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-400">NO_PLOTS_FOUND</td></tr>
                    )}
                    {filtered.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50 text-black">
                            <td className="px-3 py-2 font-bold">{p.plot_number}</td>
                            <td className="px-3 py-2">BLOCK_{p.block}</td>
                            <td className="px-3 py-2">{p.type}</td>
                            <td className="px-3 py-2">{Number(p.size_sqft).toLocaleString()}</td>
                            <td className="px-3 py-2">{Number(p.price_aed).toLocaleString()}</td>
                            <td className="px-3 py-2">₹{Number(p.price_inr).toLocaleString('en-IN')}</td>
                            <td className="px-3 py-2"><StatusTag status={p.status} /></td>
                            <td className="px-3 py-2 text-right">
                                <select
                                    value={p.status}
                                    disabled={busy === p.id}
                                    onChange={(e) => updateStatus(p.id, e.target.value)}
                                    className="border border-gray-300 text-[10px] bg-white font-bold"
                                >
                                    {['AVAILABLE', 'RESERVED', 'SOLD', 'FORFEITED'].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </td>
                        </tr>
                    ))}
                </IndTable>
            )}

            {/* Add Plot Modal */}
            {showAdd && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70" onClick={() => setShowAdd(false)} />
                    <div className="relative bg-white border-2 border-black w-full max-w-md font-mono">
                        <div className="bg-black text-white px-3 py-2 text-xs font-bold flex justify-between items-center">
                            <span>ADD_NEW_PLOT</span>
                            <button onClick={() => setShowAdd(false)}><X size={14} /></button>
                        </div>
                        <div className="p-4 space-y-3 text-xs">
                            <div>
                                <label className="font-bold block mb-1">PLOT_NUMBER *</label>
                                <input value={newPlot.plot_number} onChange={(e) => setNewPlot({ ...newPlot, plot_number: e.target.value.toUpperCase() })} className="w-full border border-gray-400 px-2 py-1 outline-none focus:border-black" placeholder="e.g. D-101" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold block mb-1">BLOCK</label>
                                    <input value={newPlot.block} onChange={(e) => setNewPlot({ ...newPlot, block: e.target.value.toUpperCase() })} className="w-full border border-gray-400 px-2 py-1 outline-none focus:border-black" />
                                </div>
                                <div>
                                    <label className="font-bold block mb-1">TYPE</label>
                                    <select value={newPlot.type} onChange={(e) => {
                                        const type = e.target.value;
                                        const mult = type === 'Standard' ? 1 : 1.05;
                                        setNewPlot({ ...newPlot, type, price_aed: Math.round(131000 * mult), price_inr: Math.round(3275000 * mult) });
                                    }} className="w-full border border-gray-400 px-2 py-1 bg-white">
                                        <option>Standard</option>
                                        <option>Garden Facing</option>
                                        <option>Corner Plot</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-bold block mb-1">SIZE_SQFT</label>
                                    <input type="number" value={newPlot.size_sqft} onChange={(e) => setNewPlot({ ...newPlot, size_sqft: Number(e.target.value) })} className="w-full border border-gray-400 px-2 py-1 outline-none focus:border-black" />
                                </div>
                                <div>
                                    <label className="font-bold block mb-1">PRICE_AED</label>
                                    <input type="number" value={newPlot.price_aed} onChange={(e) => setNewPlot({ ...newPlot, price_aed: Number(e.target.value) })} className="w-full border border-gray-400 px-2 py-1 outline-none focus:border-black" />
                                </div>
                                <div className="col-span-2">
                                    <label className="font-bold block mb-1">PRICE_INR</label>
                                    <input type="number" value={newPlot.price_inr} onChange={(e) => setNewPlot({ ...newPlot, price_inr: Number(e.target.value) })} className="w-full border border-gray-400 px-2 py-1 outline-none focus:border-black" />
                                </div>
                            </div>
                            {addError && <div className="bg-red-50 border border-red-600 text-red-700 p-2 font-bold">{addError}</div>}
                            <button onClick={handleAdd} className="w-full bg-black text-white py-2 font-bold hover:bg-gray-800">[CREATE_PLOT]</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
