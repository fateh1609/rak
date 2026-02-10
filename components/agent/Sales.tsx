
import React, { useState } from 'react';
import { Search, Filter, Download, Plus, CheckCircle, X, Mail, Phone, MessageCircle, FileText, ChevronRight, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '../Button';
import { ClientRegistration } from './ClientRegistration';
import { useCurrency } from '../../contexts/CurrencyContext';

const MOCK_CLIENTS = [
    { id: '1', name: 'Amit Sharma', plot: 'A-105', value: 2520000, paid: 820625, progress: 32, status: 'Active', nextEmi: 'Mar 01, 2026', emiAmount: 37875, earnings: 65650, date: 'Jan 15, 2026', mobile: '+91 98765 43210', email: 'amit.sharma@email.com', emiStatus: '15/60' },
    { id: '2', name: 'Priya Reddy', plot: 'B-203', value: 2520000, paid: 630000, progress: 25, status: 'Active', nextEmi: 'Mar 01, 2026', emiAmount: 37875, earnings: 50500, date: 'Jan 20, 2026', mobile: '+91 98765 11111', email: 'priya.reddy@email.com', emiStatus: '10/60' },
    { id: '3', name: 'John Doe', plot: 'C-045', value: 2646000, paid: 252500, progress: 10, status: 'Pending', nextEmi: 'Overdue', emiAmount: 39800, earnings: 20200, date: 'Jan 25, 2026', mobile: '+971 50 123 4567', email: 'john.doe@email.com', emiStatus: '0/60' },
    { id: '4', name: 'Sneha Patel', plot: 'A-108', value: 2520000, paid: 1260000, progress: 50, status: 'Active', nextEmi: 'Mar 01, 2026', emiAmount: 37875, earnings: 111000, date: 'Jan 20, 2026', mobile: '+91 98765 22222', email: 'sneha.patel@email.com', emiStatus: '30/60' },
    { id: '5', name: 'Mike Johnson', plot: 'D-201', value: 2646000, paid: 1580000, progress: 60, status: 'Active', nextEmi: 'Mar 01, 2026', emiAmount: 39800, earnings: 129000, date: 'Jan 15, 2026', mobile: '+971 55 555 5555', email: 'mike.johnson@email.com', emiStatus: '36/60' },
    { id: '6', name: 'Sarah Lee', plot: 'E-102', value: 2520000, paid: 1890000, progress: 75, status: 'Active', nextEmi: 'Mar 01, 2026', emiAmount: 37875, earnings: 171000, date: 'Dec 20, 2025', mobile: '+971 50 999 8888', email: 'sarah.lee@email.com', emiStatus: '50/60' },
    { id: '7', name: 'David Chen', plot: 'A-203', value: 2520000, paid: 2270000, progress: 90, status: 'Active', nextEmi: 'Finished', emiAmount: 0, earnings: 202000, date: 'Dec 10, 2025', mobile: '+971 50 777 6666', email: 'david.chen@email.com', emiStatus: '60/60' },
];

export const SalesView = () => {
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const { formatAED } = useCurrency();

    if (isRegistering) {
        return <ClientRegistration onBack={() => setIsRegistering(false)} />;
    }

    return (
        <div className="space-y-6 animate-fade-in-up pb-20">
            {/* Quick Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-deepblue-900">Sales & Client Management</h2>
                    <p className="text-sm text-gray-500 mt-1">Track your pipeline and manage active clients.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="!py-2 !px-4 !text-xs flex items-center gap-2"><Download size={14} /> Import Contacts</Button>
                    <Button variant="outline" className="!py-2 !px-4 !text-xs flex items-center gap-2"><FileText size={14} /> Reports</Button>
                    <Button className="!py-2 !px-4 !text-xs flex items-center gap-2 shadow-gold-500/20" onClick={() => setIsRegistering(true)}><Plus size={14} /> Register New Client</Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative flex-1 min-w-[250px]">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input type="text" placeholder="Search by name, mobile, plot..." className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer">
                        <option>Status: All</option>
                        <option>Active</option>
                        <option>Pending</option>
                        <option>Defaulted</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer">
                        <option>Plot: All Blocks</option>
                        <option>Block A</option>
                        <option>Block B</option>
                        <option>Block C</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer">
                        <option>Date: Last 30 Days</option>
                        <option>Last 3 Months</option>
                        <option>All Time</option>
                    </select>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">My Clients & Sales ({MOCK_CLIENTS.length} Total)</h3>
                </div>
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">Client Name</th>
                                <th className="px-6 py-4">Plot</th>
                                <th className="px-6 py-4">Purchase Date</th>
                                <th className="px-6 py-4 text-right">Total Value (AED)</th>
                                <th className="px-6 py-4 text-right">Paid (AED)</th>
                                <th className="px-6 py-4 text-center">EMI Status</th>
                                <th className="px-6 py-4 text-right">My Earnings</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {MOCK_CLIENTS.map((client) => (
                                <tr key={client.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-gray-900">{client.name}</td>
                                    <td className="px-6 py-4 font-mono text-xs font-bold text-deepblue-900">{client.plot}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{client.date}</td>
                                    <td className="px-6 py-4 text-right text-gray-600">{formatAED(client.value)}</td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-800">{formatAED(client.paid)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${client.emiStatus === '0/60' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                                            {client.emiStatus} {client.emiStatus !== '0/60' && '✅'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-gold-600">{formatAED(client.earnings)}</td>
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
                        <span>Total Sales: <strong className="text-gray-900">{formatAED(11844000)}</strong></span>
                        <span>Total Earned: <strong className="text-gray-900">{formatAED(947000)}</strong></span>
                    </div>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-white disabled:opacity-50" disabled>Prev</button>
                        <button className="px-3 py-1 border border-gray-200 rounded bg-deepblue-900 text-white font-bold">1</button>
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-white hover:text-deepblue-900">2</button>
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-white">Next</button>
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
                            <h3 className="font-bold text-deepblue-900">Client Details: {selectedClient.name}</h3>
                            <button onClick={() => setSelectedClient(null)} className="text-gray-400 hover:text-red-500 transition"><X size={20} /></button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            {/* 1. Client Info */}
                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><CheckCircle size={12} /> Client Information</h4>
                                <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">{selectedClient.name.charAt(0)}</div>
                                            <div>
                                                <p className="font-bold text-gray-900">{selectedClient.name}</p>
                                                <p className="text-xs text-gray-500">Registered: {selectedClient.date}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-gray-600"><Mail size={12} /> {selectedClient.email}</div>
                                        <div className="flex items-center gap-2 text-gray-600"><Phone size={12} /> {selectedClient.mobile}</div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button variant="outline" className="flex-1 !py-1.5 !text-xs gap-1"><Mail size={12} /> Email</Button>
                                        <Button variant="outline" className="flex-1 !py-1.5 !text-xs gap-1"><Phone size={12} /> Call</Button>
                                        <Button variant="outline" className="flex-1 !py-1.5 !text-xs gap-1"><MessageCircle size={12} /> WhatsApp</Button>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Plot & Payment */}
                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">🏘️ Plot & Payment Status</h4>
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500">Plot Number</p>
                                            <p className="font-bold text-deepblue-900">{selectedClient.plot} (Block A)</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">Total Value</p>
                                            <p className="font-bold text-gray-900">{formatAED(selectedClient.value)}</p>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>EMI Progress ({selectedClient.emiStatus})</span>
                                            <span className="font-bold text-green-600">{selectedClient.progress}% Paid</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${selectedClient.progress}%` }}></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>Paid: {formatAED(selectedClient.paid)}</span>
                                            <span>Bal: {formatAED(selectedClient.value - selectedClient.paid)}</span>
                                        </div>
                                    </div>

                                    <div className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold">Next EMI</p>
                                            <p className="text-sm font-bold text-gray-900">{selectedClient.nextEmi}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase font-bold">Amount</p>
                                            <p className="text-sm font-bold text-deepblue-900">{formatAED(selectedClient.emiAmount)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Earnings */}
                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">💵 My Earnings</h4>
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                    <p className="text-xs text-blue-600 font-bold uppercase mb-2">Level 1 Direct Commission (8%)</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">From Booking:</span>
                                            <span className="font-bold text-gray-900">{formatAED(20200)} <span className="text-green-600 text-xs ml-1">Paid</span></span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">From EMIs:</span>
                                            <span className="font-bold text-gray-900">{formatAED(selectedClient.earnings - 20200)} <span className="text-green-600 text-xs ml-1">Paid</span></span>
                                        </div>
                                        <div className="border-t border-blue-200 pt-2 flex justify-between">
                                            <span className="font-bold text-blue-900">Total Earned So Far:</span>
                                            <span className="font-bold text-blue-900">{formatAED(selectedClient.earnings)}</span>
                                        </div>
                                        <div className="text-right text-xs text-blue-500 mt-1">Lifetime Potential: {formatAED(201800)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Recent Activity */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">📅 Recent Activity</h4>
                                <ul className="space-y-3 text-xs text-gray-600">
                                    <li className="flex gap-2">
                                        <CheckCircle size={14} className="text-green-500" />
                                        <span>EMI-15 paid successfully on <b>Feb 01, 2026</b></span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle size={14} className="text-green-500" />
                                        <span>EMI-14 paid successfully on <b>Jan 01, 2026</b></span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle size={14} className="text-green-500" />
                                        <span>Booking confirmed on <b>{selectedClient.date}</b></span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2">
                            <Button variant="outline" className="flex-1 !text-xs border-gray-300 text-gray-600 hover:text-deepblue-900">Send Reminder</Button>
                            <Button variant="outline" className="flex-1 !text-xs border-gray-300 text-gray-600 hover:text-deepblue-900">Add Note</Button>
                            <Button className="flex-1 !text-xs shadow-none">View History</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
