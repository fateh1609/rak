
import React from 'react';
import { AdminSection } from './Dashboard';

interface AdminHomeProps {
    onViewChange: (view: AdminSection) => void;
}

export const AdminHome: React.FC<AdminHomeProps> = ({ onViewChange }) => {
    return (
        <div className="font-mono text-sm text-black bg-white min-h-screen space-y-4 p-1">
            
            {/* 1. HEADER */}
            <div className="bg-white border border-black p-2 flex flex-col md:flex-row justify-between items-center shadow-none">
                <div className="font-bold text-lg tracking-tight text-black">RAK OASIS ADMIN</div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600">System Status:</span>
                        <span className="text-green-700 font-bold flex items-center gap-1">● ONLINE</span>
                    </div>
                    <div className="text-black">Admin: <span className="font-bold">John</span></div>
                </div>
            </div>
            <div className="flex justify-between px-1 text-xs text-gray-600">
                <span>Last Data Refresh: 2 sec ago</span>
                <span>Feb 02, 2026 14:35:22 GMT</span>
            </div>

            {/* 2. METRICS */}
            <div className="bg-white border border-black p-0">
                <div className="bg-black text-white px-2 py-1 font-bold text-xs uppercase">SYSTEM METRICS - REAL TIME</div>
                <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-black text-center border-t border-black">
                    <MetricBox label="REVENUE" value="₹45,234,890" sub="+₹892,340 TODAY" />
                    <MetricBox label="CLIENTS" value="1,234 ACTIVE" sub="12 NEW TODAY" />
                    <MetricBox label="AGENTS" value="287 ACTIVE" sub="5 NEW TODAY" />
                    <MetricBox label="PLOTS" value="856/2000 SOLD" sub="67 THIS MONTH" />
                    <MetricBox label="UPTIME" value="99.8%" sub="47D 3H" />
                </div>
            </div>

            {/* 3. FINANCIAL & ALERTS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                {/* FINANCIAL OVERVIEW */}
                <div className="bg-white border border-black flex flex-col">
                    <div className="bg-gray-200 border-b border-black px-2 py-1 font-bold text-xs flex justify-between text-black">
                        <span>FINANCIAL OVERVIEW - FEBRUARY 2026</span>
                        <span className="text-blue-700 cursor-pointer hover:underline">[EXPORT]</span>
                    </div>
                    <div className="p-3 text-xs leading-relaxed overflow-auto flex-1 text-black">
                        <div className="mb-4">
                            <div className="font-bold border-b border-gray-300 mb-1 text-black">COLLECTIONS:</div>
                            <div className="flex justify-between"><span>├─ Booking Payments:</span> <span>₹1,20,00,000 (12 txns)</span></div>
                            <div className="flex justify-between"><span>├─ EMI Payments:</span> <span>₹3,30,00,000 (1,198 txns)</span></div>
                            <div className="flex justify-between font-bold bg-gray-50 text-black"><span>└─ TOTAL COLLECTED:</span> <span>₹4,50,00,000</span></div>
                        </div>

                        <div className="mb-4">
                            <div className="font-bold border-b border-gray-300 mb-1 text-black">COMMISSIONS (10%):</div>
                            <div className="flex justify-between"><span>├─ Unilevel (5 lvls):</span> <span>₹33,75,000 (75%)</span></div>
                            <div className="flex justify-between"><span>├─ Infinity Bonus:</span> <span>₹9,00,000 (20%)</span></div>
                            <div className="flex justify-between"><span>├─ Leaderboard:</span> <span>₹2,25,000 (5%)</span></div>
                            <div className="flex justify-between font-bold text-black"><span>├─ GROSS COMM:</span> <span>₹45,00,000</span></div>
                            <div className="flex justify-between text-red-600"><span>├─ TDS (10%):</span> <span>-₹4,50,000</span></div>
                            <div className="flex justify-between font-bold bg-gray-50 text-black"><span>└─ NET PAYABLE:</span> <span>₹40,50,000</span></div>
                        </div>

                        <div>
                            <div className="font-bold border-b border-gray-300 mb-1 text-black">USDT PAYOUTS:</div>
                            <div className="flex justify-between"><span>├─ TRC-20:</span> <span>₹35.2L (423k USDT)</span></div>
                            <div className="flex justify-between font-bold bg-green-50 text-green-800"><span>└─ NET PROFIT:</span> <span>₹4,04,50,000 (89.9%)</span></div>
                        </div>
                    </div>
                </div>

                {/* ALERTS */}
                <div className="bg-white border border-black flex flex-col h-full">
                    <div className="bg-gray-200 border-b border-black px-2 py-1 font-bold text-xs flex justify-between text-black">
                        <span>ALERTS & PENDING ACTIONS</span>
                        <span>[SORT: PRIORITY ▼]</span>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-gray-100 border-b border-black text-black">
                                <tr>
                                    <th className="px-2 py-1 w-16">PRI</th>
                                    <th className="px-2 py-1">ITEM</th>
                                    <th className="px-2 py-1 text-right">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-300 text-black">
                                <AlertRow pri="HIGH" item="23 USDT payout requests pending (₹45.6L)" action="PROCESS" onClick={() => onViewChange('PAYOUTS')} />
                                <AlertRow pri="HIGH" item="15 Agent applications awaiting approval" action="REVIEW" onClick={() => onViewChange('AGENTS')} />
                                <AlertRow pri="HIGH" item="7 Failed payments need reconciliation" action="RECONCILE" onClick={() => onViewChange('PAYMENTS')} />
                                <AlertRow pri="HIGH" item="5 USDT wallet verifications pending" action="VERIFY" onClick={() => onViewChange('PAYOUTS')} />
                                <AlertRow pri="MED" item="28 Support tickets open (avg 4.5h)" action="VIEW" onClick={() => onViewChange('SUPPORT')} />
                                <AlertRow pri="MED" item="Commission calculation due (Feb)" action="CALC" onClick={() => onViewChange('COMMISSIONS')} />
                                <AlertRow pri="LOW" item="3 Plots need price update" action="UPDATE" onClick={() => onViewChange('PLOTS')} />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 4. LIVE FEED & SYSTEM STATUS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* FEED */}
                <div className="lg:col-span-2 bg-white border border-black">
                    <div className="bg-gray-200 border-b border-black px-2 py-1 font-bold text-xs flex justify-between text-black">
                        <span>LIVE ACTIVITY FEED</span>
                        <div className="space-x-2"><span className="cursor-pointer hover:underline">[AUTO-REFRESH: ON]</span> <span className="cursor-pointer hover:underline">[PAUSE]</span></div>
                    </div>
                    <div className="p-2 h-48 overflow-y-auto space-y-2 text-xs font-mono bg-white text-black">
                        <LogEntry time="14:35:18" type="NEW_CLIENT" msg="Rahul Verma | Plot B-234 | Agent: AGT-10523" link="VIEW" />
                        <LogEntry time="14:34:52" type="PAYMENT_RECEIVED" msg="₹37,875 | Amit Sharma | EMI-16 | Method: UPI" link="VERIFY" />
                        <LogEntry time="14:33:21" type="PAYOUT_REQUESTED" msg="AGT-10526 | ₹2,50,000 | TRC-20" link="REVIEW" color="text-red-700 font-bold" />
                        <LogEntry time="14:32:45" type="AGENT_APPLICATION" msg="Priya Singh | Sponsor: AGT-10523" link="APPROVE" />
                        <LogEntry time="14:31:08" type="SUPPORT_TICKET" msg="#TKT-891 | Payment Issue | Client" link="ASSIGN" color="text-blue-700" />
                        <LogEntry time="14:29:33" type="LOGIN_FAILED" msg="IP: 103.xxx.xxx.xxx | User: client123" link="BLOCK IP" color="text-red-600 font-bold" />
                    </div>
                </div>

                {/* STATUS */}
                <div className="bg-white border border-black">
                    <div className="bg-gray-200 border-b border-black px-2 py-1 font-bold text-xs text-black">SYSTEM STATUS</div>
                    <div className="p-3 text-xs space-y-3 text-black">
                        <StatusRow label="DATABASE" status="CONNECTED" meta="Size: 2.4GB | Load: 23%" />
                        <StatusRow label="PAYMENT GW" status="OPERATIONAL" meta="Razorpay OK | Uptime: 100%" />
                        <StatusRow label="BLOCKCHAIN" status="SYNCED" meta="TRON: #58234891 | ETH: #19234567" />
                        <StatusRow label="EMAIL SVC" status="ACTIVE" meta="Queue: 3 | Sent: 1,234/d" />
                        <StatusRow label="CRON JOBS" status="RUNNING" meta="Next: 15:00 Comm Calc" />
                    </div>
                </div>
            </div>

            {/* 5. TRANSACTIONS & NETWORK */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                {/* TRANSACTIONS */}
                <div className="bg-white border border-black">
                    <div className="bg-gray-200 border-b border-black px-2 py-1 font-bold text-xs flex justify-between text-black">
                        <span>TODAY'S TRANSACTIONS</span>
                        <span>[VIEW ALL]</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left whitespace-nowrap text-black">
                            <thead className="bg-gray-100 border-b border-black">
                                <tr>
                                    <th className="px-2 py-1">TIME</th>
                                    <th className="px-2 py-1">TYPE</th>
                                    <th className="px-2 py-1">ENTITY</th>
                                    <th className="px-2 py-1 text-right">AMOUNT</th>
                                    <th className="px-2 py-1">STATUS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <TxnRow time="14:34" type="EMI" entity="Amit Sharma" amt="₹37,875" status="VERIFIED" />
                                <TxnRow time="14:28" type="BOOKING" entity="Rahul Verma" amt="₹2,52,500" status="VERIFIED" />
                                <TxnRow time="14:15" type="EMI" entity="Priya Das" amt="₹37,875" status="PENDING" />
                                <TxnRow time="13:45" type="PAYOUT" entity="AGT-10523" amt="₹2,50,000" status="PROCESSED" />
                                <TxnRow time="12:34" type="EMI" entity="Karan Patel" amt="₹37,875" status="FAILED" />
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* NETWORK */}
                <div className="bg-white border border-black">
                    <div className="bg-gray-200 border-b border-black px-2 py-1 font-bold text-xs text-black">NETWORK OVERVIEW</div>
                    <div className="p-3 text-xs space-y-4 text-black">
                        <div>
                            <div className="font-bold mb-1">AGENT DISTRIBUTION:</div>
                            <DistBar rank="Rank 1" count={145} pct={50.5} />
                            <DistBar rank="Rank 2" count={78} pct={27.2} />
                            <DistBar rank="Rank 3" count={45} pct={15.7} />
                            <DistBar rank="Rank 4" count={15} pct={5.2} />
                            <DistBar rank="Rank 5" count={4} pct={1.4} />
                        </div>
                        <div>
                            <div className="font-bold mb-1 border-t border-gray-200 pt-2">TOP 3 AGENTS (VOLUME):</div>
                            <div className="flex justify-between py-1 border-b border-gray-100">
                                <span>1. Vikas Sharma</span> <span>₹3.2Cr (127 plots)</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-100">
                                <span>2. Anita Desai</span> <span>₹2.4Cr (98 plots)</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-100">
                                <span>3. Rahul Mehta</span> <span>₹1.9Cr (76 plots)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. QUICK ACTIONS & LOGS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* QUICK ACTIONS */}
                <div className="bg-white border border-black">
                    <div className="bg-gray-200 border-b border-black px-2 py-1 font-bold text-xs text-black">QUICK ACTIONS</div>
                    <div className="p-3 grid grid-cols-2 gap-2">
                        <ActionButton label="PROCESS PAYOUTS" onClick={() => onViewChange('PAYOUTS')} />
                        <ActionButton label="APPROVE AGENTS" onClick={() => onViewChange('AGENTS')} />
                        <ActionButton label="VERIFY PAYMENTS" onClick={() => onViewChange('PAYMENTS')} />
                        <ActionButton label="CALC COMMISSIONS" onClick={() => onViewChange('COMMISSIONS')} />
                        <ActionButton label="VIEW CLIENTS" onClick={() => onViewChange('CLIENTS')} />
                        <ActionButton label="SUPPORT TICKETS" onClick={() => onViewChange('SUPPORT')} />
                    </div>
                </div>

                {/* ADMIN LOGS */}
                <div className="lg:col-span-2 bg-white border border-black">
                    <div className="bg-gray-200 border-b border-black px-2 py-1 font-bold text-xs flex justify-between text-black">
                        <span>ADMIN ACTIVITY LOG</span>
                        <span>[EXPORT]</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left text-black">
                            <thead className="bg-gray-100 border-b border-black">
                                <tr>
                                    <th className="px-2 py-1">TIME</th>
                                    <th className="px-2 py-1">ADMIN</th>
                                    <th className="px-2 py-1">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr><td className="px-2 py-1">14:30</td><td className="px-2 py-1">john_admin</td><td className="px-2 py-1">PROCESSED_PAYOUT: AGT-10523 | ₹2.5L</td></tr>
                                <tr><td className="px-2 py-1">14:15</td><td className="px-2 py-1">sarah_admin</td><td className="px-2 py-1">APPROVED_AGENT: AGT-10789</td></tr>
                                <tr><td className="px-2 py-1">14:08</td><td className="px-2 py-1">john_admin</td><td className="px-2 py-1">VERIFIED_PAYMENT: Client-1234</td></tr>
                                <tr><td className="px-2 py-1">13:55</td><td className="px-2 py-1">mike_admin</td><td className="px-2 py-1">UPDATED_PLOT: B-234 | Status: Sold</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
};

// --- SUB COMPONENTS ---

const MetricBox = ({ label, value, sub }: any) => (
    <div className="p-3">
        <div className="text-gray-500 font-bold mb-1">{label}</div>
        <div className="text-lg font-bold text-black">{value}</div>
        <div className="text-[10px] text-gray-600">{sub}</div>
    </div>
);

const AlertRow = ({ pri, item, action, onClick }: any) => (
    <tr className="group hover:bg-yellow-50">
        <td className={`px-2 py-1 font-bold ${pri === 'HIGH' ? 'text-red-600' : pri === 'MED' ? 'text-yellow-600' : 'text-gray-500'}`}>{pri}</td>
        <td className="px-2 py-1 text-black">{item}</td>
        <td className="px-2 py-1 text-right">
            <button onClick={onClick} className="text-blue-700 hover:bg-blue-100 px-1 font-bold border border-transparent hover:border-blue-700">[{action}]</button>
        </td>
    </tr>
);

const LogEntry = ({ time, type, msg, link, color }: any) => (
    <div className="flex gap-2 hover:bg-gray-50 p-1">
        <span className="text-gray-500 shrink-0">{time}</span>
        <span className="font-bold text-black shrink-0 w-32">{type}</span>
        <span className={`flex-1 ${color || 'text-gray-800'}`}>{msg}</span>
        {link && <span className="text-blue-700 font-bold cursor-pointer hover:underline">[{link}]</span>}
    </div>
);

const StatusRow = ({ label, status, meta }: any) => (
    <div className="flex justify-between border-b border-gray-100 pb-1 last:border-0">
        <div className="text-black">
            <span className="font-bold w-24 inline-block">{label}:</span>
            <span className="text-green-700 font-bold">● {status}</span>
        </div>
        <span className="text-gray-500">{meta}</span>
    </div>
);

const TxnRow = ({ time, type, entity, amt, status }: any) => (
    <tr className="hover:bg-gray-50 text-black">
        <td className="px-2 py-1">{time}</td>
        <td className="px-2 py-1">{type}</td>
        <td className="px-2 py-1">{entity}</td>
        <td className="px-2 py-1 text-right font-mono">{amt}</td>
        <td className={`px-2 py-1 font-bold ${status === 'VERIFIED' || status === 'PROCESSED' ? 'text-green-700' : status === 'FAILED' ? 'text-red-600' : 'text-yellow-600'}`}>
            {status}
        </td>
    </tr>
);

const DistBar = ({ rank, count, pct }: any) => (
    <div className="flex items-center gap-2 mb-1">
        <span className="w-12 text-gray-600">{rank}</span>
        <div className="flex-1 bg-gray-200 h-3 relative">
            <div className="bg-black h-3 absolute top-0 left-0" style={{ width: `${pct}%` }}></div>
        </div>
        <span className="w-20 text-right text-black">{count} ({pct}%)</span>
    </div>
);

const ActionButton = ({ label, onClick }: any) => (
    <button onClick={onClick} className="border border-black bg-white text-black hover:bg-black hover:text-white py-2 px-1 text-[10px] font-bold transition-colors">
        [{label}]
    </button>
);
