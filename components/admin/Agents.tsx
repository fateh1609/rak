
import React, { useState } from 'react';
import { Search, Download, AlertTriangle } from 'lucide-react';
import { SectionTitle, IndButton, IndTable, StatusTag } from './Shared';

export const AgentsView = () => {
    const [tab, setTab] = useState<'PENDING' | 'ALL'>('PENDING');

    return (
        <div className="space-y-6">
            <SectionTitle 
                title="AGENT_REGISTRY_V1" 
                actions={
                    <>
                        <IndButton active={tab === 'PENDING'} onClick={() => setTab('PENDING')}>PENDING_QUEUE (15)</IndButton>
                        <IndButton active={tab === 'ALL'} onClick={() => setTab('ALL')}>MASTER_LIST</IndButton>
                        <IndButton><Download size={12} className="mr-1 inline" /> EXPORT_CSV</IndButton>
                    </>
                } 
            />

            {tab === 'PENDING' ? (
                <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 p-2 text-xs text-yellow-800 font-bold flex items-center gap-2">
                        <AlertTriangle size={14} /> ACTION REQUIRED: 15 applications pending review. Oldest: 5 days.
                    </div>
                    <IndTable headers={['APPLICANT', 'ID_REF', 'SPONSOR', 'LOCATION', 'DATE', 'DOCS', 'ACTIONS']}>
                        {[1, 2, 3, 4, 5].map(i => (
                            <tr key={i} className="hover:bg-gray-50 text-black">
                                <td className="px-3 py-2 font-bold">Priya Singh</td>
                                <td className="px-3 py-2">TEMP-{1000+i}</td>
                                <td className="px-3 py-2">AGT-10523</td>
                                <td className="px-3 py-2">Mumbai, IN</td>
                                <td className="px-3 py-2">Feb 0{i}, 2026</td>
                                <td className="px-3 py-2"><a href="#" className="text-blue-600 hover:underline font-bold">[VIEW_PDF]</a></td>
                                <td className="px-3 py-2 text-right">
                                    <div className="flex gap-1 justify-end">
                                        <button className="bg-green-600 text-white px-2 py-1 text-[10px] hover:bg-green-700 font-bold">[APPROVE]</button>
                                        <button className="bg-red-600 text-white px-2 py-1 text-[10px] hover:bg-red-700 font-bold">[REJECT]</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </IndTable>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex gap-2 bg-white border border-black p-2">
                        <div className="flex items-center gap-2 flex-1 border border-gray-300 px-2 bg-gray-50">
                            <Search size={14} className="text-gray-400" />
                            <input type="text" placeholder="SEARCH_QUERY..." className="w-full bg-transparent text-xs py-1 outline-none text-black" />
                        </div>
                        <select className="bg-white border border-gray-300 text-xs px-2 py-1 text-black"><option>RANK: ALL</option></select>
                        <select className="bg-white border border-gray-300 text-xs px-2 py-1 text-black"><option>STATUS: ACTIVE</option></select>
                        <IndButton>FILTER</IndButton>
                    </div>

                    <IndTable headers={['AGENT_ID', 'FULL_NAME', 'RANK', 'DIRECT_SALES', 'TEAM_SIZE', 'STATUS', 'ACTIONS']}>
                        {[1,2,3,4,5,6].map(i => (
                            <tr key={i} className="hover:bg-gray-50 text-black">
                                <td className="px-3 py-2 font-bold">AGT-1052{i}</td>
                                <td className="px-3 py-2">Rajesh Kumar</td>
                                <td className="px-3 py-2">RANK_03</td>
                                <td className="px-3 py-2 text-center">12</td>
                                <td className="px-3 py-2 text-center">47</td>
                                <td className="px-3 py-2"><StatusTag status="ACTIVE" /></td>
                                <td className="px-3 py-2 text-right">
                                    <button className="text-blue-600 font-bold hover:underline">[MANAGE]</button>
                                </td>
                            </tr>
                        ))}
                    </IndTable>
                </div>
            )}
        </div>
    );
};
