
import React, { useState } from 'react';
import { 
  MessageCircle, Mail, Phone, Plus, Search, ChevronDown, ChevronUp, 
  FileText, Paperclip, X, CheckCircle, Clock, AlertCircle, HelpCircle, 
  BookOpen, Send
} from 'lucide-react';
import { Button } from '../Button';

// --- MOCK DATA ---
const MOCK_TICKETS = [
    { id: 'TKT-456', subject: 'Payout Not Received', status: 'IN_PROGRESS', category: 'Payouts', date: 'Feb 01, 2026', lastUpdate: '6 hours ago' },
    { id: 'TKT-423', subject: 'Wallet Verification Issue', status: 'CLOSED', category: 'Technical', date: 'Jan 28, 2026', lastUpdate: 'Jan 29, 2026' },
    { id: 'TKT-398', subject: 'Commission Calculation Question', status: 'CLOSED', category: 'Commissions', date: 'Jan 20, 2026', lastUpdate: 'Jan 21, 2026' },
];

const FAQS = [
    {
        category: '💰 Commissions & Payouts',
        items: [
            { q: 'When do I receive my commission?', a: 'Commissions are calculated monthly and available for withdrawal at the end of each month. You can request USDT payout anytime after that via the Earnings tab.' },
            { q: 'Why is TDS deducted?', a: 'As per compliance regulations, a 10% TDS (Tax Deducted at Source) is applicable on all commission payouts for Indian residents. International agents may have different tax structures.' },
            { q: 'How do USDT payouts work?', a: 'Payouts are processed via the TRC-20 (Tron) or ERC-20 (Ethereum) networks. Ensure your wallet address is correct in the Profile section to avoid loss of funds.' }
        ]
    },
    {
        category: '🔐 Wallets & Verification',
        items: [
            { q: 'How do I verify my USDT wallet?', a: 'Go to Profile > Crypto Wallets. Add your address and follow the verification step by sending a micro-transaction (1 USDT) to prove ownership. This amount is refunded.' },
            { q: 'Can I change my wallet address?', a: 'Yes, but for security reasons, changing a verified wallet requires a 24-hour cooling period before new payouts can be requested.' }
        ]
    },
    {
        category: '🎯 Ranks & Targets',
        items: [
            { q: 'How do I advance to the next rank?', a: 'Rank advancement is based on completing specific "Quests" or targets found on your Dashboard home screen. These include personal sales volume, team recruitment, and total network volume.' }
        ]
    }
];

export const SupportView = () => {
    const [ticketModalOpen, setTicketModalOpen] = useState(false);
    const [ticketFilter, setTicketFilter] = useState('ALL');

    return (
        <div className="space-y-8 animate-fade-in-up pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-deepblue-900 to-deepblue-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><HelpCircle size={120} /></div>
                <h2 className="text-3xl font-serif font-bold mb-2">Agent Support Center</h2>
                <p className="text-blue-200">Need help? We're here to assist you with payments, technical issues, and sales inquiries.</p>
            </div>

            {/* Quick Help Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-gold-300 transition-colors group">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                        <MessageCircle size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Live Chat</h3>
                    <p className="text-sm text-gray-500 mb-4">Chat with our support team in real-time.</p>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-bold text-green-600">Online Now</span>
                    </div>
                    <Button variant="outline" fullWidth>Start Chat</Button>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition-colors group">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                        <Mail size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Email Support</h3>
                    <p className="text-sm text-gray-500 mb-4">Get a response within 24 hours.</p>
                    <p className="text-sm font-bold text-deepblue-900 mb-4 bg-gray-50 p-2 rounded text-center">agent-support@rakoasis.com</p>
                    <Button variant="outline" fullWidth>Compose Email</Button>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-purple-300 transition-colors group">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                        <Phone size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Call Us</h3>
                    <p className="text-sm text-gray-500 mb-4">Mon-Sat, 9AM - 6PM (GST)</p>
                    <p className="text-lg font-bold text-deepblue-900 mb-2 text-center">+971 4 000 0000</p>
                    <Button variant="outline" fullWidth>Call Now</Button>
                </div>
            </div>

            {/* My Tickets */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h3 className="font-bold text-deepblue-900 flex items-center gap-2"><FileText size={20} className="text-gold-500" /> MY SUPPORT TICKETS</h3>
                    <div className="flex gap-2 w-full md:w-auto">
                        <select 
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-gold-500"
                            value={ticketFilter}
                            onChange={(e) => setTicketFilter(e.target.value)}
                        >
                            <option value="ALL">All Status</option>
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                        <Button onClick={() => setTicketModalOpen(true)} className="!py-2 !px-4 !text-xs whitespace-nowrap"><Plus size={14} className="mr-1" /> Create Ticket</Button>
                    </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                    {MOCK_TICKETS.map((ticket) => (
                        <div key={ticket.id} className="p-6 hover:bg-gray-50 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{ticket.id}</span>
                                    <h4 className="font-bold text-deepblue-900 text-sm md:text-base">{ticket.subject}</h4>
                                    <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">{ticket.category}</span>
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-4">
                                    <span>Created: {ticket.date}</span>
                                    <span>Last Update: {ticket.lastUpdate}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                <StatusBadge status={ticket.status} />
                                <button className="text-xs font-bold text-blue-600 hover:underline border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition">View Details</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* FAQs */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="font-bold text-deepblue-900 flex items-center gap-2 text-lg border-b border-gray-200 pb-2"><HelpCircle size={20} className="text-purple-500" /> Frequently Asked Questions</h3>
                    <div className="space-y-6">
                        {FAQS.map((section, idx) => (
                            <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-800 text-sm">
                                    {section.category}
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {section.items.map((item, i) => (
                                        <FAQAccordion key={i} question={item.q} answer={item.a} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-3 text-sm font-bold text-gray-500 hover:text-deepblue-900 hover:bg-gray-100 rounded-xl transition border border-dashed border-gray-300">View All 50+ FAQs</button>
                </div>

                {/* Sidebar: Knowledge Base & Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-deepblue-900 mb-4 flex items-center gap-2"><BookOpen size={18} className="text-blue-500" /> Knowledge Base</h3>
                        
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                            <input type="text" placeholder="Search guides..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500" />
                        </div>

                        <div className="space-y-3">
                            <ArticleLink title="Getting Started as an Agent" readTime="15 min" />
                            <ArticleLink title="Understanding Compensation" readTime="10 min" />
                            <ArticleLink title="How to Set Up USDT Wallet" readTime="5 min" />
                            <ArticleLink title="Effective Sales Strategies" readTime="12 min" />
                            <ArticleLink title="Team Building Best Practices" readTime="18 min" />
                        </div>
                    </div>

                    <div className="bg-deepblue-900 text-white p-6 rounded-xl shadow-lg">
                        <h3 className="font-bold mb-4 text-gold-400">Office Location</h3>
                        <p className="text-sm mb-1 font-bold">Birla Housing Limited</p>
                        <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                            Level 12, Commercial Tower,<br/>
                            Downtown Dubai, UAE
                        </p>
                        <div className="h-px bg-white/10 my-4"></div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Social Connect</p>
                        <div className="flex gap-3">
                            <SocialIcon>FB</SocialIcon>
                            <SocialIcon>IN</SocialIcon>
                            <SocialIcon>TW</SocialIcon>
                        </div>
                    </div>
                </div>
            </div>

            <CreateTicketModal isOpen={ticketModalOpen} onClose={() => setTicketModalOpen(false)} />
        </div>
    );
};

// --- SUB-COMPONENTS ---

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        OPEN: 'bg-blue-100 text-blue-700',
        IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
        CLOSED: 'bg-green-100 text-green-700',
    };
    const labels: any = {
        OPEN: 'Open',
        IN_PROGRESS: 'In Progress',
        CLOSED: 'Closed',
    };
    const icons: any = {
        OPEN: AlertCircle,
        IN_PROGRESS: Clock,
        CLOSED: CheckCircle,
    };
    const Icon = icons[status];

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${styles[status]}`}>
            <Icon size={12} /> {labels[status]}
        </span>
    );
};

const FAQAccordion = ({ question, answer }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="group">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex justify-between items-center p-4 text-left transition-colors ${isOpen ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
            >
                <span className={`text-sm font-medium ${isOpen ? 'text-blue-800' : 'text-gray-700'}`}>{question}</span>
                {isOpen ? <ChevronUp size={16} className="text-blue-500" /> : <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600" />}
            </button>
            {isOpen && (
                <div className="px-4 pb-4 pt-0 text-xs text-gray-600 leading-relaxed bg-blue-50/50 animate-fade-in-up">
                    {answer}
                </div>
            )}
        </div>
    );
};

const ArticleLink = ({ title, readTime }: any) => (
    <a href="#" className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg group transition-colors">
        <span className="text-xs text-blue-600 font-medium group-hover:underline">{title}</span>
        <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{readTime}</span>
    </a>
);

const SocialIcon = ({ children }: any) => (
    <button className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs font-bold transition-colors">
        {children}
    </button>
);

const CreateTicketModal = ({ isOpen, onClose }: any) => {
    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    if (submitted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-deepblue-900/60 backdrop-blur-sm" onClick={onClose}></div>
                <div className="bg-white rounded-2xl w-full max-w-md relative shadow-2xl animate-fade-in-up p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-deepblue-900 mb-2">Ticket Created!</h3>
                    <p className="text-sm text-gray-500 mb-6">Your ticket #TKT-NEW-001 has been submitted. We will respond shortly.</p>
                    <Button onClick={() => { setSubmitted(false); onClose(); }} fullWidth>Close</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-deepblue-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-2xl w-full max-w-lg relative shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-deepblue-900 text-lg">Create Support Ticket</h3>
                    <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-red-500" /></button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-4">
                    <div>
                        <label className="label">Category *</label>
                        <select className="input-field cursor-pointer">
                            <option>Commissions & Earnings</option>
                            <option>Payouts & Withdrawals</option>
                            <option>Wallet Issues</option>
                            <option>Client Registration</option>
                            <option>Technical Issues</option>
                            <option>General Inquiry</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="label">Subject *</label>
                        <input type="text" className="input-field" placeholder="Brief description of the issue" />
                    </div>

                    <div>
                        <label className="label">Description *</label>
                        <textarea className="input-field" rows={4} placeholder="Please provide details..."></textarea>
                    </div>

                    <div>
                        <label className="label">Priority</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="priority" className="accent-green-500" /> 
                                <span className="text-sm text-gray-600">Low</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="priority" className="accent-yellow-500" defaultChecked /> 
                                <span className="text-sm text-gray-600">Medium</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="priority" className="accent-red-500" /> 
                                <span className="text-sm text-gray-600">High</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="label">Attachments (Optional)</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                            <Paperclip className="mx-auto text-gray-400 mb-2" size={20} />
                            <p className="text-xs text-gray-500">Click to upload screenshot or document</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => setSubmitted(true)}>Submit Ticket <Send size={14} className="ml-2" /></Button>
                </div>
            </div>
        </div>
    );
};
