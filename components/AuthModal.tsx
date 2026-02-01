import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { X, Phone, Mail, User, Shield, ChevronRight, CheckCircle, Loader2, Lock, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type AuthMode = 'LOGIN' | 'SIGNUP';
type SignupStep = 'PHONE_INPUT' | 'PHONE_VERIFY' | 'WELCOME' | 'EMAIL_INPUT' | 'EMAIL_VERIFY' | 'BROKER_CODE';

const COUNTRY_CODES = [
  { code: '+971', label: 'UAE 🇦🇪' },
  { code: '+91', label: 'IND 🇮🇳' },
  { code: '+1', label: 'USA 🇺🇸' },
  { code: '+44', label: 'UK 🇬🇧' },
  { code: '+966', label: 'KSA 🇸🇦' },
  { code: '+974', label: 'QAT 🇶🇦' },
  { code: '+973', label: 'BHR 🇧🇭' },
  { code: '+968', label: 'OMN 🇴🇲' },
  { code: '+965', label: 'KWT 🇰🇼' },
  { code: '+86', label: 'CHN 🇨🇳' },
  { code: '+7', label: 'RUS 🇷🇺' },
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('SIGNUP');
  const [step, setStep] = useState<SignupStep>('PHONE_INPUT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Data
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+971');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [agentCode, setAgentCode] = useState('');

  if (!isOpen) return null;

  const resetState = () => {
    setMode('SIGNUP');
    setStep('PHONE_INPUT');
    setError(null);
    setLoading(false);
    setOtp('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // --- LOGIN FLOW ---
  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false, // Only allow existing users
        }
      });
      if (error) throw error;
      setStep('EMAIL_VERIFY'); // Reuse email verify step for login
    } catch (err: any) {
      setError(err.message || "Failed to send Login OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginVerify = async () => {
    setError(null);
    if (otp.length !== 6) {
        setError("Please enter the 6-digit code.");
        return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });
      if (error) throw error;
      if (data.session) onSuccess();
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };


  // --- SIGNUP FLOW ---

  // Step 1: Send Phone OTP (MOCKED for now)
  const handleSignupPhone = async () => {
    if (!fullName.trim() || !mobile.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setError(null);
    setLoading(true);

    // MOCK: Simulate API call delay
    setTimeout(() => {
        setStep('PHONE_VERIFY');
        setOtp('');
        setLoading(false);
    }, 1000);
  };

  // Step 2: Verify Phone OTP (MOCKED for now)
  const handleVerifyPhone = async () => {
    setError(null);
    if (otp.length !== 6) {
        setError("Please enter the 6-digit code.");
        return;
    }
    setLoading(true);

    // MOCK: Accept any code, simulate verification
    setTimeout(() => {
        setStep('WELCOME');
        setLoading(false);
         // Wait 2 seconds on welcome screen then move to Email
          setTimeout(() => {
             setStep('EMAIL_INPUT');
          }, 2000);
    }, 1000);
  };

  // Step 3: Send Email OTP (Real Auth Start)
  const handleSendEmailOtp = async () => {
    if (!email.trim()) {
        setError("Please enter your email.");
        return;
    }
    setError(null);
    setLoading(true);
    
    try {
        // Since phone was mocked, we don't have a session yet.
        // We start the actual session creation here with Email.
        const { error } = await supabase.auth.signInWithOtp({ 
            email: email 
        });
        
        if (error) throw error;
        
        setStep('EMAIL_VERIFY');
        setOtp('');
    } catch (err: any) {
        setError(err.message || "Failed to send email code.");
    } finally {
        setLoading(false);
    }
  };

  // Step 4: Verify Email OTP
  const handleVerifyEmail = async () => {
      setError(null);
      if (otp.length !== 6) {
        setError("Please enter the 6-digit code.");
        return;
      }
      setLoading(true);
      try {
          const { error } = await supabase.auth.verifyOtp({
              email: email,
              token: otp,
              type: 'email' // Changed from 'email_change' to 'email' (login/signup)
          });
          if (error) throw error;
          setStep('BROKER_CODE');
      } catch (err: any) {
          setError(err.message || "Invalid Email OTP.");
      } finally {
          setLoading(false);
      }
  };

  // Step 5: Finalize & Broker Code
  const handleFinalize = async () => {
    if(!agentCode.trim()) {
        setError("Broker/Agent Code is required.");
        return;
    }
    setLoading(true);
    
    try {
        // Here we would insert into a 'profiles' table
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
            const { error } = await supabase.from('profiles').upsert({
                id: user.id,
                full_name: fullName,
                mobile: `${countryCode}${mobile}`,
                email: email,
                role: 'client',
                agent_code: agentCode
            });
            
            if (error) console.error("Profile update error", error);
        }

        onSuccess();
    } catch (err) {
        console.error(err);
        onSuccess();
    } finally {
        setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-deepblue-900/80 backdrop-blur-sm transition-opacity" onClick={handleClose} />
      
      <div className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
        {/* Header Image/Gradient */}
        <div className="h-32 bg-deepblue-900 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://i.ibb.co/N61WBzn8/Generated-Image-February-01-2026-1-19-AM.jpg')] bg-cover bg-center opacity-40"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-deepblue-900 to-transparent"></div>
             <button onClick={handleClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition z-20">
                <X size={24} />
             </button>
             <div className="absolute bottom-6 left-8 z-10">
                <h2 className="text-3xl font-serif font-bold text-white">
                    {mode === 'LOGIN' ? 'Welcome Back' : 'Join the Elite'}
                </h2>
                <p className="text-gold-400 text-xs tracking-widest uppercase mt-1">
                    {mode === 'LOGIN' ? 'Client Access' : 'Exclusive Ownership'}
                </p>
             </div>
        </div>

        <div className="p-8">
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                    <Shield size={16} /> {error}
                </div>
            )}

            {/* --- LOGIN VIEW --- */}
            {mode === 'LOGIN' && (
                <div className="space-y-6">
                    {step === 'PHONE_INPUT' ? ( // Actually reusing step state, logically EMAIL_INPUT for login
                        <>
                            <div>
                                <label className="block text-sm font-bold text-deepblue-900 mb-2">Registered Email</label>
                                <div className="relative">
                                    <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
                                    <input 
                                        type="email" 
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none transition"
                                        placeholder="client@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button fullWidth onClick={handleLogin} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : 'Send Login Code'}
                            </Button>
                        </>
                    ) : (
                        <>
                           <div className="text-center mb-4">
                                <p className="text-gray-600 text-sm">Enter the code sent to <span className="font-bold">{email}</span></p>
                            </div>
                            <div className="flex justify-center mb-6">
                                <input 
                                    type="text" 
                                    className="w-32 text-center text-3xl tracking-widest border-b-2 border-gold-500 py-2 focus:outline-none font-mono text-deepblue-900"
                                    placeholder="000000"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            <Button fullWidth onClick={handleLoginVerify} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : 'Verify & Login'}
                            </Button>
                        </>
                    )}
                    
                    <div className="text-center pt-4 border-t border-gray-100">
                        <button onClick={() => { resetState(); setMode('SIGNUP'); }} className="text-sm text-gray-500 hover:text-deepblue-900 transition">
                            Don't have an account? <span className="font-bold text-gold-500">Register Interest</span>
                        </button>
                    </div>
                </div>
            )}


            {/* --- SIGNUP VIEW --- */}
            {mode === 'SIGNUP' && (
                <div className="space-y-6">
                    
                    {/* STEP 1: Name & Phone */}
                    {step === 'PHONE_INPUT' && (
                        <div className="space-y-4 animate-fade-in-up">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Full Name (As per Passport)</label>
                                <div className="relative">
                                    <User className="absolute top-3 left-3 text-gray-400" size={18} />
                                    <input 
                                        type="text" 
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none transition"
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Mobile Number</label>
                                <div className="flex gap-2">
                                    <select 
                                        className="bg-gray-50 border border-gray-200 rounded-lg px-2 text-sm focus:ring-2 focus:ring-gold-500 outline-none"
                                        value={countryCode}
                                        onChange={(e) => setCountryCode(e.target.value)}
                                    >
                                        {COUNTRY_CODES.map(c => (
                                            <option key={c.code} value={c.code}>{c.label} {c.code}</option>
                                        ))}
                                    </select>
                                    <input 
                                        type="tel" 
                                        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none transition"
                                        placeholder="50 000 0000"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button fullWidth onClick={handleSignupPhone} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2">Verify Mobile <ChevronRight size={16}/></span>}
                            </Button>
                        </div>
                    )}

                    {/* STEP 2: Verify Phone */}
                    {step === 'PHONE_VERIFY' && (
                        <div className="space-y-6 animate-fade-in-up text-center">
                            <p className="text-sm text-gray-600">
                                Enter the OTP sent to <br/><span className="font-bold text-deepblue-900">{countryCode} {mobile}</span>
                            </p>
                            <div className="flex justify-center">
                                <input 
                                    type="text" 
                                    className="w-40 text-center text-4xl tracking-[0.5em] border-b-2 border-gold-500 py-2 focus:outline-none font-mono text-deepblue-900 bg-transparent"
                                    placeholder="••••••"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            <Button fullWidth onClick={handleVerifyPhone} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : 'Confirm Number'}
                            </Button>
                            <button onClick={() => setStep('PHONE_INPUT')} className="text-xs text-gray-400 hover:text-gray-600">Change Number</button>
                        </div>
                    )}

                    {/* STEP 3: Welcome Screen */}
                    {step === 'WELCOME' && (
                        <div className="text-center py-8 animate-fade-in-up">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-deepblue-900 mb-2">
                                Welcome, {fullName.split(' ')[0]}
                            </h3>
                            <p className="text-gray-500">Let's secure your profile.</p>
                            <Loader2 className="animate-spin mx-auto mt-6 text-gold-500" />
                        </div>
                    )}

                    {/* STEP 4: Email Input */}
                    {step === 'EMAIL_INPUT' && (
                        <div className="space-y-4 animate-fade-in-up">
                            <div className="text-center mb-2">
                                <h3 className="font-serif font-bold text-xl text-deepblue-900">Email Verification</h3>
                                <p className="text-xs text-gray-500">Required for official documentation</p>
                            </div>
                             <div className="relative">
                                <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
                                <input 
                                    type="email" 
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none transition"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <Button fullWidth onClick={handleSendEmailOtp} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : 'Send Verification Code'}
                            </Button>
                        </div>
                    )}

                    {/* STEP 5: Verify Email */}
                    {step === 'EMAIL_VERIFY' && (
                        <div className="space-y-6 animate-fade-in-up text-center">
                            <p className="text-sm text-gray-600">
                                Enter the code sent to <br/><span className="font-bold text-deepblue-900">{email}</span>
                            </p>
                            <div className="flex justify-center">
                                <input 
                                    type="text" 
                                    className="w-40 text-center text-4xl tracking-[0.5em] border-b-2 border-gold-500 py-2 focus:outline-none font-mono text-deepblue-900 bg-transparent"
                                    placeholder="••••••"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            <Button fullWidth onClick={handleVerifyEmail} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : 'Verify Email'}
                            </Button>
                        </div>
                    )}

                    {/* STEP 6: Broker Code */}
                    {step === 'BROKER_CODE' && (
                        <div className="space-y-6 animate-fade-in-up">
                             <div className="text-center mb-2">
                                <h3 className="font-serif font-bold text-xl text-deepblue-900">Agent Attribution</h3>
                                <p className="text-xs text-gray-500">Please enter your agent's code to proceed.</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Broker / Agent Code</label>
                                <div className="relative">
                                    <Lock className="absolute top-3 left-3 text-gold-500" size={18} />
                                    <input 
                                        type="text" 
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none transition uppercase tracking-widest font-bold"
                                        placeholder="AGT-000"
                                        value={agentCode}
                                        onChange={(e) => setAgentCode(e.target.value.toUpperCase())}
                                    />
                                </div>
                            </div>
                            <Button fullWidth onClick={handleFinalize} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2">Access Dashboard <ArrowRight size={16}/></span>}
                            </Button>
                        </div>
                    )}

                    {mode === 'SIGNUP' && (
                        <div className="text-center pt-4 border-t border-gray-100">
                            <button onClick={() => { resetState(); setMode('LOGIN'); }} className="text-sm text-gray-500 hover:text-deepblue-900 transition">
                                Already have an account? <span className="font-bold text-gold-500">Login Here</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};