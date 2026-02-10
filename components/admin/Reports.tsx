
import React from 'react';
import { SectionTitle, IndButton } from './Shared';

export const ReportsView = () => {
    return (
        <div className="space-y-6">
            <SectionTitle 
                title="REPORTS_&_ANALYTICS" 
                actions={
                    <>
                        <IndButton active>FINANCIAL</IndButton>
                        <IndButton>SALES</IndButton>
                        <IndButton>NETWORK</IndButton>
                        <IndButton>CUSTOM</IndButton>
                    </>
                } 
            />

            {/* Report Generator */}
            <div className="bg-white border border-black p-4 mb-6">
                <div className="font-bold text-sm bg-gray-200 border-b border-black p-2 -mx-4 -mt-4 mb-4 text-black uppercase">Report Generator</div>
                <div className="flex flex-wrap items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-xs font-bold mb-1">REPORT TYPE</label>
                        <select className="w-full border border-black p-2 text-xs bg-white"><option>FINANCIAL SUMMARY</option><option>SALES BY AGENT</option></select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold mb-1">PERIOD</label>
                        <select className="w-full border border-black p-2 text-xs bg-white"><option>THIS MONTH</option><option>CUSTOM RANGE</option></select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold mb-1">FORMAT</label>
                        <div className="flex gap-4 text-xs">
                            <label className="flex items-center gap-1"><input type="radio" name="fmt" defaultChecked /> PDF</label>
                            <label className="flex items-center gap-1"><input type="radio" name="fmt" /> CSV</label>
                        </div>
                    </div>
                    <IndButton className="bg-black text-white h-9">GENERATE REPORT</IndButton>
                </div>
            </div>

            {/* List of Reports */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-black p-4">
                    <h4 className="font-bold text-xs uppercase mb-3 border-b border-gray-200 pb-2">FINANCIAL REPORTS</h4>
                    <ul className="space-y-2 text-xs">
                        {['Monthly Financial Summary', 'Daily Collection Report', 'Commission Payout Report', 'USDT Transaction Report', 'Profit & Loss Statement', 'TDS Report'].map((item, i) => (
                            <li key={i} className="flex justify-between items-center hover:bg-gray-50 p-1 cursor-pointer border-b border-gray-100 last:border-0">
                                <span>{i+1}. {item}</span>
                                <span className="text-blue-600 font-bold hover:underline">[GENERATE]</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white border border-black p-4">
                    <h4 className="font-bold text-xs uppercase mb-3 border-b border-gray-200 pb-2">SALES & NETWORK REPORTS</h4>
                    <ul className="space-y-2 text-xs">
                        {['Plots Sold Report', 'Sales by Agent', 'Sales by Block', 'Agent Growth Report', 'Network Structure Tree', 'Top Performers'].map((item, i) => (
                            <li key={i} className="flex justify-between items-center hover:bg-gray-50 p-1 cursor-pointer border-b border-gray-100 last:border-0">
                                <span>{i+1}. {item}</span>
                                <span className="text-blue-600 font-bold hover:underline">[GENERATE]</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Recent Downloads */}
            <div className="bg-white border border-black p-4">
                <h4 className="font-bold text-xs uppercase mb-3 border-b border-gray-200 pb-2">RECENTLY GENERATED</h4>
                <div className="text-xs space-y-2">
                    <div className="flex justify-between">
                        <span>Monthly Financial Summary - Feb 2026.pdf</span>
                        <div className="space-x-2"><span className="text-gray-500">2h ago</span> <span className="font-bold text-black cursor-pointer">[DOWNLOAD]</span></div>
                    </div>
                    <div className="flex justify-between">
                        <span>Agent Network Structure - Feb 2026.xlsx</span>
                        <div className="space-x-2"><span className="text-gray-500">5h ago</span> <span className="font-bold text-black cursor-pointer">[DOWNLOAD]</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
