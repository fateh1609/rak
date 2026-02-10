
import React from 'react';
import { Shield, Smartphone, Monitor, Eye, EyeOff, Lock } from 'lucide-react';
import { SectionTitle, IndButton } from './Shared';
import { usePageAccess } from '../../contexts/PageAccessContext';
import { PageStatus } from '../../types';

export const PageControlView = () => {
    const { settings, updateSetting } = usePageAccess();

    return (
        <div className="space-y-6">
            <SectionTitle title="PAGE_ACCESS_CONTROL" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Client Portal Controls */}
                <div className="bg-white border border-black p-0">
                    <div className="bg-gray-100 border-b border-black p-4 flex items-center gap-3">
                        <Smartphone size={20} className="text-deepblue-900" />
                        <h3 className="font-bold text-lg text-deepblue-900">CLIENT PORTAL</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {Object.entries(settings.client).map(([page, status]) => (
                            <ControlRow 
                                key={page} 
                                label={page.replace('_', ' ')} 
                                status={status as PageStatus} 
                                onChange={(s) => updateSetting('client', page, s)} 
                            />
                        ))}
                    </div>
                </div>

                {/* Agent Portal Controls */}
                <div className="bg-white border border-black p-0">
                    <div className="bg-gray-100 border-b border-black p-4 flex items-center gap-3">
                        <BriefcaseIcon />
                        <h3 className="font-bold text-lg text-deepblue-900">AGENT PORTAL</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {Object.entries(settings.agent).map(([page, status]) => (
                            <ControlRow 
                                key={page} 
                                label={page.replace('_', ' ')} 
                                status={status as PageStatus} 
                                onChange={(s) => updateSetting('agent', page, s)} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ControlRowProps {
    label: string;
    status: PageStatus;
    onChange: (s: PageStatus) => void;
}

const ControlRow: React.FC<ControlRowProps> = ({ label, status, onChange }) => {
    return (
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <span className="font-bold text-sm text-gray-700">{label}</span>
            <div className="flex bg-gray-100 rounded p-1 border border-gray-300">
                <button 
                    onClick={() => onChange(PageStatus.ENABLED)}
                    className={`px-3 py-1 text-[10px] font-bold rounded flex items-center gap-1 transition-all ${
                        status === PageStatus.ENABLED ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'
                    }`}
                >
                    <Eye size={12} /> ENABLE
                </button>
                <button 
                    onClick={() => onChange(PageStatus.DISABLED)}
                    className={`px-3 py-1 text-[10px] font-bold rounded flex items-center gap-1 transition-all ${
                        status === PageStatus.DISABLED ? 'bg-yellow-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'
                    }`}
                >
                    <Lock size={12} /> DISABLE
                </button>
                <button 
                    onClick={() => onChange(PageStatus.HIDDEN)}
                    className={`px-3 py-1 text-[10px] font-bold rounded flex items-center gap-1 transition-all ${
                        status === PageStatus.HIDDEN ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'
                    }`}
                >
                    <EyeOff size={12} /> HIDE
                </button>
            </div>
        </div>
    );
};

const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-deepblue-900"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);
