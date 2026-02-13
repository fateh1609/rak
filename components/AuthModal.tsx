
import React, { useState, useEffect } from 'react';
import { X, Mail, User, Phone, ArrowRight, AlertCircle, ChevronDown, Lock, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: 'client' | 'agent' | 'admin', customData?: any) => void;
}

const COUNTRY_CODES = [
  { code: '+971', label: 'UAE' },
  { code: '+91', label: 'IND' },
  { code: '+1', label: 'USA' },
  { code: '+44', label: 'UK' },
  { code: '+966', label: 'KSA' },
  { code: '+974', label: 'QAT' },
  { code: '+973', label: 'BHR' },
  { code: '+968', label: 'OMN' },
  { code: '+965', label: 'KWT' },
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [step, setStep] = useState<1 | 2>(1); // 1: Details, 2: OTP
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [countryCode, setCountryCode] = useState('+971');
  const [otp, setOtp] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
      if (isOpen) {
          setMode('LOGIN');
          setStep(1);
          setError('');
          setEmail('');
          setOtp('');
          setFullName('');
          setMobile('');
      }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (mode === 'SIGNUP') {
        // Signup Flow (Mock Failure as per previous logic)
        if (countryCode === '+971' && mobile.length !== 9) {
            setError('UAE mobile number must be 9 digits');
            setIsLoading(false);
            return;
        }
        if (countryCode === '+91' && mobile.length !== 10) {
            setError('Indian mobile number must be 10 digits');
            setIsLoading(false);
            return;
        }
        
        setIsLoading(false);
        setError('Registration is currently invite-only. Please contact support.');
        return;
    }

    if (mode === 'LOGIN') {
        if (step === 1) {
            // Step 1: Validate Email -> Send OTP
            if (!email.includes('@')) {
                setError('Please enter a valid email address');
                setIsLoading(false);
                return;
            }
            setIsLoading(false);
            setStep(2); // Move to OTP step
        } else {
            // Step 2: Validate OTP
            if (otp !== '123456') {
                setError('Invalid OTP. Please try again.');
                setIsLoading(false);
                return;
            }

            // Success: Determine Role
            let detectedRole: 'client' | 'agent' | 'admin' = 'client';
            const lowerEmail = email.toLowerCase().trim();

            if (lowerEmail === 'admin@rakoasis.com') detectedRole = 'admin';
            else if (lowerEmail === 'agent@rakoasis.com') detectedRole = 'agent';
            else if (lowerEmail === 'client@rakoasis.com') detectedRole = 'client';
            else {
                // Fallback heuristic for other emails
                if (lowerEmail.includes('admin')) detectedRole = 'admin';
                else if (lowerEmail.includes('agent')) detectedRole = 'agent';
            }
            
            setIsLoading(false);
            onLogin(detectedRole, { email });
            onClose();
        }
    }
  };

  const switchMode = (newMode: 'LOGIN' | 'SIGNUP') => {
      setMode(newMode);
      setStep(1);
      setError('');
      setEmail('');
      setOtp('');
      setFullName('');
      setMobile('');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-deepblue-900/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-up overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-deepblue-900 text-white relative shrink-0">
            <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition p-1 rounded-full hover:bg-white/10">
              <X size={20} />
            </button>
            
            {step === 1 ? (
                <>
                    <h2 className="text-2xl font-serif font-bold mb-1">
                        {mode === 'LOGIN' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-blue-200 text-sm">
                        {mode === 'LOGIN' ? 'Enter your email to access your dashboard.' : 'Register to access exclusive inventory.'}
                    </p>
                </>
            ) : (
                <>
                    <button 
                        onClick={() => { setStep(1); setError(''); }} 
                        className="absolute top-4 left-4 text-white/50 hover:text-white transition p-1 rounded-full hover:bg-white/10"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-2xl font-serif font-bold mb-1">Verify Identity</h2>
                    <p className="text-blue-200 text-sm">
                        Enter the code sent to {email}
                    </p>
                </>
            )}
        </div>

        {/* Tab Switcher (Only visible in Step 1) */}
        {step === 1 && (
            <div className="flex border-b border-gray-100 shrink-0">
                <button 
                    onClick={() => switchMode('LOGIN')}
                    className={`flex-1 py-4 text-sm font-bold transition-all relative ${mode === 'LOGIN' ? 'text-deepblue-900' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Log In
                    {mode === 'LOGIN' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-500"></div>}
                </button>
                <button 
                    onClick={() => switchMode('SIGNUP')}
                    className={`flex-1 py-4 text-sm font-bold transition-all relative ${mode === 'SIGNUP' ? 'text-deepblue-900' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Sign Up
                    {mode === 'SIGNUP' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-500"></div>}
                </button>
            </div>
        )}

        {/* Form Content */}
        <div className="p-6 md:p-8 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-fade-in-up">
                        <AlertCircle size={16} className="shrink-0" />
                        {error}
                    </div>
                )}

                {/* SIGNUP FIELDS */}
                {mode === 'SIGNUP' && step === 1 && (
                    <>
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-3 mb-2">
                            <User className="text-blue-600" size={20} />
                            <div>
                                <p className="text-sm font-bold text-blue-900">Client Registration</p>
                                <p className="text-xs text-blue-700">Enter details to verify mobile number.</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="e.g. John Doe"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mobile Number</label>
                            <div className="flex gap-3">
                                <div className="relative w-28 shrink-0">
                                    <select
                                        className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all appearance-none font-medium cursor-pointer"
                                        value={countryCode}
                                        onChange={(e) => {
                                            setCountryCode(e.target.value);
                                            setMobile('');
                                        }}
                                    >
                                        {COUNTRY_CODES.map(c => (
                                            <option key={c.code} value={c.code}>{c.code} ({c.label})</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={14} />
                                </div>
                                <div className="relative flex-1">
                                    <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input 
                                        type="tel" 
                                        required 
                                        placeholder={countryCode === '+971' ? "50 000 0000" : "00000 00000"}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                                        value={mobile}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            const limit = countryCode === '+971' ? 9 : (countryCode === '+91' ? 10 : 15);
                                            if (val.length <= limit) setMobile(val);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* LOGIN STEP 1 */}
                {mode === 'LOGIN' && step === 1 && (
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="email" 
                                required 
                                placeholder="name@example.com"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* LOGIN STEP 2 (OTP) */}
                {mode === 'LOGIN' && step === 2 && (
                    <div className="animate-fade-in-up">
                        <div className="mb-4 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-deepblue-900">
                                <Lock size={24} />
                            </div>
                            <p className="text-sm font-bold text-gray-900">Authentication Required</p>
                            <p className="text-xs text-gray-500 mt-1">Please check your email inbox for the code.</p>
                        </div>

                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 text-center">One-Time Password</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                required 
                                maxLength={6}
                                placeholder="123456"
                                className="w-full text-center py-3 border-2 border-gray-200 rounded-xl text-2xl font-bold tracking-[0.5em] text-deepblue-900 focus:outline-none focus:border-gold-500 transition-all placeholder:tracking-normal placeholder:text-base placeholder:font-normal"
                                value={otp}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setOtp(val);
                                }}
                                autoFocus
                            />
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-4">
                            Didn't receive code? <button type="button" className="text-gold-600 font-bold hover:underline">Resend</button>
                        </p>
                    </div>
                )}

                <Button 
                    type="submit" 
                    fullWidth 
                    className="!py-3 shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2 mt-6"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                            {step === 1 ? (mode === 'LOGIN' ? 'Get Login OTP' : 'Request OTP') : 'Verify & Login'} 
                            <ArrowRight size={18} />
                        </>
                    )}
                </Button>
                
                {mode === 'SIGNUP' && step === 1 && (
                    <p className="text-center text-xs text-gray-400 mt-2">
                        You will be asked to enter a 6-digit code in the next step.
                    </p>
                )}
            </form>
        </div>
      </div>
    </div>
  );
};
