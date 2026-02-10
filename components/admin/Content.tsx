
import React, { useState } from 'react';
import { SectionTitle, IndButton, IndTable, StatusTag } from './Shared';

export const ContentView = () => {
    const [tab, setTab] = useState<'UPDATES' | 'TEMPLATES' | 'EDIT_TEMPLATE'>('UPDATES');

    return (
        <div className="space-y-6">
            <SectionTitle 
                title="CONTENT_MANAGEMENT" 
                actions={
                    <>
                        <IndButton active={tab === 'UPDATES'} onClick={() => setTab('UPDATES')}>UPDATES</IndButton>
                        <IndButton active={tab === 'TEMPLATES' || tab === 'EDIT_TEMPLATE'} onClick={() => setTab('TEMPLATES')}>EMAIL_TEMPLATES</IndButton>
                        <IndButton>DOCUMENTS</IndButton>
                    </>
                } 
            />

            {tab === 'UPDATES' && (
                <>
                    <IndTable headers={['ID', 'TITLE', 'DATE', 'PROGRESS', 'PHOTOS', 'AUDIENCE', 'ACTION']}>
                        <tr className="hover:bg-gray-50 text-black">
                            <td className="px-3 py-2 font-bold">U45</td>
                            <td className="px-3 py-2 font-bold">Block A Progress</td>
                            <td className="px-3 py-2 text-xs">Feb 01'26</td>
                            <td className="px-3 py-2 font-bold text-green-700">65%</td>
                            <td className="px-3 py-2 text-xs">18 imgs</td>
                            <td className="px-3 py-2 text-xs">BOTH (C+A)</td>
                            <td className="px-3 py-2 text-right">
                                <button className="text-blue-600 font-bold hover:underline mr-2">[EDIT]</button>
                                <button className="text-red-600 font-bold hover:underline">[DEL]</button>
                            </td>
                        </tr>
                    </IndTable>
                    <div className="flex justify-end mt-4">
                        <IndButton className="bg-black text-white">+ NEW UPDATE</IndButton>
                    </div>
                </>
            )}

            {tab === 'TEMPLATES' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-gray-100 p-2 border border-black">
                        <div className="text-xs font-bold">CATEGORIES: [ALL] [CLIENT] [AGENT] [SYSTEM]</div>
                        <IndButton onClick={() => setTab('EDIT_TEMPLATE')}>+ NEW TEMPLATE</IndButton>
                    </div>
                    <IndTable headers={['ID', 'TEMPLATE NAME', 'CATEGORY', 'TRIGGER', 'STATUS', 'USAGE', 'ACTION']}>
                        <tr className="hover:bg-gray-50 text-black">
                            <td className="px-3 py-2 font-bold">E01</td>
                            <td className="px-3 py-2">Welcome Client</td>
                            <td className="px-3 py-2">CLIENT</td>
                            <td className="px-3 py-2 text-xs">REGISTER</td>
                            <td className="px-3 py-2"><StatusTag status="ACTIVE" /></td>
                            <td className="px-3 py-2 text-xs">1,234 sends</td>
                            <td className="px-3 py-2 text-right">
                                <button className="text-blue-600 font-bold hover:underline mr-2" onClick={() => setTab('EDIT_TEMPLATE')}>[EDIT]</button>
                                <button className="text-gray-600 font-bold hover:underline">[TEST]</button>
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50 text-black">
                            <td className="px-3 py-2 font-bold">E02</td>
                            <td className="px-3 py-2">Payment Received</td>
                            <td className="px-3 py-2">CLIENT</td>
                            <td className="px-3 py-2 text-xs">PAYMENT_SUCCESS</td>
                            <td className="px-3 py-2"><StatusTag status="ACTIVE" /></td>
                            <td className="px-3 py-2 text-xs">15,678 sends</td>
                            <td className="px-3 py-2 text-right">
                                <button className="text-blue-600 font-bold hover:underline mr-2" onClick={() => setTab('EDIT_TEMPLATE')}>[EDIT]</button>
                                <button className="text-gray-600 font-bold hover:underline">[TEST]</button>
                            </td>
                        </tr>
                    </IndTable>
                </div>
            )}

            {tab === 'EDIT_TEMPLATE' && (
                <div className="bg-white border border-black p-4">
                    <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-4">
                        <h3 className="font-bold text-lg">EDIT TEMPLATE: PAYMENT RECEIVED</h3>
                        <button onClick={() => setTab('TEMPLATES')} className="text-red-600 font-bold text-xs">[CANCEL]</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label className="block text-xs font-bold mb-1">TEMPLATE NAME</label>
                                <input type="text" defaultValue="Payment Received Confirmation" className="w-full border border-gray-400 p-2 text-xs font-mono" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold mb-1">CATEGORY</label>
                                    <select className="w-full border border-gray-400 p-2 text-xs"><option>CLIENT - TRANSACTIONAL</option></select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1">TRIGGER</label>
                                    <select className="w-full border border-gray-400 p-2 text-xs"><option>PAYMENT_SUCCESS</option></select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-1">SUBJECT LINE</label>
                                <input type="text" defaultValue="Payment Received - {{PAYMENT_TYPE}} (₹{{AMOUNT}})" className="w-full border border-gray-400 p-2 text-xs font-mono" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-1">EMAIL BODY (HTML)</label>
                                <textarea className="w-full h-64 border border-gray-400 p-2 text-xs font-mono" defaultValue="<html>...</html>"></textarea>
                            </div>
                        </div>
                        <div className="bg-gray-50 border-l border-gray-300 p-4 space-y-4">
                            <div>
                                <h4 className="font-bold text-xs border-b border-gray-300 pb-1 mb-2">VARIABLES</h4>
                                <div className="space-y-1">
                                    <code className="block text-[10px] bg-white border border-gray-200 p-1 cursor-pointer hover:bg-yellow-50">{`{{CLIENT_NAME}}`}</code>
                                    <code className="block text-[10px] bg-white border border-gray-200 p-1 cursor-pointer hover:bg-yellow-50">{`{{AMOUNT}}`}</code>
                                    <code className="block text-[10px] bg-white border border-gray-200 p-1 cursor-pointer hover:bg-yellow-50">{`{{TRANSACTION_ID}}`}</code>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-xs border-b border-gray-300 pb-1 mb-2">ACTIONS</h4>
                                <IndButton className="w-full mb-2">SEND TEST EMAIL</IndButton>
                                <IndButton className="w-full bg-black text-white">SAVE TEMPLATE</IndButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
