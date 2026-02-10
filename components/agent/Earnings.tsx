
import React, { useState } from 'react';
import { DollarSign, RefreshCw, Clock, ExternalLink, CheckCircle, Plus, AlertCircle, Tag as TagIcon, Wallet, ArrowRight, TrendingUp, Calculator, RotateCcw, Download, CreditCard, ChevronDown, FileText, ChevronUp, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '../Button';
import { useCurrency } from '../../contexts/CurrencyContext';

// --- MOCK DATA (INR) ---
const MOCK_PAYOUTS = [
    { id: 'PAY-234', date: "Feb 02 '26", amountInr: 434047, usdt: 5225, network: 'TRC-20', status: 'Pending', hash: '' },
    { id: 'PAY-198', date: "Jan 31 '26", amountInr: 309000, usdt: 3732, network: 'TRC-20', status: 'Completed', hash: '0x1a2b3c...' },
    { id: 'PAY-167', date: "Dec 31 '25", amountInr: 308000, usdt: 3724, network: 'TRC-20', status: 'Completed', hash: '0x4d5e6f...' },
    { id: 'PAY-142', date: "Nov 30 '25", amountInr: 235000, usdt: 2830, network: 'ERC-20', status: 'Completed', hash: '0x7g8h...' },
    { id: 'PAY-121', date: "Oct 31 '25", amountInr: 210000, usdt: 2526, network: 'TRC-20', status: 'Completed', hash: '0xjk9l...' },
    { id: 'PAY-098', date: "Sep 30 '25", amountInr: 180000, usdt: 2180, network: 'TRC-20', status: 'Completed', hash: '0xmn3o...' },
];

export const EarningsView = () => {
    const [tab, setTab] = useState<'OVERVIEW' | 'MONTH' | 'HISTORY' | 'PAYOUT' | 'SIMULATOR'>('PAYOUT');
    const [payoutStep, setPayoutStep] = useState(1);
    const [amount, setAmount] = useState(434047);

    // Simulator State
    const [simPersonal, setSimPersonal] = useState(5);
    const [simAgents, setSimAgents] = useState(8);
    const [simAgentSales, setSimAgentSales] = useState(3);
    const [simRecruits, setSimRecruits] = useState(2);

    const renderContent = () => {
        switch(tab) {
            case 'OVERVIEW':
                return <OverviewTab onChangeTab={setTab} />;
            case 'MONTH':
                return <MonthBreakdownTab />;
            case 'HISTORY':
                return <HistoryTab />;
            case 'PAYOUT':
                return <PayoutTab step={payoutStep} setStep={setPayoutStep} amount={amount} setAmount={setAmount} onChangeTab={setTab} />;
            case 'SIMULATOR':
                return <SimulatorTab 
                    personal={simPersonal} setPersonal={setSimPersonal}
                    agents={simAgents} setAgents={setSimAgents}
                    agentSales={simAgentSales} setAgentSales={setSimAgentSales}
                    recruits={simRecruits} setRecruits={setSimRecruits}
                />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-3xl font-serif font-bold text-deepblue-900">Earnings & Commissions</h2>
                <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto no-scrollbar max-w-full">
                    {[
                        { id: 'OVERVIEW', label: 'Overview' },
                        { id: 'MONTH', label: 'This Month' },
                        { id: 'HISTORY', label: 'History' },
                        { id: 'PAYOUT', label: 'Request Payout' },
                        { id: 'SIMULATOR', label: 'Calculator' },
                    ].map((t) => (
                        <button 
                            key={t.id}
                            onClick={() => setTab(t.id as any)} 
                            className={`px-4 py-2 rounded-md text-xs font-bold transition-all whitespace-nowrap ${tab === t.id ? 'bg-white text-deepblue-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {renderContent()}
        </div>
    );
};

// --- TAB COMPONENTS ---

const OverviewTab = ({ onChangeTab }: { onChangeTab: (t: any) => void }) => {
    const { formatAED, formatUSDT, convertToAED } = useCurrency();

    // Chart Data Points (INR)
    const chartData = [
        { name: 'Sep', value: 290000 },
        { name: 'Oct', value: 310000 },
        { name: 'Nov', value: 345000 },
        { name: 'Dec', value: 380000 },
        { name: 'Jan', value: 420000 },
        { name: 'Feb', value: 482275 },
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
                    <p className="text-xs text-gray-500 font-bold mb-1">{label}</p>
                    <p className="text-sm font-bold text-gold-600">{formatAED(payload[0].value)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* 1. Top Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 {/* Card 1: Lifetime */}
                <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign size={64} /></div>
                    <p className="text-[10px] text-white/80 uppercase font-bold tracking-widest mb-1">Lifetime Earnings</p>
                    <h3 className="text-2xl lg:text-3xl font-bold mb-1">{formatAED(1245780)}</h3>
                    <p className="text-[10px] opacity-80 font-mono">≈ {formatUSDT(1245780)}</p>
                    <button onClick={() => onChangeTab('HISTORY')} className="mt-4 text-[10px] font-bold text-white hover:underline flex items-center gap-1 transition-colors">View History <ArrowRight size={10} /></button>
                </div>

                {/* Card 2: This Month */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm group hover:border-green-300 transition-colors">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">This Month Earnings</p>
                    <h3 className="text-2xl lg:text-3xl font-bold text-green-600 mb-1">{formatAED(482275)}</h3>
                    <p className="text-[10px] text-gray-400 font-mono">≈ {formatUSDT(482275)}</p>
                    <button onClick={() => onChangeTab('MONTH')} className="mt-4 text-[10px] font-bold text-green-700 hover:text-green-900 flex items-center gap-1 transition-colors">View Details <ArrowRight size={10} /></button>
                </div>

                {/* Card 3: Available Balance */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm group hover:border-gold-300 transition-colors">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Available Balance</p>
                    <h3 className="text-2xl lg:text-3xl font-bold text-deepblue-900 mb-1">{formatAED(434047)}</h3>
                    <p className="text-[10px] text-gray-400 font-mono">≈ {formatUSDT(434047)}</p>
                    <button onClick={() => onChangeTab('PAYOUT')} className="mt-4 text-[10px] font-bold text-gold-600 hover:text-gold-800 flex items-center gap-1 transition-colors">Withdraw <ArrowRight size={10} /></button>
                </div>

                {/* Card 4: Last Payout */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">Last Payout</p>
                    <h3 className="text-xl font-bold text-gray-700">Jan 31</h3>
                    <p className="text-lg font-bold text-green-600 mt-1">3,733 USDT</p>
                     <button onClick={() => onChangeTab('HISTORY')} className="mt-2 text-[10px] text-gray-400 hover:text-deepblue-900 underline">View</button>
                </div>
            </div>

            {/* 2. Chart Section */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm relative">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-bold text-deepblue-900 text-lg flex items-center gap-2"><TrendingUp size={18} className="text-gold-500" /> Earnings Trend (AED)</h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Last 6 Months Performance</p>
                    </div>
                    <div className="text-green-600 text-xs font-bold flex items-center gap-1">
                        <TrendingUp size={12} /> Growth: +45%
                    </div>
                </div>
                
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#C5A028" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#C5A028" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 600}} 
                                dy={10} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#E5E7EB', fontSize: 10, fontWeight: 600}} 
                                tickFormatter={(val) => `AED ${(val/25000).toFixed(1)}k`} // Approx conversion for axis label
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#C5A028', strokeWidth: 1, strokeDasharray: '3 3' }} />
                            <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#E8C96A" 
                                strokeWidth={3} 
                                fill="url(#colorValue)" 
                                activeDot={{ r: 6, stroke: '#C5A028', strokeWidth: 2, fill: 'white' }}
                                dot={{ r: 4, stroke: '#E8C96A', strokeWidth: 2, fill: 'white' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 3. Breakdown & Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Breakdown Table */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-deepblue-900 text-lg mb-6 flex items-center gap-2">
                        <DollarSign size={20} className="text-green-500" /> Commission Breakdown (Lifetime)
                    </h3>
                    
                    <div className="space-y-6">
                        {/* Row 1 */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-gray-700">Unilevel (L1-L5)</span>
                                <span className="text-sm font-bold text-deepblue-900">{formatAED(945230)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-deepblue-900 h-full rounded-full" style={{ width: '76%' }}></div>
                                </div>
                                <span className="text-xs font-bold text-gray-600 min-w-[3ch]">76%</span>
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-gray-700">Infinity Bonus</span>
                                <span className="text-sm font-bold text-deepblue-900">{formatAED(255550)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-deepblue-900/60 h-full rounded-full" style={{ width: '21%' }}></div>
                                </div>
                                <span className="text-xs font-bold text-gray-600 min-w-[3ch]">21%</span>
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-gray-700">Leaderboard Bonus</span>
                                <span className="text-sm font-bold text-deepblue-900">{formatAED(45000)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-deepblue-900/30 h-full rounded-full" style={{ width: '4%' }}></div>
                                </div>
                                <span className="text-xs font-bold text-gray-600 min-w-[3ch]">4%</span>
                            </div>
                        </div>

                        <div className="pt-4 mt-2 border-t border-gray-100 flex justify-between items-center">
                             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Earned</span>
                             <span className="text-lg font-bold text-deepblue-900">{formatAED(1245780)}</span>
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                    <h3 className="font-bold text-deepblue-900 text-lg mb-6 flex items-center gap-2">
                        <CheckCircle size={20} className="text-blue-500" /> Performance Metrics
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Average Monthly Earnings</span>
                            <span className="text-lg font-bold text-gray-800">{formatAED(124578)}</span>
                        </div>
                        <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Best Month</span>
                            <span className="text-lg font-bold text-gray-800">{formatAED(342650)} <span className="text-[10px] text-green-600 font-normal">(Dec 2025)</span></span>
                        </div>
                        <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Total Withdrawals</span>
                            <span className="text-lg font-bold text-gray-800">{formatAED(811733)} <span className="text-[10px] text-gray-500 font-normal">(9,760 USDT)</span></span>
                        </div>
                        <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Current Available Balance</span>
                            <span className="text-lg font-bold text-gold-600">{formatAED(434047)} <span className="text-[10px] text-gold-600/70 font-normal">({formatUSDT(434047)})</span></span>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Active Income Sources:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> 47 active client EMIs</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> 43 agent network commissions</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Level 1-5 unilevel coverage</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Rank 3 infinity bonus</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

const MonthBreakdownTab = () => {
    const { formatAED, formatUSDT } = useCurrency();
    return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-deepblue-900 text-lg">💰 FEBRUARY 2026 COMMISSION BREAKDOWN</h3>
            </div>
            
            <div className="p-6 space-y-8">
                {/* 1. UNILEVEL */}
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-blue-800 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded w-fit">1. Unilevel Commissions (15%)</h4>
                    
                    {/* Level 1 */}
                    <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-deepblue-900 text-lg">LEVEL 1 (Direct - 8%)</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-bold text-gray-700 mb-1">Booking Commissions:</p>
                                <p className="text-xs text-gray-500 mb-2">3 new clients × {formatAED(20200)} avg = <span className="font-bold text-gray-900">{formatAED(60600)}</span></p>
                                <ul className="text-xs text-gray-500 space-y-1 pl-4 border-l-2 border-gray-100">
                                    <li>• Amit Sharma (A-105): {formatAED(20200)}</li>
                                    <li>• Priya Reddy (B-203): {formatAED(20200)}</li>
                                    <li>• John Doe (C-045): {formatAED(20200)}</li>
                                </ul>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-700 mb-1">Monthly Salary (EMIs):</p>
                                <p className="text-xs text-gray-500">47 active clients × {formatAED(3030)} = <span className="font-bold text-gray-900">{formatAED(142410)}</span></p>
                            </div>
                            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                                <span className="text-sm text-gray-500">Level 1 Total</span>
                                <span className="font-bold text-blue-600 text-lg">{formatAED(203010)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Level 2 */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-gray-700">LEVEL 2 (Team - 3%)</span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Booking: 2 sales × {formatAED(7575)}</span>
                                <span>{formatAED(15150)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Monthly: 28 clients × {formatAED(1136)}</span>
                                <span>{formatAED(31808)}</span>
                            </div>
                            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
                                <span>Level 2 Total</span>
                                <span>{formatAED(46958)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Levels 3-5 Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Level 3 (2%)</p>
                            <div className="space-y-1 text-xs text-gray-600">
                                <p>Booking: {formatAED(5050)}</p>
                                <p>Monthly: {formatAED(11355)}</p>
                            </div>
                            <p className="mt-2 font-bold text-gray-900 text-sm">{formatAED(16405)}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Level 4 (1%)</p>
                            <div className="space-y-1 text-xs text-gray-600">
                                <p>Monthly: {formatAED(2268)}</p>
                            </div>
                            <p className="mt-2 font-bold text-gray-900 text-sm">{formatAED(2268)}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Level 5 (1%)</p>
                            <div className="space-y-1 text-xs text-gray-600">
                                <p>Monthly: {formatAED(756)}</p>
                            </div>
                            <p className="mt-2 font-bold text-gray-900 text-sm">{formatAED(756)}</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex justify-between items-center">
                        <span className="font-bold text-blue-800">UNILEVEL TOTAL</span>
                        <span className="font-bold text-blue-900 text-xl">{formatAED(269397)}</span>
                    </div>
                </div>

                <div className="border-t border-dashed border-gray-300"></div>

                {/* 2. INFINITY */}
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-purple-800 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded w-fit">2. Infinity Bonus (+2% - Rank 3)</h4>
                    
                    <div className="bg-white border border-purple-100 rounded-xl p-5 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Your Rank</p>
                                <p className="font-bold text-deepblue-900">Area Manager (Rank 3)</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Infinity Rate</p>
                                <p className="font-bold text-purple-600">2%</p>
                            </div>
                        </div>
                        
                        <div className="bg-purple-50 rounded-lg p-4 mb-4">
                            <p className="text-xs font-bold text-purple-800 uppercase mb-2">Open Volume This Month</p>
                            <p className="text-sm text-gray-700 mb-2">18 plots from agents ranked below you</p>
                            
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Calculation:</span>
                                    <span className="font-bold">{formatAED(90900)}</span>
                                </div>
                                <div className="text-xs text-gray-500 pl-4">18 plots × {formatAED(5050)} (2% of Base)</div>
                                
                                <div className="flex justify-between pt-1">
                                    <span className="text-gray-600">Monthly Infinity from EMIs:</span>
                                    <span className="font-bold">{formatAED(13626)}</span>
                                </div>
                                <div className="text-xs text-gray-500 pl-4">18 active clients × {formatAED(757)}</div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-purple-900">INFINITY TOTAL</span>
                            <span className="font-bold text-purple-900 text-lg">{formatAED(104526)}</span>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-3">
                            <Lightbulb size={24} className="text-yellow-600" />
                            <div className="text-xs text-yellow-800">
                                <strong>Upgrade to Rank 4 to earn 3% instead of 2%!</strong>
                                <br />
                                Potential increase: +{formatAED(52263)}/month
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-dashed border-gray-300"></div>

                {/* 3. LEADERBOARD */}
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gold-700 uppercase tracking-widest bg-gold-50 px-3 py-1 rounded w-fit">3. Champions Leaderboard (1%)</h4>
                    
                    <div className="bg-white border border-gold-200 rounded-xl p-5 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Your Position</p>
                                <p className="font-bold text-deepblue-900">#7 (47 team plots)</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase font-bold">Earnings</p>
                                <p className="font-bold text-gray-400">{formatAED(0)} (Not in Top 5)</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Total Company Collection</span>
                                <span className="font-bold text-gray-900">{formatAED(45000000)}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Leaderboard Pool (1%)</span>
                                <span className="font-bold text-gold-600">{formatAED(450000)}</span>
                            </div>
                        </div>

                        <div className="border-l-4 border-red-400 pl-4 py-1">
                            <p className="text-xs font-bold text-red-500 uppercase">To Enter Top 5</p>
                            <p className="text-sm text-gray-700">Position #5: 52 plots vs Your team: 47 plots</p>
                            <p className="text-sm font-bold text-red-600 mt-1">Gap: Need 6 more plots</p>
                            <p className="text-xs text-gray-500">Potential earnings: {formatAED(22500)} (5% of pool)</p>
                        </div>
                        
                        <div className="mt-4 text-center">
                            <button className="text-xs font-bold text-blue-600 hover:underline">View Full Leaderboard</button>
                        </div>
                    </div>
                </div>

                <div className="border-t-4 border-double border-gray-200"></div>

                {/* TOTAL */}
                <div className="bg-deepblue-900 text-white rounded-xl p-6 shadow-xl">
                    <h3 className="font-serif font-bold text-xl mb-4">TOTAL EARNINGS FEBRUARY 2026</h3>
                    
                    <div className="space-y-2 mb-4 text-sm opacity-90">
                        <div className="flex justify-between">
                            <span>Gross Earnings</span>
                            <span>{formatAED(373923)}</span>
                        </div>
                        <div className="flex justify-between text-red-300">
                            <span>TDS Deducted (10%)</span>
                            <span>- {formatAED(37392)}</span>
                        </div>
                    </div>
                    
                    <div className="border-t border-white/20 pt-4 mb-4">
                        <div className="flex justify-between items-end">
                            <span className="text-gold-400 font-bold uppercase tracking-wider text-sm">NET PAYABLE</span>
                            <div className="text-right">
                                <span className="block text-3xl font-bold">{formatAED(336531)}</span>
                                <span className="block text-sm font-mono text-green-400">≈ {formatUSDT(336531)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-xs opacity-60 mb-6">
                        <span>Status: Available for Withdrawal</span>
                        <span>Date: End of Feb 2026</span>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" fullWidth className="!border-white/30 !text-white hover:!bg-white hover:!text-deepblue-900">
                            <Download size={16} className="mr-2" /> Statement
                        </Button>
                        <Button fullWidth className="!bg-gold-500 !text-deepblue-900 hover:!bg-gold-400">
                            <Wallet size={16} className="mr-2" /> Request Payout
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

const HistoryTab = () => {
    const { formatAED, formatUSDT } = useCurrency();
    return (
    <div className="space-y-6 animate-fade-in-up">
        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
            
            {/* Header & Filters */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="font-bold text-deepblue-900 flex items-center gap-2 text-lg">
                    <CreditCard size={20} className="text-gold-500"/> USDT Payout History
                </h3>
                <div className="flex flex-wrap gap-2">
                    <select className="px-3 py-1.5 border border-gray-300 rounded text-xs bg-white font-medium text-gray-600 focus:outline-none focus:border-gold-500">
                        <option>All Time</option>
                        <option>2026</option>
                        <option>2025</option>
                    </select>
                    <select className="px-3 py-1.5 border border-gray-300 rounded text-xs bg-white font-medium text-gray-600 focus:outline-none focus:border-gold-500">
                        <option>Network: All</option>
                        <option>TRC-20</option>
                        <option>ERC-20</option>
                    </select>
                    <select className="px-3 py-1.5 border border-gray-300 rounded text-xs bg-white font-medium text-gray-600 focus:outline-none focus:border-gold-500">
                        <option>Status: All</option>
                        <option>Completed</option>
                        <option>Pending</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white text-gray-500 font-bold border-b border-gray-200 uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4 bg-gray-50/50 sticky left-0 z-10">Request ID</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Amount (AED)</th>
                            <th className="px-6 py-4">USDT</th>
                            <th className="px-6 py-4">Network</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">TxHash</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {MOCK_PAYOUTS.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50/80 transition-colors group">
                                <td className="px-6 py-4 font-bold text-deepblue-900 bg-white group-hover:bg-gray-50/80 sticky left-0 border-r border-gray-100 font-mono text-xs">{row.id}</td>
                                <td className="px-6 py-4 text-gray-600">{row.date}</td>
                                <td className="px-6 py-4 font-bold text-gray-900">{formatAED(row.amountInr)}</td>
                                <td className="px-6 py-4 font-medium text-gray-700">{row.usdt.toLocaleString()} USDT</td>
                                <td className="px-6 py-4 text-xs text-gray-500">{row.network}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${row.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {row.status === 'Completed' ? <CheckCircle size={10} /> : <Clock size={10} />}
                                        {row.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {row.hash ? <button className="text-blue-600 hover:underline text-xs font-mono">{row.hash.substring(0,6)}... [View]</button> : <span className="text-gray-300">-</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                <span className="text-xs text-gray-500">Showing 1-6 of 14 payouts</span>
                <div className="flex gap-2">
                    <button className="px-2 py-1 border rounded bg-white text-gray-400 text-xs" disabled>&lt;</button>
                    <button className="px-2 py-1 border rounded bg-white text-gray-600 hover:text-deepblue-900 text-xs">1</button>
                    <button className="px-2 py-1 border rounded bg-white text-gray-600 hover:text-deepblue-900 text-xs">2</button>
                    <button className="px-2 py-1 border rounded bg-white text-gray-600 hover:text-deepblue-900 text-xs">&gt;</button>
                </div>
            </div>
        </div>

        {/* Footer Summary */}
        <div className="flex justify-between items-center text-xs text-gray-500 px-2">
            <span>Total Withdrawn: <strong>{formatAED(1245780)}</strong> (14,986 USDT)</span>
            <button className="flex items-center gap-1 hover:text-deepblue-900 font-bold"><Download size={12}/> Download Payout Statement</button>
        </div>
    </div>
    );
};

const PayoutTab = ({ step, setStep, amount, setAmount, onChangeTab }: any) => {
    const { formatAED, formatUSDT, convertToAED, rates } = useCurrency();
    // amount in INR from state
    
    // Derived values
    const amountAED = convertToAED(amount);
    const amountUSDT = amountAED * rates.aedToUsdt; 

    return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
        {step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-deepblue-900 flex items-center gap-2"><Wallet className="text-gold-500" /> REQUEST COMMISSION PAYOUT</h3>
                </div>
                
                <div className="p-8 space-y-8">
                    {/* Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center text-xs text-yellow-800 font-medium flex items-center justify-center gap-2">
                        <AlertTriangle size={14} /> IMPORTANT: All payouts are in USDT only
                    </div>

                    {/* Balance Card */}
                    <div className="bg-deepblue-900 rounded-xl p-6 text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign size={80} /></div>
                        <p className="text-xs text-gold-400 font-bold uppercase tracking-widest mb-2">Available Balance</p>
                        <h2 className="text-4xl font-bold mb-2">{formatAED(434047)} <span className="text-lg font-normal text-gray-400">AED</span></h2>
                        <p className="text-xl text-green-400 font-mono mb-4">≈ {formatUSDT(434047)}</p>
                        
                        <div className="inline-flex flex-col gap-1 text-[10px] text-gray-400 bg-black/20 p-2 rounded-lg">
                            <span>Live rate: $0.9998 / USDT</span>
                            <span>1 AED = {rates.aedToUsdt} USDT</span>
                        </div>
                        <button className="mt-4 text-[10px] text-gold-400 hover:text-white flex items-center justify-center gap-1 mx-auto"><RefreshCw size={10} /> Refresh Rate</button>
                    </div>

                    <div className="flex justify-between text-xs text-gray-500 px-2">
                        <span>Minimum Withdrawal: {formatAED(5000)} (≈ 60 USDT)</span>
                        <span>Processing Time: Within 24 hours</span>
                    </div>

                    {/* Step 1 */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">STEP 1: WITHDRAWAL AMOUNT (INR source)</h4>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                            <input 
                                type="number" 
                                value={amount} 
                                onChange={(e) => setAmount(Number(e.target.value))} 
                                className="w-full pl-8 pr-20 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none font-mono font-bold text-lg" 
                            />
                            <button className="absolute right-2 top-2 bg-gray-100 hover:bg-gray-200 text-xs font-bold px-3 py-1.5 rounded text-gray-600" onClick={() => setAmount(434047)}>Max</button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-right">Equivalent to: <span className="font-bold text-deepblue-900">{formatAED(amount)}</span></p>
                        <p className="text-xs text-gray-500 mt-1 text-right">You will receive: <span className="font-bold text-green-600">≈ {amountUSDT.toFixed(2)} USDT</span> (before fees)</p>
                        
                        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
                            <button onClick={() => setAmount(100000)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs hover:bg-gray-50">₹1,00,000</button>
                            <button onClick={() => setAmount(200000)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs hover:bg-gray-50">₹2,00,000</button>
                            <button onClick={() => setAmount(300000)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs hover:bg-gray-50">₹3,00,000</button>
                            <button onClick={() => setAmount(434047)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs hover:bg-gray-50 text-gold-600 font-bold border-gold-200">All Available</button>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">STEP 2: SELECT PAYOUT WALLET</h4>
                        <div className="space-y-3">
                            <label className="flex items-start gap-3 p-4 border-2 border-gold-500 bg-gold-50/20 rounded-xl cursor-pointer relative">
                                <input type="radio" name="wallet" defaultChecked className="mt-1 accent-gold-500 w-4 h-4" />
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-deepblue-900 text-sm">TRC-20 Wallet (TRON)</span>
                                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">RECOMMENDED <Sparkles size={10} className="inline" /></span>
                                    </div>
                                    <p className="text-xs text-gray-500 font-mono mt-1 break-all">TYuX8vK3zN9L4mP2qR7sT1vW3xY4zA5bC6</p>
                                    <div className="flex gap-4 mt-2 text-[10px] text-gray-500">
                                        <span>Network Fee: ~$1 (1 USDT)</span>
                                        <span className="font-bold text-green-600">You'll receive: {(amountUSDT - 1).toFixed(2)} USDT</span>
                                    </div>
                                    <span className="text-[10px] text-green-600 font-bold mt-1 flex items-center gap-1"><CheckCircle size={10} /> Verified</span>
                                </div>
                            </label>

                            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                                <input type="radio" name="wallet" className="mt-1 accent-gray-400 w-4 h-4" />
                                <div className="flex-1">
                                    <span className="font-bold text-gray-700 text-sm">ERC-20 Wallet (Ethereum)</span>
                                    <p className="text-xs text-gray-400 font-mono mt-1 break-all">0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2</p>
                                    <div className="flex gap-4 mt-2 text-[10px] text-gray-400">
                                        <span>Network Fee: ~$10 (10 USDT)</span>
                                        <span>You'll receive: {(amountUSDT - 10).toFixed(2)} USDT</span>
                                    </div>
                                    <span className="text-[10px] text-green-600 font-bold mt-1 flex items-center gap-1"><CheckCircle size={10} /> Verified</span>
                                </div>
                            </label>

                            <button className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-xs text-gray-500 hover:border-gold-300 hover:text-gold-600 transition flex items-center justify-center gap-1">
                                <Plus size={14} /> Add BEP-20 Wallet
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 text-center flex items-center justify-center gap-1"><Lightbulb size={10} /> TRC-20 recommended: Lowest fees, fastest delivery</p>
                    </div>

                    {/* Step 3 */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">STEP 3: PAYMENT BREAKDOWN</h4>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Withdrawal Amount (AED)</span>
                                <span className="font-bold text-gray-900">{formatAED(amount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">USDT Amount</span>
                                <span className="text-gray-900">{amountUSDT.toFixed(2)} USDT</span>
                            </div>
                            <div className="flex justify-between text-red-500">
                                <span className="text-red-500">Network Fee (TRC-20)</span>
                                <span>-1.00 USDT</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-bold text-deepblue-900">
                                <span>FINAL AMOUNT YOU RECEIVE</span>
                                <span>{(amountUSDT - 1).toFixed(2)} USDT</span>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
                            <p><strong>📍 Receiving Address:</strong> TYuX8vK3zN9L4mP2qR7sT1vW3xY4zA5bC6</p>
                            <p className="mt-1 opacity-80 flex items-center gap-1"><Lightbulb size={10} /> Funds typically arrive within 15-30 minutes after admin approval.</p>
                        </div>
                    </div>

                    {/* Confirmation */}
                    <div className="space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" className="mt-1 w-4 h-4 accent-deepblue-900" />
                            <div className="text-xs text-gray-600">
                                <strong>I confirm that:</strong>
                                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                                    <li>My wallet address is correct</li>
                                    <li>I've selected the correct network (TRC-20)</li>
                                    <li>I understand this transaction is irreversible</li>
                                    <li>I've read the payout terms & conditions</li>
                                </ul>
                            </div>
                        </label>
                        <button className="text-xs text-blue-600 underline pl-7">View Payout Terms</button>
                    </div>

                    <div className="pt-2 flex gap-4">
                        <Button variant="outline" onClick={() => setAmount(434047)} className="flex-1">Cancel</Button>
                        <Button fullWidth onClick={() => setStep(2)} className="flex-[2] !py-4 shadow-xl shadow-gold-500/20">Request Payout →</Button>
                    </div>
                </div>
            </div>
        )}

        {step === 2 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm text-center animate-fade-in-up max-w-xl mx-auto overflow-hidden">
                <div className="bg-green-50 p-8 border-b border-green-100">
                    <div className="w-20 h-20 bg-white text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-green-200">
                        <CheckCircle size={40} />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-deepblue-900">Payout Request Submitted!</h3>
                    <p className="text-sm text-gray-500 mt-2">Your USDT payout request is being processed</p>
                </div>
                
                <div className="p-8 text-left space-y-6">
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-3 text-sm shadow-inner">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Request ID</span>
                            <span className="font-mono font-bold text-deepblue-900">PAY-2026-00234</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Amount (AED)</span>
                            <span className="font-bold text-gray-900">{formatAED(amount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Amount (USDT)</span>
                            <span className="font-bold text-green-600">{(amountUSDT - 1).toFixed(2)} USDT</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Network</span>
                            <span className="font-bold text-gray-900">TRC-20 (TRON)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Wallet Address</span>
                            <span className="font-mono text-xs text-gray-600 bg-white px-1 rounded border border-gray-200">TYuX8vK...zA5bC6</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Requested</span>
                            <span className="text-gray-900">{new Date().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Status</span>
                            <span className="font-bold text-yellow-600 flex items-center gap-1"><Clock size={12} /> Pending Admin Approval</span>
                        </div>
                    </div>

                    <div className="text-center text-xs text-gray-500">
                        <p className="font-bold mb-2 flex items-center justify-center gap-1"><Clock size={12} /> Processing Time: Within 24 hours</p>
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-left space-y-2">
                            <p className="font-bold text-blue-800 border-b border-blue-200 pb-1 mb-2">WHAT HAPPENS NEXT:</p>
                            <p>1. Admin reviews your request (usually within 6 hours)</p>
                            <p>2. USDT is sent to your wallet</p>
                            <p>3. You receive email + SMS with transaction hash</p>
                            <p>4. Funds arrive in your wallet (15-30 minutes)</p>
                        </div>
                        <p className="mt-4 flex items-center justify-center gap-1"><FileText size={12} /> Confirmation email sent to rajesh@champion20.com</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex gap-3">
                            <Button variant="outline" fullWidth onClick={() => { setStep(1); onChangeTab('HISTORY'); }}>View Payout History</Button>
                            <Button fullWidth onClick={() => setStep(1)}>Request Another</Button>
                        </div>
                        <button onClick={() => { setStep(1); onChangeTab('OVERVIEW'); }} className="text-xs text-gray-400 hover:text-gray-600 underline">Back to Earnings</button>
                    </div>
                </div>
            </div>
        )}
    </div>
    );
};

const SimulatorTab = ({ personal, setPersonal, agents, setAgents, agentSales, setAgentSales, recruits, setRecruits }: any) => {
    const { formatAED, formatUSDT } = useCurrency();
    
    // Logic based on prompt description (using INR for base calc then converting)
    const l1Comm = (agents * agentSales * 20200) + (agents * agentSales * 3030); 
    
    const bookingAmount = 2520000 * 0.10; // 2.52L
    const l1Rate = 20200; // Approx 8%
    const l2Rate = 7575;  // Approx 3%
    const l3Rate = 5050;  // Approx 2%
    const infRate = 5050; // Rank 3 - 2%

    const l1Sales = agents * agentSales;
    const l1Total = (l1Sales * l1Rate) + (l1Sales * 3030); // Sales + Monthly

    const l2Agents = agents * recruits;
    const l2Sales = l2Agents * agentSales;
    const l2Total = l2Sales * l2Rate; 

    const l3Agents = l2Agents * recruits;
    const l3Sales = l3Agents * agentSales;
    const l3Total = l3Sales * l3Rate;

    const totalVolume = l1Sales + l2Sales + l3Sales;
    const infinityTotal = totalVolume * infRate;

    const total = l1Total + l2Total + l3Total + infinityTotal;
    const rank4Total = total + (totalVolume * (7575 - 5050)); 

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="p-6 bg-deepblue-900 text-white flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Calculator size={20} className="text-gold-500" /> EARNINGS CALCULATOR</h3>
                    <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1"><RotateCcw size={12} /> Reset Calculator</button>
                </div>
                
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Inputs */}
                    <div className="space-y-8">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200 pb-2">YOUR INPUTS</h4>
                        
                        <div>
                            <label className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                                I personally sell:
                                <span className="text-gold-600 bg-gold-50 px-2 py-0.5 rounded">{personal} plots/mo</span>
                            </label>
                            <input type="range" min="0" max="20" value={personal} onChange={(e) => setPersonal(Number(e.target.value))} className="w-full accent-gold-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        </div>

                        <div>
                            <label className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                                Each of my <span className="text-blue-600">{agents}</span> direct agents sells:
                                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{agentSales} plots</span>
                            </label>
                            <input type="range" min="0" max="10" value={agentSales} onChange={(e) => setAgentSales(Number(e.target.value))} className="w-full accent-blue-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        </div>

                        <div>
                            <label className="flex justify-between text-sm font-bold text-gray-700 mb-2">
                                Each of my agents recruits:
                                <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded">{recruits} new agents</span>
                            </label>
                            <input type="range" min="0" max="5" value={recruits} onChange={(e) => setRecruits(Number(e.target.value))} className="w-full accent-purple-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-500">
                            <p><strong>Note:</strong> This simulation assumes standard unilevel structure depth and consistent performance across tiers.</p>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="bg-gray-50 rounded-xl p-0 border border-gray-200 flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-white">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">PROJECTED MONTHLY EARNINGS</h4>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <div className="flex justify-between font-bold text-gray-900">
                                        <span>Level 1 Direct Commission:</span>
                                        <span>{formatAED(l1Total)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">({agents} agents × {agentSales} sales)</p>
                                </div>
                                <div>
                                    <div className="flex justify-between font-bold text-gray-900">
                                        <span>Level 2 Team Commission:</span>
                                        <span>{formatAED(l2Total)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">({l2Agents} agents × {agentSales} sales)</p>
                                </div>
                                <div>
                                    <div className="flex justify-between font-bold text-gray-900">
                                        <span>Level 3 Network:</span>
                                        <span>{formatAED(l3Total)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">({l3Agents} agents × {agentSales} sales)</p>
                                </div>
                                <div className="pt-2 border-t border-dashed border-gray-300">
                                    <div className="flex justify-between font-bold text-purple-700">
                                        <span>Infinity Bonus (Rank 3 - 2%):</span>
                                        <span>{formatAED(infinityTotal)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">({totalVolume} open volume plots)</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-deepblue-900 text-white text-center">
                            <p className="text-xs text-gold-400 uppercase font-bold tracking-widest mb-1">TOTAL PROJECTED</p>
                            <h3 className="text-3xl font-serif font-bold text-white mb-1">{formatAED(total)} <span className="text-sm font-sans font-normal opacity-70">/ month</span></h3>
                            <p className="text-sm text-green-400 font-mono">≈ {formatUSDT(total)}</p>
                        </div>

                        <div className="p-4 bg-gold-50 border-t border-gold-200">
                            <div className="flex items-center gap-3">
                                <Lightbulb size={24} className="text-gold-600" />
                                <div className="text-xs text-gold-800">
                                    <span className="font-bold">If you achieve Rank 4 (3% Infinity):</span><br/>
                                    Projected: {formatAED(rank4Total)}/mo (+{formatAED(rank4Total-total)})
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
