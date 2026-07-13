
import React, { useState } from 'react';
import { CheckCircle, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../Button';
import { api } from '../../lib/api';

interface RecruitProps {
    onCancel: () => void;
    onSuccess: () => void;
}

export const RecruitAgent = ({ onCancel, onSuccess }: RecruitProps) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [created, setCreated] = useState<any>(null);

    const handleSubmit = async () => {
        setError('');
        if (!fullName || !email || !password) { setError('Full name, email and password are required.'); return; }
        if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
        if (!agreed) { setError('Please confirm the agreement checkboxes.'); return; }
        setSubmitting(true);
        try {
            const { profile } = await api.post<{ profile: any }>('/auth/register-agent', {
                full_name: fullName, email, mobile, password
            });
            setCreated(profile);
        } catch (e: any) {
            setError(e?.message || 'Registration failed.');
        } finally {
            setSubmitting(false);
        }
    };

    if (created) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-center animate-fade-in-up bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-deepblue-900 mb-2">Agent Submitted!</h2>
                <p className="text-gray-500 mb-8 max-w-md">The application for <span className="font-bold text-gray-900">{created.full_name}</span> has been sent for admin approval. They can log in once verified.</p>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-left max-w-lg w-full mb-8">
                    <h4 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Application Details</h4>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Agent Code</span>
                            <span className="font-mono font-bold text-deepblue-900 bg-gray-100 px-2 rounded">{created.agent_code}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Email</span>
                            <span className="font-bold text-gray-900">{created.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Placement</span>
                            <span className="font-bold text-gray-900">Direct (Level 1)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Status</span>
                            <span className="text-yellow-600 font-bold flex items-center gap-1"><div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div> Pending Approval</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button variant="outline" onClick={onSuccess}>Back to Network</Button>
                    <Button onClick={() => { setCreated(null); setFullName(''); setEmail(''); setMobile(''); setPassword(''); setAgreed(false); }}>Recruit Another</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="mb-6">
                <h2 className="text-3xl font-serif font-bold text-deepblue-900">Recruit New Agent</h2>
                <p className="text-gray-500">Expand your network and earn overrides. New agents are placed directly under you (Level 1).</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Section 1: Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="e.g. John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="john@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
                            <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="+971 50 000 0000" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Temporary Password *</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="Min. 8 characters" />
                            <p className="text-[10px] text-gray-400 mt-1">Share this with the agent; they can change it after first login.</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Section 2: Agreement</h3>
                    <div className="space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 w-4 h-4 text-gold-600 border-gray-300 rounded focus:ring-gold-500" />
                            <span className="text-sm text-gray-600">I confirm the information is accurate, I have the person's consent to register them, and they agree to the terms & conditions (payouts in USDT, KYC required before payout).</span>
                        </label>
                    </div>
                </div>

                {error && (
                    <div className="mx-8 mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                        <AlertCircle size={16} className="shrink-0" /> {error}
                    </div>
                )}

                <div className="p-8 bg-gray-50 flex justify-between items-center">
                    <button onClick={onCancel} className="text-gray-500 font-bold hover:text-gray-800 transition">Cancel</button>
                    <Button onClick={handleSubmit} disabled={submitting} className="!px-8 !py-3 shadow-lg shadow-gold-500/20">
                        {submitting ? <Loader2 className="animate-spin" size={16} /> : <>Submit for Approval <ArrowRight size={16} className="ml-2" /></>}
                    </Button>
                </div>
            </div>
        </div>
    );
};
