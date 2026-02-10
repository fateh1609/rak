
import React from 'react';
import { Eye, Download } from 'lucide-react';

interface DocItemProps {
    title: string;
    id: string;
    date: string;
    size: string;
    status: string;
    amount?: string;
    onView?: () => void;
    onDownload?: () => void;
}

export const DocItem: React.FC<DocItemProps> = ({ title, id, date, size, status, amount, onView, onDownload }) => {
    return (
        <div className="p-4 hover:bg-gray-50 transition flex justify-between items-center group border-b border-gray-50 last:border-0">
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h5 className="font-bold text-gray-800 text-sm group-hover:text-deepblue-900 transition-colors">{title}</h5>
                    {status === 'Paid' && <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">VERIFIED</span>}
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                    {id} • {date} • {size}
                </p>
                {amount && <p className="text-xs font-bold text-gray-700 mt-1">Amount: {amount}</p>}
            </div>
            <div className="flex flex-col items-end gap-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    status === 'Signed' || status === 'Accepted' || status === 'Issued' || status === 'Paid' || status === 'Ready' || status === 'Available' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                    {status}
                </span>
                <div className="flex gap-4">
                    {onView ? (
                        <button 
                            onClick={(e) => { 
                                e.preventDefault();
                                e.stopPropagation();
                                console.log(`[${new Date().toLocaleTimeString()}] 🖱️ DocItem: 'VIEW' clicked for ${title}`);
                                onView(); 
                            }} 
                            className="text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 text-[10px] font-bold cursor-pointer" 
                            title="Open Preview"
                        >
                            <Eye size={16} /> VIEW
                        </button>
                    ) : (
                         <button 
                            onClick={(e) => {
                                e.preventDefault();
                                console.warn(`[${new Date().toLocaleTimeString()}] ⚠️ DocItem: 'VIEW' clicked for ${title} but no handler provided.`);
                            }}
                            className="text-gray-300 cursor-not-allowed flex items-center gap-1 text-[10px] font-bold" 
                            title="View not available"
                        >
                            <Eye size={16} /> VIEW
                        </button>
                    )}
                    
                    {onDownload ? (
                        <button 
                            onClick={(e) => { 
                                e.preventDefault();
                                e.stopPropagation();
                                console.log(`[${new Date().toLocaleTimeString()}] 🖱️ DocItem: 'DOWNLOAD' clicked for ${title}`);
                                onDownload(); 
                            }} 
                            className="text-gray-400 hover:text-gold-600 transition-colors flex items-center gap-1 text-[10px] font-bold cursor-pointer" 
                            title="Save PDF"
                        >
                            <Download size={16} /> SAVE
                        </button>
                    ) : (
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                console.warn(`[${new Date().toLocaleTimeString()}] ⚠️ DocItem: 'DOWNLOAD' clicked for ${title} but no handler provided.`);
                            }}
                            className="text-gray-300 cursor-not-allowed flex items-center gap-1 text-[10px] font-bold" 
                            title="Download not available"
                        >
                            <Download size={16} /> SAVE
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
