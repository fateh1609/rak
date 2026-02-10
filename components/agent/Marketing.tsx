
import React, { useState } from 'react';
import { 
  Link as LinkIcon, Copy, Share2, Download, CheckCircle
} from 'lucide-react';
import { Button } from '../Button';
import { UserProfile } from '../../types';

interface MarketingViewProps {
    profile: UserProfile | null;
}

export const MarketingView: React.FC<MarketingViewProps> = ({ profile }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getRankName = (rank: number) => {
        const ranks = ['Agent', 'Agent', 'Senior Agent', 'Area Manager', 'Zonal Head', 'President'];
        return ranks[rank] || 'Agent';
    };

    const handleDownloadQR = async () => {
        const agentName = profile?.full_name || 'Rajesh Kumar';
        const agentCode = profile?.agent_code || 'AGT-10523';
        const rankName = profile ? getRankName(profile.rank) : 'Area Manager';
        const linkUrl = `https://rakoasis.com/signup?agent=${agentCode}`;
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(linkUrl)}`;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = 600;
        const height = 800; // Increased height for details
        canvas.width = width;
        canvas.height = height;

        if (ctx) {
            // Draw Background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            
            // Draw Decorative Border
            ctx.strokeStyle = '#C5A028'; // Gold
            ctx.lineWidth = 10;
            ctx.strokeRect(10, 10, width - 20, height - 20);

            // Draw Top Branding
            ctx.fillStyle = '#0F172A'; // Deep Blue
            ctx.textAlign = 'center';
            ctx.font = 'bold 40px "Playfair Display", serif';
            ctx.fillText('RAK OASIS', width / 2, 80);
            
            ctx.fillStyle = '#C5A028';
            ctx.font = '16px sans-serif';
            ctx.letterSpacing = '4px';
            ctx.fillText('PREMIUM ESTATE', width / 2, 110);

            // Draw QR Code
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = qrApiUrl;
            
            await new Promise((resolve) => {
                img.onload = () => {
                    // Draw image centered
                    ctx.drawImage(img, (width - 400) / 2, 150, 400, 400);
                    resolve(true);
                };
                img.onerror = (e) => {
                    console.error("Failed to load QR image", e);
                    resolve(false);
                }
            });

            // Draw Agent Info
            ctx.fillStyle = '#0F172A';
            ctx.font = 'bold 32px sans-serif';
            ctx.fillText(agentName, width / 2, 600);

            ctx.fillStyle = '#64748B'; // Gray
            ctx.font = 'bold 20px monospace';
            ctx.fillText(agentCode, width / 2, 640);

            // Rank Badge Drawing
            const rankText = rankName.toUpperCase();
            ctx.font = 'bold 16px sans-serif';
            const textWidth = ctx.measureText(rankText).width;
            
            // Background capsule for rank
            ctx.fillStyle = '#FFF8E1'; // Light Gold bg
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect((width - textWidth - 40) / 2, 670, textWidth + 40, 32, 16);
            } else {
                ctx.rect((width - textWidth - 40) / 2, 670, textWidth + 40, 32); // Fallback
            }
            ctx.fill();
            
            ctx.fillStyle = '#B45309'; // Dark Gold/Orange text
            ctx.fillText(rankText, width / 2, 692);

            // Footer Call to Action
            ctx.fillStyle = '#0F172A';
            ctx.font = 'italic 18px serif';
            ctx.fillText('Scan to register for priority access', width / 2, 750);

            // Trigger Download
            try {
                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `RAK_Oasis_${agentCode}_QR.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (e) {
                console.error("Canvas export failed", e);
                alert("Could not download image due to browser security settings.");
            }
        }
    };

    const agentCode = profile?.agent_code || 'AGT-10523';
    const referralLink = `https://rakoasis.com/signup?agent=${agentCode}`;

    return (
        <div className="space-y-8 animate-fade-in-up pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-deepblue-900 to-deepblue-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Share2 size={120} /></div>
                <h2 className="text-3xl font-serif font-bold mb-2">Marketing Tools</h2>
                <p className="text-blue-200">Share your unique referral link to grow your network.</p>
            </div>

            {/* SECTION 1: REFERRAL LINK & QR */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-deepblue-900 flex items-center gap-2"><LinkIcon size={20} className="text-gold-500" /> YOUR CLIENT REFERRAL LINK</h3>
                </div>
                <div className="p-6 md:p-8 space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Link Area */}
                        <div className="space-y-6">
                            <p className="text-sm text-gray-600">Share this link with potential clients to register. Your agent code is automatically applied.</p>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 font-mono text-sm text-gray-700 truncate">
                                    {referralLink}
                                </div>
                                <Button onClick={() => handleCopy(referralLink)} className="shrink-0">
                                    {copied ? <CheckCircle size={18} /> : <Copy size={18} />} {copied ? 'Copied' : 'Copy'}
                                </Button>
                            </div>
                        </div>

                        {/* QR Code Area */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 shrink-0">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(referralLink)}`}
                                    alt="Scan to Signup"
                                    className="w-[120px] h-[120px] object-contain"
                                />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h4 className="font-bold text-deepblue-900 mb-1">Scan to Signup</h4>
                                <p className="text-xs text-gray-500 mb-4">Linked to {profile?.full_name || 'Rajesh Kumar'} ({agentCode})</p>
                                <div className="flex flex-col gap-2">
                                    <button onClick={handleDownloadQR} className="text-xs font-bold text-deepblue-900 hover:text-gold-600 flex items-center justify-center sm:justify-start gap-1"><Download size={12} /> Download Card (PNG)</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
