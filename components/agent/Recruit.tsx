
import React, { useState } from 'react';
import { ChevronDown, CheckCircle, Upload, ArrowRight, User } from 'lucide-react';
import { Button } from '../Button';

interface RecruitProps {
    onCancel: () => void;
    onSuccess: () => void;
}

export const RecruitAgent = ({ onCancel, onSuccess }: RecruitProps) => {
    const [placement, setPlacement] = useState<'DIRECT' | 'DOWNLINE'>('DIRECT');
    const [submitted, setSubmitted] = useState(false);

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-center animate-fade-in-up bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-deepblue-900 mb-2">Agent Submitted!</h2>
                <p className="text-gray-500 mb-8 max-w-md">The application for <span className="font-bold text-gray-900">John Michael Doe</span> has been sent for admin approval. You will be notified once verified.</p>
                
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-left max-w-lg w-full mb-8">
                    <h4 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Application Details</h4>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Agent Code</span>
                            <span className="font-mono font-bold text-deepblue-900 bg-gray-100 px-2 rounded">AGT-10789</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Placement</span>
                            <span className="font-bold text-gray-900">{placement === 'DIRECT' ? 'Direct (Level 1)' : 'Downline (Level 2)'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Sponsor</span>
                            <span className="font-bold text-gray-900">You (AGT-10523)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Status</span>
                            <span className="text-yellow-600 font-bold flex items-center gap-1"><div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div> Pending Approval</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button variant="outline" onClick={onCancel}>Back to Network</Button>
                    <Button onClick={() => setSubmitted(false)}>Recruit Another</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="mb-6">
                <h2 className="text-3xl font-serif font-bold text-deepblue-900">Recruit New Agent</h2>
                <p className="text-gray-500">Expand your network and earn overrides.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Section 1: Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                            <input type="text" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="e.g. John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                            <div className="flex gap-2">
                                <input type="email" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="john@example.com" />
                                <button className="px-4 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 whitespace-nowrap">Send OTP</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number *</label>
                            <div className="flex gap-2">
                                <input type="tel" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="+971 50 000 0000" />
                                <button className="px-4 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 whitespace-nowrap">Send OTP</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-b border-gray-100 bg-gray-50/30">
                    <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Section 2: KYC Documents</h3>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">National ID / Passport Number *</label>
                            <input type="text" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="ID Number" />
                        </div>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-white transition-colors cursor-pointer group">
                            <Upload className="mx-auto text-gray-400 mb-2 group-hover:text-gold-500 transition-colors" />
                            <p className="text-sm font-bold text-gray-600">Upload ID Copy</p>
                            <p className="text-xs text-gray-400 mt-1">PDF, JPG or PNG (Max 5MB)</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Section 3: Crypto Wallet (Payouts)</h3>
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mb-4 text-xs text-yellow-800">
                        ⚠️ Required: Agent needs at least one USDT wallet for commissions.
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">USDT TRC-20 Address *</label>
                        <input type="text" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none font-mono" placeholder="T..." />
                        <p className="text-[10px] text-gray-400 mt-1">Recommended for lowest fees.</p>
                    </div>
                </div>

                <div className="p-8 border-b border-gray-100 bg-blue-50/30">
                    <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Section 4: Genealogy Placement</h3>
                    <div className="space-y-4">
                        <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${placement === 'DIRECT' ? 'border-gold-500 bg-white shadow-md' : 'border-gray-200 bg-white/50'}`} onClick={() => setPlacement('DIRECT')}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${placement === 'DIRECT' ? 'border-gold-500' : 'border-gray-300'}`}>
                                {placement === 'DIRECT' && <div className="w-2.5 h-2.5 bg-gold-500 rounded-full" />}
                            </div>
                            <div>
                                <span className="font-bold text-gray-900 block">Place directly under ME (Level 1)</span>
                                <span className="text-xs text-gray-500">You will be the direct sponsor. Best for maximizing L1 commission (8%).</span>
                            </div>
                        </label>

                        <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${placement === 'DOWNLINE' ? 'border-gold-500 bg-white shadow-md' : 'border-gray-200 bg-white/50'}`} onClick={() => setPlacement('DOWNLINE')}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${placement === 'DOWNLINE' ? 'border-gold-500' : 'border-gray-300'}`}>
                                {placement === 'DOWNLINE' && <div className="w-2.5 h-2.5 bg-gold-500 rounded-full" />}
                            </div>
                            <div className="flex-1">
                                <span className="font-bold text-gray-900 block">Place under downline agent</span>
                                <span className="text-xs text-gray-500">Strategic placement to help team growth. You still earn overrides.</span>
                                
                                {placement === 'DOWNLINE' && (
                                    <div className="mt-3 animate-fade-in-up">
                                        <div className="relative">
                                            <select className="w-full p-2 pl-3 pr-8 border border-gray-300 rounded-lg text-sm appearance-none bg-white">
                                                <option>Select Parent Agent...</option>
                                                <option>Amit Singh (AGT-10524) - L1</option>
                                                <option>Mike Johnson (AGT-10526) - L1</option>
                                            </select>
                                            <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </label>
                    </div>
                </div>

                <div className="p-8 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Section 5: Agreement</h3>
                    <div className="space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" className="mt-1 w-4 h-4 text-gold-600 border-gray-300 rounded focus:ring-gold-500" />
                            <span className="text-sm text-gray-600">I confirm that all information provided is accurate and I have obtained consent to register this person.</span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" className="mt-1 w-4 h-4 text-gold-600 border-gray-300 rounded focus:ring-gold-500" />
                            <span className="text-sm text-gray-600">The agent agrees to the Champion 20 terms & conditions and understands payouts are in USDT.</span>
                        </label>
                    </div>
                </div>

                <div className="p-8 bg-gray-50 flex justify-between items-center">
                    <button onClick={onCancel} className="text-gray-500 font-bold hover:text-gray-800 transition">Cancel</button>
                    <Button onClick={() => setSubmitted(true)} className="!px-8 !py-3 shadow-lg shadow-gold-500/20">Submit for Approval <ArrowRight size={16} className="ml-2" /></Button>
                </div>
            </div>
        </div>
    );
};
