
import React, { useState } from 'react';
import { 
  User, Wallet, Shield, Settings, FileText, Upload, CheckCircle, AlertCircle, 
  Trash2, Plus, Copy, ExternalLink, Smartphone, Monitor, Clock, Download, 
  Eye, RefreshCw, X, ChevronRight, Globe, Bell, Lock, LogOut, QrCode, AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { Button } from '../Button';
import { UserProfile } from '../../types';

interface ProfileViewProps {
    profile: UserProfile | null;
}

type TabType = 'PERSONAL' | 'WALLETS' | 'SECURITY' | 'PREFS' | 'KYC';

export const ProfileView: React.FC<ProfileViewProps> = ({ profile }) => {
    const [activeTab, setActiveTab] = useState<TabType>('PERSONAL');

    return (
        <div className="space-y-6 animate-fade-in-up pb-20">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-3xl font-bold text-gray-400">
                        {profile?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload size={20} className="text-white" />
                    </div>
                </div>
                <div className="text-center md:text-left flex-1">
                    <h2 className="text-2xl font-serif font-bold text-deepblue-900">{profile?.full_name || 'Rajesh Kumar'}</h2>
                    <p className="text-gray-500 font-mono text-sm bg-gray-100 px-2 py-0.5 rounded inline-block mt-1">{profile?.agent_code || 'AGT-10523'}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-xs font-bold text-gray-500">
                        <span className="flex items-center gap-1"><CheckCircle size={12} className="text-green-500" /> KYC Verified</span>
                        <span className="flex items-center gap-1"><CheckCircle size={12} className="text-green-500" /> Wallet Active</span>
                        <span className="flex items-center gap-1"><Shield size={12} className="text-gray-400" /> 2FA Off</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex bg-white rounded-xl border border-gray-200 p-1 overflow-x-auto no-scrollbar shadow-sm">
                <TabButton id="PERSONAL" label="Personal Info" icon={User} active={activeTab} onClick={setActiveTab} />
                <TabButton id="WALLETS" label="Crypto Wallets" icon={Wallet} active={activeTab} onClick={setActiveTab} />
                <TabButton id="SECURITY" label="Security" icon={Shield} active={activeTab} onClick={setActiveTab} />
                <TabButton id="PREFS" label="Preferences" icon={Settings} active={activeTab} onClick={setActiveTab} />
                <TabButton id="KYC" label="KYC & Docs" icon={FileText} active={activeTab} onClick={setActiveTab} />
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 min-h-[600px]">
                {activeTab === 'PERSONAL' && <PersonalInfoTab profile={profile} />}
                {activeTab === 'WALLETS' && <WalletsTab />}
                {activeTab === 'SECURITY' && <SecurityTab />}
                {activeTab === 'PREFS' && <PreferencesTab />}
                {activeTab === 'KYC' && <DocumentsTab />}
            </div>
        </div>
    );
};

// --- TAB 1: PERSONAL INFORMATION ---

const PersonalInfoTab = ({ profile }: { profile: UserProfile | null }) => (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <User className="text-deepblue-900" size={24} />
            <h3 className="text-lg font-bold text-deepblue-900">Personal Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="label">Full Name</label>
                <input type="text" defaultValue={profile?.full_name || 'Rajesh Kumar'} className="input-field" />
            </div>
            <div>
                <label className="label">Agent Code</label>
                <div className="relative">
                    <input type="text" value={profile?.agent_code || 'AGT-10523'} disabled className="input-field bg-gray-50 text-gray-500 cursor-not-allowed" />
                    <span className="absolute right-3 top-3 text-[10px] text-gray-400 uppercase font-bold tracking-wider">Cannot Change</span>
                </div>
            </div>
            <div>
                <label className="label">Email Address</label>
                <div className="relative">
                    <input type="email" defaultValue={profile?.email || 'rajesh@champion20.com'} className="input-field pr-24" />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-green-600 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded"><CheckCircle size={10} /> Verified</span>
                </div>
            </div>
            <div>
                <label className="label">Mobile Number</label>
                <div className="relative">
                    <input type="tel" defaultValue={profile?.mobile || '+91 98765 43210'} className="input-field pr-24" />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-green-600 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded"><CheckCircle size={10} /> Verified</span>
                </div>
            </div>
            <div className="md:col-span-2">
                <label className="label">Residential Address</label>
                <div className="relative">
                    <textarea rows={3} className="input-field" defaultValue="123 MG Road, Bangalore, Karnataka&#10;India - 560001"></textarea>
                </div>
            </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button>Update Information</Button>
        </div>
    </div>
);

// --- TAB 2: CRYPTO WALLETS ---

const WalletsTab = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [wallets, setWallets] = useState([
        { id: 1, network: 'TRC-20 (TRON)', address: 'TYuX8vK3zN9L4mP2qR7sT1vW3xY4zA5bC6', status: 'Verified', verifiedDate: 'Jan 15, 2026', totalReceived: '9,760', lastPayout: 'Jan 31, 2026', type: 'recommended' },
        { id: 2, network: 'ERC-20 (Ethereum)', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2', status: 'Verified', verifiedDate: 'Jan 15, 2026', totalReceived: '2,526', lastPayout: 'Oct 31, 2025', type: 'standard' },
    ]);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
                <div>
                    <h4 className="font-bold text-yellow-800 text-sm">IMPORTANT: All commission payouts are in USDT</h4>
                    <p className="text-xs text-yellow-700 mt-1">Add your wallet addresses to receive payments. Ensure networks match to avoid loss of funds.</p>
                </div>
            </div>

            <div className="space-y-6">
                {wallets.map((wallet) => (
                    <div key={wallet.id} className={`bg-white border rounded-xl p-6 shadow-sm transition-all relative overflow-hidden ${wallet.type === 'recommended' ? 'border-gold-300 ring-1 ring-gold-100' : 'border-gray-200'}`}>
                        {wallet.type === 'recommended' && (
                            <div className="absolute top-0 right-0 bg-gold-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                                RECOMMENDED ✨
                            </div>
                        )}
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-deepblue-900 text-lg">{wallet.network}</span>
                            </div>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded flex items-center gap-1 border border-green-100"><CheckCircle size={12} /> {wallet.status}</span>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm text-gray-600 break-all border border-gray-200 flex items-center justify-between gap-4 mb-4">
                            {wallet.address}
                            <div className="flex gap-2">
                                <button className="text-gray-400 hover:text-gold-600 transition p-1 hover:bg-white rounded"><Copy size={14} /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500 mb-4 bg-white/50 p-2 rounded-lg">
                            <div>
                                <span className="block text-[10px] uppercase font-bold text-gray-400">Verified On</span>
                                <span className="font-medium text-gray-700">{wallet.verifiedDate}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase font-bold text-gray-400">Total Received</span>
                                <span className="font-medium text-gray-700">{wallet.totalReceived} USDT</span>
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase font-bold text-gray-400">Last Payout</span>
                                <span className="font-medium text-gray-700">{wallet.lastPayout}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div className="text-[10px] text-gray-400">
                                {wallet.network.includes('TRC') ? 'Lowest fees (~$1) • Fastest (1-3 mins)' : 'Higher gas fees ($5-20) • Slower (5-15 mins)'}
                            </div>
                            <div className="flex gap-4 text-xs font-bold">
                                <button className="text-blue-600 hover:underline">Edit Address</button>
                                <button className="text-red-500 hover:underline">Remove</button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Wallet Button */}
                <div className="border border-gray-200 rounded-xl p-6 bg-gray-50/50">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-700">USDT BEP-20 (Binance Smart Chain)</span>
                        </div>
                        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded flex items-center gap-1 border border-red-100"><X size={12} /> Not Added</span>
                    </div>
                    <button onClick={() => setIsAddModalOpen(true)} className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-gray-500 font-bold hover:border-gold-400 hover:text-gold-600 hover:bg-white transition flex items-center justify-center gap-2 bg-white">
                        <Plus size={16} /> Add BEP-20 Wallet
                    </button>
                    <p className="text-[10px] text-gray-400 mt-2 text-center">Medium fees (~$0.50 per transaction)</p>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Preferred Payout Wallet</h4>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer p-3 border border-gold-200 bg-gold-50/30 rounded-lg">
                        <input type="radio" name="pref_wallet" defaultChecked className="accent-gold-500 w-4 h-4" />
                        <div>
                            <span className="text-sm font-bold text-deepblue-900 block">TRC-20 (Recommended)</span>
                            <span className="text-xs text-gray-500">Commissions will be sent here by default.</span>
                        </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input type="radio" name="pref_wallet" className="accent-gold-500 w-4 h-4" />
                        <span className="text-sm text-gray-700">ERC-20</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 opacity-50">
                        <input type="radio" name="pref_wallet" disabled className="accent-gold-500 w-4 h-4" />
                        <span className="text-sm text-gray-400">BEP-20 (Not configured)</span>
                    </label>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button className="!py-2 !px-6 !text-xs">Save Preference</Button>
                </div>
            </div>

            <AddWalletModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </div>
    );
};

const AddWalletModal = ({ isOpen, onClose }: any) => {
    const [step, setStep] = useState(1);
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-deepblue-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-2xl w-full max-w-md relative shadow-2xl animate-fade-in-up overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-deepblue-900">Add USDT Wallet</h3>
                    <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-red-500" /></button>
                </div>
                
                <div className="p-6">
                    {step === 1 && (
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step 1: Select Network</p>
                            
                            <label className="flex items-center gap-4 p-4 border-2 border-gold-500 bg-gold-50 rounded-xl cursor-pointer relative shadow-sm">
                                <input type="radio" name="network" className="accent-gold-500 w-5 h-5" defaultChecked />
                                <div>
                                    <span className="font-bold text-deepblue-900 block text-sm">TRC-20 (TRON)</span>
                                    <span className="text-xs text-gray-500">Fee: ~$1 | Time: 1-3 mins</span>
                                </div>
                                <span className="absolute top-2 right-2 text-[10px] bg-gold-200 text-gold-800 px-2 py-0.5 rounded font-bold">Recommended</span>
                            </label>

                            <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                                <input type="radio" name="network" className="accent-gold-500 w-5 h-5" />
                                <div>
                                    <span className="font-bold text-gray-700 block text-sm">BEP-20 (Binance Smart Chain)</span>
                                    <span className="text-xs text-gray-500">Fee: ~$0.50 | Time: 1-2 mins</span>
                                </div>
                            </label>

                            <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                                <input type="radio" name="network" className="accent-gold-500 w-5 h-5" />
                                <div>
                                    <span className="font-bold text-gray-700 block text-sm">ERC-20 (Ethereum)</span>
                                    <span className="text-xs text-gray-500">Fee: $5-20 | Time: 5-15 mins</span>
                                </div>
                            </label>

                            <div className="pt-2">
                                <Button fullWidth onClick={() => setStep(2)}>Next Step</Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step 2: Enter Wallet Address</p>
                            
                            <div>
                                <label className="label">Wallet Address *</label>
                                <input type="text" className="input-field font-mono text-sm" placeholder="Paste your USDT TRC-20 address here" />
                            </div>

                            <div className="bg-red-50 p-4 rounded-xl text-xs text-red-800 border border-red-100 flex items-start gap-3">
                                <AlertTriangle size={24} className="shrink-0" />
                                <div>
                                    <p className="font-bold mb-1">CRITICAL WARNING:</p>
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>Double-check the address. Mistakes are irreversible.</li>
                                        <li>Ensure it is a USDT address on the TRC-20 network.</li>
                                        <li>Wrong address/network = Permanent loss of funds.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                                <Button fullWidth onClick={() => setStep(3)} className="flex-[2]">Add Wallet & Verify</Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 text-center">
                            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                <Clock size={32} />
                            </div>
                            
                            <div>
                                <h4 className="font-bold text-lg text-deepblue-900">Wallet Verification Pending</h4>
                                <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto">To verify ownership, please send exactly <strong>1.00 USDT</strong> to the company address below.</p>
                            </div>

                            <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 text-left">
                                <p className="text-[10px] text-gray-500 uppercase font-bold mb-2 text-center">Company Verification Wallet</p>
                                <div className="flex items-center gap-2 bg-white p-2 rounded border border-gray-200">
                                    <code className="text-xs font-mono break-all flex-1">TCompanyVerificationWallet123ABC...</code>
                                    <button className="text-gray-400 hover:text-gold-600"><Copy size={14} /></button>
                                </div>
                                <div className="mt-4 flex justify-center">
                                    <div className="bg-white p-2 rounded border border-gray-200">
                                        <QrCode size={80} className="text-deepblue-900" />
                                    </div>
                                </div>
                                <p className="text-[10px] text-center text-gold-600 font-bold mt-2 cursor-pointer hover:underline">Download QR Code</p>
                            </div>

                            <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg text-left">
                                <p className="font-bold mb-1">What happens next:</p>
                                <ol className="list-decimal pl-4 space-y-0.5">
                                    <li>Our system detects the transaction (5-15 mins).</li>
                                    <li>Wallet is automatically verified.</li>
                                    <li>1.00 USDT is refunded to you.</li>
                                </ol>
                            </div>

                            <div className="pt-2 space-y-3">
                                <Button fullWidth onClick={onClose} className="!bg-green-600 hover:!bg-green-700">I've Sent It - Check Now</Button>
                                <button onClick={onClose} className="text-xs text-gray-400 hover:text-red-500">Cancel Verification</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- TAB 3: SECURITY ---

const SecurityTab = () => (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <Shield className="text-deepblue-900" size={24} />
            <h3 className="text-lg font-bold text-deepblue-900">Security Settings</h3>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
            <Lock className="text-blue-600 shrink-0 mt-0.5" size={20} />
            <div>
                <h4 className="font-bold text-blue-800 text-sm">NO PASSWORD LOGIN</h4>
                <p className="text-xs text-blue-700 mt-1">Your account uses OTP-based authentication for enhanced security. Login via email OTP only - no password to remember.</p>
            </div>
        </div>

        <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Two-Factor Authentication (2FA)</h4>
            <div className="flex items-center justify-between p-6 border border-gray-200 rounded-xl bg-white">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-sm text-gray-800">Authenticator App</p>
                        <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">Disabled</span>
                    </div>
                    <p className="text-xs text-gray-500">Add an extra layer of security using Google Authenticator or Authy.</p>
                </div>
                <Button>Enable 2FA</Button>
            </div>
        </div>

        <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Active Sessions</h4>
            <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-full text-green-600 shadow-sm"><Monitor size={20} /></div>
                        <div>
                            <p className="font-bold text-sm text-green-800">Chrome on Windows (Current)</p>
                            <p className="text-[10px] text-green-700">Greater Noida, India • IP: 103.xxx.xxx.xxx • Active Now</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-green-600 px-2 py-1 bg-white rounded uppercase tracking-wide">This Device</span>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 rounded-full text-gray-500"><Smartphone size={20} /></div>
                        <div>
                            <p className="font-bold text-sm text-gray-700">Safari on iPhone</p>
                            <p className="text-[10px] text-gray-500">Greater Noida, India • IP: 103.xxx.xxx.xxx • 3 hours ago</p>
                        </div>
                    </div>
                    <button className="text-red-500 text-xs font-bold hover:underline border border-red-200 px-3 py-1.5 rounded hover:bg-red-50">Logout</button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 rounded-full text-gray-500"><Monitor size={20} /></div>
                        <div>
                            <p className="font-bold text-sm text-gray-700">Chrome on MacOS</p>
                            <p className="text-[10px] text-gray-500">Bangalore, India • IP: 49.xxx.xxx.xxx • 2 days ago</p>
                        </div>
                    </div>
                    <button className="text-red-500 text-xs font-bold hover:underline border border-red-200 px-3 py-1.5 rounded hover:bg-red-50">Logout</button>
                </div>
            </div>
            <div className="mt-4 text-right">
                <button className="text-xs font-bold text-red-600 flex items-center gap-1 ml-auto hover:text-red-800 transition"><LogOut size={14} /> Logout All Other Devices</button>
            </div>
        </div>

        <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Login History (Last 10)</h4>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase border-b border-gray-200">
                        <tr>
                            <th className="p-3">Date & Time</th>
                            <th className="p-3">Device</th>
                            <th className="p-3">Location</th>
                            <th className="p-3 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr>
                            <td className="p-3 text-gray-600">Feb 02, 2026 - 09:30 AM</td>
                            <td className="p-3 font-medium">Chrome, Windows</td>
                            <td className="p-3 text-gray-500">Bangalore, IN</td>
                            <td className="p-3 text-right text-green-600 font-bold">Success ✅</td>
                        </tr>
                        <tr>
                            <td className="p-3 text-gray-600">Feb 01, 2026 - 08:45 PM</td>
                            <td className="p-3 font-medium">Safari, iPhone</td>
                            <td className="p-3 text-gray-500">Mumbai, IN</td>
                            <td className="p-3 text-right text-green-600 font-bold">Success ✅</td>
                        </tr>
                        <tr>
                            <td className="p-3 text-gray-600">Feb 01, 2026 - 02:15 PM</td>
                            <td className="p-3 font-medium">Chrome, Windows</td>
                            <td className="p-3 text-gray-500">Bangalore, IN</td>
                            <td className="p-3 text-right text-green-600 font-bold">Success ✅</td>
                        </tr>
                    </tbody>
                </table>
                <div className="p-2 text-center bg-gray-50 border-t border-gray-100">
                    <button className="text-[10px] text-blue-600 font-bold hover:underline">View Full History</button>
                </div>
            </div>
        </div>

        <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Security Alerts</h4>
            <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-200">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-gold-500 rounded" />
                    <span className="text-sm text-gray-700">Email me for suspicious login attempts</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-gold-500 rounded" />
                    <span className="text-sm text-gray-700">Email me for new device logins</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-gold-500 rounded" />
                    <span className="text-sm text-gray-700">Email me for payout requests</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-gold-500 rounded" />
                    <span className="text-sm text-gray-700">SMS alerts for large transactions (>₹1L)</span>
                </label>
            </div>
            <div className="mt-4 flex justify-end">
                <Button className="!py-2 !px-6 !text-xs">Save Settings</Button>
            </div>
        </div>
    </div>
);

// --- TAB 4: PREFERENCES ---

const PreferencesTab = () => (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <Settings className="text-deepblue-900" size={24} />
            <h3 className="text-lg font-bold text-deepblue-900">Preferences</h3>
        </div>

        {/* Notifications */}
        <div>
            <h4 className="font-bold text-deepblue-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><Bell size={16} /> Notification Settings</h4>
            
            {/* Commission & Earnings */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
                <div className="p-3 bg-gray-50 border-b border-gray-200 font-bold text-xs text-gray-500 uppercase">Commission & Earnings</div>
                <div className="p-4 space-y-3">
                    <ToggleRow label="Email notifications" defaultChecked />
                    <ToggleRow label="SMS notifications" defaultChecked />
                    <ToggleRow label="Push notifications (mobile app)" defaultChecked />
                </div>
            </div>

            {/* Commission Alerts */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
                <div className="p-3 bg-gray-50 border-b border-gray-200 font-bold text-xs text-gray-500 uppercase">Commission Alerts</div>
                <div className="p-4 space-y-3">
                    <ToggleRow label="New sale from my clients" defaultChecked />
                    <ToggleRow label="New sale from my network" defaultChecked />
                    <ToggleRow label="Monthly payment received" defaultChecked />
                    <ToggleRow label="Rank advancement achieved" defaultChecked />
                    <ToggleRow label="Leaderboard position change" defaultChecked />
                </div>
            </div>

            {/* Team Activity */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
                <div className="p-3 bg-gray-50 border-b border-gray-200 font-bold text-xs text-gray-500 uppercase">Team Activity</div>
                <div className="p-4 space-y-3">
                    <ToggleRow label="New agent recruited in my network" defaultChecked />
                    <ToggleRow label="Agent approval/rejection" defaultChecked />
                    <ToggleRow label="Team member rank advancement" defaultChecked />
                    <ToggleRow label="Daily team activity summary" />
                </div>
            </div>

            {/* Payout Notifications */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-gray-200 font-bold text-xs text-gray-500 uppercase">Payout Notifications</div>
                <div className="p-4 space-y-3">
                    <ToggleRow label="Payout request submitted" defaultChecked />
                    <ToggleRow label="Payout approved" defaultChecked />
                    <ToggleRow label="Payout completed (USDT sent)" defaultChecked />
                    <ToggleRow label="Wallet verification status" defaultChecked />
                </div>
            </div>
        </div>

        <div className="border-t border-gray-200 pt-6"></div>

        {/* Regional */}
        <div>
            <h4 className="font-bold text-deepblue-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><Globe size={16} /> Language & Regional</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-gray-200">
                <div>
                    <label className="label">Language</label>
                    <div className="relative">
                        <select className="input-field cursor-pointer appearance-none bg-white">
                            <option>English</option>
                            <option>Hindi</option>
                            <option>Arabic</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>
                <div>
                    <label className="label">Currency Display</label>
                    <div className="relative">
                        <select className="input-field cursor-pointer appearance-none bg-white">
                            <option>INR (₹)</option>
                            <option>USD ($)</option>
                            <option>AED (د.إ)</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 italic">(USDT always shown regardless)</p>
                </div>
                <div>
                    <label className="label">Timezone</label>
                    <div className="relative">
                        <select className="input-field cursor-pointer appearance-none bg-white">
                            <option>Asia/Kolkata (GMT+5:30)</option>
                            <option>Asia/Dubai (GMT+4:00)</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>
                <div>
                    <label className="label">Date Format</label>
                    <div className="relative">
                        <select className="input-field cursor-pointer appearance-none bg-white">
                            <option>DD/MM/YYYY</option>
                            <option>MM/DD/YYYY</option>
                            <option>YYYY-MM-DD</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>
        </div>

        <div className="border-t border-gray-200 pt-6"></div>

        {/* Dashboard Prefs */}
        <div>
            <h4 className="font-bold text-deepblue-900 mb-4 text-sm uppercase tracking-wider">Dashboard Preferences</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-gray-200">
                <div>
                    <label className="label">Default Landing Page</label>
                    <select className="input-field cursor-pointer appearance-none bg-white">
                        <option>Dashboard</option>
                        <option>Sales</option>
                        <option>Earnings</option>
                        <option>Network</option>
                    </select>
                </div>
                <div>
                    <label className="label">Charts Display</label>
                    <select className="input-field cursor-pointer appearance-none bg-white">
                        <option>Last 6 Months</option>
                        <option>Last Month</option>
                        <option>Last 3 Months</option>
                    </select>
                </div>
                <div>
                    <label className="label">Network View Default</label>
                    <select className="input-field cursor-pointer appearance-none bg-white">
                        <option>Tree View</option>
                        <option>Table View</option>
                        <option>Statistics</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Privacy */}
        <div>
            <h4 className="font-bold text-deepblue-900 mb-4 text-sm uppercase tracking-wider">Privacy</h4>
            <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
                <div>
                    <label className="label mb-2 block">Profile Visibility</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="visibility" className="accent-gold-500" /> <span className="text-sm text-gray-600">Public</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="visibility" className="accent-gold-500" defaultChecked /> <span className="text-sm text-gray-600 font-bold">Network Only</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="visibility" className="accent-gold-500" /> <span className="text-sm text-gray-600">Private</span>
                        </label>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-500 uppercase">Contact Information Sharing</p>
                    <ToggleRow label="Allow downline agents to see my email" defaultChecked />
                    <ToggleRow label="Allow downline agents to see my mobile" defaultChecked />
                </div>
            </div>
        </div>

        <div className="flex justify-end pt-4 pb-10">
            <Button className="!py-3 !px-8">Save All Preferences</Button>
        </div>
    </div>
);

// --- TAB 5: KYC & DOCUMENTS ---

const DocumentsTab = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <FileText className="text-deepblue-900" size={24} />
            <h3 className="text-lg font-bold text-deepblue-900">KYC & Documents</h3>
        </div>

        {/* Verification Status */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
            <div className="bg-white p-4 rounded-full shadow-md text-green-600 border border-green-100">
                <CheckCircle size={40} />
            </div>
            <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-bold text-green-800">KYC VERIFIED</h3>
                <p className="text-sm text-green-700 mt-1">Your identity and documents have been verified by Admin on <span className="font-bold">January 05, 2024</span>.</p>
                <div className="mt-2 inline-flex items-center gap-1 text-xs text-green-600 bg-white/60 px-2 py-1 rounded">
                    <Shield size={10} /> Verified by: admin@rakoasis.com
                </div>
            </div>
        </div>

        {/* PAN / ID */}
        <div>
            <h4 className="font-bold text-deepblue-900 mb-4 border-l-4 border-gold-500 pl-3">PAN CARD / EMIRATES ID</h4>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-sm text-gray-500">Document Type</span>
                        <span className="font-bold text-deepblue-900">PAN Card (India)</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-sm text-gray-500">Number</span>
                        <span className="font-bold text-deepblue-900">ABCDE1234F</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Status</span>
                        <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-0.5 rounded">Verified ✅</span>
                    </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center w-full md:w-auto">
                    <div className="flex items-center justify-center gap-2 mb-2 text-green-700 text-xs font-bold">
                        <CheckCircle size={14} /> pan_card_rajesh_kumar.pdf
                    </div>
                    <p className="text-[10px] text-gray-400 mb-3">Uploaded: Jan 05, 2024 • 1.8 MB</p>
                    <div className="flex gap-2">
                        <button className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 flex items-center gap-1"><Eye size={12} /> View</button>
                        <button className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 flex items-center gap-1"><RefreshCw size={12} /> Update</button>
                    </div>
                </div>
            </div>
        </div>

        {/* Agreement */}
        <div>
            <h4 className="font-bold text-deepblue-900 mb-4 border-l-4 border-blue-500 pl-3">AGENT AGREEMENT</h4>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-sm text-gray-500">Agreement Signed</span>
                        <span className="font-bold text-green-600">Yes ✅</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-sm text-gray-500">Signed On</span>
                        <span className="font-bold text-deepblue-900">January 05, 2024</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Digital Signature</span>
                        <button className="text-blue-600 text-xs font-bold hover:underline">[View Signature]</button>
                    </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center w-full md:w-auto">
                    <div className="flex items-center justify-center gap-2 mb-2 text-blue-700 text-xs font-bold">
                        <FileText size={14} /> agent_agreement_AGT10523.pdf
                    </div>
                    <p className="text-[10px] text-gray-400 mb-3">2.1 MB</p>
                    <button className="text-xs bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-1 w-full"><Download size={12} /> Download Agreement</button>
                </div>
            </div>
        </div>

        {/* Tax Docs */}
        <div>
            <h4 className="font-bold text-deepblue-900 mb-4 border-l-4 border-purple-500 pl-3">TAX DOCUMENTS</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h5 className="font-bold text-gray-800 mb-4 text-sm border-b border-gray-100 pb-2">Form 16 (Tax Certificate)</h5>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">FY 2024-25</span>
                            <button className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"><Download size={12} /> Download</button>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">FY 2023-24</span>
                            <button className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"><Download size={12} /> Download</button>
                        </li>
                    </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h5 className="font-bold text-gray-800 mb-4 text-sm border-b border-gray-100 pb-2">TDS Certificates</h5>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Q4 2025</span>
                            <button className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"><Download size={12} /> Download</button>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Q3 2025</span>
                            <button className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"><Download size={12} /> Download</button>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Q2 2025</span>
                            <button className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"><Download size={12} /> Download</button>
                        </li>
                    </ul>
                    <button className="text-xs text-gray-400 mt-3 hover:text-deepblue-900 block text-center w-full">[View All Certificates]</button>
                </div>
            </div>
        </div>

        {/* Commission Statements */}
        <div>
            <h4 className="font-bold text-deepblue-900 mb-4 border-l-4 border-green-500 pl-3">COMMISSION STATEMENTS</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h5 className="font-bold text-gray-800 mb-4 text-sm border-b border-gray-100 pb-2">Monthly Statements</h5>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">February 2026</span>
                            <button className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"><Download size={12} /> Download</button>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">January 2026</span>
                            <button className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"><Download size={12} /> Download</button>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">December 2025</span>
                            <button className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"><Download size={12} /> Download</button>
                        </li>
                    </ul>
                    <button className="text-xs text-gray-400 mt-3 hover:text-deepblue-900 block text-center w-full">[View All Statements]</button>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h5 className="font-bold text-gray-800 mb-4 text-sm border-b border-gray-100 pb-2">Annual Summary</h5>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">2025 Annual Report</span>
                            <button className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"><Download size={12} /> Download</button>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">2024 Annual Report</span>
                            <button className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"><Download size={12} /> Download</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

// --- HELPERS ---

const TabButton = ({ id, label, icon: Icon, active, onClick }: any) => (
    <button 
        onClick={() => onClick(id)}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${active === id ? 'bg-deepblue-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
    >
        <Icon size={16} /> {label}
    </button>
);

const ToggleRow = ({ label, defaultChecked }: any) => (
    <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">{label}</span>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold-500"></div>
        </label>
    </div>
);
