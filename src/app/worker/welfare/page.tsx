'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle2, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { MatchedScheme } from '@/lib/agents/welfareAgent';

export default function WelfarePage() {
  const [schemes, setSchemes] = useState<MatchedScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSchemes() {
      try {
        const res = await fetch('/api/worker/welfare');
        if (!res.ok) {
          throw new Error('Failed to fetch schemes');
        }
        const json = await res.json();
        setSchemes(json.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchSchemes();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Eligible':
        return 'bg-[#138808] text-white';
      case 'Likely':
        return 'bg-[#FF9933] text-white';
      case 'Not Eligible':
        return 'bg-slate-200 text-slate-700';
      default:
        return 'bg-slate-200 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Eligible':
        return <CheckCircle2 size={18} />;
      case 'Likely':
        return <Info size={18} />;
      case 'Not Eligible':
        return <AlertCircle size={18} />;
      default:
        return null;
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
        
        <header className="border-l-4 border-[#138808] pl-4 mb-8">
          <h2 className="text-3xl font-extrabold text-[#0B3D91] flex items-center gap-3">
            <FileText className="text-[#138808]" /> 
            Welfare Schemes
          </h2>
          <p className="text-slate-600 mt-2">Checking your eligibility based on your Skill Passport data.</p>
        </header>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <RefreshCw className="animate-spin text-[#0B3D91] mr-3" size={32} />
            <span className="text-xl font-semibold text-slate-700">Evaluating your profile...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && schemes.length === 0 && (
          <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 text-center">
            <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">No Schemes Found</h3>
            <p className="text-slate-600 mt-2">Could not find any schemes in the database. Please ensure the seed script has been run.</p>
          </div>
        )}

        {!loading && !error && schemes.length > 0 && (
          <div className="grid gap-6">
            {schemes.map((scheme) => (
              <div key={scheme.scheme_id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-[#0B3D91]">{scheme.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">Source: {scheme.source} | Jurisdiction: {scheme.jurisdiction}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(scheme.eligibility_status)}`}>
                      {getStatusIcon(scheme.eligibility_status)}
                      {scheme.eligibility_status}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-slate-700">{scheme.description}</p>
                  </div>

                  <div className="mt-5 p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-3">
                    <Info className="text-slate-400 mt-0.5 shrink-0" size={20} />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700">AI Evaluation Reason:</h4>
                      <p className="text-sm text-slate-600 mt-1">{scheme.reason}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
