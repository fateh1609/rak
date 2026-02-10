
import React from 'react';

export const SectionTitle = ({ title, actions }: { title: string, actions?: React.ReactNode }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 mb-4 border-b-2 border-black pb-2">
        <h2 className="text-xl font-bold text-black uppercase tracking-tight">{title}</h2>
        <div className="flex gap-2">{actions}</div>
    </div>
);

export const IndButton = ({ children, onClick, active, className = '' }: any) => (
    <button 
        onClick={onClick}
        className={`px-3 py-1 text-xs font-bold border border-black transition-colors uppercase rounded-none flex items-center gap-2 ${
            active ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
        } ${className}`}
    >
        {children}
    </button>
);

export const IndTable = ({ headers, children }: any) => (
    <div className="border border-black bg-white overflow-x-auto">
        <table className="w-full text-xs text-left font-mono text-black">
            <thead className="bg-gray-200 text-black border-b border-black">
                <tr>
                    {headers.map((h: string, i: number) => (
                        <th key={i} className="px-3 py-2 font-bold uppercase whitespace-nowrap border-r border-gray-400 last:border-r-0">{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {children}
            </tbody>
        </table>
    </div>
);

export const StatusTag = ({ status }: { status: string }) => {
    const colors: any = {
        'PENDING': 'bg-yellow-100 text-yellow-800',
        'APPROVED': 'bg-green-100 text-green-800',
        'VERIFIED': 'bg-green-100 text-green-800',
        'COMPLETED': 'bg-green-100 text-green-800',
        'REJECTED': 'bg-red-100 text-red-800',
        'FAILED': 'bg-red-100 text-red-800',
        'ACTIVE': 'bg-green-100 text-green-800',
        'SOLD': 'bg-red-100 text-red-800',
        'AVAILABLE': 'bg-blue-100 text-blue-800',
        'OPEN': 'bg-blue-100 text-blue-800',
        'CLOSED': 'bg-gray-200 text-gray-800',
        'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
        'HIGH': 'bg-red-100 text-red-800',
        'MEDIUM': 'bg-yellow-100 text-yellow-800',
        'LOW': 'bg-gray-100 text-gray-800',
    };
    return (
        <span className={`px-1.5 py-0.5 text-[10px] font-bold border border-transparent uppercase ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};
