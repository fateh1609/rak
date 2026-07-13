
import React, { useState, useEffect, useRef } from 'react';
import { Upload, Home, DollarSign, CreditCard, Landmark, AlertCircle, CheckCircle, X, ChevronRight, Check, Loader2 } from 'lucide-react';
import { Button } from '../Button';
import { Plot } from '../../types';
import { useCurrency } from '../../contexts/CurrencyContext';
import { api } from '../../lib/api';

type WizardSection = 'BUYER' | 'KYC' | 'INTENT' | 'PLOT' | 'PLAN' | 'PROOF' | 'CONSULTANT' | 'SIGNATURE';

export const PurchaseWizard = ({ profile, selectedPlot: initialPlot, onCancel, onSuccess }: any) => {
    const [step, setStep] = useState<WizardSection>('PLOT');
    const [plot, setPlot] = useState<Plot | null>(initialPlot);
    const [inventory, setInventory] = useState<Plot[]>([]);
    const [inventoryLoading, setInventoryLoading] = useState(false);

    // Form State
    const [intent, setIntent] = useState<'personal' | 'investment' | null>(null);
    const [paymentPlan, setPaymentPlan] = useState<'full' | 'financing'>('financing');
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'manual' | 'crypto' | null>(null);
    const [transactionRef, setTransactionRef] = useState('');
    const [signature, setSignature] = useState<string | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const { formatAED, formatUSDT } = useCurrency();

    useEffect(() => {
        if (!initialPlot) fetchInventory();
        else setStep('BUYER');
    }, []);

    const fetchInventory = async () => {
        setInventoryLoading(true);
        try {
            const { plots } = await api.get<{ plots: Plot[] }>('/plots');
            setInventory(plots);
        } catch (e) {
            console.error('Failed to load inventory', e);
            setInventory([]);
        } finally {
            setInventoryLoading(false);
        }
    };

    /** Creates the booking, then submits the booking-amount payment for admin verification. */
    const handleSubmitApplication = async () => {
        if (!plot) return;
        setSubmitting(true);
        setSubmitError('');
        try {
            const { booking } = await api.post<{ booking: any }>('/bookings', { plot_id: plot.id });
            const amount = paymentPlan === 'full'
                ? Number(plot.price_inr)
                : Math.round(Number(plot.price_inr) * 0.1);
            const method = paymentMethod === 'crypto' ? 'USDT_TRC20'
                : paymentMethod === 'stripe' ? 'RAZORPAY' : 'BANK_TRANSFER';
            await api.post('/payments', {
                booking_id: booking.id,
                amount,
                method,
                transaction_ref: transactionRef || undefined
            });
            setShowConfetti(true);
            setTimeout(() => { onSuccess(); }, 2000);
        } catch (e: any) {
            setSubmitError(e?.message || 'Submission failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePlotSelect = (p: Plot) => {
        if(p.status === 'AVAILABLE') {
            setPlot(p);
            setStep('BUYER');
        }
    };

    // --- SUB-STEPS RENDERING ---

    const renderStepContent = () => {
        switch(step) {
            case 'PLOT':
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-2xl font-serif font-bold text-deepblue-900">Select Your Plot</h3>
                            <p className="text-gray-500">Choose from available inventory in Phase 1.</p>
                        </div>
                        {inventoryLoading && (
                            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gold-500" size={32} /></div>
                        )}
                        {!inventoryLoading && inventory.length === 0 && (
                            <p className="text-center text-gray-500 py-12">No plots available right now. Please check back soon.</p>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {inventory.map(p => (
                                <button 
                                    key={p.id}
                                    onClick={() => handlePlotSelect(p)}
                                    disabled={p.status !== 'AVAILABLE'}
                                    className={`p-4 rounded-xl border text-left transition relative ${
                                        p.status === 'AVAILABLE' 
                                        ? 'bg-white border-gray-200 hover:border-gold-500 hover:shadow-md' 
                                        : 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed'
                                    }`}
                                >
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-deepblue-900">{p.plot_number}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.status}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">{p.type}</p>
                                    <p className="text-sm font-bold text-gold-600 mt-2">{formatAED(p.price_inr)}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 'BUYER':
                return (
                    <div className="space-y-6 max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold text-deepblue-900 border-b pb-4">1. Buyer Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" value={profile?.full_name} disabled className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input type="text" value={profile?.email} disabled className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                <input type="text" value={profile?.mobile} disabled className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address *</label>
                                <textarea className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:outline-none" rows={3} placeholder="Enter your full residential address..."></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button onClick={() => setStep('KYC')}>Next: KYC Documents <ChevronRight size={16} /></Button>
                        </div>
                    </div>
                );

            case 'KYC':
                return (
                    <div className="space-y-6 max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold text-deepblue-900 border-b pb-4">2. Identity Verification</h3>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number *</label>
                                <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="Enter Passport Number" />
                            </div>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer">
                                <Upload className="mx-auto text-gray-400 mb-3" size={32} />
                                <p className="font-bold text-gray-700">Upload Passport Copy</p>
                                <p className="text-xs text-gray-400 mt-1">PDF, JPG or PNG (Max 5MB)</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">National ID Number *</label>
                                <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="Emirates ID / Aadhar / SSN" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 cursor-pointer">
                                    <p className="text-sm font-bold text-gray-600">ID Front</p>
                                </div>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 cursor-pointer">
                                    <p className="text-sm font-bold text-gray-600">ID Back</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between pt-4">
                             <button onClick={() => setStep('BUYER')} className="text-gray-500 hover:text-deepblue-900 font-medium">Back</button>
                             <Button onClick={() => setStep('INTENT')}>Next: Intent <ChevronRight size={16} /></Button>
                        </div>
                    </div>
                );

            case 'INTENT':
                return (
                     <div className="space-y-6 max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold text-deepblue-900 border-b pb-4">3. Investment Intent</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button 
                                onClick={() => setIntent('personal')}
                                className={`p-6 rounded-xl border-2 text-left transition ${intent === 'personal' ? 'border-gold-500 bg-gold-50' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <Home size={24} className={intent === 'personal' ? 'text-gold-600' : 'text-gray-400'} />
                                <h4 className="font-bold text-lg mt-3 text-gray-900">Personal Use</h4>
                                <p className="text-sm text-gray-500 mt-1">I plan to build a villa for myself or my family.</p>
                            </button>
                             <button 
                                onClick={() => setIntent('investment')}
                                className={`p-6 rounded-xl border-2 text-left transition ${intent === 'investment' ? 'border-gold-500 bg-gold-50' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <DollarSign size={24} className={intent === 'investment' ? 'text-gold-600' : 'text-gray-400'} />
                                <h4 className="font-bold text-lg mt-3 text-gray-900">Investment</h4>
                                <p className="text-sm text-gray-500 mt-1">I am purchasing for capital appreciation or rental yield.</p>
                            </button>
                        </div>
                        <div className="flex justify-between pt-4">
                             <button onClick={() => setStep('KYC')} className="text-gray-500 hover:text-deepblue-900 font-medium">Back</button>
                             <Button onClick={() => setStep('PLAN')} disabled={!intent}>Next: Payment Plan <ChevronRight size={16} /></Button>
                        </div>
                     </div>
                );

            case 'PLAN':
                return (
                    <div className="space-y-6 max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold text-deepblue-900 border-b pb-4">4. Payment Plan</h3>
                        
                        {/* Financing Option */}
                        <div 
                            onClick={() => setPaymentPlan('financing')}
                            className={`relative p-6 rounded-xl border-2 cursor-pointer transition ${paymentPlan === 'financing' ? 'border-gold-500 bg-white ring-1 ring-gold-500' : 'border-gray-200 bg-gray-50'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-lg text-deepblue-900">Company Financing (0% Interest)</h4>
                                    <p className="text-sm text-gray-500">10% Booking + 60 Monthly Installments</p>
                                </div>
                                <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Recommended</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Booking Amount (10%)</span>
                                    <span className="font-bold">{formatAED(plot!.price_inr * 0.1)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Monthly EMI (x60)</span>
                                    <span className="font-bold">{formatAED(plot!.price_inr * 0.9 / 60)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-deepblue-900">
                                    <span>Total Payable</span>
                                    <span>{formatAED(plot!.price_inr)}</span>
                                </div>
                            </div>
                        </div>

                         {/* Full Payment Option */}
                         <div 
                            onClick={() => setPaymentPlan('full')}
                            className={`relative p-6 rounded-xl border-2 cursor-pointer transition ${paymentPlan === 'full' ? 'border-gold-500 bg-white ring-1 ring-gold-500' : 'border-gray-200 bg-gray-50'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-lg text-deepblue-900">Full Payment Upfront</h4>
                                    <p className="text-sm text-gray-500">100% Payment instantly</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                             <button onClick={() => setStep('INTENT')} className="text-gray-500 hover:text-deepblue-900 font-medium">Back</button>
                             <Button onClick={() => setStep('PROOF')}>Next: Make Payment <ChevronRight size={16} /></Button>
                        </div>
                    </div>
                );

            case 'PROOF':
                return (
                    <div className="space-y-6 max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold text-deepblue-900 border-b pb-4">5. Payment & Proof</h3>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                            <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                            <div className="text-sm text-blue-800">
                                <p className="font-bold">Booking Amount Due: {formatAED(plot!.price_inr * 0.1)}</p>
                                <p>Please select a method to pay the booking amount.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button onClick={() => setPaymentMethod('stripe')} className={`p-4 border rounded-xl text-center hover:border-gold-500 ${paymentMethod === 'stripe' ? 'bg-gold-50 border-gold-500' : ''}`}>
                                <CreditCard className="mx-auto mb-2 text-deepblue-900" />
                                <span className="text-sm font-bold">Card / Stripe</span>
                            </button>
                            <button onClick={() => setPaymentMethod('manual')} className={`p-4 border rounded-xl text-center hover:border-gold-500 ${paymentMethod === 'manual' ? 'bg-gold-50 border-gold-500' : ''}`}>
                                <Landmark className="mx-auto mb-2 text-deepblue-900" />
                                <span className="text-sm font-bold">Bank Transfer</span>
                            </button>
                            <button onClick={() => setPaymentMethod('crypto')} className={`p-4 border rounded-xl text-center hover:border-gold-500 ${paymentMethod === 'crypto' ? 'bg-gold-50 border-gold-500' : ''}`}>
                                <div className="mx-auto mb-2 text-deepblue-900 font-bold border-2 border-current w-6 h-6 rounded-full flex items-center justify-center text-xs">₿</div>
                                <span className="text-sm font-bold">Crypto</span>
                            </button>
                        </div>

                        {paymentMethod === 'manual' && (
                             <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-fade-in-up">
                                 <h4 className="font-bold text-gray-900 mb-4">Bank Transfer Details</h4>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                     <div className="p-4 bg-white rounded border border-gray-100">
                                         <p className="font-bold text-gray-500 text-xs uppercase mb-2">UAE Account 🇦🇪</p>
                                         <p><span className="text-gray-400">Bank:</span> Emirates NBD</p>
                                         <p><span className="text-gray-400">IBAN:</span> AE07 0330 1234 5678 9012</p>
                                         <p><span className="text-gray-400">Swift:</span> EBILAEAD</p>
                                     </div>
                                     <div className="p-4 bg-white rounded border border-gray-100">
                                         <p className="font-bold text-gray-500 text-xs uppercase mb-2">India Account 🇮🇳</p>
                                         <p><span className="text-gray-400">Bank:</span> State Bank of India</p>
                                         <p><span className="text-gray-400">Acc:</span> 123456789012</p>
                                         <p><span className="text-gray-400">IFSC:</span> SBIN0001234</p>
                                     </div>
                                 </div>
                                 <div className="mt-6">
                                     <label className="block text-sm font-medium text-gray-700 mb-1">Bank Transfer Reference Number *</label>
                                     <input type="text" value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:outline-none bg-white" placeholder="e.g. UTR / SWIFT reference..." />
                                 </div>
                             </div>
                        )}

                        {paymentMethod === 'crypto' && (
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-fade-in-up">
                                <h4 className="font-bold text-gray-900 mb-2">Pay with USDT (TRC20)</h4>
                                <div className="bg-white p-4 rounded border border-gray-200 flex flex-col items-center text-center">
                                    <div className="w-32 h-32 bg-gray-200 mb-4 rounded flex items-center justify-center text-xs">[QR Code]</div>
                                    <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">TYuX8vK3zN9L4mP2qR7sT1vW3xY4zA5bC6</p>
                                    <p className="text-xs text-red-500 mt-2 font-bold">
                                        Send exactly {formatUSDT(plot!.price_inr * 0.1 * 1.05)} (+5% fee included)
                                    </p>
                                </div>
                                 <div className="mt-4">
                                     <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Hash (TXID)</label>
                                     <input type="text" value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="Enter blockchain transaction hash..." />
                                 </div>
                            </div>
                        )}

                        <div className="flex justify-between pt-4">
                             <button onClick={() => setStep('PLAN')} className="text-gray-500 hover:text-deepblue-900 font-medium">Back</button>
                             <Button onClick={() => setStep('SIGNATURE')} disabled={!paymentMethod}>Next: Sign Agreement <ChevronRight size={16} /></Button>
                        </div>
                    </div>
                );

            case 'SIGNATURE':
                return (
                    <div className="space-y-6 max-w-2xl mx-auto">
                         <h3 className="text-xl font-bold text-deepblue-900 border-b pb-4">6. Final Declaration</h3>
                         <div className="h-32 overflow-y-auto bg-gray-50 p-4 rounded text-xs text-gray-600 border border-gray-200">
                             <p className="mb-2 font-bold">TERMS AND CONDITIONS</p>
                             <p>1. I hereby solemnly declare that the information provided is true...</p>
                             <p>2. I understand that the booking amount is non-refundable...</p>
                             <p>3. I agree to the payment plan schedule...</p>
                             {/* ... more terms ... */}
                         </div>
                         
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Digital Signature *</label>
                             <SignaturePad onSave={setSignature} />
                         </div>

                         {submitError && (
                             <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                                 <AlertCircle size={16} className="shrink-0" /> {submitError}
                             </div>
                         )}

                         <div className="flex justify-between pt-4">
                             <button onClick={() => setStep('PROOF')} className="text-gray-500 hover:text-deepblue-900 font-medium">Back</button>
                             <Button onClick={handleSubmitApplication} disabled={!signature || submitting}>
                                 {submitting ? <Loader2 className="animate-spin" size={16} /> : <>Submit Application <CheckCircle size={16} /></>}
                             </Button>
                        </div>
                    </div>
                );
        }
    };

    if (showConfetti) {
        return (
            <div className="h-full flex flex-col items-center justify-center animate-fade-in-up">
                 <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                     <Check size={48} />
                 </div>
                 <h2 className="text-3xl font-serif font-bold text-deepblue-900 mb-2">Application Submitted!</h2>
                 <p className="text-gray-500">Redirecting to dashboard...</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl min-h-[600px] flex flex-col">
            {/* Wizard Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                <div>
                    <h2 className="text-lg font-bold text-deepblue-900">Purchase Application</h2>
                    {plot && <p className="text-xs text-gold-600 font-bold">Plot {plot.plot_number}</p>}
                </div>
                <button onClick={onCancel} className="text-gray-400 hover:text-red-500"><X size={20} /></button>
            </div>
            
            {/* Progress Bar */}
            <div className="h-1 bg-gray-100 w-full">
                <div 
                    className="h-full bg-gold-500 transition-all duration-500" 
                    style={{ width: `${['PLOT','BUYER','KYC','INTENT','PLAN','PROOF','SIGNATURE'].indexOf(step) * 16}%` }}
                ></div>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                {renderStepContent()}
            </div>
        </div>
    );
};

// --- SIGNATURE PAD COMPONENT ---
const SignaturePad = ({ onSave }: { onSave: (data: string) => void }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const startDrawing = (e: any) => {
        const canvas = canvasRef.current;
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        if(!ctx) return;
        
        ctx.beginPath();
        ctx.moveTo(
            e.nativeEvent.offsetX || e.touches[0].clientX - canvas.getBoundingClientRect().left,
            e.nativeEvent.offsetY || e.touches[0].clientY - canvas.getBoundingClientRect().top
        );
        setIsDrawing(true);
    };

    const draw = (e: any) => {
        if(!isDrawing) return;
        const canvas = canvasRef.current;
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        ctx.lineTo(
             e.nativeEvent.offsetX || e.touches[0].clientX - canvas.getBoundingClientRect().left,
             e.nativeEvent.offsetY || e.touches[0].clientY - canvas.getBoundingClientRect().top
        );
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        if(canvasRef.current) {
            onSave(canvasRef.current.toDataURL());
        }
    };

    const clear = () => {
        const canvas = canvasRef.current;
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        onSave(''); // Clear saved
    };

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50 relative">
             <canvas 
                ref={canvasRef}
                width={500}
                height={150}
                className="w-full h-40 cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
             />
             <button onClick={clear} className="absolute top-2 right-2 text-xs bg-white border border-gray-200 px-2 py-1 rounded text-red-500 hover:bg-red-50">Clear</button>
             <div className="absolute bottom-2 left-2 text-[10px] text-gray-400 pointer-events-none">Sign above</div>
        </div>
    );
};
