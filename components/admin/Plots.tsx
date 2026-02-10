
import React from 'react';
import { Search } from 'lucide-react';
import { SectionTitle, IndButton, IndTable, StatusTag } from './Shared';

export const PlotsView = () => (
    <div className="space-y-6">
        <SectionTitle 
            title="MASTER_INVENTORY" 
            actions={<IndButton className="bg-black text-white">+ ADD_PLOT</IndButton>} 
        />

        {/* Stats Strip */}
        <div className="grid grid-cols-4 gap-0 border border-black divide-x divide-black bg-white text-center">
            <div className="p-2">
                <div className="text-[10px] text-gray-500 font-bold uppercase">TOTAL_UNITS</div>
                <div className="text-xl font-bold text-black">2,000</div>
            </div>
            <div className="p-2">
                <div className="text-[10px] text-gray-500 font-bold uppercase">AVAILABLE</div>
                <div className="text-xl font-bold text-blue-600">1,144</div>
            </div>
            <div className="p-2">
                <div className="text-[10px] text-gray-500 font-bold uppercase">SOLD</div>
                <div className="text-xl font-bold text-red-600">856</div>
            </div>
            <div className="p-2">
                <div className="text-[10px] text-gray-500 font-bold uppercase">RESERVED</div>
                <div className="text-xl font-bold text-yellow-600">0</div>
            </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 items-center">
            <div className="flex-1 border border-black bg-white px-2 py-1 flex items-center">
                <Search size={12} className="mr-2 text-black" />
                <input className="w-full text-xs outline-none text-black" placeholder="SEARCH_PLOT_ID..." />
            </div>
            <IndButton>BLOCK_A</IndButton>
            <IndButton>BLOCK_B</IndButton>
            <IndButton>AVAILABLE_ONLY</IndButton>
        </div>

        {/* Table */}
        <IndTable headers={['PLOT_ID', 'BLOCK', 'SIZE_SQFT', 'PRICE_AED', 'STATUS', 'OWNER', 'CONFIG']}>
            <tr className="hover:bg-gray-50 text-black">
                <td className="px-3 py-2 font-bold">A-105</td>
                <td className="px-3 py-2">BLOCK_A</td>
                <td className="px-3 py-2">1,000</td>
                <td className="px-3 py-2">101,000</td>
                <td className="px-3 py-2"><StatusTag status="SOLD" /></td>
                <td className="px-3 py-2">Amit Sharma</td>
                <td className="px-3 py-2 text-right"><button className="hover:underline text-blue-600 font-bold">[EDIT]</button></td>
            </tr>
            <tr className="hover:bg-gray-50 text-black">
                <td className="px-3 py-2 font-bold">A-106</td>
                <td className="px-3 py-2">BLOCK_A</td>
                <td className="px-3 py-2">1,000</td>
                <td className="px-3 py-2">101,000</td>
                <td className="px-3 py-2"><StatusTag status="AVAILABLE" /></td>
                <td className="px-3 py-2 text-gray-400">--</td>
                <td className="px-3 py-2 text-right"><button className="hover:underline text-blue-600 font-bold">[EDIT]</button></td>
            </tr>
            <tr className="hover:bg-gray-50 text-black">
                <td className="px-3 py-2 font-bold">A-107</td>
                <td className="px-3 py-2">BLOCK_A</td>
                <td className="px-3 py-2">1,200 (CNR)</td>
                <td className="px-3 py-2">127,260</td>
                <td className="px-3 py-2"><StatusTag status="AVAILABLE" /></td>
                <td className="px-3 py-2 text-gray-400">--</td>
                <td className="px-3 py-2 text-right"><button className="hover:underline text-blue-600 font-bold">[EDIT]</button></td>
            </tr>
        </IndTable>
    </div>
);
