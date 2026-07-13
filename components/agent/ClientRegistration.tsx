
import React, { useState } from 'react';
import { Copy, MessageCircle, Mail, QrCode, Smartphone, ArrowRight, User, CheckCircle, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../Button';
import { api } from '../../lib/api';

interface ClientRegistrationProps {
    onBack: () => void;
    agentCode?: string;
}

export const ClientRegistration = ({ onBack, agentCode }: ClientRegistrationProps) => {
    const [method, setMethod] = useState<'SELECTION' | 'MANUAL'>('SELECTION');
    const [copied, setCopied] = useState(false);

    // Manual form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);

    const code = agentCode || 'AGT-10523';
    const referralLink = `${window.location.origin}/#/?agent=${code}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCreate = async () => {
        setError('');
        if (!firstName || !email || !password) { setError('Name, email and password are required.'); return; }
        if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
        setSubmitting(true);
        try {
            await api.post('/auth/register', {
                full_name: `${firstName} ${lastName}`.trim(),
                email,
                mobile,
                password,
                agent_code: code
            });
            setDone(true);
        } catch (e: any) {
            setError(e?.message || 'Registration failed.');
        } finally {
            setSubmitting(false);
        }
    };

    if (done) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center animate-fade-in-up bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-deepblue-900 mb-2">Client Registered!</h2>
                <p className="text-gray-500 mb-8 max-w-md">
                    <span className="font-bold text-gray-900">{firstName} {lastName}</span> is now registered under your code <span className="font-mono font-bold">{code}</span>. Share their login credentials so they can book a plot.
                </p>
                <Button onClick={onBack}>Back to Sales</Button>
            </div>
        );
    }

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
                                <p className="text-sm text-gray-500">Client signs up themselves with your code pre-filled.</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Your Unique Referral Link</label>
                            <div className="flex gap-2">
                                <code className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono text-gray-600 truncate">
                                    {referralLink}
                                </code>
                                <button onClick={handleCopy} className="bg-deepblue-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-deepblue-800 transition flex items-center gap-2">
                                    {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <a href={`https://wa.me/?text=${encodeURIComponent(`Invest in RAK Oasis! Sign up here: ${referralLink}`)}`} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition text-gray-600 hover:text-green-700">
                                <MessageCircle size={20} /> <span className="text-xs font-bold">WhatsApp</span>
                            </a>
                            <a href={`mailto:?subject=${encodeURIComponent('RAK Oasis Investment')}&body=${encodeURIComponent(`Sign up here: ${referralLink}`)}`} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition text-gray-600 hover:text-blue-700">
                                <Mail size={20} /> <span className="text-xs font-bold">Email</span>
                            </a>
                            <a href={`sms:?body=${encodeURIComponent(`Sign up for RAK Oasis: ${referralLink}`)}`} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition text-gray-600 hover:text-purple-700">
                                <Smartphone size={20} /> <span className="text-xs font-bold">SMS</span>
                            </a>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="bg-white p-2 rounded shadow-sm">
                                <QrCode size={48} className="text-deepblue-900" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-deepblue-900">In-Person?</p>
                                <p className="text-xs text-blue-700">Let the client scan your link on your phone to sign up instantly.</p>
                            </div>
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
                                Use this if you have the client's details ready. The account is created instantly
                                under your agent code and the client can log in with the password you set.
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
                        <span className="font-bold block">Agent Code Locked: {code}</span>
                        You are registering this client under your name. This cannot be changed later.
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">First Name *</label>
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="e.g. Rahul" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="e.g. Verma" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="client@example.com" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
                            <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="+971 50 000 0000" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Temporary Password *</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="Min. 8 characters" />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                            <AlertCircle size={16} className="shrink-0" /> {error}
                        </div>
                    )}

                    <div className="pt-6 border-t border-gray-100">
                        <Button fullWidth onClick={handleCreate} disabled={submitting} className="!py-4 text-lg shadow-xl shadow-gold-500/20">
                            {submitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Create Client Account'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
