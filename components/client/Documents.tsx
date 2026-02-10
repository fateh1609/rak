
import React, { useState } from 'react';
import { FileText, CheckCircle, DollarSign, Download, Eye, X, Loader2 } from 'lucide-react';
import { pdf, Font } from '@react-pdf/renderer';
import { UserProfile } from '../../types';
import { BookingSlipPDF } from '../pdf/BookingSlipPDF';
import { EMISlipPDF } from '../pdf/EMISlipPDF';
import { GenericDocumentPDF } from '../pdf/GenericDocumentPDF';
import { DocItem } from './DocItem';
import { useCurrency } from '../../contexts/CurrencyContext';

// Register fonts to avoid "unitsPerEm" errors with default fonts in browser
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' }
  ]
});

interface DocumentsViewProps {
    bookings: any;
    profile: UserProfile | null;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ bookings, profile }) => {
    // --- STATE ---
    const [viewingPdfUrl, setViewingPdfUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const { formatAED } = useCurrency();

    // --- GENERATOR HELPER ---
    const generateBlob = async (type: 'BOOKING' | 'EMI' | 'GENERIC', docData: any) => {
        console.log(`[${new Date().toLocaleTimeString()}] ⚙️ PDF Generator: Starting generation for type: ${type}`, docData);
        
        let DocumentTemplate;
        switch(type) {
            case 'BOOKING': DocumentTemplate = <BookingSlipPDF data={docData} />; break;
            case 'EMI': DocumentTemplate = <EMISlipPDF data={docData} />; break;
            case 'GENERIC': DocumentTemplate = <GenericDocumentPDF data={docData} />; break;
            default: DocumentTemplate = <GenericDocumentPDF data={docData} />;
        }
        
        try {
            const instance = pdf(DocumentTemplate);
            if (!instance) throw new Error("PDF instance creation returned null");
            
            const blob = await instance.toBlob();
            console.log(`[${new Date().toLocaleTimeString()}] ✅ PDF Generator: Blob created successfully. Size: ${blob.size} bytes`);
            return blob;
        } catch (e) {
            console.error(`[${new Date().toLocaleTimeString()}] ❌ PDF Generator Error:`, e);
            throw e;
        }
    };

    // --- HANDLERS ---
    const handleViewPDF = async (type: 'BOOKING' | 'EMI' | 'GENERIC', docData: any) => {
        console.log(`[${new Date().toLocaleTimeString()}] 🚀 Handler: View PDF requested for ${type}`);
        setIsGenerating(true);
        try {
            const blob = await generateBlob(type, docData);
            const url = URL.createObjectURL(blob);
            console.log(`[${new Date().toLocaleTimeString()}] 🔗 Handler: Blob URL created: ${url}`);

            // Always use in-app modal to avoid "New Tab" restrictions in cloud environments
            console.log(`[${new Date().toLocaleTimeString()}] 🖥️ Handler: Opening in-app modal`);
            setViewingPdfUrl(url);
            
        } catch (error) {
            console.error(`[${new Date().toLocaleTimeString()}] ❌ Handler View Error:`, error);
            alert("Unable to generate document preview. Please check console for details.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadPDF = async (type: 'BOOKING' | 'EMI' | 'GENERIC', docData: any, fileName: string) => {
        console.log(`[${new Date().toLocaleTimeString()}] 🚀 Handler: Download PDF requested for ${fileName}`);
        setIsGenerating(true);
        try {
            const blob = await generateBlob(type, docData);
            const url = URL.createObjectURL(blob);
            
            console.log(`[${new Date().toLocaleTimeString()}] ⬇️ Handler: Triggering download anchor click`);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setTimeout(() => {
                URL.revokeObjectURL(url);
                console.log(`[${new Date().toLocaleTimeString()}] 🧹 Handler: Cleanup done`);
            }, 2000);
        } catch (error) {
            console.error(`[${new Date().toLocaleTimeString()}] ❌ Handler Download Error:`, error);
            alert("Download failed. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const closeViewer = () => {
        console.log(`[${new Date().toLocaleTimeString()}] 🔒 Viewer: Closing modal`);
        if (viewingPdfUrl) {
            URL.revokeObjectURL(viewingPdfUrl);
            setViewingPdfUrl(null);
        }
    };

    // --- DATA PREPARATION ---
    const bookingData = {
        bookingId: 'RO/BK/2026/00145', 
        name: profile?.full_name || 'Valued Investor',
        email: profile?.email || '-',
        plotNo: 'A 105',
        block: 'Block A',
        type: 'Standard Residential',
        date: 'Jan 15, 2026',
        mode: 'Bank Transfer',
        txnId: 'HDFC-88223311', 
        amount: formatAED(252500)
    };

    const emiData = {
        receiptNo: 'RO/EMI/2026/00234',
        date: 'Feb 01, 2026',
        clientName: profile?.full_name || 'Valued Investor',
        installmentNumber: '01', 
        utr: 'UPI-9876543210',
        amount: formatAED(37875)
    };

    const createDocData = (title: string, ref: string, date: string, type: string, status: string) => ({
        title, ref, date, type, status,
        owner: profile?.full_name || 'Valued Investor',
        plot: 'A 105'
    });

    return (
        <div className="space-y-8 animate-fade-in-up pb-20 relative">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-3xl font-serif font-bold text-deepblue-900">My Documents</h2>
            </div>

            {/* --- LOADING SPINNER OVERLAY --- */}
            {isGenerating && (
                <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-3 animate-bounce-in">
                        <Loader2 className="animate-spin text-gold-500" size={40} />
                        <div className="text-center">
                            <p className="font-bold text-deepblue-900">Generating Document...</p>
                            <p className="text-xs text-gray-500">Preparing your PDF</p>
                        </div>
                    </div>
                </div>
            )}

            {/* --- PDF MODAL (IFRAME) --- */}
            {viewingPdfUrl && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                        onClick={closeViewer}
                    />
                    
                    <div className="relative bg-white w-full h-full max-w-6xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up border border-gray-700">
                        <div className="bg-gray-900 text-white p-4 flex justify-between items-center shrink-0 border-b border-gray-700">
                            <div className="flex items-center gap-3">
                                <FileText className="text-gold-500" size={20} />
                                <span className="font-bold tracking-wide text-sm">DOCUMENT PREVIEW</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <a 
                                    href={viewingPdfUrl} 
                                    download="RakOasis_Doc.pdf" 
                                    className="flex items-center gap-2 text-xs font-bold bg-gold-500 text-deepblue-900 px-3 py-1.5 rounded hover:bg-gold-400 transition-colors"
                                >
                                    <Download size={14} /> DOWNLOAD
                                </a>
                                <button 
                                    onClick={closeViewer} 
                                    className="text-gray-400 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-gray-100 relative">
                            {/* IFRAME FOR DISPLAYING BLOB PDF */}
                            <iframe 
                                src={viewingPdfUrl} 
                                className="w-full h-full absolute inset-0 border-none"
                                title="PDF Viewer"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* --- DOCUMENT LISTS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Purchase Agreements */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-deepblue-900 flex items-center gap-2">
                        <FileText size={18} className="text-blue-500" /> Purchase Agreements
                    </div>
                    <div className="divide-y divide-gray-100">
                        <DocItem 
                            title="Sale Agreement" 
                            id="SA-2026-A105" 
                            date="Jan 15, 2026" 
                            size="2.4 MB" 
                            status="Signed"
                            onView={() => handleViewPDF('GENERIC', createDocData('Agreement for Sale', 'SA-2026-A105', 'Jan 15, 2026', 'Sale Agreement', 'Signed'))}
                            onDownload={() => handleDownloadPDF('GENERIC', createDocData('Agreement for Sale', 'SA-2026-A105', 'Jan 15, 2026', 'Sale Agreement', 'Signed'), 'Sale_Agreement.pdf')}
                        />
                        <DocItem 
                            title="Terms & Conditions" 
                            id="TC-2026-A105" 
                            date="Jan 15, 2026" 
                            size="1.1 MB" 
                            status="Accepted"
                            onView={() => handleViewPDF('GENERIC', createDocData('Terms and Conditions', 'TC-2026-A105', 'Jan 15, 2026', 'T&C Document', 'Accepted'))}
                            onDownload={() => handleDownloadPDF('GENERIC', createDocData('Terms and Conditions', 'TC-2026-A105', 'Jan 15, 2026', 'T&C Document', 'Accepted'), 'Terms_and_Conditions.pdf')}
                        />
                    </div>
                </div>

                {/* Ownership */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-deepblue-900 flex items-center gap-2">
                        <CheckCircle size={18} className="text-gold-500" /> Ownership & Registration
                    </div>
                    <div className="divide-y divide-gray-100">
                        <DocItem 
                            title="Plot Allotment Letter" 
                            id="A-105" 
                            date="Jan 16, 2026" 
                            size="850 KB" 
                            status="Issued"
                            onView={() => handleViewPDF('GENERIC', createDocData('Allotment Letter', 'AL-2026-A105', 'Jan 16, 2026', 'Allotment Letter', 'Issued'))}
                            onDownload={() => handleDownloadPDF('GENERIC', createDocData('Allotment Letter', 'AL-2026-A105', 'Jan 16, 2026', 'Allotment Letter', 'Issued'), 'Allotment_Letter.pdf')}
                        />
                        <DocItem 
                            title="Plot Blueprint" 
                            id="Map-A105" 
                            date="Jan 2026" 
                            size="3.2 MB" 
                            status="Available"
                            onView={() => handleViewPDF('GENERIC', createDocData('Plot Blueprint', 'Map-A105', 'Jan 2026', 'Technical Blueprint', 'Available'))}
                            onDownload={() => handleDownloadPDF('GENERIC', createDocData('Plot Blueprint', 'Map-A105', 'Jan 2026', 'Technical Blueprint', 'Available'), 'Plot_Blueprint.pdf')}
                        />
                        <div className="p-4 flex justify-between items-center opacity-60 bg-gray-50/50">
                            <div>
                                <h5 className="font-bold text-gray-700">Registration Certificate</h5>
                                <p className="text-xs text-gray-500">Available after full payment (Jan 2031)</p>
                            </div>
                            <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded font-bold">Pending</span>
                        </div>
                    </div>
                </div>

                {/* Receipts */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden md:col-span-2">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-deepblue-900 flex items-center gap-2">
                        <DollarSign size={18} className="text-green-500" /> Payment Receipts
                    </div>
                    <div className="divide-y divide-gray-100">
                        <DocItem 
                            title="Initial Booking Receipt" 
                            id="BKG-2026-00145" 
                            date="Jan 15, 2026" 
                            size="150 KB" 
                            status="Paid" 
                            amount={formatAED(252500)}
                            onView={() => handleViewPDF('BOOKING', bookingData)}
                            onDownload={() => handleDownloadPDF('BOOKING', bookingData, 'RakOasis_Booking_Receipt.pdf')}
                        />
                        
                        <DocItem 
                            title="EMI Installment #1 - Feb 2026" 
                            id="EMI-2026-00234" 
                            date="Feb 01, 2026" 
                            size="120 KB" 
                            status="Paid" 
                            amount={formatAED(37875)}
                            onView={() => handleViewPDF('EMI', emiData)}
                            onDownload={() => handleDownloadPDF('EMI', emiData, 'RakOasis_EMI_Receipt_01.pdf')}
                        />
                        
                        <div className="p-4 text-center bg-gray-50">
                            <button className="text-xs font-bold text-blue-600 hover:underline">View All Historical Receipts</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
