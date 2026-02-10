
import React from 'react';
import { SectionTitle, IndButton, IndTable, StatusTag } from './Shared';

export const ClientsView = () => (
    <div className="space-y-6">
        <SectionTitle title="CLIENT_DATABASE" actions={<IndButton>EXPORT_FULL_DB</IndButton>} />
        
        <div className="bg-white border border-black p-4 space-y-4">
            <div className="flex gap-2">
                <input type="text" placeholder="SEARCH_NAME_OR_ID..." className="border border-gray-400 px-3 py-1 text-xs w-64 outline-none focus:border-black text-black" />
                <IndButton>SEARCH</IndButton>
            </div>

            <IndTable headers={['CLIENT_NAME', 'PLOT_REF', 'STATUS', 'PAID_%', 'AGENT_REF', 'ACTIONS']}>
                <tr className="hover:bg-gray-50 text-black">
                    <td className="px-3 py-2 font-bold">Amit Sharma</td>
                    <td className="px-3 py-2">A-105</td>
                    <td className="px-3 py-2"><StatusTag status="ACTIVE" /></td>
                    <td className="px-3 py-2 font-bold">32.6%</td>
                    <td className="px-3 py-2">Rajesh K.</td>
                    <td className="px-3 py-2 text-right"><a href="#" className="text-blue-600 hover:underline font-bold">[PROFILE]</a></td>
                </tr>
                <tr className="hover:bg-gray-50 text-black">
                    <td className="px-3 py-2 font-bold">Rahul Verma</td>
                    <td className="px-3 py-2">B-202</td>
                    <td className="px-3 py-2"><StatusTag status="PENDING" /></td>
                    <td className="px-3 py-2 font-bold">10.0%</td>
                    <td className="px-3 py-2">Mike J.</td>
                    <td className="px-3 py-2 text-right"><a href="#" className="text-blue-600 hover:underline font-bold">[PROFILE]</a></td>
                </tr>
            </IndTable>
        </div>
    </div>
);
