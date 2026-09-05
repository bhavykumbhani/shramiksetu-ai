'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Award, BookOpen, MapPin, IndianRupee, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { CareerUpgradeOption } from '@/lib/agents/careerAgent';

export default function CareerUpgradePage() {
  const [pathways, setPathways] = useState<CareerUpgradeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/worker/career')
      .then(res => res.json())
      .then(data => {
        setPathways(data.pathways || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleEnroll = (role: string) => {
    setEnrolled(prev => ({ ...prev, [role]: true }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16 font-sans">
      <div className="bg-[#0B3D91] text-white py-2 px-6 text-sm flex justify-between items-center">
        <span>Government of Gujarat • Kaushalya Skill Development Mission</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8 space-y-8">
        <Link href="/worker/dashboard" className="inline-flex items-center text-sm font-bold text-[#0B3D91] hover:underline">
          <ArrowLeft size={16} className="mr-2" /> Back to Worker Dashboard
        </Link>

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#0B3D91] via-blue-900 to-indigo-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <TrendingUp size={240} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF9933] text-white text-xs font-black mb-4 shadow">
              <Sparkles size={14} /> Agent 8: Kaushalya Path AI
            </span>
            <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight">
              Double Your Daily Wage with Certified Skill Upgradation
            </h1>
            <p className="text-blue-100 text-base leading-relaxed">
              AI-analyzed career pathways connecting your current experience to high-demand technical roles certified by Govt ITI & Kaushalya Skill University.
            </p>
          </div>
        </div>

        {/* Pathways Grid */}
        {loading ? (
          <div className="py-16 text-center text-slate-500 font-bold animate-pulse flex flex-col items-center">
            <TrendingUp size={48} className="text-[#0B3D91] mb-4 animate-bounce" />
            Analyzing your skills & computing Gujarat wage upgrade pathways...
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-[#0B3D91] flex items-center gap-2">
              <Award className="text-[#FF9933]" /> Recommended Wage Upgrade Programs
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {pathways.map((path, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-black px-4 py-1.5 rounded-bl-2xl shadow">
                    +{path.wageIncreasePercent}% Daily Wage Jump
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2 mt-2">{path.targetRole}</h3>
                    <p className="text-xs text-slate-500 font-medium mb-6 flex items-center gap-1">
                      <BookOpen size={14} className="text-[#0B3D91]" /> {path.recommendedCourse}
                    </p>

                    {/* Wage Comparison Card */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-4 mb-6 text-center">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase block">Current Wage</span>
                        <span className="text-lg font-black text-slate-600 flex items-center justify-center gap-0.5">
                          <IndianRupee size={16} />{path.currentWage}/day
                        </span>
                      </div>
                      <div className="border-l border-slate-200">
                        <span className="text-[11px] font-bold text-[#138808] uppercase block">Target Wage</span>
                        <span className="text-2xl font-black text-[#138808] flex items-center justify-center gap-0.5">
                          <IndianRupee size={20} />{path.projectedWage}/day
                        </span>
                      </div>
                    </div>

                    {/* Program Details */}
                    <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                      <li className="flex items-center gap-2">
                        <MapPin size={16} className="text-blue-600 shrink-0" />
                        <span><strong>Training Provider:</strong> {path.trainingProvider}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Award size={16} className="text-[#FF9933] shrink-0" />
                        <span><strong>Duration:</strong> {path.durationWeeks} Weeks (Free Govt Sponsorship)</span>
                      </li>
                    </ul>

                    {/* Skills Covered */}
                    <div className="mb-6">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-2">Key Skills You Will Learn</span>
                      <div className="flex flex-wrap gap-1.5">
                        {path.keySkillsTaught.map((skill, sIdx) => (
                          <span key={sIdx} className="text-xs bg-blue-50 text-[#0B3D91] font-bold px-2.5 py-1 rounded-lg border border-blue-100">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    {enrolled[path.targetRole] ? (
                      <div className="w-full py-3.5 bg-green-50 text-[#138808] border border-green-200 rounded-2xl font-bold text-center text-sm flex items-center justify-center gap-2">
                        <CheckCircle2 size={18} /> Pre-Enrolled! ITI Center Will Contact You
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEnroll(path.targetRole)}
                        className="w-full py-3.5 bg-[#0B3D91] hover:bg-blue-900 text-white rounded-2xl font-bold transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
                      >
                        Enroll in Free Program <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
