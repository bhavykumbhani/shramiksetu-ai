'use client';

import React from 'react';
import { X, ShieldCheck, Printer, FileCheck2, Scale, CheckCircle2, Lock } from 'lucide-react';
import { DigitalAgreementData } from '@/lib/agents/contractAgreementAgent';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  agreement: DigitalAgreementData | null;
}

export default function DigitalAgreementModal({ isOpen, onClose, agreement }: ModalProps) {
  if (!isOpen || !agreement) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[110] p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border-4 border-[#138808] my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#138808] to-emerald-800 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1.5 transition"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/15 rounded-2xl">
              <ShieldCheck size={32} className="text-[#FF9933]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest font-black bg-white/20 px-2 py-0.5 rounded text-emerald-100">
                HakKosh Digital Agreement Engine
              </span>
              <h3 className="text-xl font-black tracking-wide mt-1">DIGITAL WAGE LOCK CERTIFICATE</h3>
              <p className="text-xs text-emerald-100 font-medium">State of Gujarat • Labor Rights Guarantee Portal</p>
            </div>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-6 space-y-6 text-slate-900">
          
          {/* Certificate Metadata Bar */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="font-bold text-slate-400 uppercase block text-[10px]">Certificate ID</span>
              <span className="font-mono font-black text-[#138808] text-xs">{agreement.agreementId}</span>
            </div>
            <div className="border-x border-emerald-200">
              <span className="font-bold text-slate-400 uppercase block text-[10px]">Date Signed</span>
              <span className="font-bold text-slate-800">{agreement.issueDate}</span>
            </div>
            <div>
              <span className="font-bold text-slate-400 uppercase block text-[10px]">Status</span>
              <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                LEGAL BINDING
              </span>
            </div>
          </div>

          {/* Binding Parties */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-bold uppercase block text-[10px]">Worker (Party A)</span>
              <span className="font-black text-slate-800 text-sm block mt-0.5">{agreement.workerName}</span>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span className="text-slate-400 font-bold uppercase block text-[10px]">Contractor (Party B)</span>
              <span className="font-black text-slate-800 text-sm block mt-0.5">{agreement.contractorName}</span>
            </div>
          </div>

          {/* Agreed Wage & Shift */}
          <div className="bg-gradient-to-r from-[#0B3D91] to-blue-900 text-white p-5 rounded-2xl shadow-md flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-blue-200 uppercase block">Agreed Daily Pay Rate</span>
              <div className="text-3xl font-black text-[#FF9933] flex items-center gap-0.5">
                ₹{agreement.agreedDailySalary} <span className="text-sm text-white font-medium">/ day</span>
              </div>
              <span className="text-[11px] text-blue-200 mt-1 block font-medium">
                Shift: {agreement.workingHoursPerDay} Hours • Overtime Rate: {agreement.overtimeRateMultiplier}x
              </span>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/20 text-center shrink-0">
              <Lock size={24} className="text-[#FF9933] mx-auto mb-1" />
              <span className="text-[9px] font-bold tracking-widest text-blue-100 uppercase block">WAGE LOCKED</span>
            </div>
          </div>

          {/* Statutory Clauses */}
          <div>
            <h4 className="text-xs font-black uppercase text-[#0B3D91] tracking-wider mb-2 flex items-center gap-1.5">
              <FileCheck2 size={14} className="text-[#138808]" /> Statutory Gujarat Labor Act Protections
            </h4>
            <ul className="space-y-2 text-xs">
              {agreement.statutoryClauses.map((clause, idx) => (
                <li key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start gap-2 text-slate-700">
                  <CheckCircle2 size={14} className="text-[#138808] shrink-0 mt-0.5" />
                  <span>{clause}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* QR Verification Seal */}
          <div className="bg-slate-100 p-3.5 rounded-2xl border border-slate-300 flex justify-between items-center text-xs">
            <div>
              <span className="font-mono font-bold text-slate-700 block">VERIFICATION CODE: {agreement.verificationCode}</span>
              <span className="text-[10px] text-slate-500">Tamper-proof digital hash logged on ShramikSetu State Registry.</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-300 font-mono text-[9px] font-black text-[#0B3D91] shrink-0">
              STATE STAMP 2026
            </div>
          </div>

          {/* Footer Action */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Close Window
            </button>
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-[#138808] hover:bg-green-700 text-white text-sm font-bold rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Printer size={16} /> Print / Save Certificate
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
