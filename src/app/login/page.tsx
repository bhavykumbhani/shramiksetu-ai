'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserCheck, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [roleTab, setRoleTab] = useState<'WORKER' | 'ADMIN' | 'CONTRACTOR'>('WORKER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    
    if (res?.error) {
      setError(res.error);
    } else {
      if (email.includes('@gujarat.gov.in') || roleTab === 'ADMIN') {
        window.location.href = '/admin/dashboard';
      } else if (email.includes('contractor') || roleTab === 'CONTRACTOR') {
        window.location.href = '/contractor/dashboard';
      } else {
        window.location.href = '/worker/dashboard';
      }
    }
  };

  const handleAdminPreset = () => {
    setRoleTab('ADMIN');
    setEmail('admin@gujarat.gov.in');
    setPassword('admin123');
  };

  const handleWorkerPreset = () => {
    setRoleTab('WORKER');
    setEmail('worker@example.com');
    setPassword('worker123');
  };

  const handleContractorPreset = () => {
    setRoleTab('CONTRACTOR');
    setEmail('contractor@example.com');
    setPassword('contractor123');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center justify-center font-sans">
      {/* Header Badge */}
      <div className="bg-[#0B3D91] text-white text-xs px-4 py-1 rounded-full mb-6 font-semibold shadow-sm">
        Government of Gujarat | Official Sign-In
      </div>

      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
        
        {/* Role Toggle Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-xl mb-6">
          <button 
            type="button"
            onClick={handleWorkerPreset}
            className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${roleTab === 'WORKER' ? 'bg-white text-[#0B3D91] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <UserCheck size={14} /> Worker
          </button>
          <button 
            type="button"
            onClick={handleContractorPreset}
            className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${roleTab === 'CONTRACTOR' ? 'bg-[#FF9933] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <ShieldCheck size={14} /> Contractor
          </button>
          <button 
            type="button"
            onClick={handleAdminPreset}
            className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${roleTab === 'ADMIN' ? 'bg-[#0B3D91] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <ShieldAlert size={14} /> Admin
          </button>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {roleTab === 'ADMIN' ? 'State Admin Access' : roleTab === 'CONTRACTOR' ? 'Contractor Portal' : 'ShramikSetu Portal'}
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            {roleTab === 'ADMIN' ? 'Labor Department Official Command Center' : roleTab === 'CONTRACTOR' ? 'Find and Hire Verified Workers' : 'Access your digital worker passport & welfare schemes'}
          </p>
        </div>
        
        {error && <div className="p-3 mb-6 text-xs text-red-700 bg-red-100 rounded-lg">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="mt-1 w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B3D91] outline-none text-sm" 
              placeholder={roleTab === 'ADMIN' ? "official@gujarat.gov.in" : roleTab === 'CONTRACTOR' ? "contractor@example.com" : "worker@example.com"}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="mt-1 w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B3D91] outline-none text-sm" 
              placeholder="Enter password"
            />
          </div>

          {roleTab === 'ADMIN' && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-[11px] text-blue-800 font-medium">
              💡 <strong>Demo Mode:</strong> Any email containing <code>@gujarat.gov.in</code> will be automatically authenticated with full Administrator privileges.
            </div>
          )}

          <button 
            type="submit" 
            className={`w-full py-3 px-4 text-sm font-bold rounded-lg text-white transition-all shadow-md ${roleTab === 'ADMIN' ? 'bg-[#0B3D91] hover:bg-blue-900' : roleTab === 'CONTRACTOR' ? 'bg-[#FF9933] hover:bg-[#e68a2e]' : 'bg-[#FF9933] hover:bg-[#e68a2e]'}`}
          >
            {roleTab === 'ADMIN' ? 'Authenticate Admin Account' : roleTab === 'CONTRACTOR' ? 'Sign In as Contractor' : 'Sign In as Worker'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-[#138808]" /> SSL Encrypted</span>
          <span>ShramikSetu v1.0</span>
        </div>
      </div>
    </div>
  );
}
