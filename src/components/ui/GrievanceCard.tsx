'use client';

import React, { useState } from "react";
import { AlertCircle, Calendar, MapPin, Building, ShieldAlert, Scale, Printer, X, FileCheck2, ShieldCheck } from "lucide-react";
import { LegalNoticeData } from "@/lib/agents/legalNoticeAgent";

interface GrievanceProps {
  grievance: {
    grievance_id: string;
    category: string;
    description: string;
    district: string | null;
    employer_alias: string | null;
    severity: string | null;
    status: string;
    createdAt: string;
    indicators?: {
      indicator_type: string;
      points: number;
    }[];
  };
}

export default function GrievanceCard({ grievance }: GrievanceProps) {
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [loadingNotice, setLoadingNotice] = useState(false);
  const [noticeData, setNoticeData] = useState<LegalNoticeData | null>(null);

  const isHighSeverity = grievance.severity === "HIGH";
  
  const statusColors: Record<string, string> = {
    OPEN: "bg-red-100 text-red-800 border-red-200",
    IN_PROGRESS: "bg-orange-100 text-orange-800 border-orange-200",
    RESOLVED: "bg-green-100 text-green-800 border-green-200",
  };

  const statusColor = statusColors[grievance.status] || "bg-gray-100 text-gray-800";
  const dateStr = new Date(grievance.createdAt).toLocaleDateString();

  const handleOpenNotice = async () => {
    setNoticeModalOpen(true);
    if (!noticeData) {
      setLoadingNotice(true);
      try {
        const res = await fetch('/api/worker/grievance/legal-notice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(grievance)
        });
        if (res.ok) {
          const data = await res.json();
          setNoticeData(data.notice);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingNotice(false);
      }
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              {grievance.category}
              {isHighSeverity && <AlertCircle className="w-4 h-4 text-red-500" />}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{grievance.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
            {grievance.status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{dateStr}</span>
          </div>
          
          {grievance.district && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="truncate">{grievance.district}</span>
            </div>
          )}

          {grievance.employer_alias && (
            <div className="flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-400" />
              <span className="truncate">{grievance.employer_alias}</span>
            </div>
          )}
          
          {grievance.severity && (
            <div className="flex items-center gap-1.5">
              <ShieldAlert className={`w-4 h-4 ${isHighSeverity ? 'text-red-500' : 'text-slate-400'}`} />
              <span className={`font-semibold ${isHighSeverity ? 'text-red-600' : ''}`}>
                {grievance.severity} Severity
              </span>
            </div>
          )}
        </div>

        {/* Action Toolbar */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {grievance.indicators?.map((ind, idx) => (
              <span 
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200"
              >
                {ind.indicator_type.replace(/_/g, ' ')}
                <span className="text-orange-600 font-bold">+{ind.points}pts</span>
              </span>
            ))}
          </div>

          <button
            onClick={handleOpenNotice}
            className="inline-flex items-center gap-2 bg-[#0B3D91] hover:bg-blue-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-sm transition"
          >
            <Scale size={14} className="text-[#FF9933]" />
            Generate AI Legal Notice
          </button>
        </div>
      </div>

      {/* Official Legal Notice Modal */}
      {noticeModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border-4 border-[#0B3D91] my-8">
            
            {/* Header */}
            <div className="bg-[#0B3D91] text-white p-6 relative">
              <button 
                onClick={() => setNoticeModalOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1.5 transition"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck size={32} className="text-[#FF9933]" />
                <div>
                  <h3 className="text-xl font-extrabold tracking-wide">STATE LEGAL DISPUTE NOTICE</h3>
                  <p className="text-xs text-blue-200">Labour & Employment Department • Government of Gujarat</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {loadingNotice ? (
                <div className="py-12 text-center text-slate-500 font-bold animate-pulse flex flex-col items-center">
                  <Scale size={40} className="text-[#0B3D91] mb-3 animate-bounce" />
                  Drafting Official Legal Notice & Statutory Citations...
                </div>
              ) : noticeData ? (
                <div id="printable-legal-notice" className="space-y-5 text-slate-900">
                  
                  {/* Notice Meta Badge */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-500 uppercase block">Ref Number</span>
                      <span className="font-mono font-black text-slate-800 text-sm">{noticeData.noticeNumber}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 uppercase block">Issue Date</span>
                      <span className="font-bold text-slate-800">{noticeData.issueDate}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 uppercase block">District Jurisdiction</span>
                      <span className="font-bold text-[#0B3D91]">{noticeData.district}</span>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="border-l-4 border-[#FF9933] pl-4 py-1">
                    <h4 className="font-extrabold text-base text-slate-900">{noticeData.subject}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Target Party: <strong className="text-slate-800">{noticeData.employer}</strong></p>
                  </div>

                  {/* Applicable Laws */}
                  <div>
                    <h5 className="text-xs font-black uppercase text-[#0B3D91] tracking-wider mb-2 flex items-center gap-1.5">
                      <FileCheck2 size={14} className="text-[#138808]" /> Statutory Indian Labor Law Citations
                    </h5>
                    <div className="space-y-2">
                      {noticeData.applicableLaws.map((law, idx) => (
                        <div key={idx} className="bg-blue-50/70 p-3 rounded-lg border border-blue-100 text-xs">
                          <div className="font-bold text-[#0B3D91] flex justify-between">
                            <span>{law.actName}</span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">{law.section}</span>
                          </div>
                          <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{law.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Formal Notice Content */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm leading-relaxed font-serif italic text-slate-800">
                    "{noticeData.noticeContent}"
                  </div>

                  {/* Recommendation & Seal */}
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs flex justify-between items-center gap-4">
                    <div>
                      <span className="font-bold text-amber-900 block mb-1">Notice Expiration / Response Window</span>
                      <p className="text-amber-800">{noticeData.timelineDays} Days from date of issuance before mandatory escalation to District Labor Inspector.</p>
                    </div>
                    <div className="shrink-0 text-center border-2 border-dashed border-amber-400 p-2 rounded-lg bg-white">
                      <span className="text-[10px] font-black text-amber-900 block">OFFICIAL E-NYAY SEAL</span>
                      <span className="text-[9px] text-emerald-700 font-bold">VERIFIED AGENT #7</span>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-6 text-red-500">Failed to load legal notice.</div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setNoticeModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Close Window
                </button>

                {noticeData && (
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-5 py-2.5 bg-[#138808] hover:bg-green-700 text-white text-sm font-bold rounded-xl shadow-md transition flex items-center gap-2"
                  >
                    <Printer size={16} /> Print / Save Legal Slip
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
}
