
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { SectionTitle, IndButton, IndTable, StatusTag } from './Shared';

export const SupportView = () => {
    const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

    return (
        <div className="space-y-6 h-full flex flex-col">
            <SectionTitle 
                title="SUPPORT_TICKET_MANAGEMENT" 
                actions={
                    <>
                        <div className="text-[10px] font-bold mr-4 self-center hidden md:block">
                            OPEN: 28 | IN_PROGRESS: 15 | CLOSED_TODAY: 12
                        </div>
                        <IndButton active>OPEN</IndButton>
                        <IndButton>IN_PROGRESS</IndButton>
                        <IndButton>CLOSED</IndButton>
                    </>
                } 
            />

            {!selectedTicket ? (
                <>
                    {/* Filters */}
                    <div className="flex flex-wrap gap-2 bg-white border border-black p-2">
                        <div className="flex items-center gap-2 flex-1 border border-gray-300 px-2 bg-gray-50 min-w-[200px]">
                            <Search size={14} className="text-gray-400" />
                            <input type="text" placeholder="SEARCH TICKETS..." className="w-full bg-transparent text-xs py-1 outline-none text-black" />
                        </div>
                        <select className="bg-white border border-gray-300 text-xs px-2 py-1 text-black"><option>PRIORITY: ALL</option></select>
                        <select className="bg-white border border-gray-300 text-xs px-2 py-1 text-black"><option>CATEGORY: ALL</option></select>
                        <select className="bg-white border border-gray-300 text-xs px-2 py-1 text-black"><option>ASSIGNED: ME</option></select>
                        <IndButton>FILTER</IndButton>
                    </div>

                    <IndTable headers={['TICKET', 'SUBJECT', 'SOURCE', 'PRIORITY', 'CATEGORY', 'STATUS', 'ASSIGNED', 'ACTION']}>
                        <tr className="hover:bg-gray-50 text-black cursor-pointer" onClick={() => setSelectedTicket('TKT-891')}>
                            <td className="px-3 py-2 font-bold">TKT-891</td>
                            <td className="px-3 py-2">Payment Not Reflecting</td>
                            <td className="px-3 py-2">CLIENT (Amit)</td>
                            <td className="px-3 py-2"><span className="text-red-600 font-bold bg-red-50 px-1">HIGH</span></td>
                            <td className="px-3 py-2 text-xs">PAYMENT</td>
                            <td className="px-3 py-2"><StatusTag status="OPEN" /></td>
                            <td className="px-3 py-2">John (You)</td>
                            <td className="px-3 py-2 text-right"><button className="text-blue-600 font-bold hover:underline">[VIEW]</button></td>
                        </tr>
                        <tr className="hover:bg-gray-50 text-black">
                            <td className="px-3 py-2 font-bold">TKT-890</td>
                            <td className="px-3 py-2">Commission Not Visible</td>
                            <td className="px-3 py-2">AGENT (Rajesh)</td>
                            <td className="px-3 py-2"><span className="text-yellow-600 font-bold bg-yellow-50 px-1">MED</span></td>
                            <td className="px-3 py-2 text-xs">ACCOUNT</td>
                            <td className="px-3 py-2"><StatusTag status="IN_PROGRESS" /></td>
                            <td className="px-3 py-2">Sarah</td>
                            <td className="px-3 py-2 text-right"><button className="text-blue-600 font-bold hover:underline">[VIEW]</button></td>
                        </tr>
                        <tr className="hover:bg-gray-50 text-black">
                            <td className="px-3 py-2 font-bold">TKT-889</td>
                            <td className="px-3 py-2">Wallet Verif Issue</td>
                            <td className="px-3 py-2">AGENT (Priya)</td>
                            <td className="px-3 py-2"><span className="text-red-600 font-bold bg-red-50 px-1">HIGH</span></td>
                            <td className="px-3 py-2 text-xs">CRYPTO</td>
                            <td className="px-3 py-2"><StatusTag status="PENDING" /></td>
                            <td className="px-3 py-2">Mike</td>
                            <td className="px-3 py-2 text-right"><button className="text-blue-600 font-bold hover:underline">[VIEW]</button></td>
                        </tr>
                    </IndTable>
                </>
            ) : (
                // Ticket Detail View
                <div className="flex-1 bg-white border border-black flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-200 border-b border-black p-3 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-lg">TICKET: {selectedTicket}</span>
                            <StatusTag status="OPEN" />
                            <span className="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 border border-red-200">HIGH PRIORITY</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="text-xs font-bold bg-white border border-black px-2 py-1 hover:bg-red-50 text-red-600">[CLOSE TICKET]</button>
                            <button onClick={() => setSelectedTicket(null)} className="text-xs font-bold bg-white border border-black px-2 py-1 hover:bg-gray-100">[BACK]</button>
                        </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
                        {/* Thread */}
                        <div className="flex-1 p-4 border-r border-black overflow-y-auto bg-white flex flex-col">
                            {/* Message 1 */}
                            <div className="mb-6">
                                <div className="flex justify-between items-end mb-2 border-b border-gray-100 pb-1">
                                    <span className="font-bold text-sm">Amit Sharma (CLIENT)</span>
                                    <span className="text-[10px] text-gray-500">Jan 28, 2026 10:15:33</span>
                                </div>
                                <div className="bg-gray-50 p-4 border border-gray-200 text-xs text-black leading-relaxed font-mono">
                                    Subject: Payment Not Reflecting<br/><br/>
                                    Hi,<br/>
                                    I made my EMI payment of ₹37,875 on February 1st through UPI but it's still not showing in my account. The money was debited from my bank account but my dashboard shows the payment as pending.<br/><br/>
                                    Transaction ID: RZP789ABC<br/>
                                    Amount: ₹37,875<br/>
                                    Date: February 1, 2026<br/><br/>
                                    Please help urgently.<br/><br/>
                                    Attachments:<br/>
                                    <span className="text-blue-600 underline cursor-pointer">📎 bank_statement.pdf (1.2 MB)</span>
                                </div>
                            </div>

                            {/* Reply Box */}
                            <div className="mt-auto pt-4 border-t-2 border-black">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold">REPLY TO CLIENT</label>
                                    <span className="text-[10px] text-gray-500">Also sends email to: amit.sharma@email.com</span>
                                </div>
                                <textarea className="w-full h-32 border border-black p-2 text-xs mb-2 bg-white font-mono" placeholder="Type your reply..."></textarea>
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-4">
                                        <label className="text-xs flex items-center gap-1"><input type="radio" name="status" defaultChecked /> Reply & Keep Open</label>
                                        <label className="text-xs flex items-center gap-1"><input type="radio" name="status" /> Reply & Close</label>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 border border-black text-xs font-bold hover:bg-gray-100">ATTACH FILE</button>
                                        <IndButton className="bg-black text-white">SEND REPLY</IndButton>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="w-72 bg-gray-100 p-4 space-y-6 overflow-y-auto">
                            <div>
                                <h4 className="font-bold text-xs border-b border-black pb-1 mb-2">TICKET INFO</h4>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between"><span>Category:</span> <strong>PAYMENT</strong></div>
                                    <div className="flex justify-between"><span>Assigned:</span> <strong>John (You)</strong></div>
                                    <div className="flex justify-between"><span>Created:</span> <span>4.5h ago</span></div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-xs border-b border-black pb-1 mb-2">CLIENT DETAILS</h4>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between"><span>Name:</span> <strong>Amit Sharma</strong></div>
                                    <div className="flex justify-between"><span>ID:</span> <span>CLT-1234</span></div>
                                    <div className="flex justify-between"><span>Phone:</span> <span>+91 987...</span></div>
                                    <div className="flex justify-between"><span>Plot:</span> <strong>A-105</strong></div>
                                    <button className="w-full text-center border border-gray-400 bg-white mt-2 py-1 hover:bg-gray-50">[VIEW PROFILE]</button>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-xs border-b border-black pb-1 mb-2">RELATED INFO</h4>
                                <div className="bg-white border border-gray-300 p-2 text-xs mb-2">
                                    <strong>Possible Transaction Found:</strong><br/>
                                    ID: RZP789ABC<br/>
                                    Amt: ₹37,875<br/>
                                    Status: <span className="text-yellow-600 font-bold">PENDING VERIFICATION</span>
                                </div>
                                <button className="w-full bg-green-100 border border-green-300 text-green-800 font-bold text-xs py-1 hover:bg-green-200">[VERIFY PAYMENT]</button>
                            </div>

                            <div>
                                <h4 className="font-bold text-xs border-b border-black pb-1 mb-2">INTERNAL NOTES</h4>
                                <textarea className="w-full h-20 border border-gray-300 p-1 text-xs bg-yellow-50" placeholder="Add note for team..."></textarea>
                                <button className="w-full text-right text-[10px] font-bold mt-1 text-blue-600 hover:underline">SAVE NOTE</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
