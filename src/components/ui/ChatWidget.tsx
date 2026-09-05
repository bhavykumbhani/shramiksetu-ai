'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, ShieldCheck, Loader2, Mic, MicOff } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useSpeechToText } from '@/hooks/useSpeechToText';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  
  const { isListening, transcript, toggleListening, supported, setTranscript } = useSpeechToText('hi-IN');
  
  useEffect(() => {
    if (transcript) {
      setInput(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + transcript);
      setTranscript('');
    }
  }, [transcript, setTranscript]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Set initial greeting based on language
    const greetings = {
      en: "Namaskar! I am the ShramikSetu AI. How can I help you regarding government schemes, wages, or worker rights today?",
      hi: "नमस्कार! मैं ShramikSetu AI हूँ। आज मैं सरकारी योजनाओं, मजदूरी या अधिकारों के संबंध में आपकी कैसे सहायता कर सकता हूँ?",
      gu: "નમસ્કાર! હું ShramikSetu AI છું. સરકારી યોજનાઓ, વેતન અથવા અધિકારો અંગે હું આજે તમારી કેવી રીતે મદદ કરી શકું?"
    };
    if (messages.length === 0) {
      setMessages([{ role: 'ai', content: greetings[language] || greetings.en }]);
    }
  }, [language]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
      } else {
        throw new Error("No reply");
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I am having trouble connecting to the network right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50 flex-shrink-0"
          >
            {/* Header */}
            <div className="bg-[#0B3D91] text-white p-4 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-[#FF9933]"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-white text-[#0B3D91]">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold">ShramikSetu AI</h3>
                  <p className="text-xs text-blue-200">Official GovTech Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-blue-200 hover:text-white transition bg-transparent border-none cursor-pointer p-1 rounded hover:bg-blue-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#FF9933] text-white rounded-br-sm' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-bl-sm border border-slate-200 shadow-sm flex items-center gap-2 text-slate-500">
                    <Loader2 size={16} className="animate-spin text-[#0B3D91]" /> 
                    <span className="text-xs">Thinking deterministically...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form onSubmit={handleSend} className="relative flex items-center gap-2">
                {supported && (
                  <button 
                    type="button"
                    onClick={toggleListening}
                    className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-all border ${isListening ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                  >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                )}
                <div className="relative flex-1">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isListening ? "Listening..." : "Ask a question..."}
                    className="w-full bg-slate-50 border border-slate-200 rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-shadow"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-1.5 top-1.5 w-9 h-9 flex items-center justify-center bg-[#0B3D91] text-white rounded-full hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
                  >
                    <Send size={16} className="ml-0.5" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-40 border-none cursor-pointer transition-colors ${isOpen ? 'bg-slate-200 text-slate-500' : 'bg-[#0B3D91] text-white hover:bg-[#082a63]'}`}
      >
        <MessageSquare size={24} />
      </motion.button>
    </>
  );
}
