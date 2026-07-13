
import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Medal, Crown, Loader2 } from 'lucide-react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { api } from '../../lib/api';

export const LeaderboardView = () => {
    const { formatAED } = useCurrency();
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<{ leaderboard: any[] }>('/leaderboard')
            .then(({ leaderboard }) => setRows(leaderboard))
            .catch(() => setRows([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="flex justify-center py-24"><Loader2 className="animate-spin text-gold-500" size={32} /></div>;
    }

    const [first, second, third, ...rest] = rows;
    const monthLabel = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

    return (
        <div className="space-y-8 animate-fade-in-up pb-20">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-deepblue-900 to-deepblue-800 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Trophy size={120} /></div>
                <div className="relative z-10 text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-white/20">
                        <Calendar size={12} /> {monthLabel}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-white">Champions Leaderboard</h2>
                    <p className="text-sm text-blue-200">Ranked by lifetime approved commission earnings.</p>
                </div>
            </div>

            {rows.length === 0 && (
                <p className="text-center text-gray-400 py-12">No agent activity yet. Be the first on the board!</p>
            )}

            {/* Top 3 Podium */}
            {rows.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-end -mt-8 relative z-20 px-4">
                {/* 2nd Place */}
                {second && (
                <div className="bg-white rounded-t-2xl rounded-b-xl border border-gray-200 shadow-lg p-6 text-center order-2 md:order-1 transform hover:-translate-y-2 transition relative overflow-hidden group">
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gray-300"></div>
                    <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 border-4 border-gray-300 flex items-center justify-center text-gray-400 shadow-inner group-hover:scale-110 transition-transform">
                        <Medal size={32} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">{second.full_name}</h3>
                    <p className="text-sm text-gray-500 font-medium">{second.agent_code}</p>
                    <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Total Earnings</p>
                        <p className="text-xl font-bold text-gray-700">{formatAED(Number(second.total_earnings))}</p>
                    </div>
                </div>
                )}

                {/* 1st Place */}
                {first && (
                <div className="bg-white rounded-t-2xl rounded-b-xl border-2 border-gold-400 shadow-2xl p-8 text-center order-1 md:order-2 transform scale-105 md:scale-110 relative overflow-hidden z-10 group">
                    <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 animate-shimmer"></div>
                    <div className="absolute top-4 right-4 text-gold-500 animate-pulse"><Crown size={24} /></div>
                    <div className="w-24 h-24 rounded-full bg-gold-50 mx-auto mb-4 border-4 border-gold-400 flex items-center justify-center text-gold-600 shadow-inner group-hover:scale-110 transition-transform">
                        <Trophy size={48} />
                    </div>
                    <h3 className="font-bold text-2xl text-deepblue-900">{first.full_name}</h3>
                    <p className="text-sm text-gold-600 font-bold mb-6 uppercase tracking-wide bg-gold-50 inline-block px-3 py-1 rounded-full mt-2">Grand Champion</p>
                    <div className="bg-gradient-to-br from-gold-50 to-white rounded-xl p-4 border border-gold-200 shadow-sm">
                        <p className="text-xs text-gold-600 uppercase font-bold tracking-wider">Total Earnings</p>
                        <p className="text-3xl font-bold text-deepblue-900">{formatAED(Number(first.total_earnings))}</p>
                        <p className="text-xs text-gray-400 mt-1 font-medium">{first.agent_code} • Rank {first.rank}</p>
                    </div>
                </div>
                )}

                {/* 3rd Place */}
                {third && (
                <div className="bg-white rounded-t-2xl rounded-b-xl border border-gray-200 shadow-lg p-6 text-center order-3 transform hover:-translate-y-2 transition relative overflow-hidden group">
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-orange-300"></div>
                    <div className="w-16 h-16 rounded-full bg-orange-50 mx-auto mb-4 border-4 border-orange-300 flex items-center justify-center text-orange-600 shadow-inner group-hover:scale-110 transition-transform">
                        <Medal size={32} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">{third.full_name}</h3>
                    <p className="text-sm text-gray-500 font-medium">{third.agent_code}</p>
                    <div className="mt-4 bg-orange-50 rounded-lg p-3 border border-orange-100">
                        <p className="text-[10px] text-orange-600 uppercase font-bold">Total Earnings</p>
                        <p className="text-xl font-bold text-orange-800">{formatAED(Number(third.total_earnings))}</p>
                    </div>
                </div>
                )}
            </div>
            )}

            {/* Runners Up List */}
            <div className="max-w-4xl mx-auto space-y-3 px-4">
                {rest.map((winner: any, i: number) => (
                    <div key={winner.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm hover:shadow-md transition group">
                        <div className="flex items-center gap-6">
                            <span className="text-gray-300 font-bold text-xl w-8 text-center group-hover:text-gold-500 transition-colors">#{i + 4}</span>
                            <div>
                                <p className="font-bold text-gray-900 text-lg">{winner.full_name}</p>
                                <p className="text-xs text-gray-500 font-medium">{winner.agent_code} • {winner.commission_count} commissions</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-lg font-bold text-green-600">{formatAED(Number(winner.total_earnings))}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
