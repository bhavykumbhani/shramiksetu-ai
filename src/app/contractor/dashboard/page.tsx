'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, UserPlus, FileText, CheckCircle2, Megaphone, Clock, IndianRupee, Users } from 'lucide-react';

interface WorkerData {
  worker_id: string;
  first_name: string;
  current_district: string | null;
  industry: string | null;
  experience_months: number | null;
  skills: string[];
}

export default function ContractorDashboard() {
  const [activeTab, setActiveTab] = useState('SEARCH');
  const [jobHistory, setJobHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  
  // Search state
  const [district, setDistrict] = useState('');
  const [industry, setIndustry] = useState('');
  const [skill, setSkill] = useState('');
  const [results, setResults] = useState<WorkerData[]>([]);
  const [loading, setLoading] = useState(false);
  const [offered, setOffered] = useState<Record<string, boolean>>({});

  // Job post state
  const [jobPost, setJobPost] = useState({ title: '', industry: '', skill: '', district: '', salary: '', description: '' });
  const [posting, setPosting] = useState(false);

  const handleBroadcastJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    try {
      const res = await fetch('/api/contractor/job-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobPost)
      });
      if (res.ok) {
        const data = await res.json();
        alert(`Job Broadcasted Successfully! Notified ${data.matchedCount} eligible workers in ${jobPost.district}.`);
        setJobPost({ title: '', industry: '', skill: '', district: '', salary: '', description: '' });
      } else {
        alert("Failed to broadcast job.");
      }
    } catch (e) {
      console.error(e);
    }
    setPosting(false);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (district) params.append('district', district);
      if (industry) params.append('industry', industry);
      if (skill) params.append('skill', skill);

      const res = await fetch(`/api/contractor/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [offerModal, setOfferModal] = useState<{ isOpen: boolean; workerId: string; title: string; salary: string; location: string; description: string }>({ isOpen: false, workerId: '', title: '', salary: '', location: '', description: '' });

  const handleOpenOffer = (workerId: string) => {
    setOfferModal({ isOpen: true, workerId, title: '', salary: '', location: '', description: '' });
  };

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contractor/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          worker_id: offerModal.workerId,
          title: offerModal.title,
          salary: offerModal.salary,
          location: offerModal.location,
          description: offerModal.description
        })
      });
      if (res.ok) {
        setOffered(prev => ({ ...prev, [offerModal.workerId]: true }));
        setOfferModal({ isOpen: false, workerId: '', title: '', salary: '', location: '', description: '' });
        alert("Job offer sent successfully! The worker will receive a notification.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Optional: load some initial data
  useEffect(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    if (activeTab === 'HISTORY') {
      setLoadingHistory(true);
      fetch('/api/contractor/job-post')
        .then(res => res.json())
        .then(data => setJobHistory(data || []))
        .catch(console.error)
        .finally(() => setLoadingHistory(false));
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar */}
      <nav className="bg-[#0B3D91] text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Briefcase size={24} />
          <h1 className="text-xl font-bold">Labor Contractor Portal</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">Welcome, Contractor</div>
          <button 
            onClick={() => {
              document.cookie = "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
              window.location.href = "/api/auth/signout";
            }}
            className="text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition"
          >
            Secure Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 mt-4">
        
        {/* Motivational Banner */}
        <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden shadow-lg border border-slate-200 mb-8">
          <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200" alt="Construction Site" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B3D91]/90 to-[#0B3D91]/40"></div>
          <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Build India's Infrastructure.</h2>
            <p className="text-blue-100 text-sm md:text-lg max-w-lg">Find verified talent instantly. ShramikSetu AI connects you with thousands of skilled workers ready to work.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200 mb-6 bg-white px-4 pt-4 rounded-t-xl shadow-sm">
          <button 
            onClick={() => setActiveTab('SEARCH')} 
            className={`pb-3 font-bold text-sm flex items-center gap-2 ${activeTab === 'SEARCH' ? 'text-[#0B3D91] border-b-2 border-[#0B3D91]' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Search size={18} /> Search Workers
          </button>
          <button 
            onClick={() => setActiveTab('POST')} 
            className={`pb-3 font-bold text-sm flex items-center gap-2 ${activeTab === 'POST' ? 'text-[#0B3D91] border-b-2 border-[#0B3D91]' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Megaphone size={18} /> Broadcast Job Post
          </button>
          <button 
            onClick={() => setActiveTab('HISTORY')} 
            className={`pb-3 font-bold text-sm flex items-center gap-2 ${activeTab === 'HISTORY' ? 'text-[#0B3D91] border-b-2 border-[#0B3D91]' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Clock size={18} /> My Job Posts
          </button>
        </div>

        {activeTab === 'SEARCH' && (
        <>
        {/* Search Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Search size={20} className="text-[#0B3D91]" /> Find Verified Workers
          </h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">District</label>
              <input 
                type="text" 
                placeholder="e.g. Ahmedabad" 
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B3D91] outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Industry</label>
              <input 
                type="text" 
                placeholder="e.g. Construction" 
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B3D91] outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Skill</label>
              <input 
                type="text" 
                placeholder="e.g. Masonry" 
                value={skill}
                onChange={e => setSkill(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B3D91] outline-none text-sm"
              />
            </div>
            <div className="flex items-end">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#FF9933] hover:bg-[#e68a2e] text-white py-2 rounded-lg font-bold shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div>
          <h3 className="text-md font-bold text-slate-700 mb-4">
            Search Results {results.length > 0 && <span className="bg-[#0B3D91] text-white px-2 py-0.5 rounded-full text-xs ml-2">{results.length} found</span>}
          </h3>
          
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading...</div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200 border-dashed">
              No workers found matching your criteria. Try broadening your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map(worker => (
                <div key={worker.worker_id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-lg text-slate-900">{worker.first_name}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin size={12} /> {worker.current_district || 'District Not Specified'}
                      </p>
                    </div>
                    <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Verified
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-xs text-slate-600 mb-1">
                      <span className="font-semibold">Industry:</span> {worker.industry || 'N/A'}
                    </p>
                    <p className="text-xs text-slate-600 mb-2">
                      <span className="font-semibold">Experience:</span> {worker.experience_months ? `${Math.floor(worker.experience_months / 12)} yrs ${worker.experience_months % 12} mos` : 'N/A'}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {worker.skills.map((s, i) => (
                        <span key={i} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full border border-slate-200">
                          {s}
                        </span>
                      ))}
                      {worker.skills.length === 0 && <span className="text-[10px] text-slate-400">No skills listed</span>}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleOpenOffer(worker.worker_id)}
                    disabled={offered[worker.worker_id]}
                    className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${offered[worker.worker_id] ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-[#0B3D91] hover:bg-blue-900 text-white shadow-sm'}`}
                  >
                    {offered[worker.worker_id] ? (
                      <><CheckCircle2 size={16} /> Offer Sent</>
                    ) : (
                      <><UserPlus size={16} /> Send Job Offer</>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        </>
        )}

        {activeTab === 'POST' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-[#0B3D91] mb-2 flex items-center gap-2">
              <Megaphone size={24} /> Broadcast Job Post
            </h2>
            <p className="text-slate-600 mb-6 text-sm">Create a job post and our AI will automatically match and notify all eligible verified workers in the selected district.</p>
            
            <form onSubmit={handleBroadcastJob} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Job Title</label>
                <input required type="text" value={jobPost.title} onChange={e => setJobPost({...jobPost, title: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#0B3D91] outline-none" placeholder="e.g. 10 Expert Masons Needed" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Industry</label>
                  <select required value={jobPost.industry} onChange={e => setJobPost({...jobPost, industry: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#0B3D91] outline-none bg-white">
                    <option value="">Select Industry</option>
                    <option value="Construction">Construction</option>
                    <option value="Textile">Textile</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Manufacturing">Manufacturing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Specific Skill (Optional)</label>
                  <input type="text" value={jobPost.skill} onChange={e => setJobPost({...jobPost, skill: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#0B3D91] outline-none" placeholder="e.g. Masonry, Weaving" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">District</label>
                  <input required type="text" value={jobPost.district} onChange={e => setJobPost({...jobPost, district: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#0B3D91] outline-none" placeholder="e.g. Surat" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Daily Salary (₹)</label>
                  <input required type="number" value={jobPost.salary} onChange={e => setJobPost({...jobPost, salary: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#0B3D91] outline-none" placeholder="e.g. 600" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Job Description</label>
                <textarea required rows={4} value={jobPost.description} onChange={e => setJobPost({...jobPost, description: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#0B3D91] outline-none" placeholder="Describe the job, accommodation, hours, etc." />
              </div>
              
              <button 
                type="submit" 
                disabled={posting}
                className="w-full bg-[#138808] hover:bg-green-700 text-white py-3 rounded-lg font-bold shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {posting ? 'Broadcasting...' : 'Broadcast Job Post'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'HISTORY' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-[#0B3D91] mb-6 flex items-center gap-2">
              <Clock size={24} /> Broadcast History
            </h2>
            
            {loadingHistory ? (
              <div className="text-center py-12 text-slate-500">Loading history...</div>
            ) : jobHistory.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                You haven't broadcasted any job posts yet.
              </div>
            ) : (
              <div className="space-y-4">
                {jobHistory.map((job) => (
                  <div key={job.id} className="bg-slate-50 p-5 rounded-xl border border-slate-200 hover:shadow-md transition">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600 mb-2">
                          <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200"><MapPin size={12}/> {job.district}</span>
                          <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200"><IndianRupee size={12}/> {job.salary}/day</span>
                          <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200 text-slate-400">{new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-2 max-w-2xl">{job.description}</p>
                      </div>
                      
                      <button 
                        onClick={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)}
                        className={`flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-lg transition shrink-0 ${expandedJobId === job.id ? 'bg-[#0B3D91] text-white' : 'bg-blue-100 text-[#0B3D91] hover:bg-blue-200'}`}
                      >
                        <Users size={16} /> 
                        {job.applications?.length || 0} Applications {expandedJobId === job.id ? '▼' : '▶'}
                      </button>
                    </div>

                    {/* Applicants List */}
                    {expandedJobId === job.id && (
                      <div className="mt-6 pt-6 border-t border-slate-200">
                        <h4 className="font-bold text-slate-800 text-sm mb-4">Worker Applications</h4>
                        {job.applications?.length === 0 ? (
                          <div className="text-sm text-slate-500 italic">No applications yet.</div>
                        ) : (
                          <div className="space-y-3">
                            {job.applications.map((app: any) => (
                              <div key={app.id} className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-center">
                                <div>
                                  <h5 className="font-bold text-slate-800">{app.worker.name || app.worker.user?.name || 'Unnamed Worker'}</h5>
                                  <p className="text-xs text-slate-500 mt-1 flex gap-3">
                                    <span><span className="font-semibold">Industry:</span> {app.worker.industry}</span>
                                    <span><span className="font-semibold">Exp:</span> {app.worker.experience_months} months</span>
                                  </p>
                                </div>
                                <a 
                                  href={`mailto:${app.worker.user.email}?subject=Regarding your application for ${job.title}`}
                                  className="text-xs font-bold text-[#138808] bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded transition"
                                >
                                  Contact Worker
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
          </div>
          
          {/* Side Column for Schemes and Quotes */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-[#FF9933] p-3 text-white text-center font-bold text-sm">Contractor Scheme Spotlight</div>
              <img src="https://images.unsplash.com/photo-1574689049597-7e6e58ebaec3?auto=format&fit=crop&q=80&w=600" alt="Factory" className="w-full h-32 object-cover" />
              <div className="p-4">
                <h4 className="font-bold text-slate-800 text-sm mb-1">MSME ZED Certification</h4>
                <p className="text-xs text-slate-600 mb-3">Improve quality and get financial support for testing equipment under the Zero Defect Zero Effect scheme.</p>
                <a href="#" className="text-[#0B3D91] text-xs font-bold flex items-center gap-1 hover:underline">Read More</a>
              </div>
            </div>
            
            <div className="bg-[#0B3D91] p-5 rounded-2xl shadow-sm border border-slate-200 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 opacity-10">
                 <Megaphone size={100} className="-mr-6 -mt-6" />
               </div>
               <p className="italic text-sm leading-relaxed mb-4 relative z-10">
                 "A reliable workforce is the foundation of every successful project. By verifying skills and ensuring welfare, we build a stronger tomorrow."
               </p>
               <h4 className="font-bold text-xs text-blue-200">- ShramikSetu AI Initiative</h4>
            </div>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
               <h4 className="font-bold text-slate-800 text-sm mb-3 border-b pb-2">Quick Stats</h4>
               <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-600">Active Job Posts</span>
                   <span className="font-bold text-[#0B3D91]">{jobHistory.filter(j => j.isActive).length}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-600">Total Applications</span>
                   <span className="font-bold text-[#138808]">{jobHistory.reduce((acc, job) => acc + (job.applications?.length || 0), 0)}</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {offerModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-[#0B3D91] mb-4">Draft Job Offer</h3>
            <form onSubmit={handleSendOffer} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Job Title / Role</label>
                <input required type="text" value={offerModal.title} onChange={e => setOfferModal({...offerModal, title: e.target.value})} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-[#0B3D91]" placeholder="e.g. Senior Mason" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Daily Salary (₹)</label>
                  <input required type="number" value={offerModal.salary} onChange={e => setOfferModal({...offerModal, salary: e.target.value})} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-[#0B3D91]" placeholder="e.g. 600" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Location</label>
                  <input required type="text" value={offerModal.location} onChange={e => setOfferModal({...offerModal, location: e.target.value})} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-[#0B3D91]" placeholder="e.g. Surat" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Additional Details</label>
                <textarea rows={3} value={offerModal.description} onChange={e => setOfferModal({...offerModal, description: e.target.value})} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-[#0B3D91]" placeholder="Accommodation provided, etc." />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setOfferModal({...offerModal, isOpen: false})} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-[#0B3D91] hover:bg-blue-900 rounded-lg transition">Send Offer to Worker</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
