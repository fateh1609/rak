
import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { SectionTitle, IndButton } from './Shared';

export const CommissionsView = () => {
    return (
        <div className="space-y-6">
            <SectionTitle 
                title="COMMISSION_CALCULATION"
                actions={
                    <>
                        <IndButton active>CALCULATE</IndButton>
                        <IndButton>HISTORY</IndButton>
                        <IndButton>SETTINGS</IndButton>
                    </>
                }
            />

            <div className="bg-white border border-black p-4 mb-6">
                <div className="flex justify-between items-center border-b border-black pb-2 mb-4">
                    <h3 className="font-bold text-lg">CYCLE: FEBRUARY 2026</h3>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-bold border border-yellow-200 flex items-center gap-1">
                        <Clock size={12} /> READY TO CALCULATE
                    </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs mb-6">
                    <div>
                        <p className="font-bold text-gray-500 mb-1">TOTAL COLLECTIONS</p>
                        <p className="text-xl font-bold">₹4,50,00,000</p>
                        <p className="text-gray-500">1,210 verified payments</p>
                    </div>
                    <div>
                        <p className="font-bold text-gray-500 mb-1">GROSS COMMISSION (10%)</p>
                        <p className="text-xl font-bold">₹45,00,000</p>
                    </div>
                    <div>
                        <p className="font-bold text-gray-500 mb-1">NET PAYABLE (AFTER TDS)</p>
                        <p className="text-xl font-bold text-blue-600">₹40,50,000</p>
                    </div>
                </div>

                <div className="bg-gray-100 border border-black p-3 mb-6 font-mono text-xs">
                    <p className="font-bold mb-2 underline">PREVIEW BREAKDOWN:</p>
                    <div className="flex justify-between py-1"><span>1. UNILEVEL (75%)</span> <span>₹33,75,000</span></div>
                    <div className="flex justify-between py-1 ml-4 text-gray-600"><span>L1 (8%) - 287 agents</span> <span>₹20,25,000</span></div>
                    <div className="flex justify-between py-1 ml-4 text-gray-600"><span>L2-L5 (7%)</span> <span>₹13,50,000</span></div>
                    <div className="flex justify-between py-1"><span>2. INFINITY BONUS (20%)</span> <span>₹9,00,000</span></div>
                    <div className="flex justify-between py-1"><span>3. LEADERBOARD (5%)</span> <span>₹2,25,000</span></div>
                    <div className="flex justify-between py-1 border-t border-gray-400 mt-1 pt-1 font-bold"><span>TOTAL GROSS</span> <span>₹45,00,000</span></div>
                </div>

                <div className="flex gap-4 items-center bg-yellow-50 border border-yellow-200 p-2 mb-4 text-xs">
                    <AlertTriangle size={16} className="text-yellow-600"/>
                    <span className="font-bold text-yellow-800">WARNING: 3 agents close to rank advancement. Manual review recommended.</span>
                </div>

                <button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 text-sm uppercase border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all">
                    [ EXECUTE CALCULATION SCRIPT - FEB 2026 ]
                </button>
            </div>
        </div>
    );
};
