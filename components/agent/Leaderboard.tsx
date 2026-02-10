
import React from 'react';
import { Trophy, TrendingUp, ChevronRight, Calendar, ArrowUp, Medal, Crown } from 'lucide-react';
import { Button } from '../Button';

export const LeaderboardView = () => (
    <div className="space-y-8 animate-fade-in-up pb-20">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-deepblue-900 to-deepblue-800 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Trophy size={120} /></div>
            <div className="relative z-10 text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-white/20">
                    <Calendar size={12} /> February 2026
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-white">Champions Leaderboard</h2>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 inline-block w-full max-w-lg">
                    <p className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-1">Total Prize Pool</p>
                    <p className="text-3xl font-bold">₹ 4,50,000</p>
                    <p className="text-xs text-gray-300 mt-1">(1% of ₹4.5 Crore Total Collection)</p>
                </div>
            </div>
        </div>
        
        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-end -mt-8 relative z-20 px-4">
            
            {/* 2nd Place */}
            <div className="bg-white rounded-t-2xl rounded-b-xl border border-gray-200 shadow-lg p-6 text-center order-2 md:order-1 transform hover:-translate-y-2 transition relative overflow-hidden group">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gray-300"></div>
                <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 border-4 border-gray-300 flex items-center justify-center text-gray-400 shadow-inner group-hover:scale-110 transition-transform">
                    <Medal size={32} />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Anita Desai</h3>
                <p className="text-sm text-gray-500 font-medium">98 Plots</p>
                <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Prize (25%)</p>
                    <p className="text-xl font-bold text-gray-700">₹ 1,12,500</p>
                </div>
            </div>

            {/* 1st Place */}
            <div className="bg-white rounded-t-2xl rounded-b-xl border-2 border-gold-400 shadow-2xl p-8 text-center order-1 md:order-2 transform scale-105 md:scale-110 relative overflow-hidden z-10 group">
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 animate-shimmer"></div>
                <div className="absolute top-4 right-4 text-gold-500 animate-pulse"><Crown size={24} /></div>
                <div className="w-24 h-24 rounded-full bg-gold-50 mx-auto mb-4 border-4 border-gold-400 flex items-center justify-center text-gold-600 shadow-inner group-hover:scale-110 transition-transform">
                    <Trophy size={48} />
                </div>
                <h3 className="font-bold text-2xl text-deepblue-900">Vikas Sharma</h3>
                <p className="text-sm text-gold-600 font-bold mb-6 uppercase tracking-wide bg-gold-50 inline-block px-3 py-1 rounded-full mt-2">Grand Champion</p>
                <div className="bg-gradient-to-br from-gold-50 to-white rounded-xl p-4 border border-gold-200 shadow-sm">
                    <p className="text-xs text-gold-600 uppercase font-bold tracking-wider">Prize (45%)</p>
                    <p className="text-3xl font-bold text-deepblue-900">₹ 2,02,500</p>
                    <p className="text-xs text-gray-400 mt-1 font-medium">127 Plots Sold</p>
                </div>
            </div>

            {/* 3rd Place */}
            <div className="bg-white rounded-t-2xl rounded-b-xl border border-gray-200 shadow-lg p-6 text-center order-3 transform hover:-translate-y-2 transition relative overflow-hidden group">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-orange-300"></div>
                <div className="w-16 h-16 rounded-full bg-orange-50 mx-auto mb-4 border-4 border-orange-300 flex items-center justify-center text-orange-600 shadow-inner group-hover:scale-110 transition-transform">
                    <Medal size={32} />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Rahul Mehta</h3>
                <p className="text-sm text-gray-500 font-medium">76 Plots</p>
                <div className="mt-4 bg-orange-50 rounded-lg p-3 border border-orange-100">
                    <p className="text-[10px] text-orange-600 uppercase font-bold">Prize (15%)</p>
                    <p className="text-xl font-bold text-orange-800">₹ 67,500</p>
                </div>
            </div>
        </div>

        {/* Runners Up List */}
        <div className="max-w-4xl mx-auto space-y-3 px-4">
            {[
                { pos: 4, name: 'Priya Singh', plots: 64, prize: '₹ 45,000', percent: '10%' },
                { pos: 5, name: 'Karan Patel', plots: 52, prize: '₹ 22,500', percent: '5%' },
            ].map((winner) => (
                <div key={winner.pos} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm hover:shadow-md transition group">
                    <div className="flex items-center gap-6">
                        <span className="text-gray-300 font-bold text-xl w-8 text-center group-hover:text-gold-500 transition-colors">#{winner.pos}</span>
                        <div>
                            <p className="font-bold text-gray-900 text-lg">{winner.name}</p>
                            <p className="text-xs text-gray-500 font-medium">{winner.plots} Plots Sold</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] text-gray-400 uppercase font-bold mr-2 bg-gray-100 px-2 py-1 rounded">{winner.percent} Pool</span>
                        <span className="text-lg font-bold text-green-600">{winner.prize}</span>
                    </div>
                </div>
            ))}
            
            {/* Gap Separator */}
            <div className="flex items-center gap-4 py-4 opacity-50">
                <div className="h-px bg-gray-300 flex-1"></div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">You are here</span>
                <div className="h-px bg-gray-300 flex-1"></div>
            </div>

            {/* User Position Card */}
            <div className="bg-deepblue-900 p-6 rounded-2xl border border-deepblue-800 shadow-xl relative overflow-hidden group">
                {/* Background Glow */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl group-hover:bg-gold-500/20 transition-all"></div>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="flex flex-col items-center">
                            <span className="text-gold-400 font-bold text-2xl">#7</span>
                            <span className="text-[10px] text-gray-400 uppercase">Rank</span>
                        </div>
                        <div className="h-10 w-px bg-white/10"></div>
                        <div>
                            <p className="font-bold text-white text-lg flex items-center gap-2">YOU (Rajesh Kumar) <span className="bg-white/10 text-xs px-2 py-0.5 rounded text-gray-300 font-normal">Me</span></p>
                            <p className="text-sm text-blue-200">47 Plots Sold (Team Volume)</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end w-full md:w-auto">
                        <div className="text-right mb-2">
                            <p className="text-xs text-red-300 font-bold uppercase tracking-wide flex items-center justify-end gap-1">
                                Gap to Top 5 <ArrowUp size={12} />
                            </p>
                            <p className="text-white font-bold text-lg">+6 plots needed</p>
                        </div>
                        <div className="w-full md:w-64 bg-deepblue-950 rounded-full h-2 mb-2 border border-white/5">
                            <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full relative" style={{width: '90%'}}>
                                <div className="absolute right-0 -top-1 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-red-500"></div>
                            </div>
                        </div>
                        <p className="text-xs text-gold-400">Potential Earnings: ₹22,500 if you reach #5</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-center gap-4 pt-8">
            <Button variant="outline" className="!text-gray-600 !border-gray-300 hover:!border-gold-500 hover:!text-gold-600">View Last Month</Button>
            <Button className="shadow-lg shadow-gold-500/20">View Full Rankings <ChevronRight size={16} /></Button>
        </div>
    </div>
);
