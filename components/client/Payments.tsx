
import React, { useState, useEffect } from 'react';
import { CheckCircle, Calendar, Clock, CreditCard, Landmark, Loader2, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '../Button';
import { useCurrency } from '../../contexts/CurrencyContext';
import { api } from '../../lib/api';

export const PaymentsView = ({ bookings }: any) => {
    const { formatAED } = useCurrency();
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Payment form state
    const [payType, setPayType] = useState<'emi' | 'advance' | 'settlement'>('emi');
    const [method, setMethod] = useState<'RAZORPAY' | 'BANK_TRANSFER' | 'USDT_TRC20'>('BANK_TRANSFER');
    const [transactionRef, setTransactionRef] = useState('');
    const [customAmount, setCustomAmount] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formMsg, setFormMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

    const booking = (bookings || [])[0];
    const totalValue = Number(booking?.total_amount || 0);
    const paid = Number(booking?.paid_amount || 0);
    const outstanding = Math.max(0, totalValue - paid);
    const progress = totalValue > 0 ? ((paid / totalValue) * 100).toFixed(1) : '0';
    const emiAmount = totalValue > 0 ? Math.round((totalValue * 0.9) / 60) : 0;
    const nextDue = booking?.next_emi_date
        ? new Date(booking.next_emi_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : '—';
    const daysLeft = booking?.next_emi_date
        ? Math.max(0, Math.ceil((new Date(booking.next_emi_date).getTime() - Date.now()) / 86400000))
        : 0;
    const isUpToDate = !booking?.next_emi_date || new Date(booking.next_emi_date).getTime() >= Date.now();

    const fetchPayments = () => {
        api.get<{ payments: any[] }>('/payments/my')
            .then(({ payments: p }) => setPayments(p))
            .catch(() => setPayments([]))
            .finally(() => setLoading(false));
    };

    useEffect(fetchPayments, []);

    const payAmount = payType === 'emi' ? emiAmount
        : payType === 'settlement' ? outstanding
        : Number(customAmount) || 0;

    const handleSubmit = async () => {
        setFormMsg(null);
        if (!booking) { setFormMsg({ type: 'err', text: 'No active booking found.' }); return; }
        if (!payAmount || payAmount <= 0) { setFormMsg({ type: 'err', text: 'Enter a valid amount.' }); return; }
        if (!transactionRef.trim()) { setFormMsg({ type: 'err', text: 'Enter your transaction reference.' }); return; }
        setSubmitting(true);
        try {
            await api.post('/payments', {
                booking_id: booking.id,
                amount: payAmount,
                method,
                transaction_ref: transactionRef.trim()
            });
            setFormMsg({ type: 'ok', text: 'Payment submitted. It will reflect once verified by our team.' });
            setTransactionRef('');
            setCustomAmount('');
            fetchPayments();
        } catch (e: any) {
            setFormMsg({ type: 'err', text: e?.message || 'Submission failed.' });
        } finally {
            setSubmitting(false);
        }
    };

    const statusBadge = (status: string) => {
        if (status === 'verified') return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={10} /> Verified</span>;
        if (status === 'rejected') return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 w-fit"><XCircle size={10} /> Rejected</span>;
        return <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 w-fit"><Clock size={10} /> Pending</span>;
    };

    return (
        <div className="space-y-8 animate-fade-in-up pb-20">
            <h2 className="text-3xl font-serif font-bold text-deepblue-900">Payments & Financing</h2>

            {!booking && (
                <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-12 text-center">
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No Active Booking</h3>
                    <p className="text-gray-500">Purchase a plot to start your payment plan.</p>
                </div>
            )}

            {booking && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* A. Summary & B. Upcoming */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Summary Card */}
                    <div className="bg-gradient-to-r from-deepblue-900 to-deepblue-800 text-white rounded-2xl p-8 shadow-xl">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Total Plot Value — {booking.plot_details?.plot_number}</p>
                                <h3 className="text-3xl font-bold font-serif">{formatAED(totalValue)}</h3>
                            </div>
                            <span className={`${isUpToDate ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'} border px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2`}>
                                <CheckCircle size={12} /> {isUpToDate ? 'UP TO DATE' : 'PAYMENT DUE'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-6">
                            <div>
                                <p className="text-blue-200 text-xs uppercase mb-1">Amount Paid</p>
                                <p className="text-xl font-bold">{formatAED(paid)}</p>
                            </div>
                            <div>
                                <p className="text-blue-200 text-xs uppercase mb-1">Outstanding</p>
                                <p className="text-xl font-bold text-gold-400">{formatAED(outstanding)}</p>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs mb-2">
                                <span>Payment Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-deepblue-950 rounded-full h-2">
                                <div className="bg-gold-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Payments */}
                    {outstanding > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h4 className="font-bold text-deepblue-900 mb-4 flex items-center gap-2"><Calendar size={18} /> UPCOMING PAYMENTS</h4>

                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex justify-between items-center mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                    <span className="font-bold text-red-800 text-sm">NEXT EMI DUE</span>
                                </div>
                                <p className="text-2xl font-bold text-deepblue-900">{formatAED(emiAmount)}</p>
                                <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><Clock size={10} /> Due: {nextDue} {daysLeft > 0 && `(In ${daysLeft} days)`}</p>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 italic">
                            Plan: 10% booking + {formatAED(emiAmount)} × 60 monthly installments at 0% interest.
                        </p>
                    </div>
                    )}
                </div>

                {/* D. Make Payment */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-fit sticky top-24">
                    <h4 className="font-bold text-deepblue-900 mb-6 flex items-center gap-2"><CreditCard size={18} /> MAKE PAYMENT</h4>

                    <div className="space-y-6">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Type</p>
                            <div className="space-y-2">
                                <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${payType === 'emi' ? 'border-gold-500 bg-gold-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input type="radio" name="payType" checked={payType === 'emi'} onChange={() => setPayType('emi')} className="accent-gold-500" />
                                    <span className="text-sm font-bold text-gray-800">Regular EMI ({formatAED(emiAmount)})</span>
                                </label>
                                <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${payType === 'advance' ? 'border-gold-500 bg-gold-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input type="radio" name="payType" checked={payType === 'advance'} onChange={() => setPayType('advance')} className="accent-gold-500" />
                                    <span className="text-sm text-gray-600">Advance Payment</span>
                                </label>
                                <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${payType === 'settlement' ? 'border-gold-500 bg-gold-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input type="radio" name="payType" checked={payType === 'settlement'} onChange={() => setPayType('settlement')} className="accent-gold-500" />
                                    <span className="text-sm text-gray-600">Full Settlement ({formatAED(outstanding)})</span>
                                </label>
                            </div>
                        </div>

                        {payType === 'advance' && (
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Amount (INR)</p>
                                <input type="number" min={1} value={customAmount} onChange={(e) => setCustomAmount(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:outline-none text-sm"
                                    placeholder="Enter amount in INR" />
                            </div>
                        )}

                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Method</p>
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => setMethod('RAZORPAY')} className={`p-2 border rounded-lg text-center transition ${method === 'RAZORPAY' ? 'border-gold-500 bg-gold-50' : 'border-gray-200 hover:border-gold-300'}`}>
                                    <CreditCard size={20} className="mx-auto text-gray-500 mb-1" />
                                    <span className="text-[10px] font-bold text-gray-600">Digital</span>
                                </button>
                                <button onClick={() => setMethod('BANK_TRANSFER')} className={`p-2 border rounded-lg text-center transition ${method === 'BANK_TRANSFER' ? 'border-gold-500 bg-gold-50' : 'border-gray-200 hover:border-gold-300'}`}>
                                    <Landmark size={20} className="mx-auto text-gray-500 mb-1" />
                                    <span className="text-[10px] font-bold text-gray-600">Bank</span>
                                </button>
                                <button onClick={() => setMethod('USDT_TRC20')} className={`p-2 border rounded-lg text-center transition ${method === 'USDT_TRC20' ? 'border-gold-500 bg-gold-50' : 'border-gray-200 hover:border-gold-300'}`}>
                                    <div className="w-5 h-5 mx-auto text-gray-500 mb-1 border-2 border-current rounded-full flex items-center justify-center text-[10px] font-bold">₿</div>
                                    <span className="text-[10px] font-bold text-gray-600">Crypto</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Transaction Reference *</p>
                            <input type="text" value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:outline-none text-sm"
                                placeholder="UTR / TXID / Reference no." />
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <p className="text-xs text-gray-500 mb-1">Total Payable</p>
                            <p className="text-2xl font-bold text-deepblue-900">{formatAED(payAmount)}</p>
                        </div>

                        {formMsg && (
                            <div className={`px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${formMsg.type === 'ok' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                                {formMsg.type === 'ok' ? <CheckCircle size={16} className="shrink-0" /> : <AlertCircle size={16} className="shrink-0" />}
                                {formMsg.text}
                            </div>
                        )}

                        <Button fullWidth className="!py-3 shadow-lg shadow-gold-500/20" onClick={handleSubmit} disabled={submitting}>
                            {submitting ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Submit Payment →'}
                        </Button>
                    </div>
                </div>
            </div>
            )}

            {/* C. Payment History */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-deepblue-900">📊 Payment History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Method</th>
                                <th className="px-6 py-4">Reference</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading && (
                                <tr><td colSpan={5} className="px-6 py-8 text-center"><Loader2 className="animate-spin mx-auto text-gold-500" size={24} /></td></tr>
                            )}
                            {!loading && payments.length === 0 && (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No payments yet.</td></tr>
                            )}
                            {payments.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-600">{new Date(p.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}</td>
                                    <td className="px-6 py-4 font-bold text-deepblue-900">{formatAED(Number(p.amount))}</td>
                                    <td className="px-6 py-4 text-gray-600">{(p.method || '').replace('_', ' ')}</td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{p.transaction_ref || '—'}</td>
                                    <td className="px-6 py-4">{statusBadge(p.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
