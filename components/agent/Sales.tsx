
import React, { useState, useEffect } from 'react';
import { Search, Plus, CheckCircle, X, Mail, Phone, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '../Button';
import { ClientRegistration } from './ClientRegistration';
import { useCurrency } from '../../contexts/CurrencyContext';
import { api } from '../../lib/api';

export const SalesView = () => {
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { formatAED } = useCurrency();

    const fetchClients = () => {
        setLoading(true);
        api.get<{ clients: any[] }>('/network/clients')
            .then(({ clients: c }) => setClients(c))
            .catch(() => setClients([]))
            .finally(() => setLoading(false));
    };

    useEffect(fetchClients, []);

    if (isRegistering) {
        return <ClientRegistration onBack={() => { setIsRegistering(false); fetchClients(); }} />;
    }

    const filtered = clients.filter(c =>
        !search ||
        c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.plot_number?.toLowerCase().includes(search.toLowerCase()) ||
        c.mobile?.includes(search)
    );

    const totalSales = clients.reduce((s, c) => s + Number(c.total_amount || 0), 0);
    const totalEarned = clients.reduce((s, c) => s + Number(c.my_earnings || 0), 0);

    const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

    return (
        <div className="space-y-6 animate-fade-in-up pb-20">
            {/* Quick Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-deepblue-900">Sales & Client Management</h2>
                    <p className="text-sm text-gray-500 mt-1">Track your pipeline and manage active clients.</p>
                </div>
                <div className="flex gap-2">
                    <Button className="!py-2 !px-4 !text-xs flex items-center gap-2 shadow-gold-500/20" onClick={() => setIsRegistering(true)}><Plus size={14} /> Register New Client</Button>
                </div>
            </div>

            {/* Search */}
            <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative flex-1 min-w-[250px]">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, mobile, plot..." className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">My Clients & Sales ({clients.length} Total)</h3>
                </div>
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">Client Name</th>
                                <th className="px-6 py-4">Plot</th>
                                <th className="px-6 py-4">Registered</th>
                                <th className="px-6 py-4 text-right">Total Value</th>
                                <th className="px-6 py-4 text-right">Paid</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">My Earnings</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading && (
                                <tr><td colSpan={8} className="px-6 py-12 text-center"><Loader2 className="animate-spin mx-auto text-gold-500" size={24} /></td></tr>
                            )}
                            {!loading && filtered.length === 0 && (
                                <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400">No clients yet. Register your first client to start earning.</td></tr>
                            )}
                            {filtered.map((client) => (
                                <tr key={client.id + (client.booking_id || '')} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-gray-900">{client.full_name}</td>
                                    <td className="px-6 py-4 font-mono text-xs font-bold text-deepblue-900">{client.plot_number || '—'}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{fmtDate(client.created_at)}</td>
                                    <td className="px-6 py-4 text-right text-gray-600">{client.total_amount ? formatAED(Number(client.total_amount)) : '—'}</td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-800">{client.paid_amount ? formatAED(Number(client.paid_amount)) : '—'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                                            client.booking_status === 'CONFIRMED' ? 'bg-green-50 text-green-700'
                                            : client.booking_status === 'PENDING_VERIFICATION' ? 'bg-yellow-50 text-yellow-700'
                                            : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {client.booking_status === 'CONFIRMED' ? 'Active' : client.booking_status === 'PENDING_VERIFICATION' ? 'Pending' : 'No Plot'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-gold-600">{formatAED(Number(client.my_earnings || 0))}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => setSelectedClient(client)} className="text-blue-600 hover:text-white hover:bg-blue-600 text-xs font-bold border border-blue-200 px-3 py-1.5 rounded-lg transition-all">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 bg-gray-50/50 gap-4">
                    <div className="flex gap-6">
                        <span>Total Sales: <strong className="text-gray-900">{formatAED(totalSales)}</strong></span>
                        <span>Total Earned: <strong className="text-gray-900">{formatAED(totalEarned)}</strong></span>
                    </div>
                </div>
            </div>

            {/* Client Detail Modal */}
            {selectedClient && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-deepblue-900/60 backdrop-blur-sm" onClick={() => setSelectedClient(null)}></div>
                    <div className="bg-white rounded-2xl w-full max-w-lg relative shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh] overflow-hidden">

                        {/* Header */}
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-bold text-deepblue-900">Client Details: {selectedClient.full_name}</h3>
                            <button onClick={() => setSelectedClient(null)} className="text-gray-400 hover:text-red-500 transition"><X size={20} /></button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            {/* 1. Client Info */}
                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><CheckCircle size={12} /> Client Information</h4>
                                <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">{selectedClient.full_name?.charAt(0)}</div>
                                            <div>
                                                <p className="font-bold text-gray-900">{selectedClient.full_name}</p>
                                                <p className="text-xs text-gray-500">Registered: {fmtDate(selectedClient.created_at)}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${selectedClient.kyc_verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {selectedClient.kyc_verified ? 'KYC Verified' : 'KYC Pending'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-gray-600"><Mail size={12} /> {selectedClient.email}</div>
                                        <div className="flex items-center gap-2 text-gray-600"><Phone size={12} /> {selectedClient.mobile || '—'}</div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <a href={`mailto:${selectedClient.email}`} className="flex-1"><Button variant="outline" fullWidth className="!py-1.5 !text-xs gap-1"><Mail size={12} /> Email</Button></a>
                                        {selectedClient.mobile && <a href={`tel:${selectedClient.mobile}`} className="flex-1"><Button variant="outline" fullWidth className="!py-1.5 !text-xs gap-1"><Phone size={12} /> Call</Button></a>}
                                    </div>
                                </div>
                            </div>

                            {/* 2. Plot & Payment */}
                            {selectedClient.booking_id ? (
                                <div className="mb-6">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">🏘️ Plot & Payment Status</h4>
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="text-xs text-gray-500">Plot Number</p>
                                                <p className="font-bold text-deepblue-900">{selectedClient.plot_number} (Block {selectedClient.block})</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Total Value</p>
                                                <p className="font-bold text-gray-900">{formatAED(Number(selectedClient.total_amount))}</p>
                                            </div>
                                        </div>

                                        <div>
                                            {(() => {
                                                const pct = Number(selectedClient.total_amount) > 0
                                                    ? Math.round((Number(selectedClient.paid_amount) / Number(selectedClient.total_amount)) * 100) : 0;
                                                return (
                                                    <>
                                                        <div className="flex justify-between text-xs mb-1">
                                                            <span>Payment Progress</span>
                                                            <span className="font-bold text-green-600">{pct}% Paid</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }}></div>
                                                        </div>
                                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                            <span>Paid: {formatAED(Number(selectedClient.paid_amount))}</span>
                                                            <span>Bal: {formatAED(Number(selectedClient.total_amount) - Number(selectedClient.paid_amount))}</span>
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>

                                        <div className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-bold">Next EMI</p>
                                                <p className="text-sm font-bold text-gray-900">{fmtDate(selectedClient.next_emi_date)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 uppercase font-bold">Booking Status</p>
                                                <p className="text-sm font-bold text-deepblue-900">{selectedClient.booking_status}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center text-sm text-gray-500">
                                    No plot purchased yet.
                                </div>
                            )}

                            {/* 3. Earnings */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">💵 My Earnings</h4>
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                    <p className="text-xs text-blue-600 font-bold uppercase mb-2">Level 1 Direct Commission (8% of verified payments)</p>
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold text-blue-900">Total Earned (approved):</span>
                                        <span className="font-bold text-blue-900">{formatAED(Number(selectedClient.my_earnings || 0))}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
