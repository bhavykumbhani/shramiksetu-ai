'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, ShieldCheck, MapPin, Briefcase, FileText, AlertTriangle, ArrowRight, Bell, ExternalLink, PhoneCall, Phone, IndianRupee, Calendar, UserPlus, CheckCircle2, TrendingUp, Scale } from 'lucide-react';
import DigitalAgreementModal from '@/components/ui/DigitalAgreementModal';
import { DigitalAgreementData } from '@/lib/agents/contractAgreementAgent';

export default function WorkerDashboard() {
  const router = useRouter();
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Agent 14 Agreement Modal state
  const [selectedAgreement, setSelectedAgreement] = useState<DigitalAgreementData | null>(null);
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [generatingAgreement, setGeneratingAgreement] = useState(false);

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
        if (data && !data.worker) {
          router.push('/worker/onboarding');
        } else if (data && data.worker) {
          setWorker(data.worker);
          // Fetch notifications after worker profile is verified
          fetch('/api/worker/notifications')
            .then(res => res.json())
            .then(nots => setNotifications(nots || []))
            .catch(console.error);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const markAllRead = async () => {
    try {
      await fetch('/api/worker/notifications/mark-read', { method: 'POST', body: JSON.stringify({}) });
      setNotifications(notifications.map(n => ({...n, isRead: true})));
    } catch (e) { console.error(e); }
  };

  const [applyingTo, setApplyingTo] = useState<Record<string, boolean>>({});
  const handleApply = async (jobPostId: string, notifId: string) => {
    setApplyingTo(prev => ({...prev, [jobPostId]: true}));
    try {
      await fetch('/api/worker/apply', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ jobPostId, notificationId: notifId })
      });
      alert("Application sent successfully!");
    } catch (e) { console.error(e); }
  };

  const handleGenerateAgreement = async (jobTitle: string, salary: number, district: string, contractorName?: string, description?: string) => {
    setGeneratingAgreement(true);
    try {
      const res = await fetch('/api/worker/apply/agreement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          contractorName: contractorName || "Verified Contractor",
          workerName: worker?.name || "Registered Worker",
          salary,
          district,
          description
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedAgreement(data.agreement);
        setIsAgreementModalOpen(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingAgreement(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9933]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Gov Header */}
      <div className="bg-[#0B3D91] text-white py-2 px-6 text-sm flex justify-between items-center">
        <span>Government of Gujarat | श्रमेव जयते</span>
        <span className="font-semibold text-[#FF9933]">ShramikSetu AI</span>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white border-b-4 border-[#FF9933] px-6 py-4 flex justify-between items-center shadow-sm relative z-50">
        <h1 className="text-2xl font-bold text-[#0B3D91] flex items-center gap-2">
          <ShieldCheck className="text-[#138808]" size={28} />
          ShramikSetu Platform
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications && notifications.some(n => !n.isRead)) {
                  markAllRead();
                }
              }}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-full relative transition"
            >
              <Bell size={20} />
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">No new notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`p-4 border-b border-slate-100 last:border-0 ${!n.isRead ? 'bg-blue-50/50' : ''}`}>
                        <h4 className="text-sm font-bold text-slate-800">{n.title}</h4>
                        <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-2 block">{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <span className="text-sm font-medium text-slate-700 hidden sm:inline">Namaskar, {worker?.name?.split(' ')[0] || 'Worker'}</span>
          <div className="w-10 h-10 rounded-full bg-[#e6f0fa] border border-[#0B3D91] flex items-center justify-center text-[#0B3D91] font-bold">
            {worker?.name?.charAt(0) || 'W'}
          </div>
          <button 
            onClick={() => {
              document.cookie = "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
              window.location.href = "/api/auth/signout";
            }} 
            className="ml-2 text-xs font-bold px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition"
          >
            Log Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
        
        {/* Motivational Banner */}
        <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
          <img src="https://images.unsplash.com/photo-1541888086925-0c13bb3a453f?auto=format&fit=crop&q=80&w=1200" alt="Construction Worker" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B3D91]/90 to-[#0B3D91]/40"></div>
          <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Build Your Future, Safely.</h2>
            <p className="text-blue-100 text-sm md:text-lg max-w-lg">ShramikSetu AI empowers your hard work by ensuring fair wages, securing your welfare, and mapping your skills to new opportunities.</p>
          </div>
        </div>

        {/* Worker Info Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border-2 border-slate-200 shrink-0">
               <User size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">{worker?.occupation || 'Occupation not set'}</h3>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-slate-600 mt-1">
                <span className="flex items-center gap-1 font-medium"><Briefcase size={16} className="text-[#0B3D91]"/> {worker?.industry || 'Industry not set'}</span>
                <span className="flex items-center gap-1 font-medium"><MapPin size={16} className="text-[#138808]"/> {worker?.current_district || 'District not set'}, Gujarat</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/worker/career" className="px-5 py-3 bg-[#0B3D91] text-white font-bold rounded-lg hover:bg-blue-900 transition inline-flex items-center justify-center gap-2 shadow-sm whitespace-nowrap text-sm">
              <TrendingUp size={18} className="text-[#FF9933]" /> Double Wage (Kaushalya AI)
            </Link>
            <Link href="/worker/passport" className="px-5 py-3 bg-[#FF9933] text-white font-bold rounded-lg hover:bg-[#e68a2e] transition inline-flex items-center justify-center gap-2 shadow-sm whitespace-nowrap text-sm">
              <User size={18} /> Digital Passport
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            {/* Job Offers Section */}
            {notifications.filter(n => n.type === 'JOB_OFFER' || n.type === 'JOB_POST_MATCH').length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
                  <Briefcase className="text-[#0B3D91]" size={20} /> New Job Opportunities
                </h3>
                <div className="grid gap-4">
                  {notifications.filter(n => n.type === 'JOB_OFFER' || n.type === 'JOB_POST_MATCH').map(n => {
                    let meta: any = {};
                    try { meta = JSON.parse(n.metadata); } catch(e){}
                    return (
                      <div key={n.id} className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-[#138808] flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-lg text-slate-900">{n.title.replace('Job Offer: ', '').replace('Hiring Match: ', '')}</h4>
                            {meta?.trustScore && (
                              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0B3D91] border border-blue-200">
                                🌟 AI TrustScore: {meta.trustScore}/100
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
                            <span className="flex items-center gap-1 font-semibold text-green-700"><IndianRupee size={14}/> {meta?.salary}/day</span>
                            <span className="flex items-center gap-1"><MapPin size={14}/> {meta?.location}</span>
                            <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(n.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-slate-500 mt-2 line-clamp-2">{meta?.description}</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                          <button
                            onClick={() => handleGenerateAgreement(
                              n.title.replace('Job Offer: ', '').replace('Hiring Match: ', ''),
                              meta?.salary || 600,
                              meta?.location || 'Gujarat',
                              meta?.contractorEmail ? meta.contractorEmail.split('@')[0] : 'Verified Contractor',
                              meta?.description
                            )}
                            disabled={generatingAgreement}
                            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#138808] border border-emerald-200 font-bold rounded-lg transition text-xs flex items-center justify-center gap-1.5 whitespace-nowrap"
                          >
                            <Scale size={14} className="text-[#138808]" /> View Wage Lock Contract
                          </button>

                          {n.type === 'JOB_POST_MATCH' ? (
                            <button 
                              onClick={() => handleApply(meta.jobPostId, n.id)}
                              disabled={applyingTo[meta.jobPostId]}
                              className={`px-4 py-2 font-bold text-xs rounded-lg transition whitespace-nowrap flex items-center justify-center gap-2 border ${applyingTo[meta.jobPostId] ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-[#0B3D91] text-white hover:bg-blue-800 border-[#0B3D91]'}`}
                            >
                              {applyingTo[meta.jobPostId] ? <CheckCircle2 size={16} /> : <UserPlus size={16} />}
                              {applyingTo[meta.jobPostId] ? 'Applied' : 'Apply Now'}
                            </button>
                          ) : (
                            <a href={`mailto:${meta?.contractorEmail}?subject=Accepting Job Offer: ${n.title}`} className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 font-bold text-xs rounded-lg transition whitespace-nowrap flex items-center justify-center gap-2 border border-green-200">
                              <Phone size={16} /> Contact Firm
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Grid */}
            <h3 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4">Government Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/worker/welfare" className="group bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-[#FF9933] transition block relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-[#138808]"></div>
                <div className="w-10 h-10 rounded bg-green-50 border border-green-100 flex items-center justify-center text-green-700 mb-3 group-hover:bg-green-100 transition-colors"><FileText size={20} /></div>
                <h3 className="text-md font-bold text-[#0B3D91] mb-1">Check Welfare</h3>
                <p className="text-xs text-slate-600 mb-3">Verify eligibility for official benefits.</p>
                <span className="text-[#FF9933] font-semibold text-xs flex items-center gap-1">Access Service <ArrowRight size={14} /></span>
              </Link>
              <Link href="/worker/wage-check" className="group bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-[#FF9933] transition block relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-[#0B3D91]"></div>
                <div className="w-10 h-10 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0B3D91] mb-3 group-hover:bg-blue-100 transition-colors"><Briefcase size={20} /></div>
                <h3 className="text-md font-bold text-[#0B3D91] mb-1">Wage Check</h3>
                <p className="text-xs text-slate-600 mb-3">Verify your wages meet legal minimums.</p>
                <span className="text-[#FF9933] font-semibold text-xs flex items-center gap-1">Access Service <ArrowRight size={14} /></span>
              </Link>
              <Link href="/worker/grievance" className="group bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-[#FF9933] transition block relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-red-600"></div>
                <div className="w-10 h-10 rounded bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mb-3 group-hover:bg-red-100 transition-colors"><AlertTriangle size={20} /></div>
                <h3 className="text-md font-bold text-[#0B3D91] mb-1">e-Nyay Grievance</h3>
                <p className="text-xs text-slate-600 mb-3">Report workplace safety or wage theft.</p>
                <span className="text-[#FF9933] font-semibold text-xs flex items-center gap-1">Access Service <ArrowRight size={14} /></span>
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            {/* Scheme Advertisements */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-[#138808] p-3 text-white text-center font-bold text-sm">Govt Highlight: Shramik Annapurna</div>
              <img src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=600" alt="Food" className="w-full h-32 object-cover" />
              <div className="p-4">
                <h4 className="font-bold text-slate-800 text-sm mb-1">Subsidized Nutritious Meals</h4>
                <p className="text-xs text-slate-600 mb-3">Registered construction workers can avail nutritious meals at just ₹5 at designated Kadiyanakas.</p>
                <Link href="/worker/welfare" className="text-[#FF9933] text-xs font-bold flex items-center gap-1">Check Eligibility <ExternalLink size={12}/></Link>
              </div>
            </div>

            {/* Helpline Numbers */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 border-b pb-2 mb-3 flex items-center gap-2">
                <PhoneCall className="text-red-600" size={18} /> Emergency Helplines
              </h3>
              <ul className="space-y-3">
                <li className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Labor Dept Toll-Free</span>
                  <a href="tel:155372" className="font-bold text-[#0B3D91] bg-blue-50 px-2 py-1 rounded">155372</a>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Women Helpline</span>
                  <a href="tel:181" className="font-bold text-[#0B3D91] bg-blue-50 px-2 py-1 rounded">181</a>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Medical Emergency</span>
                  <a href="tel:108" className="font-bold text-[#0B3D91] bg-blue-50 px-2 py-1 rounded">108</a>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Police</span>
                  <a href="tel:100" className="font-bold text-[#0B3D91] bg-blue-50 px-2 py-1 rounded">100</a>
                </li>
              </ul>
            </div>
          </div>
          
        </div>
      </div>

      <DigitalAgreementModal 
        isOpen={isAgreementModalOpen} 
        onClose={() => setIsAgreementModalOpen(false)} 
        agreement={selectedAgreement} 
      />
    </div>
  );
}