
import React from 'react';
import { Monitor } from 'lucide-react';
import { UserProfile } from '../../types';

export const ProfileView = ({ profile }: { profile: UserProfile | null }) => (
    <div className="space-y-8 animate-fade-in-up pb-20">
        <h2 className="text-3xl font-serif font-bold text-deepblue-900">My Profile</h2>
        
        {/* Profile Details Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-deepblue-900 text-white flex items-center justify-center text-3xl font-bold">
                    {profile?.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-deepblue-900">{profile?.full_name || 'Valued Client'}</h3>
                    <p className="text-gray-500">{profile?.email}</p>
                    <p className="text-gray-500">{profile?.mobile}</p>
                </div>
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" value={profile?.full_name || ''} disabled className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="text" value={profile?.email || ''} disabled className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                        <input type="text" value={profile?.mobile || ''} disabled className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Agent Code</label>
                        <input type="text" value={profile?.agent_code || 'AGT-10523'} disabled className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500" />
                    </div>
                </div>
            </div>
        </div>

        {/* Login History Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-deepblue-900 flex items-center gap-2">
                    <Monitor size={18} className="text-gold-500" /> Recent Login Activity
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200 uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4">Date & Time</th>
                            <th className="px-6 py-4">Device</th>
                            <th className="px-6 py-4">IP Address</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {[
                            { date: "Feb 02, 2026 - 09:30 AM", device: "Chrome on Windows", ip: "103.21.145.12", loc: "Mumbai, IN", status: "Success" },
                            { date: "Feb 01, 2026 - 08:45 PM", device: "Safari on iPhone", ip: "49.32.112.56", loc: "Delhi, IN", status: "Success" },
                            { date: "Jan 28, 2026 - 02:15 PM", device: "Chrome on MacOS", ip: "103.21.145.12", loc: "Mumbai, IN", status: "Success" },
                            { date: "Jan 25, 2026 - 11:10 AM", device: "Chrome on Windows", ip: "103.21.145.12", loc: "Mumbai, IN", status: "Success" },
                            { date: "Jan 20, 2026 - 06:20 PM", device: "Edge on Windows", ip: "122.15.89.23", loc: "Dubai, UAE", status: "Success" },
                        ].map((log, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-gray-600">{log.date}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{log.device}</td>
                                <td className="px-6 py-4 font-mono text-xs text-gray-500">{log.ip}</td>
                                <td className="px-6 py-4 text-gray-600">{log.loc}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                                        {log.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);
