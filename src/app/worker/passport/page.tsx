'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, MapPin, Briefcase, Download, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { GujaratDistrictMap } from '@/components/ui/GujaratDistrictMap';

export default function DigitalPassport() {
  const router = useRouter();
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/worker/me')
      .then(res => {
        if (res.status === 401) {
          router.push('/login');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data && data.worker) {
          setWorker(data.worker);
        } else {
          router.push('/worker/onboarding');
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-[#0B3D91]" size={40} />
        <p className="text-slate-500 font-medium text-sm">Verifying Digital Identity...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Gov Header */}
      <div className="bg-[#0B3D91] text-white py-2 px-6 text-sm flex justify-between items-center shadow-md z-10 relative">
        <span className="font-semibold tracking-wide">Government of Gujarat | श्रमेव जयते</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <Link href="/worker/dashboard" className="inline-flex items-center text-sm font-bold text-[#0B3D91] hover:text-[#FF9933] transition mb-4">
              <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Digital Skill Passport
              <ShieldCheck className="text-[#138808]" size={32} />
            </h1>
            <p className="text-slate-600 mt-2 font-medium">Verified inter-state credential record.</p>
          </div>
          
          <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#0B3D91] text-[#0B3D91] font-bold rounded-lg hover:bg-blue-50 transition shadow-sm">
            <Download size={18} /> Download PDF
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Identity Card Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative">
              <div className="h-24 bg-gradient-to-br from-[#0B3D91] to-[#082a63] relative">
                 <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
              </div>
              
              <div className="px-6 pb-6 relative">
                <div className="w-24 h-24 bg-white rounded-xl shadow-md border-4 border-white -mt-12 mb-4 flex items-center justify-center text-[#0B3D91]">
                   <User size={48} />
                </div>
                
                <h2 className="text-2xl font-black text-slate-900">{worker?.name || 'Unknown Name'}</h2>
                <div className="flex items-center gap-1 text-[#FF9933] font-bold text-sm mb-4">
                  Shramik ID: {worker?.worker_id?.substring(0,8).toUpperCase() || 'PNDG-0000'}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                    <Briefcase size={16} className="text-[#0B3D91]"/> 
                    {worker?.occupation || 'Unspecified'} ({worker?.industry || 'Unspecified'})
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                    <MapPin size={16} className="text-[#138808]"/> 
                    {worker?.current_district || 'Unspecified District'}, GJ
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                    <span className="w-4 text-center font-black text-[#0B3D91]">A</span> 
                    Origin: {worker?.origin_state || 'Unknown'}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                   <div>
                     <p className="text-xs text-slate-400 font-bold uppercase">e-Shram Linked</p>
                     <p className="text-sm font-bold text-slate-800">Verified ✅</p>
                   </div>
                   {/* Mock QR Code */}
                   <div className="w-16 h-16 bg-slate-100 p-1 rounded-lg border border-slate-200">
                     <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-cover opacity-80"></div>
                   </div>
                </div>
              </div>
            </div>

            <GujaratDistrictMap district={worker?.current_district} />
          </div>

          {/* Skills Column */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-[#0B3D91]">Verified Skill Ledger</h3>
                <Link href="/worker/onboarding" className="text-sm font-bold text-[#FF9933] hover:underline">
                  + Add Skill
                </Link>
              </div>

              {worker?.skills && worker.skills.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {worker.skills.map((skill: any) => (
                    <SkillBadge 
                      key={skill.id}
                      skillName={skill.skill_name}
                      proficiency={skill.proficiency}
                      experienceMonths={skill.experience_months}
                      verificationStatus={skill.verification_status}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <Briefcase size={40} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 font-medium">No skills registered yet.</p>
                  <Link href="/worker/onboarding" className="mt-4 inline-block px-4 py-2 bg-[#0B3D91] text-white text-sm font-bold rounded shadow">
                    Register Skills Now
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-orange-50 rounded-2xl border border-orange-200 p-6 flex items-start gap-4 shadow-sm">
               <ShieldCheck className="text-[#FF9933] shrink-0" size={28} />
               <div>
                 <h4 className="font-bold text-orange-900 mb-1">Portability Guarantee</h4>
                 <p className="text-sm text-orange-800 leading-relaxed font-medium">
                   This digital passport is cryptographically signed. Your skills and experience carry over securely across any contractor or district within Gujarat, ensuring fair minimum wage classification based on your tier.
                 </p>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}