"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, ShieldAlert, FileText, Send, UserX, Mic, MicOff } from 'lucide-react';
import GrievanceCard from '@/components/ui/GrievanceCard';
import { useSpeechToText } from '@/hooks/useSpeechToText';

export default function GrievancePage() {
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [grievances, setGrievances] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);

  const { isListening, transcript, toggleListening, supported, setTranscript } = useSpeechToText('hi-IN');

  useEffect(() => {
    fetchGrievances();
  }, []);

  useEffect(() => {
    if (transcript) {
      setDescription(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + transcript);
      setTranscript('');
    }
  }, [transcript, setTranscript]);

  const fetchGrievances = async () => {
    try {
      const res = await fetch('/api/worker/grievance');
      if (res.ok) {
        const data = await res.json();
        setGrievances(data.data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/worker/grievance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, anonymous }),
      });
      if (res.ok) {
        setSuccess(true);
        setDescription("");
        setAnonymous(false);
        fetchGrievances();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="bg-[#0B3D91] text-white py-2 px-6 text-sm flex justify-between items-center">
        <span>Government of Gujarat | श्रमेव जयते</span>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 mt-8 space-y-6">
        <Link href="/worker/dashboard" className="inline-flex items-center text-sm font-medium text-[#0B3D91] hover:underline">
          <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
        </Link>
        
        <header className="border-l-4 border-red-600 pl-4 mb-8">
          <h2 className="text-3xl font-extrabold text-[#0B3D91] flex items-center gap-3">
            <AlertTriangle className="text-red-600" /> 
            Grievance Portal (e-Nyay)
          </h2>
          <p className="text-slate-600 mt-2">File an official report. The AI engine will automatically analyze your issue and alert relevant authorities.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                <FileText size={20} className="text-[#FF9933]" />
                Submit New Grievance
              </h3>
              
              {success && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm">
                  Grievance submitted successfully. It is now under review.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <label className="block text-sm font-medium text-slate-700">
                      Describe your issue in detail (Hindi, English, or Gujarati)
                    </label>
                    {supported && (
                      <button 
                        type="button" 
                        onClick={toggleListening}
                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-colors shadow-sm border ${isListening ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'}`}
                      >
                        {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                        {isListening ? 'Stop Mic' : 'Speak (Hindi)'}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <textarea 
                      rows={5}
                      className={`w-full rounded-md shadow-sm focus:border-[#0B3D91] focus:ring focus:ring-[#0B3D91] focus:ring-opacity-50 border p-3 ${isListening ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-300'}`}
                      placeholder="E.g. Mujhe pichle 2 mahine se wages nahi mile. Contractor ka naam Ramesh hai. Surat mein kaam karta hu."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                    {isListening && (
                      <div className="absolute bottom-3 right-3 flex gap-1">
                         <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                         <span className="text-[10px] text-red-500 font-bold">Listening...</span>
                       </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-md border border-slate-200">
                  <input
                    type="checkbox"
                    id="anonymous"
                    className="rounded text-[#0B3D91] focus:ring-[#0B3D91]"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                  />
                  <label htmlFor="anonymous" className="text-sm text-slate-700 flex items-center gap-2 flex-1 cursor-pointer">
                    <UserX size={16} />
                    Submit Anonymously (Hide my identity)
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !description.trim()}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0B3D91] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B3D91] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Analyzing & Submitting...' : 'Submit Grievance'}
                  {!loading && <Send size={16} />}
                </button>
              </form>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert size={20} className="text-green-600" />
                <h3 className="text-lg font-bold text-slate-800">Your Protections</h3>
              </div>
              <ul className="text-sm text-slate-600 space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF9933] mt-1.5" />
                  Your identity is protected if you choose anonymous reporting.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF9933] mt-1.5" />
                  High severity issues (abuse, major theft) are escalated directly to District Labor Officers.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF9933] mt-1.5" />
                  You cannot be legally retaliated against for reporting safety violations.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {grievances.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-[#0B3D91] mb-6 border-b pb-2">Your Past Reports</h3>
            <div className="space-y-4">
              {grievances.map(g => (
                <GrievanceCard key={g.grievance_id} grievance={g} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
