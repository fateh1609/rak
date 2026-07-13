
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, TreeDeciduous, List, BarChart, ChevronDown, ChevronRight, ChevronUp,
  User, Filter, Download, ZoomIn, ZoomOut, Mail, Phone, MessageCircle,
  X, CheckCircle, Award, TrendingUp, AlertCircle, Calendar, RefreshCw, Eye, Move
} from 'lucide-react';
import { Button } from '../Button';
import { useCurrency } from '../../contexts/CurrencyContext';

import { api } from '../../lib/api';

interface AgentNode {
    id: string;
    name: string;
    code: string;
    rank: number;
    sales: number;
    team: number;
    joinDate: string;
    status: 'Active' | 'Inactive';
    level: number;
    sponsor: string;
    avatar_color: string;
    children?: AgentNode[];
}

const rankColor = (rank: number, isRoot = false) => {
    if (isRoot) return 'bg-gold-500 text-white';
    if (rank >= 4) return 'bg-gold-200 text-gold-800';
    if (rank === 3) return 'bg-gray-300 text-gray-800';
    if (rank === 2) return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-700';
};

const fmtDate = (d: string) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

/** Builds an AgentNode tree from the flat /network/tree rows. */
const buildTree = (rows: any[], root: AgentNode): AgentNode => {
    const nodes = new Map<string, AgentNode>();
    const countTeam = (id: string): number =>
        rows.filter(r => r.sponsor_id === id)
            .reduce((sum, r) => sum + 1 + countTeam(r.id), 0);

    rows.forEach(r => {
        nodes.set(r.id, {
            id: r.id,
            name: r.role === 'client' ? `${r.full_name} (Client)` : r.full_name,
            code: r.agent_code || 'CLIENT',
            rank: r.rank || 1,
            sales: 0,
            team: countTeam(r.id),
            joinDate: fmtDate(r.created_at),
            status: r.status === 'active' ? 'Active' : 'Inactive',
            level: r.level,
            sponsor: '',
            avatar_color: rankColor(r.rank || 1),
            children: []
        });
    });
    rows.forEach(r => {
        const node = nodes.get(r.id)!;
        const parent = nodes.get(r.sponsor_id);
        if (parent) {
            node.sponsor = parent.name;
            parent.children!.push(node);
        } else {
            node.sponsor = root.name;
            root.children!.push(node);
        }
    });
    root.team = rows.length;
    return root;
};

export const NetworkView = ({ onRecruit, profile }: { onRecruit: () => void; profile?: any }) => {
    const [networkTab, setNetworkTab] = useState<'TREE' | 'TABLE' | 'STATS'>('TREE');
    const [selectedAgent, setSelectedAgent] = useState<AgentNode | null>(null);
    const [treeData, setTreeData] = useState<AgentNode | null>(null);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const { formatAED } = useCurrency();

    useEffect(() => {
        api.get<{ network: any[] }>('/network/tree').then(({ network }) => {
            const root: AgentNode = {
                id: 'root',
                name: `${profile?.full_name || 'You'} (YOU)`,
                code: profile?.agent_code || '—',
                rank: profile?.rank || 1,
                sales: 0,
                team: 0,
                joinDate: fmtDate(profile?.created_at || ''),
                status: 'Active',
                level: 0,
                sponsor: 'Company',
                avatar_color: rankColor(profile?.rank || 1, true),
                children: []
            };
            setTreeData(buildTree(network, root));
            setTableRows(network.map(r => ({
                id: r.id,
                name: r.role === 'client' ? `${r.full_name} (Client)` : r.full_name,
                code: r.agent_code || 'CLIENT',
                level: r.level,
                rank: r.rank || 1,
                personal: 0,
                team: network.filter(x => x.sponsor_id === r.id).length,
                join: fmtDate(r.created_at),
                status: r.status === 'active' ? 'Active' : 'Inactive'
            })));
        }).catch(() => { setTreeData(null); setTableRows([]); });
    }, []);
    
    // Tree View State controls
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandTrigger, setExpandTrigger] = useState(0); // 0: init, >0: expand, <0: collapse

    // Refs for drag logic
    const dragStartRef = useRef({ x: 0, y: 0 });
    const pointerStartRef = useRef({ x: 0, y: 0 });

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2.0));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.4));
    const handleExpandAll = () => setExpandTrigger(Date.now()); 
    const handleCollapseAll = () => setExpandTrigger(-Date.now()); 

    // --- DRAG HANDLERS (MOUSE) ---
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return; // Left click only
        setIsDragging(true);
        dragStartRef.current = {
            x: e.clientX - pan.x,
            y: e.clientY - pan.y
        };
        pointerStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        setPan({
            x: e.clientX - dragStartRef.current.x,
            y: e.clientY - dragStartRef.current.y
        });
    };

    const handleMouseUp = () => setIsDragging(false);
    const handleMouseLeave = () => setIsDragging(false);

    // --- DRAG HANDLERS (TOUCH) ---
    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            setIsDragging(true);
            dragStartRef.current = {
                x: e.touches[0].clientX - pan.x,
                y: e.touches[0].clientY - pan.y
            };
            pointerStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        if (e.touches.length === 1) {
            setPan({
                x: e.touches[0].clientX - dragStartRef.current.x,
                y: e.touches[0].clientY - dragStartRef.current.y
            });
        }
    };

    const handleTouchEnd = () => setIsDragging(false);

    // Prevent clicking on nodes if user was dragging
    const handleClickCapture = (e: React.MouseEvent | React.TouchEvent) => {
        let clientX, clientY;
        if ('changedTouches' in e) {
             clientX = e.changedTouches[0].clientX;
             clientY = e.changedTouches[0].clientY;
        } else {
             clientX = (e as React.MouseEvent).clientX;
             clientY = (e as React.MouseEvent).clientY;
        }

        const dist = Math.sqrt(
            Math.pow(clientX - pointerStartRef.current.x, 2) + 
            Math.pow(clientY - pointerStartRef.current.y, 2)
        );
        if (dist > 5) {
            e.stopPropagation(); 
        }
    };

    // Reset view when tab changes
    useEffect(() => {
        if (networkTab === 'TREE') {
            setPan({ x: 0, y: 0 });
            setZoom(1);
        }
    }, [networkTab]);

    return (
        <div className="space-y-6 animate-fade-in-up pb-20 print:pb-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-deepblue-900">My Network (Genealogy)</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your team structure and performance.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <div className="bg-white border border-gray-200 rounded-lg p-1 flex">
                        <button onClick={() => setNetworkTab('TREE')} className={`px-4 py-2 text-xs font-bold rounded flex items-center gap-2 transition ${networkTab === 'TREE' ? 'bg-deepblue-900 text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <TreeDeciduous size={14} /> Tree View
                        </button>
                        <button onClick={() => setNetworkTab('TABLE')} className={`px-4 py-2 text-xs font-bold rounded flex items-center gap-2 transition ${networkTab === 'TABLE' ? 'bg-deepblue-900 text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <List size={14} /> Table View
                        </button>
                        <button onClick={() => setNetworkTab('STATS')} className={`px-4 py-2 text-xs font-bold rounded flex items-center gap-2 transition ${networkTab === 'STATS' ? 'bg-deepblue-900 text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <BarChart size={14} /> Statistics
                        </button>
                    </div>
                    <Button onClick={onRecruit} className="!py-2 !px-4 !text-xs gap-2 shadow-lg"><Plus size={14} /> Recruit Agent</Button>
                </div>
            </div>

            {/* TAB CONTENT */}
            <div className="min-h-[600px] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden print:border-none print:shadow-none flex flex-col">
                
                {/* --- TAB 1: TREE VIEW --- */}
                {networkTab === 'TREE' && (
                    <div className="flex flex-col h-full flex-1">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 print:hidden z-20 relative shadow-sm">
                            <h3 className="font-bold text-deepblue-900 flex items-center gap-2"><TreeDeciduous size={18} className="text-green-600" /> MY GENEALOGY TREE</h3>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2 top-1.5 text-gray-400" size={14} />
                                    <input 
                                        type="text" 
                                        placeholder="Search Agent..." 
                                        className="pl-7 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex bg-white rounded border border-gray-300">
                                    <button onClick={handleZoomOut} className="p-1.5 hover:bg-gray-50 transition border-r border-gray-200" title="Zoom Out"><ZoomOut size={16} className="text-gray-600" /></button>
                                    <button onClick={handleZoomIn} className="p-1.5 hover:bg-gray-50 transition" title="Zoom In"><ZoomIn size={16} className="text-gray-600" /></button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Interactive Canvas */}
                        <div 
                            className={`flex-1 relative bg-slate-50 overflow-hidden select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseLeave}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onClickCapture={handleClickCapture}
                        >
                            {/* Grid Background Pattern */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                                style={{ 
                                    backgroundImage: 'radial-gradient(#0F172A 1px, transparent 1px)', 
                                    backgroundSize: '24px 24px',
                                    transform: `translate(${pan.x % 24}px, ${pan.y % 24}px)` 
                                }} 
                            />

                            {/* Info Hint */}
                            <div className="absolute bottom-4 left-4 z-10 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-200 text-[10px] text-gray-500 flex items-center gap-2 pointer-events-none">
                                <Move size={12} /> Drag to pan • Scroll to zoom
                            </div>

                            {/* Centered Content Container */}
                            <div 
                                className="w-full h-full flex items-center justify-center transition-transform duration-75 ease-linear origin-center"
                                style={{ 
                                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                                }}
                            >
                                {treeData ? (
                                    <TreeNode
                                        node={treeData}
                                        onView={setSelectedAgent}
                                        searchQuery={searchQuery}
                                        expandTrigger={expandTrigger}
                                    />
                                ) : (
                                    <p className="text-sm text-gray-400">Loading network…</p>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200 bg-white flex justify-between items-center text-xs text-gray-500 print:hidden z-20 relative">
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-200 rounded border border-gray-300"></div> Rank 1</span>
                                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-100 rounded border border-orange-300"></div> Rank 2</span>
                                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-300 rounded border border-gray-400"></div> Rank 3</span>
                                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gold-200 rounded border border-gold-400"></div> Rank 4</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleCollapseAll} className="hover:text-deepblue-900 font-bold px-2 py-1 rounded hover:bg-gray-100 transition">Collapse All</button>
                                <button onClick={handleExpandAll} className="hover:text-deepblue-900 font-bold px-2 py-1 rounded hover:bg-gray-100 transition">Expand All</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB 2: TABLE VIEW --- */}
                {networkTab === 'TABLE' && (
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <h3 className="font-bold text-deepblue-900 flex items-center gap-2"><List size={18} className="text-blue-600" /> LIST VIEW</h3>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="!py-1.5 !px-3 !text-xs"><Download size={14} className="mr-1" /> Export CSV</Button>
                                    <Button variant="outline" className="!py-1.5 !px-3 !text-xs"><Mail size={14} className="mr-1" /> Email Selected</Button>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 items-center">
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
                                    <input type="text" placeholder="Search by name, code..." className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
                                </div>
                                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 cursor-pointer focus:outline-none">
                                    <option>Level: All</option>
                                    <option>Level 1</option>
                                    <option>Level 2</option>
                                </select>
                                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 cursor-pointer focus:outline-none">
                                    <option>Rank: All</option>
                                    <option>Rank 1</option>
                                    <option>Rank 2</option>
                                </select>
                                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 cursor-pointer focus:outline-none">
                                    <option>Status: Active</option>
                                    <option>Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white text-gray-500 font-bold border-b border-gray-200 uppercase tracking-wider text-xs sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th className="px-6 py-4">Agent Name</th>
                                        <th className="px-6 py-4">Code</th>
                                        <th className="px-6 py-4 text-center">Lvl</th>
                                        <th className="px-6 py-4 text-center">Rank</th>
                                        <th className="px-6 py-4 text-center">Personal</th>
                                        <th className="px-6 py-4 text-center">Team</th>
                                        <th className="px-6 py-4">Join Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {tableRows.length === 0 && (
                                        <tr><td colSpan={9} className="px-6 py-8 text-center text-gray-400">No network members yet. Recruit your first agent!</td></tr>
                                    )}
                                    {tableRows.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4 font-bold text-gray-900 group-hover:text-gold-600 transition-colors">{row.name}</td>
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500">{row.code}</td>
                                            <td className="px-6 py-4 text-center"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">{row.level}</span></td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${row.rank > 1 ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                    Rank {row.rank}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-gray-700">{row.personal}</td>
                                            <td className="px-6 py-4 text-center font-bold text-deepblue-900">{row.team}</td>
                                            <td className="px-6 py-4 text-xs text-gray-500">{row.join}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full uppercase tracking-wide">
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => setSelectedAgent({...row, sponsor: 'Unknown'} as any)} 
                                                    className="text-blue-600 hover:text-white hover:bg-blue-600 text-xs font-bold border border-blue-200 px-3 py-1.5 rounded transition-all"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
                            <span>Showing {tableRows.length} network member{tableRows.length === 1 ? '' : 's'}</span>
                            <div className="flex gap-1">
                                <button className="px-2 py-1 border rounded bg-white disabled:opacity-50" disabled>&lt;</button>
                                <button className="px-2 py-1 border rounded bg-deepblue-900 text-white font-bold">1</button>
                                <button className="px-2 py-1 border rounded bg-white hover:bg-gray-100">2</button>
                                <button className="px-2 py-1 border rounded bg-white hover:bg-gray-100">3</button>
                                <button className="px-2 py-1 border rounded bg-white hover:bg-gray-100">&gt;</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB 3: STATISTICS --- */}
                {networkTab === 'STATS' && (
                    <div className="flex flex-col h-full overflow-auto">
                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-deepblue-900 flex items-center gap-2"><BarChart size={18} className="text-purple-600" /> NETWORK PERFORMANCE</h3>
                        </div>
                        
                        <div className="p-8 space-y-8">
                            {/* Level Breakdown */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2"><List size={16} /> Level Breakdown</h4>
                                <div className="space-y-4">
                                    <LevelStatRow level={1} agents={8} sales={15} percent={19} color="bg-deepblue-900" />
                                    <LevelStatRow level={2} agents={12} sales={8} percent={28} color="bg-blue-700" />
                                    <LevelStatRow level={3} agents={15} sales={4} percent={35} color="bg-blue-500" />
                                    <LevelStatRow level={4} agents={6} sales={2} percent={14} color="bg-blue-300" />
                                    <LevelStatRow level={5} agents={2} sales={1} percent={5} color="bg-blue-200" />
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center font-bold text-deepblue-900">
                                    <span>Total Network</span>
                                    <span>43 Agents | 30 Personal Sales</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Rank Distribution */}
                                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2"><Award size={16} /> Rank Distribution</h4>
                                    <div className="space-y-4">
                                        <RankStatRow rank="Rank 1" count={25} percent={58} color="bg-gray-400" />
                                        <RankStatRow rank="Rank 2" count={12} percent={28} color="bg-orange-400" />
                                        <RankStatRow rank="Rank 3" count={5} percent={12} color="bg-gray-300" />
                                        <RankStatRow rank="Rank 4" count={1} percent={2} color="bg-gold-500" />
                                        <RankStatRow rank="Rank 5" count={0} percent={0} color="bg-gray-100" />
                                    </div>
                                </div>

                                {/* Growth Metrics */}
                                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2"><TrendingUp size={16} /> Growth Metrics</h4>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                            <p className="text-xs text-green-700 font-bold uppercase">This Month</p>
                                            <p className="text-2xl font-bold text-green-800">+5 Agents</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            <p className="text-xs text-gray-500 font-bold uppercase">Last Month</p>
                                            <p className="text-2xl font-bold text-gray-700">+3 Agents</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Growth Rate:</span>
                                            <span className="font-bold text-green-600">+66.7% ↑</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Avg. per Month:</span>
                                            <span className="font-bold">4.2 Agents</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Projection (3mo):</span>
                                            <span className="font-bold text-deepblue-900">+13 Agents</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Performance */}
                            <div className="bg-gradient-to-r from-deepblue-900 to-deepblue-800 rounded-xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
                                <div>
                                    <h4 className="text-gold-400 font-bold text-lg mb-1">Total Sales Value Generated</h4>
                                    <p className="text-3xl font-bold">{formatAED(11844000)}</p>
                                </div>
                                <div className="h-10 w-px bg-white/20 hidden md:block"></div>
                                <div>
                                    <p className="text-gray-300 text-xs font-bold uppercase">Average per Agent</p>
                                    <p className="text-xl font-bold">{formatAED(275441)}</p>
                                </div>
                                <div className="h-10 w-px bg-white/20 hidden md:block"></div>
                                <div>
                                    <p className="text-gray-300 text-xs font-bold uppercase">Top Performer</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-8 h-8 rounded-full bg-white text-deepblue-900 flex items-center justify-center font-bold text-xs">MJ</div>
                                        <div>
                                            <p className="font-bold text-sm">Mike J.</p>
                                            <p className="text-xs text-green-400">{formatAED(2010000)} Sales</p>
                                        </div>
                                    </div>
                                </div>
                                <Button className="bg-white text-deepblue-900 hover:bg-gray-100 border-none ml-auto">Download Report</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* --- AGENT DETAIL MODAL --- */}
            {selectedAgent && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-deepblue-900/60 backdrop-blur-sm" onClick={() => setSelectedAgent(null)}></div>
                    <div className="bg-white rounded-2xl w-full max-w-lg relative shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh] overflow-hidden">
                        
                        <div className="bg-deepblue-900 p-6 text-white flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg bg-white text-deepblue-900`}>
                                    {selectedAgent.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedAgent.name}</h3>
                                    <p className="text-sm text-gray-300 font-mono mb-1">{selectedAgent.code}</p>
                                    <span className="text-xs bg-gold-500 text-deepblue-900 px-2 py-0.5 rounded font-bold">Rank {selectedAgent.rank} (Area Manager)</span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedAgent(null)} className="text-white/50 hover:text-white"><X size={20} /></button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6">
                            {/* Contact Info */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Contact Information</h4>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <p className="flex items-center gap-2"><Mail size={14} className="text-gray-400" /> email@example.com</p>
                                    <p className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /> +971 50 123 4567</p>
                                    <p className="flex items-center gap-2"><CheckCircle size={14} className="text-gray-400" /> Dubai, UAE</p>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Button variant="outline" className="flex-1 !py-1.5 !text-xs gap-1"><Mail size={14} /> Email</Button>
                                    <Button variant="outline" className="flex-1 !py-1.5 !text-xs gap-1"><Phone size={14} /> Call</Button>
                                    <Button variant="outline" className="flex-1 !py-1.5 !text-xs gap-1"><MessageCircle size={14} /> WhatsApp</Button>
                                </div>
                            </div>

                            {/* Performance Overview */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Performance Overview</h4>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        <p className="text-xs text-gray-500">Personal Sales</p>
                                        <p className="text-lg font-bold text-deepblue-900">{selectedAgent.sales} Plots</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        <p className="text-xs text-gray-500">Team Sales</p>
                                        <p className="text-lg font-bold text-deepblue-900">{selectedAgent.team} Plots</p>
                                    </div>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex justify-between items-center text-sm">
                                    <span className="text-blue-800 font-bold">Lifetime Earnings</span>
                                    <span className="text-blue-900 font-bold">{formatAED(678900)}</span>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Recent Activity</h4>
                                <ul className="space-y-3 text-xs text-gray-600">
                                    <li className="flex gap-2">
                                        <div className="mt-0.5 text-green-500"><CheckCircle size={12} /></div>
                                        <span>Sold Plot D-305 ({formatAED(2646000)}) - <span className="text-gray-400">2 days ago</span></span>
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="mt-0.5 text-blue-500"><User size={12} /></div>
                                        <span>Recruited Sarah Lee (AGT-10789) - <span className="text-gray-400">5 days ago</span></span>
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="mt-0.5 text-gold-500"><Award size={12} /></div>
                                        <span>Promoted to Rank 3 - <span className="text-gray-400">10 days ago</span></span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2">
                            <Button className="flex-1 !text-xs shadow-none" onClick={() => { setSelectedAgent(null); setNetworkTab('TREE'); }}>View Network Tree</Button>
                            <Button variant="outline" className="flex-1 !text-xs border-gray-300 text-gray-600 hover:text-deepblue-900">View Sales Report</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- SUB COMPONENTS ---

interface TreeNodeProps {
    node: AgentNode;
    onView: (n: AgentNode) => void;
    searchQuery: string;
    expandTrigger: number;
}

const TreeNode = ({ node, onView, searchQuery, expandTrigger }: TreeNodeProps) => {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = node.children && node.children.length > 0;
    
    // Check if current node matches search
    const isMatch = searchQuery && (
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        node.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Expand if user triggers "Expand All" or "Collapse All" or if searching
    useEffect(() => {
        if (expandTrigger > 0) {
            setExpanded(true);
        } else if (expandTrigger < 0) {
            // Keep root expanded usually, but for consistency can collapse all
            setExpanded(false);
        }
    }, [expandTrigger]);

    // Auto-expand if search matches (simplistic approach: expand if children match would be better but requires complex traversal)
    // For now, let's just expand everything if searching to ensure matches are found
    useEffect(() => {
        if (searchQuery.length > 0) {
            setExpanded(true);
        }
    }, [searchQuery]);

    return (
        <div className="flex flex-col items-center relative animate-fade-in-up">
            {/* Node Card */}
            <div 
                className={`
                    relative z-10 w-48 bg-white border-2 rounded-xl p-3 shadow-md cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg group
                    ${node.rank === 3 ? 'border-gray-300' : node.rank === 4 ? 'border-gold-400' : 'border-gray-200'}
                    ${isMatch ? 'ring-4 ring-gold-400 bg-gold-50 scale-105 border-gold-500 z-20' : ''}
                `} 
                onClick={() => onView(node)}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${node.avatar_color}`}>
                        {node.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-bold text-gray-900 text-xs truncate">{node.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono truncate">{node.code}</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-1 text-[10px] bg-gray-50 rounded p-1.5 border border-gray-100 mb-2">
                    <div className="text-center border-r border-gray-200">
                        <span className="block text-gray-400 uppercase text-[8px] font-bold">Rank</span>
                        <span className="font-bold text-gray-800">{node.rank}</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-gray-400 uppercase text-[8px] font-bold">Sales</span>
                        <span className="font-bold text-gray-800">{node.sales}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-[9px] text-gray-400">Team: {node.team}</span>
                    <button className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded hover:bg-blue-100 font-bold transition">View</button>
                </div>

                {/* Expand/Collapse Toggle */}
                {hasChildren && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-500 hover:text-deepblue-900 hover:border-deepblue-900 shadow-sm z-20 transition-colors"
                    >
                        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                )}
            </div>

            {/* Connecting Lines & Children */}
            {hasChildren && expanded && (
                <div className="flex flex-col items-center">
                    {/* Vertical line from parent */}
                    <div className="w-px h-6 bg-gray-300"></div>
                    
                    <div className="flex items-start gap-4">
                        {node.children!.map((child, index) => (
                            <div key={child.id} className="flex flex-col items-center relative">
                                {/* Horizontal line connector */}
                                <div className={`absolute top-0 w-full h-px bg-gray-300 ${
                                    node.children!.length === 1 ? 'hidden' : ''
                                } ${
                                    index === 0 ? 'left-1/2 w-1/2' : 
                                    index === node.children!.length - 1 ? 'right-1/2 w-1/2' : 'w-full'
                                }`}></div>
                                
                                {/* Vertical line to child */}
                                <div className="w-px h-6 bg-gray-300"></div>
                                
                                <TreeNode 
                                    node={child} 
                                    onView={onView} 
                                    searchQuery={searchQuery}
                                    expandTrigger={expandTrigger}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const LevelStatRow = ({ level, agents, sales, percent, color }: any) => (
    <div>
        <div className="flex justify-between text-xs mb-1">
            <span className="font-bold text-gray-700">Level {level} {level === 1 ? '(Direct)' : ''}: <span className="font-normal text-gray-500">{agents} agents | {sales} sales</span></span>
            <span className="font-bold text-gray-900">{percent}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
            <div className={`h-2 rounded-full ${color}`} style={{ width: `${percent}%` }}></div>
        </div>
    </div>
);

const RankStatRow = ({ rank, count, percent, color }: any) => (
    <div className="flex items-center gap-3 text-xs">
        <span className="w-16 font-bold text-gray-700">{rank}</span>
        <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: `${percent}%` }}></div>
        </div>
        <span className="w-24 text-right text-gray-500">{count} agents ({percent}%)</span>
    </div>
);
