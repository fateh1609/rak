
import React from 'react';
import { Search } from 'lucide-react';
import { SectionTitle, IndButton, IndTable, StatusTag } from './Shared';

export const PaymentsView = () => {
    return (
        <div className="space-y-6">
            <SectionTitle 
                title="PAYMENT_MANAGEMENT" 
                actions={
                    <>
                        <IndButton active>ALL_PAYMENTS</IndButton>
                        <IndButton>PENDING_VERIFICATION (7)</IndButton>
                        <IndButton>RECONCILIATION</IndButton>
                    </>
                } 
            />

            {/* Filters */}
            <div className="flex flex-wrap gap-2 bg-white border border-black p-2 mb-4">
                <div className="flex items-center gap-2 flex-1 border border-gray-300 px-2 bg-gray-50 min-w-[200px]">
                    <Search size={14} className="text-gray-400" />
                    <input type="text" placeholder="SEARCH_TXN..." className="w-full bg-transparent text-xs py-1 outline-none text-black" />
                </div>
                <select className="bg-white border border-gray-300 text-xs px-2 py-1 text-black"><option>STATUS: ALL</option></select>
                <select className="bg-white border border-gray-300 text-xs px-2 py-1 text-black"><option>TYPE: ALL</option></select>
                <IndButton>FILTER</IndButton>
            </div>

            <IndTable headers={['DATETIME', 'TYPE', 'CLIENT', 'AMOUNT', 'METHOD', 'STATUS', 'ACTION']}>
                <tr className="hover:bg-gray-50 text-black">
                    <td className="px-3 py-2 text-xs">Feb 02, 14:34</td>
                    <td className="px-3 py-2 font-bold">EMI-16</td>
                    <td className="px-3 py-2">Amit Sharma<br/><span className="text-[10px] text-gray-500">A-105</span></td>
                    <td className="px-3 py-2 font-bold">₹37,875</td>
                    <td className="px-3 py-2 text-xs">UPI</td>
                    <td className="px-3 py-2"><StatusTag status="VERIFIED" /></td>
                    <td className="px-3 py-2 text-right"><button className="hover:underline text-blue-600 font-bold">[VIEW]</button></td>
                </tr>
                <tr className="hover:bg-gray-50 text-black">
                    <td className="px-3 py-2 text-xs">Feb 02, 14:15</td>
                    <td className="px-3 py-2 font-bold">EMI-18</td>
                    <td className="px-3 py-2">Priya Das<br/><span className="text-[10px] text-gray-500">B-089</span></td>
                    <td className="px-3 py-2 font-bold">₹37,875</td>
                    <td className="px-3 py-2 text-xs">BANK</td>
                    <td className="px-3 py-2"><StatusTag status="PENDING" /></td>
                    <td className="px-3 py-2 text-right">
                        <button className="bg-green-600 text-white px-2 py-1 text-[10px] font-bold hover:bg-green-700 mr-1">[VERIFY]</button>
                    </td>
                </tr>
                <tr className="hover:bg-gray-50 text-black">
                    <td className="px-3 py-2 text-xs">Feb 02, 12:34</td>
                    <td className="px-3 py-2 font-bold">EMI-12</td>
                    <td className="px-3 py-2">Karan Patel<br/><span className="text-[10px] text-gray-500">C-156</span></td>
                    <td className="px-3 py-2 font-bold">₹37,875</td>
                    <td className="px-3 py-2 text-xs">CARD</td>
                    <td className="px-3 py-2"><StatusTag status="FAILED" /></td>
                    <td className="px-3 py-2 text-right"><button className="hover:underline text-blue-600 font-bold">[RETRY]</button></td>
                </tr>
            </IndTable>
        </div>
    );
};
