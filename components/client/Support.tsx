
import React from 'react';
import { Phone, MessageCircle, Mail } from 'lucide-react';

export const SupportView = () => (
    <div className="space-y-8 animate-fade-in-up pb-20">
        <h2 className="text-3xl font-serif font-bold text-deepblue-900">Support Center</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone size={24} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Call Us</h3>
                <p className="text-sm text-gray-500 mb-4">Mon-Fri from 9am to 6pm</p>
                <a href="tel:+97140000000" className="text-blue-600 font-bold hover:underline">+971 4 000 0000</a>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle size={24} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">WhatsApp</h3>
                <p className="text-sm text-gray-500 mb-4">Chat with our support team</p>
                <a href="#" className="text-green-600 font-bold hover:underline">Start Chat</a>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail size={24} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Email</h3>
                <p className="text-sm text-gray-500 mb-4">Send us your query anytime</p>
                <a href="mailto:support@rakoasis.com" className="text-purple-600 font-bold hover:underline">support@rakoasis.com</a>
            </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-deepblue-900 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
                <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-bold text-sm text-gray-800 mb-2">How can I pay my installments?</h4>
                    <p className="text-sm text-gray-600">You can pay via bank transfer, credit card, or crypto. Go to the Payments tab to see details.</p>
                </div>
                <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-bold text-sm text-gray-800 mb-2">When will I receive my ownership documents?</h4>
                    <p className="text-sm text-gray-600">The initial booking agreement is issued immediately. The final title deed is issued upon completion of 100% payment.</p>
                </div>
                <div>
                    <h4 className="font-bold text-sm text-gray-800 mb-2">Can I transfer my plot?</h4>
                    <p className="text-sm text-gray-600">Yes, plot transfer is allowed after 30% of the total amount has been paid, subject to developer approval and transfer fees.</p>
                </div>
            </div>
        </div>
    </div>
);
