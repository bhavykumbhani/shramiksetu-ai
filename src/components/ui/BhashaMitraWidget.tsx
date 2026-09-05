'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Languages, X, Sparkles, ArrowRightLeft, Copy, Check } from 'lucide-react';
import { useSpeechToText } from '@/hooks/useSpeechToText';

export default function BhashaMitraWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sourceLang, setSourceLang] = useState<'hi' | 'gu' | 'en'>('hi');
  const [targetLang, setTargetLang] = useState<'hi' | 'gu' | 'en'>('gu');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [translating, setTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const { isListening, transcript, toggleListening, supported, setTranscript } = useSpeechToText(
    sourceLang === 'hi' ? 'hi-IN' : sourceLang === 'gu' ? 'gu-IN' : 'en-US'
  );

  useEffect(() => {
    if (transcript) {
      setInputText(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + transcript);
      setTranscript('');
    }
  }, [transcript, setTranscript]);

  const handleSwap = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setTranslating(true);
    try {
      const res = await fetch('/api/assistant/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, sourceLang, targetLang })
      });
      if (res.ok) {
        const data = await res.json();
        setTranslatedText(data.translatedText);
        speakOutput(data.translatedText, targetLang);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTranslating(false);
    }
  };

  const speakOutput = (text: string, lang: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'gu' ? 'gu-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.9;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-[90] bg-[#0B3D91] hover:bg-blue-900 text-white font-black py-3 px-5 rounded-full shadow-2xl flex items-center gap-2.5 border-2 border-[#FF9933] transition-all transform hover:scale-105"
      >
        <Languages size={20} className="text-[#FF9933] animate-pulse" />
        <span className="text-xs tracking-wide uppercase">Bhasha Mitra AI</span>
      </button>

      {/* Widget Modal Window */}
      {isOpen && (
        <div className="fixed bottom-20 left-6 z-[100] w-[90vw] max-w-md bg-white rounded-3xl shadow-2xl border-4 border-[#0B3D91] overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-[#0B3D91] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/10 rounded-xl">
                <Languages size={20} className="text-[#FF9933]" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  Bhasha Mitra <Sparkles size={12} className="text-[#FF9933]" />
                </h3>
                <p className="text-[10px] text-blue-200">Agent 13 • Real-Time Voice & Dialect Translator</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1 rounded-full transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Language Selector Bar */}
          <div className="bg-slate-100 p-3 flex items-center justify-between border-b border-slate-200 text-xs font-bold">
            <select 
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value as any)}
              className="bg-white border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
            >
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="gu">Gujarati (ગુજરાતી)</option>
              <option value="en">English</option>
            </select>

            <button 
              onClick={handleSwap}
              className="p-2 bg-white hover:bg-slate-200 rounded-full border border-slate-300 text-[#0B3D91] transition"
              title="Swap Languages"
            >
              <ArrowRightLeft size={14} />
            </button>

            <select 
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value as any)}
              className="bg-white border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
            >
              <option value="gu">Gujarati (ગુજરાતી)</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Content Area */}
          <div className="p-4 space-y-4">
            
            {/* Input Box */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Speak or Type Original Message</span>
                {supported && (
                  <button 
                    type="button" 
                    onClick={toggleListening}
                    className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border transition ${isListening ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'}`}
                  >
                    {isListening ? <MicOff size={12} /> : <Mic size={12} />}
                    {isListening ? 'Listening...' : 'Voice Input'}
                  </button>
                )}
              </div>
              <textarea 
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Speak or type labor terms e.g. Mujhe ₹700 per day salary chahiye..."
                className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0B3D91] outline-none text-slate-800"
              />
            </div>

            {/* Translate Button */}
            <button
              onClick={handleTranslate}
              disabled={translating || !inputText.trim()}
              className="w-full py-2.5 bg-[#0B3D91] hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {translating ? 'Translating & Generating Audio...' : 'Translate & Read Aloud'}
            </button>

            {/* Output Box */}
            {translatedText && (
              <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 space-y-2 relative">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-[#0B3D91] uppercase flex items-center gap-1">
                    <Volume2 size={14} className={isSpeaking ? 'animate-bounce text-[#FF9933]' : ''} /> 
                    Translated Speech ({targetLang.toUpperCase()})
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => speakOutput(translatedText, targetLang)}
                      className="p-1 text-[#0B3D91] hover:bg-blue-100 rounded"
                      title="Replay Audio"
                    >
                      <Volume2 size={16} />
                    </button>
                    <button 
                      onClick={copyToClipboard}
                      className="p-1 text-slate-600 hover:bg-blue-100 rounded"
                      title="Copy Text"
                    >
                      {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                  {translatedText}
                </p>

                {isSpeaking && (
                  <div className="flex items-center gap-1 text-[10px] text-[#FF9933] font-bold">
                    <span className="w-1.5 h-1.5 bg-[#FF9933] rounded-full animate-ping"></span>
                    Reading aloud in {targetLang === 'gu' ? 'Gujarati' : targetLang === 'hi' ? 'Hindi' : 'English'}...
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
