
import React from 'react';
import { 
  Award, Briefcase, DollarSign, Users, Target, CheckCircle, 
  TrendingUp, Plus, Network, Copy, ArrowRight, AlertCircle, Sparkles 
} from 'lucide-react';
import { Button } from '../Button';
import { useCurrency } from '../../contexts/CurrencyContext';

export const DashboardHome = ({ profile, onChangeView }: any) => {
    const { formatAED, formatUSDT } = useCurrency();

    // Mock data in INR (source of truth)
    const thisMonthEarningsINR = 482275;
    const netBalanceINR = 434047;

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* A. Performance Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-gold-300 hover:shadow-lg transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Award size={64} className="text-gold-500" /></div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1"><Award size={12} /> Current Rank</p>
                        <h3 className="text-2xl font-serif font-bold text-deepblue-900 mt-2 group-hover:text-gold-600 transition-colors">Rank 3</h3>
                        <p className="text-sm font-medium text-gray-600 mt-1">Area Manager</p>
                        <button className="text-xs text-gold-600 font-bold mt-4 hover:underline flex items-center gap-1">View Details <ArrowRight size={10} /></button>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-blue-300 hover:shadow-lg transition-all" onClick={() => onChangeView('SALES')}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Briefcase size={64} className="text-blue-500" /></div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1"><Briefcase size={12} /> Personal Sales</p>
                        <h3 className="text-2xl font-serif font-bold text-deepblue-900 mt-2">12 plots</h3>
                        <p className="text-sm font-medium text-gray-600 mt-1">Lifetime</p>
                        <button className="text-xs text-blue-600 font-bold mt-4 hover:underline flex items-center gap-1">View All <ArrowRight size={10} /></button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-green-300 hover:shadow-lg transition-all cursor-pointer" onClick={() => onChangeView('EARNINGS')}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><DollarSign size={64} className="text-green-500" /></div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1"><DollarSign size={12} /> This Month Earnings</p>
                        <h3 className="text-2xl font-serif font-bold text-green-600 mt-2">{formatAED(thisMonthEarningsINR)}</h3>
                        <p className="text-sm font-medium text-gray-500 mt-1">Net: {formatAED(netBalanceINR)} (≈ {formatUSDT(netBalanceINR)})</p>
                        <button className="text-xs text-green-700 font-bold mt-4 hover:underline flex items-center gap-1">Request Payout <ArrowRight size={10} /></button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-purple-300 hover:shadow-lg transition-all" onClick={() => onChangeView('NETWORK')}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Users size={64} className="text-purple-500" /></div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1"><Users size={12} /> Team Volume</p>
                        <h3 className="text-2xl font-serif font-bold text-deepblue-900 mt-2">47 plots</h3>
                        <p className="text-sm font-medium text-purple-600 mt-1 flex items-center gap-1"><TrendingUp size={14} /> This month</p>
                        <button className="text-xs text-purple-600 font-bold mt-4 hover:underline flex items-center gap-1">View Team <ArrowRight size={10} /></button>
                    </div>
                </div>
            </div>

            {/* B. Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">👥 Direct Team</p>
                        <p className="text-xl font-bold text-deepblue-900 mt-1">8 agents</p>
                    </div>
                    <Button variant="outline" className="!py-1.5 !px-3 !text-xs rounded-full" onClick={() => onChangeView('RECRUIT')}>Recruit More</Button>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">🌐 Total Network</p>
                        <p className="text-xl font-bold text-deepblue-900 mt-1">43 agents</p>
                    </div>
                    <Button variant="outline" className="!py-1.5 !px-3 !text-xs rounded-full" onClick={() => onChangeView('NETWORK')}>View Tree</Button>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">🏆 Leaderboard</p>
                        <p className="text-xl font-bold text-gold-600 mt-1">Position: #7</p>
                    </div>
                    <Button variant="outline" className="!py-1.5 !px-3 !text-xs rounded-full" onClick={() => onChangeView('LEADERBOARD')}>View Board</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column (2/3) */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* C. Rank Advancement Progress */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition">
                            <h3 className="font-bold text-deepblue-900 flex items-center gap-2 text-lg"><Target size={20} className="text-gold-500" /> RANK ADVANCEMENT PROGRESS</h3>
                            <button className="text-xs bg-gold-100 text-gold-700 px-3 py-1 rounded-full font-bold shadow-sm">Expand ▼</button>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between text-sm mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <div>
                                    <span className="text-blue-500 block text-xs uppercase font-bold mb-1">Current Status</span>
                                    <span className="font-bold text-deepblue-900 text-lg">Rank 3 (Area Manager)</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-blue-500 block text-xs uppercase font-bold mb-1">Next Milestone</span>
                                    <span className="font-bold text-gold-600 text-lg">Rank 4 (Zonal Head)</span>
                                </div>
                            </div>

                            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <h4 className="font-bold text-sm text-gray-800 mb-2">Benefits of Rank 4:</h4>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    <li>• Infinity Bonus: 2% → 3% (+50% increase!)</li>
                                    <li>• Direct Commission: 10% → 11%</li>
                                    <li>• Higher leaderboard potential</li>
                                </ul>
                            </div>
                            
                            <div className="border-t border-gray-200 my-4"></div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Completed Targets: ✅✅✅ (3/4)</p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0 shadow-sm"><CheckCircle size={14} /></div>
                                    <div className="flex-1">
                                        <span className="text-sm font-bold text-gray-900">Target: Sell 1 Plot Personally</span>
                                        <span className="text-xs text-gray-500 block mt-0.5">Status: DONE (12 plots sold)</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0 shadow-sm"><CheckCircle size={14} /></div>
                                    <div className="flex-1">
                                        <span className="text-sm font-bold text-gray-900">Target: Recruit 3 Active Agents</span>
                                        <span className="text-xs text-gray-500 block mt-0.5">Status: DONE (8 agents recruited)</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0 shadow-sm"><CheckCircle size={14} /></div>
                                    <div className="flex-1">
                                        <span className="text-sm font-bold text-gray-900">Target: Total Team Volume 25 Plots</span>
                                        <span className="text-xs text-gray-500 block mt-0.5">Status: DONE (47 plots total)</span>
                                    </div>
                                </div>
                            </div>
                                
                            <div className="border-t border-gray-200 my-4"></div>
                            <p className="text-sm font-bold text-deepblue-900 mb-4">CHOOSE YOUR 4TH TARGET TO UNLOCK RANK 4:</p>

                            <div className="space-y-3">
                                <label className="flex items-start gap-4 p-4 bg-white border-2 border-gold-400 rounded-xl cursor-pointer shadow-md relative hover:bg-gold-50/20 transition-colors">
                                    <input type="radio" name="target" className="mt-1 text-gold-500 focus:ring-gold-500 w-5 h-5 accent-gold-500" defaultChecked />
                                    <div className="flex-1">
                                        <span className="text-sm font-bold text-deepblue-900 block">Option A: Sell 5 Plots Personally (Lifetime)</span>
                                        <div className="flex items-center gap-2 mt-2 bg-green-50 p-2 rounded-lg border border-green-100 inline-block">
                                            <CheckCircle size={12} className="text-green-600" />
                                            <span className="text-xs text-green-700 font-bold">ALREADY COMPLETED! (12 plots)</span>
                                        </div>
                                        <div className="text-xs font-bold text-gold-600 mt-2">[✓ Select This - Instant Rank 4]</div>
                                    </div>
                                </label>
                                <label className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 opacity-60 hover:opacity-100 transition-all">
                                    <input type="radio" name="target" className="mt-1 w-5 h-5 accent-gray-400" />
                                    <div className="flex-1">
                                        <span className="text-sm font-bold text-gray-900 block">Option B: Sell 15 Plots Personally (Lifetime)</span>
                                        <span className="text-xs text-gray-500 mt-1 block">Current: 12 plots | Need: 3 more plots</span>
                                        <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
                                            <div className="bg-gray-400 h-1.5 rounded-full" style={{width: '80%'}}></div>
                                        </div>
                                    </div>
                                </label>
                                <label className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 opacity-60 hover:opacity-100 transition-all">
                                    <input type="radio" name="target" className="mt-1 w-5 h-5 accent-gray-400" />
                                    <div className="flex-1">
                                        <span className="text-sm font-bold text-gray-900 block">Option C: Total Team Volume 112 Plots</span>
                                        <span className="text-xs text-gray-500 mt-1 block">Current: 47 plots | Need: 65 more plots</span>
                                        <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
                                            <div className="bg-gray-400 h-1.5 rounded-full" style={{width: '42%'}}></div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                            
                            <div className="mt-6 flex flex-col items-end">
                                <p className="text-xs text-gray-500 italic mb-2">💡 TIP: Option A gives instant rank up! You've already completed this requirement.</p>
                                <Button className="shadow-gold-500/30">Claim Rank 4 Now</Button>
                            </div>
                        </div>
                    </div>

                    {/* D. Recent Sales Table */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-deepblue-900 flex items-center gap-2"><Briefcase size={18} /> 📊 RECENT SALES</h3>
                            <button onClick={() => onChangeView('SALES')} className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">View All Sales <ArrowRight size={12} /></button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white text-gray-500 font-medium border-b border-gray-100 uppercase tracking-wider text-xs">
                                    <tr>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Client</th>
                                        <th className="px-6 py-3">Plot</th>
                                        <th className="px-6 py-3">Amount</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {[
                                        { date: "Feb 02 '26", client: "Amit Sharma", plot: "A-105", amount: 2520000, status: "✅ Active" },
                                        { date: "Jan 28 '26", client: "Priya Reddy", plot: "B-203", amount: 2520000, status: "✅ Active" },
                                        { date: "Jan 25 '26", client: "John Doe", plot: "C-045", amount: 2646000, status: "⏳ Pending" },
                                        { date: "Jan 20 '26", client: "Sneha Patel", plot: "A-108", amount: 2520000, status: "✅ Active" },
                                        { date: "Jan 15 '26", client: "Mike Johnson", plot: "D-201", amount: 2646000, status: "✅ Active" },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-gray-500">{row.date}</td>
                                            <td className="px-6 py-4 font-bold text-deepblue-900">{row.client}</td>
                                            <td className="px-6 py-4 text-gray-600 font-mono text-xs">{row.plot}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{formatAED(row.amount)}</td>
                                            <td className="px-6 py-4 text-xs font-bold">{row.status}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-gray-400 hover:text-deepblue-900 font-bold text-xs border border-gray-200 px-2 py-1 rounded hover:bg-white transition">[View]</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 text-center text-xs text-gray-400 bg-gray-50 border-t border-gray-100">
                            Showing last 5 sales
                        </div>
                    </div>

                </div>

                {/* Sidebar Column (1/3) */}
                <div className="space-y-8">
                    
                    {/* E. Commission Breakdown Summary */}
                    <div className="bg-white p-0 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900 text-sm">💰 FEBRUARY 2026 EARNINGS SUMMARY</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-3 text-sm">
                                <div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">1️⃣ Unilevel Commissions:</span>
                                        <span className="font-bold text-gray-900">{formatAED(391375)}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 ml-6">Level 1-5 from network sales</p>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">2️⃣ Infinity Bonus (+2%):</span>
                                        <span className="font-bold text-gray-900">{formatAED(90900)}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 ml-6">From 18 open volume plots</p>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">3️⃣ Leaderboard Bonus:</span>
                                        <span className="font-bold text-gray-900">{formatAED(0)}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 ml-6">Position #7 (Not in Top 5)</p>
                                </div>
                            </div>
                            
                            <div className="border-t border-double border-gray-300 my-2"></div>
                            
                            <div className="flex justify-between font-bold text-deepblue-900 text-sm">
                                <span>GROSS EARNINGS:</span>
                                <span>{formatAED(482275)}</span>
                            </div>
                            <div className="flex justify-between text-red-500 text-xs">
                                <span>TDS Deducted (10%):</span>
                                <span>- {formatAED(48228)}</span>
                            </div>
                            
                            <div className="bg-green-50 p-3 rounded border border-green-100 mt-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-green-800 font-bold uppercase text-xs tracking-wider">NET PAYABLE:</span>
                                    <span className="text-green-800 font-bold text-base">{formatAED(434047)}</span>
                                </div>
                                <div className="text-right text-xs text-green-600 mt-1 font-mono">≈ {formatUSDT(434047)}</div>
                            </div>

                            <p className="text-xs text-gray-500 text-center">Available for Withdrawal: {formatAED(434047)}</p>
                            
                            <div className="flex gap-2">
                                <Button fullWidth className="!py-2 !text-xs !bg-green-600 hover:!bg-green-700">Request USDT Payout</Button>
                                <Button variant="outline" fullWidth className="!py-2 !text-xs !text-gray-600 !border-gray-200">View Breakdown</Button>
                            </div>
                        </div>
                    </div>

                    {/* F. Team Highlights */}
                    <div className="bg-white p-0 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900 text-sm">🌟 MY TEAM HIGHLIGHTS</h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="bg-yellow-50/50 p-3 rounded border border-yellow-100">
                                <p className="text-[10px] text-gold-600 font-bold uppercase tracking-wider mb-1">🏆 TOP PERFORMER THIS MONTH:</p>
                                <p className="text-sm font-bold text-deepblue-900">Mike Johnson (AGT-10526)</p>
                                <p className="text-xs text-gray-500">8 personal sales | Rank 3 | {formatAED(201000)} earned</p>
                                <div className="flex gap-2 mt-2">
                                    <button className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded hover:bg-gray-50 text-gray-600">[View Profile]</button>
                                    <button className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded hover:bg-gray-50 text-gray-600">[Send Message]</button>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-2">🎉 NEW RECRUITS (Last 7 Days): 2</p>
                                <ul className="text-xs text-gray-600 space-y-2">
                                    <li className="flex items-center gap-2">• Arun Kumar (AGT-10789) - <span className="text-gray-400">2 days ago</span></li>
                                    <li className="flex items-center gap-2">• Lisa Wong (AGT-10790) - <span className="text-gray-400">5 days ago</span></li>
                                </ul>
                                <button className="text-[10px] text-blue-600 mt-2 hover:underline">[View All Recruits]</button>
                            </div>

                            <div className="bg-red-50/30 p-3 rounded border border-red-50">
                                <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider mb-1">⚠️ NEEDS ATTENTION:</p>
                                <p className="text-xs text-gray-600">3 agents inactive for 30+ days</p>
                                <button className="text-[10px] text-red-600 mt-1 hover:underline font-bold">[View & Follow Up]</button>
                            </div>
                        </div>
                    </div>

                    {/* G. Quick Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => onChangeView('SALES')} className="p-4 bg-deepblue-900 text-white rounded-xl text-xs font-bold hover:bg-deepblue-800 transition flex flex-col items-center gap-2 text-center shadow-lg shadow-deepblue-900/20 group">
                            <Plus size={20} className="text-gold-400 group-hover:scale-110 transition-transform" /> Register New Client
                        </button>
                        <button onClick={() => onChangeView('RECRUIT')} className="p-4 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition flex flex-col items-center gap-2 text-center hover:border-gold-300 group shadow-sm hover:shadow-md">
                            <Users size={20} className="text-blue-500 group-hover:scale-110 transition-transform" /> Recruit Agent
                        </button>
                        <button onClick={() => onChangeView('NETWORK')} className="p-4 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition flex flex-col items-center gap-2 text-center hover:border-gold-300 group shadow-sm hover:shadow-md">
                            <Network size={20} className="text-purple-500 group-hover:scale-110 transition-transform" /> View Genealogy
                        </button>
                        <button onClick={() => onChangeView('MARKETING')} className="p-4 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition flex flex-col items-center gap-2 text-center hover:border-gold-300 group shadow-sm hover:shadow-md">
                            <Copy size={20} className="text-green-500 group-hover:scale-110 transition-transform" /> Share My Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
