
import React, { useState } from 'react';
import { SectionTitle, IndButton } from './Shared';
import { useCurrency } from '../../contexts/CurrencyContext';

export const SettingsView = () => {
    const [activeTab, setActiveTab] = useState('GENERAL');
    const { rates, updateRate } = useCurrency();

    return (
        <div className="space-y-6">
            <SectionTitle 
                title="SYSTEM_SETTINGS" 
                actions={
                    <>
                        <IndButton active={activeTab === 'GENERAL'} onClick={() => setActiveTab('GENERAL')}>GENERAL</IndButton>
                        <IndButton active={activeTab === 'PAYMENT'} onClick={() => setActiveTab('PAYMENT')}>PAYMENT</IndButton>
                        <IndButton active={activeTab === 'COMMISSION'} onClick={() => setActiveTab('COMMISSION')}>COMMISSION</IndButton>
                        <IndButton active={activeTab === 'SECURITY'} onClick={() => setActiveTab('SECURITY')}>SECURITY</IndButton>
                    </>
                } 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* General Config */}
                <div className={`bg-white border border-black p-4 ${activeTab !== 'GENERAL' ? 'hidden md:block opacity-50' : ''}`}>
                    <h4 className="font-bold text-xs uppercase mb-4 bg-gray-200 p-1 border border-black">General Configuration</h4>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold mb-1">COMPANY NAME</label>
                            <input type="text" defaultValue="RAK OASIS" className="w-full border border-gray-400 p-1 text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1">SUPPORT EMAIL</label>
                            <input type="email" defaultValue="support@rakoasis.com" className="w-full border border-gray-400 p-1 text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1">TIMEZONE</label>
                            <select className="w-full border border-gray-400 p-1 text-xs bg-white"><option>Asia/Dubai (GST +4:00)</option></select>
                        </div>
                        
                        <div className="border-t border-gray-200 mt-4 pt-4">
                            <h5 className="font-bold text-xs mb-3">CURRENCY & EXCHANGE RATES</h5>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-[10px] font-bold mb-1 text-gray-500">1 AED = ? INR</label>
                                    <input 
                                        type="number" 
                                        value={rates.aedToInr} 
                                        onChange={(e) => updateRate('aedToInr', parseFloat(e.target.value))}
                                        className="w-full border border-gray-400 p-1 text-xs text-center" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold mb-1 text-gray-500">1 USDT = ? INR</label>
                                    <input 
                                        type="number" 
                                        value={rates.usdtToInr} 
                                        onChange={(e) => updateRate('usdtToInr', parseFloat(e.target.value))}
                                        className="w-full border border-gray-400 p-1 text-xs text-center" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold mb-1 text-gray-500">1 AED = ? USDT</label>
                                    <input 
                                        type="number" 
                                        value={rates.aedToUsdt} 
                                        onChange={(e) => updateRate('aedToUsdt', parseFloat(e.target.value))}
                                        className="w-full border border-gray-400 p-1 text-xs text-center" 
                                    />
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 italic">Updates reflect immediately in Agent Dashboard</p>
                        </div>

                        <div className="flex items-center gap-2 mt-4 border-t border-gray-200 pt-3">
                            <input type="checkbox" />
                            <label className="text-xs font-bold text-red-600">MAINTENANCE MODE (Suspend User Access)</label>
                        </div>
                    </div>
                    <div className="mt-4 text-right">
                        <IndButton>SAVE GENERAL</IndButton>
                    </div>
                </div>

                {/* Commission Rules */}
                <div className={`bg-white border border-black p-4 ${activeTab !== 'COMMISSION' && activeTab !== 'GENERAL' ? 'hidden md:block opacity-50' : ''}`}>
                    <h4 className="font-bold text-xs uppercase mb-4 bg-gray-200 p-1 border border-black">Commission & Payout Rules</h4>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                            <span>Unilevel Total (L1-L5):</span>
                            <div className="flex items-center"><input type="number" defaultValue="15" className="w-12 border border-gray-400 p-1 text-center" /> %</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Infinity Max Bonus:</span>
                            <div className="flex items-center"><input type="number" defaultValue="5" className="w-12 border border-gray-400 p-1 text-center" /> %</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>TDS Rate:</span>
                            <div className="flex items-center"><input type="number" defaultValue="10" className="w-12 border border-gray-400 p-1 text-center" /> %</div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                            <span>Min Payout (INR):</span>
                            <input type="text" defaultValue="10000" className="w-20 border border-gray-400 p-1 text-right" />
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Daily Payout Limit:</span>
                            <input type="text" defaultValue="1000000" className="w-20 border border-gray-400 p-1 text-right" />
                        </div>
                    </div>
                    <div className="mt-4 text-right">
                        <IndButton>UPDATE RULES</IndButton>
                    </div>
                </div>

                {/* Payment Gateway */}
                <div className={`bg-white border border-black p-4 ${activeTab !== 'PAYMENT' && activeTab !== 'GENERAL' ? 'hidden md:block opacity-50' : ''}`}>
                    <h4 className="font-bold text-xs uppercase mb-4 bg-gray-200 p-1 border border-black">Payment Gateway (Razorpay)</h4>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold mb-1">MODE</label>
                            <div className="flex gap-4 text-xs">
                                <label className="flex items-center gap-1"><input type="radio" name="mode" defaultChecked /> LIVE</label>
                                <label className="flex items-center gap-1"><input type="radio" name="mode" /> TEST</label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1">API KEY ID</label>
                            <input type="text" defaultValue="rzp_live_XXXXXXXX" className="w-full border border-gray-400 p-1 text-xs font-mono" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1">WEBHOOK SECRET</label>
                            <input type="password" defaultValue="••••••••" className="w-full border border-gray-400 p-1 text-xs" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1">ACCEPTED METHODS</label>
                            <div className="flex gap-2 text-xs">
                                <label className="flex items-center gap-1"><input type="checkbox" defaultChecked /> UPI</label>
                                <label className="flex items-center gap-1"><input type="checkbox" defaultChecked /> CARD</label>
                                <label className="flex items-center gap-1"><input type="checkbox" defaultChecked /> NETBANKING</label>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 text-right">
                        <IndButton>TEST CONNECTION</IndButton>
                    </div>
                </div>

                {/* USDT Wallets */}
                <div className={`bg-white border border-black p-4 ${activeTab !== 'PAYMENT' && activeTab !== 'GENERAL' ? 'hidden md:block opacity-50' : ''}`}>
                    <h4 className="font-bold text-xs uppercase mb-4 bg-gray-200 p-1 border border-black">Company Crypto Wallets</h4>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold mb-1">TRC-20 (TRON) ADDRESS</label>
                            <input type="text" defaultValue="TXXXXXXXXXXXXXXXXXXXX" className="w-full border border-gray-400 p-1 text-xs font-mono" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1">ERC-20 (ETH) ADDRESS</label>
                            <input type="text" defaultValue="0xXXXXXXXXXXXXXXXXXXXX" className="w-full border border-gray-400 p-1 text-xs font-mono" />
                        </div>
                    </div>
                    <div className="mt-4 text-right">
                        <IndButton>SAVE WALLETS</IndButton>
                    </div>
                </div>

                {/* Security */}
                <div className={`bg-white border border-black p-4 ${activeTab !== 'SECURITY' && activeTab !== 'GENERAL' ? 'hidden md:block opacity-50' : ''}`}>
                    <h4 className="font-bold text-xs uppercase mb-4 bg-gray-200 p-1 border border-black">Security & Access</h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked />
                            <label className="text-xs">Require 2FA for all admin accounts</label>
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1">SESSION TIMEOUT</label>
                            <select className="w-full border border-gray-400 p-1 text-xs bg-white"><option>30 Minutes</option></select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1">IP WHITELIST (Optional)</label>
                            <textarea className="w-full border border-gray-400 p-1 text-xs font-mono h-16" placeholder="Enter IPs..."></textarea>
                        </div>
                    </div>
                    <div className="mt-4 text-right">
                        <IndButton>UPDATE SECURITY</IndButton>
                    </div>
                </div>

            </div>
        </div>
    );
};
