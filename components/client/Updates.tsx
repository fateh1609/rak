
import React, { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, Camera, Calendar, Target, Newspaper } from 'lucide-react';
import { api } from '../../lib/api';

const NewsFeed = () => {
    const [updates, setUpdates] = useState<any[]>([]);
    useEffect(() => {
        api.get<{ updates: any[] }>('/updates')
            .then(({ updates: u }) => setUpdates(u))
            .catch(() => setUpdates([]));
    }, []);

    if (!updates.length) {
        return <p className="text-sm text-gray-400 text-center py-8">No announcements yet.</p>;
    }
    return (
        <div className="space-y-4">
            {updates.map(u => (
                <div key={u.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-2 inline-block">
                        {new Date(u.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <h5 className="font-bold text-sm text-gray-900">{u.title}</h5>
                    <p className="text-xs text-gray-500 mt-1">{u.body}</p>
                </div>
            ))}
        </div>
    );
};

export const UpdatesView = () => (
    <div className="space-y-8 animate-fade-in-up pb-20">
        <h2 className="text-3xl font-serif font-bold text-deepblue-900">Project Updates</h2>

        {/* Progress Tracker */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
            <h4 className="font-bold text-deepblue-900 mb-6 flex items-center gap-2"><TrendingUp className="text-blue-500" /> CONSTRUCTION PROGRESS</h4>
            
            <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <p className="text-sm font-bold text-gray-700">Overall Project Completion</p>
                        <p className="text-xs text-gray-500">Expected Completion: Dec 2027</p>
                    </div>
                    <span className="text-3xl font-bold text-green-600">45%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full striped-bar" style={{ width: '45%' }}></div>
                </div>
                <p className="text-xs text-green-700 font-bold mt-2 flex items-center gap-1"><CheckCircle size={12} /> Status: On Schedule</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <ProgressItem label="Phase 1: Infrastructure" percent={100} status="Complete" color="bg-green-500" />
                <ProgressItem label="Phase 2: Block A (Your Plot)" percent={65} status="In Progress" color="bg-gold-500" />
                <ProgressItem label="Phase 3: Block B" percent={40} status="In Progress" color="bg-blue-500" />
                <ProgressItem label="Phase 4: Amenities" percent={25} status="In Progress" color="bg-purple-500" />
                <ProgressItem label="Phase 5: Landscaping" percent={0} status="Not Started" color="bg-gray-300" />
            </div>
        </div>

        {/* Photo Updates */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-deepblue-900 flex items-center gap-2"><Camera className="text-gold-500" /> CONSTRUCTION PHOTOS</h4>
                <select className="text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white">
                    <option>Newest First</option>
                    <option>Oldest First</option>
                </select>
            </div>

            <div className="space-y-8">
                <div>
                    <p className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2"><Calendar size={14} /> February 01, 2026 - Block A Progress</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative group cursor-pointer">
                                <img src={`https://source.unsplash.com/random/400x400?construction,site,${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Construction" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                            </div>
                        ))}
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500 cursor-pointer hover:bg-gray-200 transition">
                            +14 More
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Boundary walls under construction, utility lines being installed.</p>
                </div>

                <div>
                    <p className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2"><Calendar size={14} /> January 15, 2026 - Infrastructure Complete</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {[1,2].map(i => (
                            <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative group">
                                <img src={`https://source.unsplash.com/random/400x400?road,asphalt,${i}`} className="w-full h-full object-cover" alt="Infra" />
                            </div>
                        ))}
                         <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500 cursor-pointer hover:bg-gray-200 transition">
                            View Album
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Milestones & News */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h4 className="font-bold text-deepblue-900 mb-4 flex items-center gap-2"><Target size={18} /> Milestone Timeline</h4>
                <div className="space-y-4 relative pl-4 border-l-2 border-gray-100">
                    <TimelineItem date="Jan 2026" title="Infrastructure Complete" status="Done" />
                    <TimelineItem date="Feb 2026" title="Block A 65% Complete" status="Done" />
                    <TimelineItem date="Mar 2026" title="Block A Completion" status="Target" />
                    <TimelineItem date="Jun 2026" title="Block B Completion" status="Pending" />
                    <TimelineItem date="Sep 2026" title="Amenities Phase 1" status="Pending" />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h4 className="font-bold text-deepblue-900 mb-4 flex items-center gap-2"><Newspaper size={18} /> News & Announcements</h4>
                <NewsFeed />
            </div>
        </div>
    </div>
);

const ProgressItem = ({ label, percent, status, color }: any) => (
    <div>
        <div className="flex justify-between text-xs mb-1">
            <span className="font-bold text-gray-700">{label}</span>
            <span className="font-bold text-gray-900">{status} {percent > 0 && `(${percent}%)`}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
            <div className={`${color} h-2 rounded-full`} style={{ width: `${percent}%` }}></div>
        </div>
    </div>
);

const TimelineItem = ({ date, title, status }: any) => (
    <div className="relative">
        <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${status === 'Done' ? 'bg-green-500' : status === 'Target' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
        <p className="text-xs font-bold text-gray-400">{date}</p>
        <p className={`text-sm font-bold ${status === 'Pending' ? 'text-gray-500' : 'text-gray-800'}`}>{title}</p>
        {status === 'Target' && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 rounded ml-2">Current Target</span>}
    </div>
);
