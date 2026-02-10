
import React from 'react';
import { CheckCircle, Calendar, Clock, CreditCard, DollarSign, Landmark, Download } from 'lucide-react';
import { Button } from '../Button';
import { useCurrency } from '../../contexts/CurrencyContext';

export const PaymentsView = ({ bookings }: any) => {
    const { formatAED } = useCurrency();

    return (
        <div className="space-y-8 animate-fade-in-up pb-20">
            <h2 className="text-3xl font-serif font-bold text-deepblue-900">Payments & Financing</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* A. Summary & B. Upcoming */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Summary Card */}
                    <div className="bg-gradient-to-r from-deepblue-900 to-deepblue-800 text-white rounded-2xl p-8 shadow-xl">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Total Plot Value</p>
                                <h3 className="text-3xl font-bold font-serif">{formatAED(2520000)}</h3>
                            </div>
                            <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                                <CheckCircle size={12} /> UP TO DATE
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8 mb-6">
                            <div>
                                <p className="text-blue-200 text-xs uppercase mb-1">Amount Paid</p>
                                <p className="text-xl font-bold">{formatAED(820625)}</p>
                            </div>
                            <div>
                                <p className="text-blue-200 text-xs uppercase mb-1">Outstanding</p>
                                <p className="text-xl font-bold text-gold-400">{formatAED(1699375)}</p>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs mb-2">
                                <span>Payment Progress</span>
                                <span>32.6%</span>
                            </div>
                            <div className="w-full bg-deepblue-950 rounded-full h-2">
                                <div className="bg-gold-500 h-2 rounded-full" style={{ width: '32.6%' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Payments */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h4 className="font-bold text-deepblue-900 mb-4 flex items-center gap-2"><Calendar size={18} /> UPCOMING PAYMENTS</h4>
                        
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex justify-between items-center mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                    <span className="font-bold text-red-800 text-sm">NEXT DUE: EMI #16</span>
                                </div>
                                <p className="text-2xl font-bold text-deepblue-900">{formatAED(37875)}</p>
                                <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><Clock size={10} /> Due: March 01, 2026 (In 27 days)</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button className="!py-2 !px-6 !text-xs shadow-none">Pay Now</Button>
                                <button className="text-xs text-gray-500 hover:text-deepblue-900 underline">Set Reminder</button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition">
                                <div className="text-sm text-gray-600">EMI #17 - Apr 01, 2026</div>
                                <div className="font-bold text-gray-900">{formatAED(37875)}</div>
                            </div>
                            <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition">
                                <div className="text-sm text-gray-600">EMI #18 - May 01, 2026</div>
                                <div className="font-bold text-gray-900">{formatAED(37875)}</div>
                            </div>
                            <button className="w-full text-center text-xs text-blue-600 font-bold hover:underline py-2">View Full Schedule (45 remaining)</button>
                        </div>
                    </div>
                </div>

                {/* D. Make Payment */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-fit sticky top-24">
                    <h4 className="font-bold text-deepblue-900 mb-6 flex items-center gap-2"><CreditCard size={18} /> MAKE PAYMENT</h4>
                    
                    <div className="space-y-6">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Type</p>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 p-3 border border-gold-500 bg-gold-50 rounded-lg cursor-pointer">
                                    <input type="radio" name="payType" defaultChecked className="accent-gold-500" />
                                    <span className="text-sm font-bold text-gray-800">Regular EMI ({formatAED(37875)})</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer">
                                    <input type="radio" name="payType" className="accent-gold-500" />
                                    <span className="text-sm text-gray-600">Advance Payment</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer">
                                    <input type="radio" name="payType" className="accent-gold-500" />
                                    <span className="text-sm text-gray-600">Full Settlement</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Method</p>
                            <div className="grid grid-cols-3 gap-2">
                                <button className="p-2 border border-gray-200 rounded-lg hover:border-gold-500 hover:bg-gold-50 text-center transition">
                                    <CreditCard size={20} className="mx-auto text-gray-500 mb-1" />
                                    <span className="text-[10px] font-bold text-gray-600">Digital</span>
                                </button>
                                <button className="p-2 border border-gray-200 rounded-lg hover:border-gold-500 hover:bg-gold-50 text-center transition">
                                    <DollarSign size={20} className="mx-auto text-gray-500 mb-1" />
                                    <span className="text-[10px] font-bold text-gray-600">Fiat</span>
                                </button>
                                <button className="p-2 border border-gray-200 rounded-lg hover:border-gold-500 hover:bg-gold-50 text-center transition">
                                    <div className="w-5 h-5 mx-auto text-gray-500 mb-1 border-2 border-current rounded-full flex items-center justify-center text-[10px] font-bold">₿</div>
                                    <span className="text-[10px] font-bold text-gray-600">Crypto</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <p className="text-xs text-gray-500 mb-1">Total Payable</p>
                            <p className="text-2xl font-bold text-deepblue-900">{formatAED(37875)}</p>
                        </div>

                        <Button fullWidth className="!py-3 shadow-lg shadow-gold-500/20">Proceed to Payment →</Button>
                    </div>
                </div>
            </div>

            {/* C. Payment History */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="font-bold text-deepblue-900">📊 Payment History</h3>
                    <div className="flex gap-2">
                        <select className="text-xs border border-gray-300 rounded px-2 py-1"><option>All Time</option></select>
                        <input type="text" placeholder="Search..." className="text-xs border border-gray-300 rounded px-2 py-1" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Method</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { id: 'EMI-15', date: "Feb 01 '26", type: 'EMI', amount: formatAED(37875), method: 'UPI', status: 'Paid' },
                                { id: 'EMI-14', date: "Jan 01 '26", type: 'EMI', amount: formatAED(37875), method: 'Card', status: 'Paid' },
                                { id: 'EMI-13', date: "Dec 01 '25", type: 'EMI', amount: formatAED(37875), method: 'Bank', status: 'Paid' },
                                { id: 'EMI-12', date: "Nov 01 '25", type: 'EMI', amount: formatAED(37875), method: 'UPI', status: 'Paid' },
                                { id: 'BKG', date: "Jan 15 '25", type: 'Booking', amount: formatAED(252500), method: 'Bank', status: 'Paid' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900">{row.id}</td>
                                    <td className="px-6 py-4 text-gray-600">{row.date}</td>
                                    <td className="px-6 py-4 text-gray-600">{row.type}</td>
                                    <td className="px-6 py-4 font-bold text-deepblue-900">{row.amount}</td>
                                    <td className="px-6 py-4 text-gray-600">{row.method}</td>
                                    <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={10} /> {row.status}</span></td>
                                    <td className="px-6 py-4 text-right"><button className="text-blue-600 hover:underline text-xs font-bold">[Download]</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
                    <span>Showing 1-5 of 16 payments</span>
                    <div className="flex gap-2">
                        <button className="font-bold text-blue-600">Download Complete Statement</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
