
import React, { useState } from 'react';
import { 
  Search, PlayCircle, FileText, Calendar, Download, CheckCircle, 
  Clock, ExternalLink, Video, Users, DollarSign, Award, ChevronRight, 
  Filter, Star, Mail, Bell, Lock, BookOpen, MonitorPlay, Youtube 
} from 'lucide-react';
import { Button } from '../Button';

export const TrainingView = () => {
    const [activeTab, setActiveTab] = useState<'VIDEOS' | 'DOCS' | 'EVENTS'>('VIDEOS');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="space-y-8 animate-fade-in-up pb-20">
            {/* Header & Progress */}
            <div className="bg-gradient-to-r from-deepblue-900 to-deepblue-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><BookOpen size={120} /></div>
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl font-serif font-bold mb-2">Training & Resources Center</h2>
                        <p className="text-blue-200">Welcome to your learning hub, Rajesh! Master the skills to grow your business.</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Your Learning Progress</span>
                            <span className="text-2xl font-bold">26%</span>
                        </div>
                        <div className="w-full bg-deepblue-950 rounded-full h-3 mb-3 border border-white/10">
                            <div className="bg-gold-500 h-3 rounded-full relative" style={{ width: '26%' }}>
                                <div className="absolute right-0 -top-1 w-5 h-5 bg-white rounded-full shadow-lg"></div>
                            </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-300">
                            <span>Videos Watched: 8/31</span>
                            <span>Total Time: 3h 15m</span>
                        </div>
                        <button className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2">
                            Continue Learning <ChevronRight size={12} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-1">
                <button 
                    onClick={() => setActiveTab('VIDEOS')}
                    className={`px-6 py-3 text-sm font-bold rounded-t-lg transition-all flex items-center gap-2 ${activeTab === 'VIDEOS' ? 'bg-white border-x border-t border-gray-200 text-deepblue-900 -mb-px' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                    <Youtube size={18} className={activeTab === 'VIDEOS' ? 'text-red-600' : ''} /> Video Library
                </button>
                <button 
                    onClick={() => setActiveTab('DOCS')}
                    className={`px-6 py-3 text-sm font-bold rounded-t-lg transition-all flex items-center gap-2 ${activeTab === 'DOCS' ? 'bg-white border-x border-t border-gray-200 text-deepblue-900 -mb-px' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                    <FileText size={18} className={activeTab === 'DOCS' ? 'text-blue-600' : ''} /> Documents
                </button>
                <button 
                    onClick={() => setActiveTab('EVENTS')}
                    className={`px-6 py-3 text-sm font-bold rounded-t-lg transition-all flex items-center gap-2 ${activeTab === 'EVENTS' ? 'bg-white border-x border-t border-gray-200 text-deepblue-900 -mb-px' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                    <Calendar size={18} className={activeTab === 'EVENTS' ? 'text-gold-600' : ''} /> Webinars & Events
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'VIDEOS' && <VideoLibrary />}
                {activeTab === 'DOCS' && <DocumentCenter />}
                {activeTab === 'EVENTS' && <WebinarCenter />}
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const VideoLibrary = () => (
    <div className="space-y-8 animate-fade-in-up">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="relative flex-1 w-full md:w-auto">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input type="text" placeholder="Search videos by topic..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none cursor-pointer">
                    <option>All Categories</option>
                    <option>Getting Started</option>
                    <option>Sales Mastery</option>
                    <option>Crypto & Payouts</option>
                </select>
                <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none cursor-pointer">
                    <option>Status: All</option>
                    <option>Not Watched</option>
                    <option>Completed</option>
                </select>
            </div>
        </div>

        {/* Series 1: Getting Started */}
        <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <h3 className="text-xl font-bold text-deepblue-900 flex items-center gap-2">
                    <TargetIcon /> 🎯 GETTING STARTED SERIES <span className="text-sm font-normal text-gray-500 ml-2">(5 videos - 52m)</span>
                </h3>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">2/5 Watched</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <VideoCard 
                    title="1. Welcome to Champion 20 Platform Overview"
                    duration="10:24"
                    views="12,453"
                    watched={true}
                    thumbnail="bg-blue-100"
                    desc="Platform overview, your role as an agent, and first steps to success."
                />
                <VideoCard 
                    title="2. Understanding the Compensation Plan"
                    duration="15:37"
                    views="18,234"
                    watched={true}
                    thumbnail="bg-gold-100"
                    desc="5-level unilevel breakdown, infinity bonus, and commission calculations."
                />
                <VideoCard 
                    title="3. How to Register Your First Client"
                    duration="8:15"
                    views="9,876"
                    watched={false}
                    thumbnail="bg-purple-100"
                    desc="Using referral links, manual registration, and common mistakes."
                />
                <VideoCard 
                    title="4. Commission Structure Deep Dive"
                    duration="12:42"
                    views="7,234"
                    watched={false}
                    thumbnail="bg-green-100"
                    desc="Payment schedules, TDS implications, and maximizing earnings."
                />
            </div>
        </div>

        {/* Series 2: Sales Mastery */}
        <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <h3 className="text-xl font-bold text-deepblue-900 flex items-center gap-2">
                    <BriefcaseIcon /> 💼 SALES MASTERY SERIES <span className="text-sm font-normal text-gray-500 ml-2">(8 videos - 2h 7m)</span>
                </h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">2/8 Watched</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <VideoCardCompact title="1. Effective Sales Presentation" duration="20:15" watched={true} />
                <VideoCardCompact title="2. Handling Objections" duration="18:32" watched={true} />
                <VideoCardCompact title="3. Closing Techniques" duration="15:47" watched={false} />
                <VideoCardCompact title="4. Follow-up Strategies" duration="12:23" watched={false} />
                <VideoCardCompact title="5. Building Trust" duration="16:08" watched={false} />
                <VideoCardCompact title="6. Client Needs" duration="14:51" watched={false} />
                <VideoCardCompact title="7. Virtual Meetings" duration="10:35" watched={false} />
                <VideoCardCompact title="8. Post-Sale Care" duration="9:24" watched={false} />
            </div>
        </div>

        {/* Series 3: Crypto */}
        <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <h3 className="text-xl font-bold text-deepblue-900 flex items-center gap-2">
                    <DollarSign className="text-green-600" /> 💰 CRYPTO & PAYOUTS [NEW]
                </h3>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">1/3 Watched</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <VideoCard 
                    title="1. Setting Up Your USDT Wallet"
                    duration="8:43"
                    views="5,432"
                    watched={false}
                    thumbnail="bg-gray-100"
                    desc="Complete tutorial on creating TRC-20 wallets for payouts."
                />
                <VideoCard 
                    title="2. Requesting Commission Payouts"
                    duration="6:18"
                    views="4,123"
                    watched={false}
                    thumbnail="bg-gray-100"
                    desc="Step-by-step payout request process in the dashboard."
                />
                <VideoCard 
                    title="3. Crypto Security Best Practices"
                    duration="12:05"
                    views="3,876"
                    watched={true}
                    thumbnail="bg-gray-100"
                    desc="Protecting your wallet and earnings from scams."
                />
            </div>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-8">
            <Button variant="outline" className="!text-red-600 !border-red-200 hover:!bg-red-50">
                <Youtube size={18} className="mr-2" /> Open Full Playlist on YouTube
            </Button>
        </div>
    </div>
);

const DocumentCenter = () => (
    <div className="space-y-8 animate-fade-in-up">
        {/* Section: Essential */}
        <div>
            <h3 className="text-lg font-bold text-deepblue-900 mb-4 border-l-4 border-gold-500 pl-3">Essential Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DocumentCard 
                    title="Champion 20 Compensation Plan"
                    desc="Comprehensive guide to earnings structure, ranks, and bonuses."
                    meta="24 pages | PDF | 4.2 MB"
                    updated="Jan 2026"
                    icon={Award}
                    color="gold"
                />
                <DocumentCard 
                    title="Agent Agreement & Terms"
                    desc="Legal document outlining agent responsibilities and code of conduct."
                    meta="8 pages | PDF | 1.2 MB"
                    updated="Dec 2025"
                    icon={FileText}
                    color="blue"
                />
            </div>
        </div>

        {/* Section: Brochures */}
        <div>
            <h3 className="text-lg font-bold text-deepblue-900 mb-4 border-l-4 border-blue-500 pl-3">Product Brochures</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DocumentCardCompact title="Product Brochure - English" meta="16 pages | 8.5 MB" lang="EN" />
                <DocumentCardCompact title="Product Brochure - Hindi" meta="16 pages | 8.7 MB" lang="HI" />
                <DocumentCardCompact title="Product Brochure - Arabic" meta="16 pages | 8.9 MB" lang="AR" />
            </div>
        </div>

        {/* Section: Sales Tools */}
        <div>
            <h3 className="text-lg font-bold text-deepblue-900 mb-4 border-l-4 border-green-500 pl-3">Sales Tools & Scripts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SalesToolCard title="Sales Script" format="DOCX" />
                <SalesToolCard title="Objection Handling" format="PDF" />
                <SalesToolCard title="Phone Scripts" format="PDF" />
                <SalesToolCard title="WhatsApp Templates" format="PDF" />
            </div>
        </div>

        {/* Section: Reference */}
        <div>
            <h3 className="text-lg font-bold text-deepblue-900 mb-4 border-l-4 border-purple-500 pl-3">Reference Materials</h3>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded text-purple-600"><MonitorPlay size={16} /></div>
                        <div>
                            <p className="font-bold text-sm text-gray-800">Construction Timeline</p>
                            <p className="text-xs text-gray-500">Updated: Feb 2026</p>
                        </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800"><Download size={16} /></button>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded text-purple-600"><DollarSign size={16} /></div>
                        <div>
                            <p className="font-bold text-sm text-gray-800">Payment Plan Chart</p>
                            <p className="text-xs text-gray-500">Excel Sheet</p>
                        </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800"><Download size={16} /></button>
                </div>
            </div>
        </div>

        <div className="text-center pt-4">
            <button className="text-sm text-gray-500 hover:text-deepblue-900 flex items-center justify-center gap-2 mx-auto">
                <Mail size={14} /> Email Complete Pack to Me
            </button>
        </div>
    </div>
);

const WebinarCenter = () => (
    <div className="space-y-8 animate-fade-in-up">
        {/* Featured Live Event */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-20"><Users size={120} /></div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span> Live Next Week
                    </span>
                </div>
                <h2 className="text-3xl font-serif font-bold mb-2">Advanced Closing Techniques</h2>
                <p className="text-red-100 max-w-xl text-lg mb-6">Learn psychology of closing, handling last-minute objections, and creating ethical urgency.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 max-w-3xl">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-2 rounded-lg"><Calendar size={20} /></div>
                        <div>
                            <p className="text-xs text-red-200 uppercase font-bold">Date</p>
                            <p className="font-bold">Feb 10, 2026</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-2 rounded-lg"><Clock size={20} /></div>
                        <div>
                            <p className="text-xs text-red-200 uppercase font-bold">Time</p>
                            <p className="font-bold">7:00 PM IST</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-2 rounded-lg"><Users size={20} /></div>
                        <div>
                            <p className="text-xs text-red-200 uppercase font-bold">Speaker</p>
                            <p className="font-bold">Rajesh Sharma</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <button className="px-6 py-3 bg-white text-red-700 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg flex items-center gap-2">
                        <CheckCircle size={18} /> You're Registered!
                    </button>
                    <button className="px-6 py-3 bg-transparent border border-white/30 text-white rounded-lg font-bold hover:bg-white/10 transition flex items-center gap-2">
                        <Calendar size={18} /> Add to Calendar
                    </button>
                </div>
            </div>
        </div>

        {/* Upcoming List */}
        <div>
            <h3 className="font-bold text-deepblue-900 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-gold-500" /> Upcoming Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <WebinarCard 
                    title="Building a Million-Dollar Team"
                    date="Feb 17, 2026"
                    time="8:00 PM IST"
                    speaker="Priya Desai (Rank 5)"
                    type="YouTube Live"
                    registered={false}
                />
                <WebinarCard 
                    title="Crypto Security for Agents"
                    date="Feb 24, 2026"
                    time="7:30 PM IST"
                    speaker="Security Team"
                    type="Google Meet"
                    registered={false}
                />
            </div>
        </div>

        {/* Recordings */}
        <div>
            <h3 className="font-bold text-deepblue-900 mb-4 flex items-center gap-2">
                <Video size={20} className="text-blue-500" /> Recent Recordings
            </h3>
            <div className="bg-gray-50 rounded-xl border border-gray-200 divide-y divide-gray-200">
                <div className="p-4 flex justify-between items-center hover:bg-white transition">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                            <Youtube size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Mastering the Compensation Plan</h4>
                            <p className="text-xs text-gray-500">Recorded: Jan 20, 2026 • 1h 15m</p>
                        </div>
                    </div>
                    <Button variant="outline" className="!py-1.5 !px-3 !text-xs">Watch</Button>
                </div>
                <div className="p-4 flex justify-between items-center hover:bg-white transition">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                            <Youtube size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Client Psychology & Sales Triggers</h4>
                            <p className="text-xs text-gray-500">Recorded: Jan 13, 2026 • 58m</p>
                        </div>
                    </div>
                    <Button variant="outline" className="!py-1.5 !px-3 !text-xs">Watch</Button>
                </div>
            </div>
        </div>
    </div>
);

// --- ATOMS ---

const VideoCard = ({ title, duration, views, watched, thumbnail, desc }: any) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
        <div className={`h-40 ${thumbnail} relative flex items-center justify-center group-hover:opacity-90 transition-opacity cursor-pointer`}>
            <PlayCircle size={48} className="text-deepblue-900/50 group-hover:text-deepblue-900 transition-colors" />
            {watched && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                    <CheckCircle size={10} /> WATCHED
                </div>
            )}
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-mono">
                {duration}
            </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
            <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">{title}</h4>
            <p className="text-xs text-gray-500 mb-4 line-clamp-2 flex-1">{desc}</p>
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">{views} views</span>
                <button className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1">
                    Watch on YouTube <ExternalLink size={10} />
                </button>
            </div>
        </div>
    </div>
);

const VideoCardCompact = ({ title, duration, watched }: any) => (
    <div className="bg-white p-3 rounded-lg border border-gray-200 flex gap-3 items-center hover:border-blue-300 transition-colors cursor-pointer group">
        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center shrink-0 group-hover:bg-blue-50">
            {watched ? <CheckCircle size={16} className="text-green-500" /> : <PlayCircle size={16} className="text-gray-400 group-hover:text-blue-500" />}
        </div>
        <div className="flex-1 min-w-0">
            <h5 className="text-sm font-bold text-gray-800 truncate">{title}</h5>
            <p className="text-xs text-gray-500">{duration}</p>
        </div>
    </div>
);

const DocumentCard = ({ title, desc, meta, updated, icon: Icon, color }: any) => {
    const colors: any = {
        gold: 'bg-gold-50 text-gold-600 border-gold-200',
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
    };
    return (
        <div className={`p-6 rounded-xl border ${colors[color].replace('bg-', 'border-')} bg-white hover:shadow-md transition-shadow`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${colors[color]}`}>
                    <Icon size={24} />
                </div>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded">Upd: {updated}</span>
            </div>
            <h4 className="font-bold text-lg text-deepblue-900 mb-2">{title}</h4>
            <p className="text-sm text-gray-500 mb-4">{desc}</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400 font-mono">{meta}</span>
                <button className="text-xs font-bold text-deepblue-900 hover:text-gold-600 flex items-center gap-1 transition-colors">
                    Download <Download size={12} />
                </button>
            </div>
        </div>
    );
};

const DocumentCardCompact = ({ title, meta, lang }: any) => (
    <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">
                {lang}
            </div>
            <div>
                <h5 className="font-bold text-sm text-gray-900">{title}</h5>
                <p className="text-xs text-gray-500">{meta}</p>
            </div>
        </div>
        <button className="text-gray-400 hover:text-blue-600"><Download size={18} /></button>
    </div>
);

const SalesToolCard = ({ title, format }: any) => (
    <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-sm transition cursor-pointer text-center group">
        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-100 transition-colors">
            <FileText size={20} />
        </div>
        <h5 className="font-bold text-sm text-gray-900 mb-1">{title}</h5>
        <p className="text-[10px] text-gray-400 uppercase font-bold">{format}</p>
        <button className="mt-3 text-xs text-green-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
            Download <Download size={10} />
        </button>
    </div>
);

const WebinarCard = ({ title, date, time, speaker, type, registered }: any) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition">
        <div className="flex justify-between items-start mb-3">
            <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">{type}</div>
            {registered ? (
                <span className="text-green-600 text-xs font-bold flex items-center gap-1"><CheckCircle size={12} /> Registered</span>
            ) : (
                <button className="text-blue-600 text-xs font-bold hover:underline">Register Free</button>
            )}
        </div>
        <h4 className="font-bold text-deepblue-900 text-lg mb-2">{title}</h4>
        <div className="space-y-1 text-sm text-gray-600 mb-4">
            <p className="flex items-center gap-2"><Calendar size={14} /> {date}</p>
            <p className="flex items-center gap-2"><Clock size={14} /> {time}</p>
            <p className="flex items-center gap-2"><UserIcon /> {speaker}</p>
        </div>
        <Button variant={registered ? 'outline' : 'primary'} fullWidth className="!py-2 !text-xs">
            {registered ? 'View Details' : 'Register Now'}
        </Button>
    </div>
);

// Icons
const TargetIcon = () => <Target className="text-red-500" size={24} />;
const Target = ({className, size}: any) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const BriefcaseIcon = () => <Briefcase className="text-blue-500" size={24} />;
const Briefcase = ({className, size}: any) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const UserIcon = () => <Users size={14} />;
