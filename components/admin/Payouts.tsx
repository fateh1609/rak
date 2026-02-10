
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { SectionTitle, IndButton, IndTable } from './Shared';

export const PayoutsView = () => {
    return (
        <div className="space-y-6">
            <SectionTitle 
                title="USDT_PAYOUT_PROCESSING"
                actions={
                    <>
                        <IndButton active>PENDING (23)</IndButton>
                        <IndButton>HISTORY</IndButton>
                        <IndButton>WALLETS</IndButton>
                    </>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-black p-3">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">USDT RATE (INR)</p>
                    <div className="flex justify-between items-end">
                        <p className="text-xl font-bold">₹83.02</p>
                        <button className="text-[10px] font-bold text-blue-600 underline">[UPDATE]</button>
                    </div>
                </div>
                <div className="bg-white border border-black p-3">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">WALLET BALANCE (TRC20)</p>
                    <p className="text-xl font-bold text-green-600">524,567 USDT</p>
                </div>
                <div className="bg-white border border-black p-3">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">PENDING PAYOUTS</p>
                    <p className="text-xl font-bold text-red-600">₹45.6L</p>
                </div>
            </div>

            <IndTable headers={['REQ_ID', 'AGENT', 'REQUESTED', 'AMOUNT_INR', 'USDT', 'NETWORK', 'WALLET', 'ACTION']}>
                {[1, 2, 3, 4, 5].map(i => (
                    <tr key={i} className="hover:bg-gray-50 text-black">
                        <td className="px-3 py-2 font-bold">PAY-230{i}</td>
                        <td className="px-3 py-2">AGT-1052{i}<br/><span className="text-[10px] text-gray-500">Rajesh K.</span></td>
                        <td className="px-3 py-2 text-xs">Jan 28, 11:30</td>
                        <td className="px-3 py-2 font-bold">₹2,50,000</td>
                        <td className="px-3 py-2 font-bold text-green-700">3,011.32</td>
                        <td className="px-3 py-2 text-xs">TRC-20</td>
                        <td className="px-3 py-2">
                            <span className="bg-green-100 text-green-800 text-[10px] px-1 font-bold border border-green-200 flex items-center gap-1 w-fit">
                                VERIFIED <CheckCircle size={8} />
                            </span>
                        </td>
                        <td className="px-3 py-2 text-right">
                            <button className="bg-blue-600 text-white px-3 py-1 text-[10px] font-bold hover:bg-blue-700 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none">
                                [PROCESS]
                            </button>
                        </td>
                    </tr>
                ))}
            </IndTable>
        </div>
    );
};
