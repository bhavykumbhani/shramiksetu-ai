'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserPlus, Briefcase, MapPin, Loader2 } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    occupation: '',
    industry: '',
    current_district: '',
    origin_state: '',
  });

  const [skillData, setSkillData] = useState({
    skill_name: '',
    proficiency: 'BEGINNER',
    experience_months: '0'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSkillData({ ...skillData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create/Update Worker Profile
      await fetch('/api/worker/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // If a skill was entered, add it
      if (skillData.skill_name.trim() !== '') {
        await fetch('/api/worker/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(skillData),
        });
      }

      router.push('/worker/passport');
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Gov Header */}
      <div className="bg-[#0B3D91] text-white py-2 px-6 text-sm flex justify-between items-center shadow-md relative z-10">
        <span className="font-semibold tracking-wide">Government of Gujarat | श्रमेव जयते</span>
        <button onClick={() => {
          document.cookie = "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          window.location.href = "/api/auth/signout";
        }} className="text-xs font-bold text-blue-200 hover:text-white transition">
          Log Out
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          
          <div className="bg-gradient-to-r from-[#0B3D91] to-blue-700 p-8 text-white relative">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
             <div className="relative z-10 flex items-center gap-4">
               <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
                 <UserPlus size={32} className="text-[#FF9933]" />
               </div>
               <div>
                 <h2 className="text-3xl font-black tracking-tight">Worker Registration</h2>
                 <p className="text-blue-200 font-medium mt-1">Create your official Digital Skill Passport</p>
               </div>
             </div>
          </div>

          <form className="p-8 space-y-8" onSubmit={handleSubmit}>
            
            {/* Section 1: Basic Info */}
            <div>
              <h3 className="text-lg font-black text-[#0B3D91] border-b-2 border-slate-100 pb-2 mb-4 flex items-center gap-2">
                <UserPlus size={18} className="text-[#FF9933]" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                  <input name="name" type="text" required onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent outline-none transition" placeholder="e.g. Rahul Kumar" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Origin State</label>
                  <input name="origin_state" type="text" required onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent outline-none transition" placeholder="e.g. Bihar, UP" />
                </div>
              </div>
            </div>

            {/* Section 2: Current Work */}
            <div>
              <h3 className="text-lg font-black text-[#0B3D91] border-b-2 border-slate-100 pb-2 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-[#138808]" /> Current Placement in Gujarat
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Current District</label>
                  <select name="current_district" required onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent outline-none transition text-slate-700">
                    <option value="">Select District</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Surat">Surat</option>
                    <option value="Vadodara">Vadodara</option>
                    <option value="Rajkot">Rajkot</option>
                    <option value="Bhavnagar">Bhavnagar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Industry</label>
                  <select name="industry" required onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent outline-none transition text-slate-700">
                    <option value="">Select Industry</option>
                    <option value="Construction">Construction</option>
                    <option value="Textiles">Textiles</option>
                    <option value="Diamond">Diamond Polishing</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Manufacturing">Manufacturing</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Occupation / Job Title</label>
                  <input name="occupation" type="text" required onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent outline-none transition" placeholder="e.g. Mason, Weaver, Polisher" />
                </div>
              </div>
            </div>

            {/* Section 3: Primary Skill */}
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
              <h3 className="text-lg font-black text-[#0B3D91] mb-4 flex items-center gap-2">
                <Briefcase size={18} className="text-[#0B3D91]" /> Declare Primary Skill
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Skill Name</label>
                  <input name="skill_name" type="text" onChange={handleSkillChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B3D91] outline-none text-sm" placeholder="e.g. Welding" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Proficiency</label>
                  <select name="proficiency" onChange={handleSkillChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B3D91] outline-none text-sm">
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Experience (Months)</label>
                  <input name="experience_months" type="number" min="0" onChange={handleSkillChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B3D91] outline-none text-sm" placeholder="e.g. 24" />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <ShieldCheck size={16} className="text-[#138808]" />
                Your data is secured by Gujarat Govt.
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-3 bg-[#FF9933] text-white font-bold rounded-lg hover:bg-[#e68a2e] transition shadow-md flex items-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                {loading ? 'Saving...' : 'Generate Passport'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
