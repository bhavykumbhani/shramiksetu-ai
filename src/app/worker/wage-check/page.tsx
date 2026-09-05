'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Briefcase, Calculator, AlertTriangle, Scale, Loader2 } from 'lucide-react';
import { WageGauge } from '@/components/ui/WageGauge';

export default function WageCheckPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    industry: 'Construction',
    category: 'Unskilled',
    pay_frequency: 'DAILY',
    pay_amount: '',
    days_per_month: '26'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/worker/wage-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.result) {
        setResult(data.result);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <div className="bg-[#0B3D91] text-white py-2 px-6 text-sm flex justify-between items-center shadow-md">
        <span className="font-semibold tracking-wide">Government of Gujarat | श्रमेव जयते</span>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        <Link href="/worker/dashboard" className="inline-flex items-center text-sm font-bold text-[#0B3D91] hover:text-[#FF9933] transition mb-6">
          <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
        </Link>
        
        <header className="border-l-4 border-[#0B3D91] pl-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-[#0B3D91] flex items-center gap-3">
            <Scale className="text-[#0B3D91]" size={36} /> 
            Wage Fairness Monitor
          </h2>
          <p className="text-slate-600 mt-2 font-medium">Compare your pay against the official Gujarat Minimum Wage Schedule (2024-25).</p>
        </header>

        <div className="grid md:grid-cols-5 gap-8">
          
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
                <Calculator size={18} className="text-[#0B3D91]"/> Pay Details
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Industry</label>
                  <select name="industry" value={formData.industry} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D91] outline-none text-sm">
                    <option value="Construction">Construction</option>
                    <option value="Textiles">Textiles / Garments</option>
                    <option value="Diamond">Diamond Polishing</option>
                    <option value="Agriculture">Agriculture / Farming</option>
                    <option value="Manufacturing">Factory / Manufacturing</option>
                    <option value="Hospitality">Hotel / Hospitality</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Skill Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D91] outline-none text-sm">
                    <option value="Unskilled">Unskilled (Helper/Mazdoor)</option>
                    <option value="Semi-Skilled">Semi-Skilled</option>
                    <option value="Skilled">Skilled (Mason/Artisan)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pay Frequency</label>
                  <select name="pay_frequency" value={formData.pay_frequency} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D91] outline-none text-sm">
                    <option value="DAILY">Daily (Dihaadi)</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pay Amount (₹)</label>
                  <input name="pay_amount" type="number" required value={formData.pay_amount} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D91] outline-none text-sm" placeholder="e.g. 400" />
                </div>
                {formData.pay_frequency === 'MONTHLY' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Days Worked per Month</label>
                    <input name="days_per_month" type="number" value={formData.days_per_month} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D91] outline-none text-sm" />
                  </div>
                )}
                
                <button type="submit" disabled={loading} className="w-full mt-4 px-4 py-3 bg-[#0B3D91] text-white font-bold rounded hover:bg-blue-800 transition shadow-md flex justify-center items-center gap-2">
                  {loading ? <Loader2 size={18} className="animate-spin"/> : "Verify Wage"}
                </button>
              </form>
            </div>
          </div>

          <div className="md:col-span-3">
            {!result && !loading && (
              <div className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100 h-full flex flex-col items-center justify-center text-center">
                <Briefcase size={48} className="text-blue-200 mb-4" />
                <h3 className="text-xl font-bold text-[#0B3D91] mb-2">Deterministic Verification</h3>
                <p className="text-slate-600 text-sm max-w-sm">Enter your pay details to securely check them against the official minimum wage rules for your tier and industry.</p>
              </div>
            )}
            
            {loading && (
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 h-full flex flex-col items-center justify-center">
                <Loader2 size={48} className="animate-spin text-[#0B3D91] mb-4" />
                <p className="text-slate-600 font-medium">Checking Official Schedules...</p>
              </div>
            )}

            {result && !loading && (
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
                <h3 className="text-2xl font-black text-slate-800 mb-8 border-b pb-4">Verification Result</h3>
                
                <WageGauge percentage={result.percentage} verdict={result.verdict} />

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Your Daily Pay</p>
                    <p className="text-2xl font-black text-slate-800">₹{result.workerDailyPay}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-600 font-bold uppercase mb-1">Official Minimum</p>
                    <p className="text-2xl font-black text-[#0B3D91]">₹{result.officialDailyMinimum}</p>
                  </div>
                </div>

                {!result.isFair && (
                  <div className="mt-6 bg-red-50 p-4 rounded-xl border border-red-200 flex gap-3">
                    <AlertTriangle className="text-red-600 shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-red-900">Wage Theft Detected</h4>
                      <p className="text-sm text-red-800 mt-1">You are being underpaid by <strong>₹{result.discrepancy} per day</strong> compared to the legal minimum for {formData.category} workers in {formData.industry}.</p>
                      <Link href="/worker/grievance" className="inline-block mt-3 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded shadow-sm hover:bg-red-700">
                        Report to e-Nyay
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
