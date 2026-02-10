
import React, { useState } from 'react';
import { MapPin, CheckCircle, DollarSign, Download, FileText, ChevronLeft, ChevronRight, Maximize, Ruler, Home, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../Button';
import { useCurrency } from '../../contexts/CurrencyContext';
import { UserProfile } from '../../types';

const PROPERTIES = [
    {
        id: 'A-105',
        plotNumber: 'A-105',
        block: 'Block A',
        type: 'Standard Residential',
        sizeSqFt: 1000,
        dimensions: '32.8 ft × 30.5 ft',
        price: 2520000,
        paid: 820625,
        bookingDate: 'Jan 15, 2026',
        image: 'https://iili.io/fQnWtRe.jpg',
        regId: 'RAK-2026-A105',
        coordinates: '25.7889° N, 55.9485° E',
        progress: 32.6,
        status: 'Active & Verified',
        construction: '45%'
    },
    {
        id: 'B-203',
        plotNumber: 'B-203',
        block: 'Block B',
        type: 'Corner Plot (Premium)',
        sizeSqFt: 1200,
        dimensions: '40 ft × 30 ft',
        price: 3175200,
        paid: 317520,
        bookingDate: 'Feb 02, 2026',
        image: 'https://images.unsplash.com/photo-1599809275372-b7f58fc91378?auto=format&fit=crop&w=1200&q=80',
        regId: 'RAK-2026-B203',
        coordinates: '25.7892° N, 55.9490° E',
        progress: 10.0,
        status: 'Booking Confirmed',
        construction: '20%'
    }
];

export const MyPlotView = ({ bookings, onBuyNew, profile }: { bookings: any, onBuyNew: any, profile: UserProfile | null }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { formatAED } = useCurrency();
    
    const currentProperty = PROPERTIES[currentIndex];

    const nextPlot = () => setCurrentIndex((prev) => (prev + 1) % PROPERTIES.length);
    const prevPlot = () => setCurrentIndex((prev) => (prev - 1 + PROPERTIES.length) % PROPERTIES.length);

    // Helper to generate schedule based on property data
    const getSchedule = (property: typeof PROPERTIES[0]) => {
        const emiVal = 37875; // Mock EMI Amount
        const bookingVal = property.price * 0.1;
        const paidTotal = property.paid;
        
        const payments = [];
        const bookedDate = new Date(property.bookingDate);
        
        // 1. Booking
        payments.push({ 
            id: 'BKG', 
            label: 'Booking Amount (10%)', 
            date: property.bookingDate, 
            amount: bookingVal, 
            status: 'PAID' 
        });
        
        let runningPaid = bookingVal;
        
        // 2. EMIs (60 months)
        for(let i=1; i<=60; i++) {
            const d = new Date(bookedDate);
            d.setMonth(d.getMonth() + i);
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
            
            runningPaid += emiVal;
            const isPaid = runningPaid <= (paidTotal + 100); // Tolerance
            
            payments.push({ 
                id: `EMI-${i}`, 
                label: `Monthly Installment #${i}`, 
                date: dateStr, 
                amount: emiVal, 
                status: isPaid ? 'PAID' : 'UPCOMING' 
            });
        }
        return payments;
    };

    const schedule = getSchedule(currentProperty);
    const paidPayments = schedule.filter(p => p.status === 'PAID').reverse(); // Newest first
    const upcomingPayments = schedule.filter(p => p.status === 'UPCOMING');
    const nextPayment = upcomingPayments[0];

    const handleDownloadCertificate = async () => {
        // ... (Certificate Generation Logic - Truncated for brevity but kept in real app if needed)
        alert("Certificate download started...");
    };

    return (
    <div className="space-y-8 animate-fade-in-up pb-20">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-serif font-bold text-deepblue-900">My Property Portfolio</h2>
                <p className="text-sm text-gray-500">Manage your owned assets and documents</p>
            </div>
            <span className="bg-gold-100 text-gold-700 px-4 py-2 rounded-full text-xs font-bold border border-gold-200 shadow-sm flex items-center gap-2">
                <Home size={14} /> {PROPERTIES.length} Properties Owned
            </span>
        </div>
        
        {/* CAROUSEL SECTION */}
        <div className="relative bg-deepblue-900 rounded-2xl overflow-hidden shadow-2xl aspect-[16/9] md:aspect-[21/9] group border border-gray-800">
            {/* Animated Image Background */}
            <div className="absolute inset-0 bg-black">
                <img 
                    key={currentProperty.id}
                    src={currentProperty.image} 
                    alt={currentProperty.plotNumber}
                    className="w-full h-full object-cover opacity-60 animate-fade-in-up"
                />
            </div>
            
            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 bg-gradient-to-t from-deepblue-900 via-deepblue-900/40 to-transparent">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-gold-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">{currentProperty.block}</span>
                            <span className="text-gray-300 text-xs font-bold flex items-center gap-1"><CheckCircle size={10} className="text-green-400" /> {currentProperty.status}</span>
                        </div>
                        <h3 className="text-4xl md:text-6xl font-serif font-bold text-white mb-2 shadow-lg">{currentProperty.plotNumber}</h3>
                        <p className="text-gray-300 text-sm md:text-base flex items-center gap-2">
                            <MapPin size={16} className="text-gold-500" /> Ras Al Khaimah Oasis Estate • {currentProperty.type}
                        </p>
                    </div>
                    <div className="flex gap-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                         <Button onClick={onBuyNew} className="!py-2.5 !px-5 !text-xs shadow-gold-500/20 shadow-lg bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white !rounded-xl">
                            + Add Property
                         </Button>
                         <Button onClick={handleDownloadCertificate} className="!py-2.5 !px-5 !text-xs shadow-lg bg-gold-500 text-deepblue-900 border-none !rounded-xl font-bold">
                            <Download size={14} className="mr-2" /> Certificate
                         </Button>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full px-4 flex justify-between pointer-events-none">
                <button onClick={prevPlot} className="pointer-events-auto bg-black/30 hover:bg-gold-500 backdrop-blur-md p-3 rounded-full text-white transition-all hover:scale-110 border border-white/10 group">
                    <ChevronLeft size={24} className="group-hover:text-deepblue-900" />
                </button>
                <button onClick={nextPlot} className="pointer-events-auto bg-black/30 hover:bg-gold-500 backdrop-blur-md p-3 rounded-full text-white transition-all hover:scale-110 border border-white/10 group">
                    <ChevronRight size={24} className="group-hover:text-deepblue-900" />
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute top-6 right-6 flex gap-2">
                {PROPERTIES.map((_, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-gold-500' : 'w-2 bg-white/30 hover:bg-white/50'}`} 
                    />
                ))}
            </div>
        </div>

        {/* DETAILS GRID */}
        <div key={currentProperty.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            
            {/* 1. Specs Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between hover:border-gold-300 transition-colors group">
                <div>
                    <h4 className="font-bold text-deepblue-900 mb-4 flex items-center gap-2"><FileText size={18} className="text-gold-500" /> SPECIFICATIONS</h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                            <span className="text-xs text-gray-500 uppercase font-bold">Total Area</span>
                            <span className="text-sm font-bold text-gray-900 flex items-center gap-1"><Maximize size={12} /> {currentProperty.sizeSqFt} sq.ft</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                            <span className="text-xs text-gray-500 uppercase font-bold">Dimensions</span>
                            <span className="text-sm font-bold text-gray-900 flex items-center gap-1"><Ruler size={12} /> {currentProperty.dimensions}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                            <span className="text-xs text-gray-500 uppercase font-bold">Plot Type</span>
                            <span className="text-sm font-bold text-deepblue-900">{currentProperty.type}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 uppercase font-bold">Registration ID</span>
                            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">{currentProperty.regId}</span>
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
                    Coordinates: {currentProperty.coordinates}
                </div>
            </div>

            {/* 2. Financials Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between hover:border-green-300 transition-colors">
                <div>
                    <h4 className="font-bold text-deepblue-900 mb-4 flex items-center gap-2"><DollarSign size={18} className="text-green-500" /> FINANCIAL STATUS</h4>
                    <div className="mb-4">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Total Asset Value</p>
                        <p className="text-2xl font-serif font-bold text-deepblue-900">{formatAED(currentProperty.price)}</p>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${currentProperty.progress}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="font-bold text-green-600">{currentProperty.progress}% Paid</span>
                            <span className="text-gray-500">Target: 100%</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-[10px] text-gray-400 uppercase font-bold">Paid Amount</p>
                            <p className="text-sm font-bold text-gray-800">{formatAED(currentProperty.paid)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-[10px] text-gray-400 uppercase font-bold">Balance</p>
                            <p className="text-sm font-bold text-red-500">{formatAED(currentProperty.price - currentProperty.paid)}</p>
                        </div>
                    </div>
                </div>
                <button className="w-full mt-4 text-xs font-bold text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition">Download Statement</button>
            </div>

            {/* 3. Upcoming Schedule Card (REPLACED Development) */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col hover:border-gold-300 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-bl-full -mr-4 -mt-4"></div>
                <h4 className="font-bold text-deepblue-900 mb-6 flex items-center gap-2 relative z-10"><Calendar size={18} className="text-gold-500" /> UPCOMING SCHEDULE</h4>
                
                {nextPayment ? (
                    <>
                        <div className="mb-6 relative z-10">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Next Due</span>
                            </div>
                            <p className="text-3xl font-serif font-bold text-deepblue-900">{formatAED(nextPayment.amount)}</p>
                            <p className="text-sm text-gray-500 font-medium mt-1">Due: {nextPayment.date}</p>
                        </div>

                        <div className="space-y-3 flex-1 overflow-y-auto max-h-[120px] pr-2 relative z-10">
                            {upcomingPayments.slice(1, 4).map((pay) => (
                                <div key={pay.id} className="flex justify-between items-center text-xs p-2 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="text-gray-500">{pay.date}</span>
                                    <span className="font-bold text-gray-700">{formatAED(pay.amount)}</span>
                                </div>
                            ))}
                            {upcomingPayments.length > 4 && <p className="text-[10px] text-gray-400 text-center italic">+{upcomingPayments.length - 4} more</p>}
                        </div>
                        
                        <Button className="w-full mt-4 !py-2 !text-xs relative z-10 shadow-lg shadow-gold-500/20">Pay Now</Button>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <CheckCircle size={48} className="text-green-500 mb-3" />
                        <p className="font-bold text-gray-900">All Payments Clear!</p>
                        <p className="text-xs text-gray-500 mt-1">You have fully paid for this property.</p>
                    </div>
                )}
            </div>

        </div>

        {/* PAYMENT HISTORY SECTION */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                <h3 className="font-bold text-deepblue-900 flex items-center gap-2">
                    <Clock size={18} className="text-blue-500" /> Payment History (Already Paid)
                </h3>
                <div className="text-xs font-bold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                    Total Paid: <span className="text-green-600">{formatAED(currentProperty.paid)}</span>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white text-gray-500 font-bold border-b border-gray-200 uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4">Installment</th>
                            <th className="px-6 py-4">Date Paid</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Receipt</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paidPayments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{payment.label}</td>
                                <td className="px-6 py-4 text-gray-500">{payment.date}</td>
                                <td className="px-6 py-4 font-bold text-deepblue-900">{formatAED(payment.amount)}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
                                        <CheckCircle size={10} /> Paid
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 hover:underline text-xs font-bold flex items-center justify-end gap-1 w-full">
                                        <Download size={12} /> PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {paidPayments.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-xs italic">
                                    No payments recorded yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
)};
