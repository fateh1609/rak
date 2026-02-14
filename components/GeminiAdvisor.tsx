
import React, { useState, useRef, useEffect } from 'react';
import { getInvestmentAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Bot, Send, Loader2, Sparkles } from 'lucide-react';

export const GeminiAdvisor: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your AI Investment Advisor for the RAK Oasis project. Ask me about the location, ROI, or payment structure!' }
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await getInvestmentAdvice(userMsg);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I couldn't connect to the server.", isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-[400px] md:h-[500px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-deepblue-900 to-deepblue-800 p-4 flex items-center gap-3">
        <div className="bg-white/10 p-2 rounded-full">
          <Sparkles className="text-gold-400" size={20} />
        </div>
        <div>
          <h3 className="text-white font-semibold">AI Investment Advisor</h3>
          <p className="text-blue-200 text-xs">Powered by AI</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[80%] rounded-lg p-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-gold-500 text-white rounded-br-none' 
                : 'bg-white text-gray-800 shadow-sm border border-gray-200 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 rounded-bl-none">
              <Loader2 className="animate-spin text-gold-500" size={20} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 md:p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="E.g., Why invest in RAK?"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            aria-label="Send Message"
            className="bg-deepblue-900 text-white p-2 rounded-lg hover:bg-deepblue-800 disabled:opacity-50 transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
