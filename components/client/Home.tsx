
import React, { useState, useEffect } from 'react';
import { Home, DollarSign, Calendar, Activity, ArrowRight, Bell, FileText, Smartphone, CheckCircle, CreditCard, ChevronDown, Plus } from 'lucide-react';
import { Button } from '../Button';
import { useCurrency } from '../../contexts/CurrencyContext';
import { api } from '../../lib/api';

export const DashboardHome = ({ profile, bookings, onBuyNew, onViewChange }: any) => {
    const { formatAED } = useCurrency();
    const [payments, setPayments] = useState<any[]>([]);

    // Prepare Plot Data from live bookings
    const myPlots = (bookings || []).map((b: any) => ({
        id: b.id,
        plot_number: b.plot_details?.plot_number || 'Unknown',
        block: `Block ${b.plot_details?.block || 'A'}`,
        price_inr: Number(b.plot_details?.price_inr || b.total_amount || 0),
        paid_amount: Number(b.paid_amount || 0),
        next_emi_date: b.next_emi_date ? new Date(b.next_emi_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'TBD',
        next_emi_raw: b.next_emi_date,
        status: b.status
    }));

    const [selectedPlotId, setSelectedPlotId] = useState<string>(myPlots[0]?.id || '');

    useEffect(() => {
        if (myPlots.length > 0 && !selectedPlotId) {
            setSelectedPlotId(myPlots[0].id);
        }
    }, [myPlots]);

    useEffect(() => {
        api.get<{ payments: any[] }>('/payments/my')
            .then(({ payments: p }) => setPayments(p))
            .catch(() => setPayments([]));
    }, []);

    const currentPlot = myPlots.find((p: any) => p.id === selectedPlotId) || myPlots[0];

    // Derived Stats
    const plotValue = currentPlot?.price_inr || 0;
    const amountPaid = currentPlot?.paid_amount || 0;
    const progress = plotValue > 0 ? ((amountPaid / plotValue) * 100).toFixed(1) : 0;
    // 10% booking + 90% over 60 monthly EMIs (0% interest)
    const nextEmiAmount = plotValue > 0 ? Math.round((plotValue * 0.9) / 60) : 0;
    const daysRemaining = currentPlot?.next_emi_raw
        ? Math.max(0, Math.ceil((new Date(currentPlot.next_emi_raw).getTime() - Date.now()) / 86400000))
        : 0;

    // Recent Activities from real payments + bookings
    const activities = [
        ...payments.slice(0, 4).map((p: any, i: number) => ({
            id: `pay-${p.id}`,
            title: p.status === 'verified' ? 'Payment Verified' : p.status === 'rejected' ? 'Payment Rejected' : 'Payment Submitted',
            date: new Date(p.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            desc: formatAED(Number(p.amount)),
            color: p.status === 'verified' ? 'bg-green-500' : p.status === 'rejected' ? 'bg-red-500' : 'bg-gold-500'
        })),
        ...(bookings || []).slice(0, 2).map((b: any) => ({
            id: `book-${b.id}`,
            title: b.status === 'CONFIRMED' ? 'Booking Confirmed' : 'Booking Pending Verification',
            date: new Date(b.booking_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            desc: `Plot ${b.plot_details?.plot_number || ''} Secured`,
            color: 'bg-deepblue-900'
        }))
    ];

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            {/* A. WELCOME HEADER & PLOT SELECTOR */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-deepblue-900">Welcome back, {profile?.full_name?.split(' ')[0] || 'Amit'}! 👋</h2>
                    <p className="text-gray-500 mt-1">Your RAK OASIS investment journey</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Plot Selector Dropdown */}
                    {myPlots.length > 0 ? (
                        <div className="relative">
                            <select 
                                value={selectedPlotId}
                                onChange={(e) => setSelectedPlotId(e.target.value)}
                                className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 font-bold py-2.5 pl-4 pr-10 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-500 w-full sm:w-64"
                            >
                                {myPlots.map((p: any) => (
                                    <option key={p.id} value={p.id}>{p.plot_number} ({p.block})</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    ) : (
                        <div className="text-sm font-bold text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                            No plots found. Start your journey!
                        </div>
                    )}

                    <Button onClick={onBuyNew} className="!py-2.5 !px-5 !text-sm whitespace-nowrap">
                       <Plus size={16} className="mr-1 inline" /> Buy New Plot
                    </Button>
                </div>
            </div>

            {/* B. QUICK STATS CARDS (SCROLLABLE ON MOBILE) */}
            {myPlots.length > 0 ? (
                <div className="flex overflow-x-auto pb-4 gap-6 snap-x md:grid md:grid-cols-3 md:gap-8 no-scrollbar">
                    {/* Card 1: Plot Value */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group min-w-[280px] snap-center flex flex-col justify-between h-full">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Home size={20} /></div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">My Plot</span>
                            </div>
                            <h3 className="text-2xl font-bold text-deepblue-900 mb-1">{formatAED(plotValue)}</h3>
                            <p className="text-xs text-gray-500">{currentPlot.plot_number} • {currentPlot.block}</p>
                        </div>
                        <button onClick={() => onViewChange('MY_PLOT')} className="text-xs text-blue-600 font-bold mt-4 hover:underline flex items-center gap-1">View Details <ArrowRight size={12} /></button>
                    </div>

                    {/* Card 2: Amount Paid */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group min-w-[280px] snap-center flex flex-col justify-between h-full">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-green-50 text-green-600 rounded-lg"><DollarSign size={20} /></div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Amount Paid</span>
                            </div>
                            <h3 className="text-2xl font-bold text-deepblue-900 mb-1">{formatAED(amountPaid)}</h3>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 mb-1">
                                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <p className="text-xs text-green-600 font-bold">{progress}% Complete</p>
                        </div>
                    </div>

                    {/* Card 3: Next EMI Due */}
                    <div className="bg-white p-6 rounded-xl border border-gold-200 shadow-sm relative overflow-hidden group ring-1 ring-gold-100 min-w-[280px] snap-center flex flex-col justify-between h-full">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-gold-50 text-gold-600 rounded-lg"><Calendar size={20} /></div>
                                <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">Next EMI</span>
                            </div>
                            <h3 className="text-2xl font-bold text-deepblue-900 mb-1">{formatAED(nextEmiAmount)}</h3>
                            <p className="text-xs text-gray-500">Due: {currentPlot.next_emi_date}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs font-bold text-green-600">In {daysRemaining} days</span>
                            <button onClick={() => onViewChange('PAYMENTS')} className="text-xs bg-gold-500 text-white px-3 py-1 rounded hover:bg-gold-600 transition">Pay Now</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-12 text-center">
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Start Your Investment Portfolio</h3>
                    <p className="text-gray-500 mb-6">You don't have any active plots yet. Check out our latest inventory.</p>
                    <Button onClick={onBuyNew} className="mx-auto">Browse Plots</Button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column */}
                <div className="lg:col-span-2">
                    {/* C. PAYMENT PROGRESS SECTION */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-full flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-deepblue-900 mb-6 flex items-center gap-2"><CreditCard size={18} /> PAYMENT PROGRESS</h3>
                            
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-gray-700">Booking Amount (10%)</span>
                                    <span className="text-sm font-bold text-green-600 flex items-center gap-1">{formatAED(Math.round(plotValue * 0.1))} {amountPaid >= plotValue * 0.1 && <CheckCircle size={14} />}</span>
                                </div>
                                <p className="text-xs text-gray-500">{amountPaid >= plotValue * 0.1 ? 'Received' : 'Due on booking'}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span>Payment Progress</span>
                                    <span className="font-bold text-deepblue-900">{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div className="bg-gradient-to-r from-gold-400 to-gold-600 h-3 rounded-full shadow-md" style={{ width: `${progress}%` }}></div>
                                </div>
                                
                                <div className="bg-deepblue-900/5 p-4 rounded-xl grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Total</p>
                                        <p className="text-sm font-bold text-deepblue-900">{formatAED(plotValue)}</p>
                                    </div>
                                    <div className="border-x border-gray-200">
                                        <p className="text-xs text-gray-500 uppercase font-bold">Paid</p>
                                        <p className="text-sm font-bold text-green-600">{formatAED(amountPaid)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Balance</p>
                                        <p className="text-sm font-bold text-red-500">{formatAED(Math.max(0, plotValue - amountPaid))}</p>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500 italic text-center">
                                    Monthly EMI: {formatAED(nextEmiAmount)} • 0% interest over 5 years
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-6 mt-auto">
                            <Button variant="outline" className="flex-1 !py-2 !text-xs" onClick={() => onViewChange('PAYMENTS')}>View Schedule</Button>
                            <Button className="flex-1 !py-2 !text-xs" onClick={() => onViewChange('PAYMENTS')}>Make Payment</Button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div>
                    {/* E. QUICK ACTIONS */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-full flex flex-col">
                        <h3 className="font-bold text-deepblue-900 mb-6 text-sm uppercase tracking-wider">⚡ Quick Actions</h3>
                        <div className="flex-1 flex flex-col justify-center gap-5">
                            <button onClick={() => onViewChange('PAYMENTS')} className="w-full p-4 bg-gray-50 hover:bg-gold-50 border border-gray-200 hover:border-gold-300 rounded-xl flex items-center gap-4 transition-all group shadow-sm hover:shadow-md">
                                <span className="p-3 bg-white rounded-full text-gold-600 shadow-sm group-hover:scale-110 transition-transform"><DollarSign size={20} /></span> 
                                <span className="text-sm font-bold text-gray-700 group-hover:text-deepblue-900">Make Payment</span>
                            </button>
                            <button onClick={() => onViewChange('DOCUMENTS')} className="w-full p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl flex items-center gap-4 transition-all group shadow-sm hover:shadow-md">
                                <span className="p-3 bg-white rounded-full text-blue-600 shadow-sm group-hover:scale-110 transition-transform"><FileText size={20} /></span> 
                                <span className="text-sm font-bold text-gray-700 group-hover:text-deepblue-900">View Documents</span>
                            </button>
                            <button onClick={() => onViewChange('SUPPORT')} className="w-full p-4 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-xl flex items-center gap-4 transition-all group shadow-sm hover:shadow-md">
                                <span className="p-3 bg-white rounded-full text-purple-600 shadow-sm group-hover:scale-110 transition-transform"><Smartphone size={20} /></span> 
                                <span className="text-sm font-bold text-gray-700 group-hover:text-deepblue-900">Contact Support</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* D. RECENT ACTIVITY TIMELINE (Full Width) */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-deepblue-900 mb-6 flex items-center gap-2"><Activity size={18} /> RECENT ACTIVITY</h3>
                <div className="space-y-6 relative pl-2">
                    <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-100"></div>
                    
                    {activities.map((activity) => (
                        <div key={activity.id} className="relative flex gap-4">
                            <div className={`w-4 h-4 rounded-full ${activity.color} border-4 border-white shadow-sm z-10 shrink-0`}></div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">{activity.title}</p>
                                <p className="text-xs text-gray-500">{activity.date} • {activity.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
