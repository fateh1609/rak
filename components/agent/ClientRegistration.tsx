
import React, { useState } from 'react';
import { Copy, MessageCircle, Mail, QrCode, Smartphone, ArrowRight, User, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../Button';

interface ClientRegistrationProps {
    onBack: () => void;
}

export const ClientRegistration = ({ onBack }: ClientRegistrationProps) => {
    const [method, setMethod] = useState<'SELECTION' | 'MANUAL'>('SELECTION');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('https://rakoasis.com/signup?agent=AGT10523');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (method === 'SELECTION') {
        return (
            <div className="space-y-6 animate-fade-in-up">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition"><ArrowLeft size={20} /></button>
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-deepblue-900">Register New Client</h2>
                        <p className="text-sm text-gray-500">Choose how you want to onboard your client.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Option 1: Share Link */}
                    <div className="bg-white p-8 rounded-2xl border-2 border-gold-500 shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 bg-gold-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center text-gold-600">
                                <Copy size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-deepblue-900">Option 1: Share Signup Link</h3>
                                <p className="text-sm text-gray-500">Client fills their own details. Your code is auto-applied.</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Your Unique Referral Link</label>
                            <div className="flex gap-2">
                                <code className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono text-gray-600 truncate">
                                    https://rakoasis.com/signup?agent=AGT10523
                                </code>
                                <button onClick={handleCopy} className="bg-deepblue-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-deepblue-800 transition flex items-center gap-2">
                                    {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition text-gray-600 hover:text-green-700">
                                <MessageCircle size={20} /> <span className="text-xs font-bold">WhatsApp</span>
                            </button>
                            <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition text-gray-600 hover:text-blue-700">
                                <Mail size={20} /> <span className="text-xs font-bold">Email</span>
                            </button>
                            <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition text-gray-600 hover:text-purple-700">
                                <Smartphone size={20} /> <span className="text-xs font-bold">SMS</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="bg-white p-2 rounded shadow-sm">
                                <QrCode size={48} className="text-deepblue-900" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-deepblue-900">In-Person?</p>
                                <p className="text-xs text-blue-700">Let client scan this QR code to open the signup form instantly.</p>
                            </div>
                            <button className="text-blue-600 font-bold text-xs hover:underline">Download</button>
                        </div>
                    </div>

                    {/* Option 2: Manual */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-deepblue-900">Option 2: Manual Registration</h3>
                                    <p className="text-sm text-gray-500">Fill out the form on behalf of your client.</p>
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                Use this if you have the client's documents and details ready. 
                                You will need to verify their mobile number via OTP during the process.
                            </p>
                        </div>
                        
                        <Button variant="outline" onClick={() => setMethod('MANUAL')} className="w-full justify-center py-4">
                            Proceed to Form <ArrowRight size={16} className="ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Manual Form
    return (
        <div className="space-y-6 animate-fade-in-up max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setMethod('SELECTION')} className="p-2 hover:bg-gray-100 rounded-full transition"><ArrowLeft size={20} /></button>
                <h2 className="text-2xl font-serif font-bold text-deepblue-900">Manual Client Registration</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl mb-8 text-sm text-yellow-800 flex items-start gap-3">
                    <div className="mt-0.5"><User size={16} /></div>
                    <div>
                        <span className="font-bold block">Agent Code Locked: AGT-10523</span>
                        You are registering this client under your name. This cannot be changed later.
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="label">First Name *</label>
                            <input type="text" className="input-field" placeholder="e.g. Rahul" />
                        </div>
                        <div>
                            <label className="label">Last Name *</label>
                            <input type="text" className="input-field" placeholder="e.g. Verma" />
                        </div>
                    </div>

                    <div>
                        <label className="label">Email Address *</label>
                        <input type="email" className="input-field" placeholder="client@example.com" />
                    </div>

                    <div>
                        <label className="label">Mobile Number *</label>
                        <div className="flex gap-2">
                            <input type="tel" className="input-field" placeholder="+971 50 000 0000" />
                            <Button variant="outline" className="!py-3">Send OTP</Button>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <Button fullWidth className="!py-4 text-lg shadow-xl shadow-gold-500/20">Create Client Account</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
