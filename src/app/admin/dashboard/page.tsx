'use client';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie, Legend } from 'recharts';
import { ShieldAlert, Users, TrendingUp, AlertTriangle, ShieldCheck, LogOut, MessageSquare, CheckCircle, Briefcase, LayoutDashboard, MapPin, Search } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('ANALYTICS');
  const [data, setData] = useState<any>(null);
  const [grievances, setGrievances] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Message Modal State
  const [msgModal, setMsgModal] = useState<{isOpen: boolean, userId: string, name: string}>({isOpen: false, userId: '', name: ''});
  const [msgForm, setMsgForm] = useState({ title: '', message: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsData, grievanceData, workersData, jobsData] = await Promise.all([
        fetch('/api/admin/analytics').then(res => res.json()),
        fetch('/api/admin/grievances').then(res => res.json()),
        fetch('/api/admin/workers').then(res => res.json()),
        fetch('/api/admin/jobs').then(res => res.json())
      ]);
      setData(analyticsData);
      setGrievances(grievanceData.grievances || []);
      setWorkers(workersData || []);
      setJobs(jobsData || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: msgModal.userId, ...msgForm })
      });
      if (res.ok) {
        alert("Message sent successfully!");
        setMsgModal({isOpen: false, userId: '', name: ''});
        setMsgForm({title: '', message: ''});
      }
    } catch (e) { console.error(e); }
  };

  const handleResolveGrievance = async (id: string) => {
    if (!confirm("Mark this grievance as resolved?")) return;
    try {
      await fetch(`/api/admin/grievances/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'RESOLVED' })
      });
      alert("Grievance marked as resolved.");
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to flag and remove this job post?")) return;
    try {
      await fetch(`/api/admin/jobs?id=${id}`, { method: 'DELETE' });
      alert("Job post removed.");
      fetchData();
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <ShieldAlert className="text-[#0B3D91] w-12 h-12 mb-4" />
          <p className="text-slate-600 font-bold">Loading Secure Command Center...</p>
        </div>
      </div>
    );
  }

  const districtData = data?.workers?.map((w: any) => {
    const districtName = w.current_district || 'Unknown';
    const highRiskGrievances = data?.riskyDistricts?.filter((rd: any) => rd.district === districtName && rd.severity === 'HIGH')
      .reduce((acc: number, curr: any) => acc + curr._count.grievance_id, 0) || 0;
      
    return {
      name: districtName,
      workers: w._count.worker_id,
      highRisk: highRiskGrievances
    };
  }) || [];

  const pieData = data?.grievanceStats?.map((g: any) => ({
    name: g.category || 'Other',
    value: g._count.grievance_id
  })) || [];

  const wageData = data?.wagesByIndustry?.map((w: any) => ({
    name: w.industry || 'Unknown',
    wage: Math.round(w._avg.salary || 0)
  })) || [];
  
  const COLORS = ['#0B3D91', '#FF9933', '#138808', '#D97706', '#dc2626'];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0B3D91] text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="text-[#138808]" size={28} />
            <h1 className="font-black text-xl tracking-wide">Command Center</h1>
          </div>
          <p className="text-[10px] text-blue-200 uppercase tracking-widest font-bold">Labor Dept | Gujarat</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('ANALYTICS')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition ${activeTab === 'ANALYTICS' ? 'bg-[#FF9933] text-white' : 'hover:bg-blue-800 text-blue-100'}`}>
            <LayoutDashboard size={18} /> Analytics
          </button>
          <button onClick={() => setActiveTab('WORKERS')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition ${activeTab === 'WORKERS' ? 'bg-[#FF9933] text-white' : 'hover:bg-blue-800 text-blue-100'}`}>
            <Users size={18} /> Worker Directory
          </button>
          <button onClick={() => setActiveTab('GRIEVANCES')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition ${activeTab === 'GRIEVANCES' ? 'bg-[#FF9933] text-white' : 'hover:bg-blue-800 text-blue-100'}`}>
            <AlertTriangle size={18} /> Grievance Desk
          </button>
          <button onClick={() => setActiveTab('JOBS')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition ${activeTab === 'JOBS' ? 'bg-[#FF9933] text-white' : 'hover:bg-blue-800 text-blue-100'}`}>
            <Briefcase size={18} /> Job Market
          </button>
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button onClick={() => {
            document.cookie = "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            window.location.href = "/api/auth/signout";
          }} className="w-full flex items-center justify-center gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-3 rounded-lg transition text-blue-100">
            <LogOut size={16} /> Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        
        {/* ANALYTICS TAB */}
        {activeTab === 'ANALYTICS' && (
          <div className="space-y-8 animate-in fade-in">

            {/* Agent 10 Emergency SOS Alert Banner */}
            {grievances.some(g => g.severity === 'HIGH' && g.status === 'OPEN') && (
              <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-5 rounded-2xl shadow-lg border-2 border-red-400 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <ShieldAlert size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg tracking-wide">🚨 AGENT 10: CRITICAL SOS DISTRESS ALERT DETECTED</h3>
                    <p className="text-xs text-red-100 font-medium">
                      High-severity physical distress/forced labor risk flagged in {grievances.find(g => g.severity === 'HIGH')?.district || 'Gujarat'}. Immediate police & labor inspector dispatch advised.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('GRIEVANCES')}
                  className="bg-white text-red-700 font-black px-5 py-2.5 rounded-xl hover:bg-red-50 transition shadow text-xs whitespace-nowrap"
                >
                  Inspect SOS Emergency Case →
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <Users size={28} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase">Registered Migrants</p>
                  <h3 className="text-3xl font-black text-slate-800">{workers.length}</h3>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                  <AlertTriangle size={28} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase">Open Grievances</p>
                  <h3 className="text-3xl font-black text-slate-800">{grievances.filter(g => g.status === 'OPEN').length}</h3>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
                  <TrendingUp size={28} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase">Avg AI Risk Score</p>
                  <h3 className="text-3xl font-black text-slate-800">72.4</h3>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-black text-slate-800 text-lg mb-6 flex items-center gap-2">
                  <MapPin size={20} className="text-[#0B3D91]" /> District Overview (Workers & High Risk Zones)
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={districtData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                      <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend />
                      <Bar yAxisId="left" name="Total Workers" dataKey="workers" fill="#0B3D91" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" name="High Risk Grievances" dataKey="highRisk" fill="#dc2626" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                <h3 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2 border-b pb-4">
                  <ShieldAlert size={20} className="text-red-600" /> Live Risk Feed
                </h3>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[400px]">
                  {grievances.filter(g => g.status === 'OPEN').length === 0 ? (
                    <div className="text-center py-10 text-slate-400 font-medium">No open grievances.</div>
                  ) : (
                    grievances.filter(g => g.status === 'OPEN').slice(0, 10).map((g: any) => (
                      <div key={g.grievance_id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 relative overflow-hidden">
                        <div className={`absolute left-0 top-0 w-1 h-full ${g.severity === 'HIGH' ? 'bg-red-500' : g.severity === 'MEDIUM' ? 'bg-orange-400' : 'bg-yellow-400'}`}></div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold px-2 py-1 rounded bg-white border text-slate-700">{g.category}</span>
                          <span className={`text-xs font-black ${g.severity === 'HIGH' ? 'text-red-600' : 'text-orange-600'}`}>{g.severity} RISK</span>
                        </div>
                        <p className="text-sm text-slate-700 line-clamp-2">{g.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Grievance Breakdown Pie Chart */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-black text-slate-800 text-lg mb-6 flex items-center gap-2">
                  <AlertTriangle size={20} className="text-[#FF9933]" /> Grievance Category Breakdown
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" label>
                        {pieData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Wage by Industry Bar Chart */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-black text-slate-800 text-lg mb-6 flex items-center gap-2">
                  <TrendingUp size={20} className="text-[#138808]" /> Average Market Wage by Industry (₹)
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={wageData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} width={100} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="wage" fill="#138808" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WORKERS TAB */}
        {activeTab === 'WORKERS' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-black text-[#0B3D91] flex items-center gap-2"><Users size={24}/> Worker Directory</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="p-4 border-b font-bold">Worker Name</th>
                    <th className="p-4 border-b font-bold">Industry / District</th>
                    <th className="p-4 border-b font-bold">Skills</th>
                    <th className="p-4 border-b font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {workers.map(w => (
                    <tr key={w.worker_id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <p className="font-bold text-slate-800">{w.name || w.user?.name || 'Anonymous'}</p>
                        <p className="text-xs text-slate-500">{w.user?.email || 'No email'}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-semibold text-slate-700">{w.industry || 'Unspecified'}</p>
                        <p className="text-xs text-slate-500">{w.current_district}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {w.skills?.slice(0,2).map((s: any) => <span key={s.id} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">{s.skill_name}</span>)}
                          {w.skills?.length > 2 && <span className="text-[10px] text-slate-400">+{w.skills.length - 2} more</span>}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => setMsgModal({isOpen: true, userId: w.user_id, name: w.name || w.user?.name || 'Worker'})}
                          className="inline-flex items-center gap-2 bg-[#FF9933] hover:bg-[#e68a2e] text-white px-3 py-1.5 rounded text-xs font-bold transition shadow-sm"
                        >
                          <MessageSquare size={14}/> Message
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GRIEVANCES TAB */}
        {activeTab === 'GRIEVANCES' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-black text-[#0B3D91] flex items-center gap-2"><AlertTriangle size={24}/> Grievance Desk</h2>
            </div>
            <div className="p-6 grid gap-4">
              {grievances.map(g => (
                <div key={g.grievance_id} className={`p-5 rounded-xl border ${g.status === 'RESOLVED' ? 'border-green-200 bg-green-50/30' : 'border-slate-200 bg-white shadow-sm'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3 items-center">
                      <span className={`text-xs font-bold px-2 py-1 rounded text-white ${g.severity === 'HIGH' ? 'bg-red-600' : g.severity === 'MEDIUM' ? 'bg-orange-500' : 'bg-yellow-500'}`}>{g.severity} RISK</span>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{g.category}</span>
                      {g.status === 'RESOLVED' && <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded flex items-center gap-1"><CheckCircle size={12}/> RESOLVED</span>}
                    </div>
                    <span className="text-xs font-semibold text-slate-400">{new Date(g.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-800 text-sm mb-4">{g.description}</p>
                  <div className="flex justify-between items-center border-t pt-4">
                    <div className="text-xs text-slate-500 font-medium flex gap-4">
                      <span><MapPin size={12} className="inline mr-1"/>{g.district || 'Unknown District'}</span>
                      <span>Worker ID: {g.worker_id ? g.worker_id.slice(0, 8) + '...' : 'Anonymous'}</span>
                    </div>
                    {g.status !== 'RESOLVED' && (
                      <button 
                        onClick={() => handleResolveGrievance(g.grievance_id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-xs font-bold transition shadow-sm flex items-center gap-2"
                      >
                        <CheckCircle size={14}/> Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === 'JOBS' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-black text-[#0B3D91] flex items-center gap-2"><Briefcase size={24}/> Job Market Oversight</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="p-4 border-b font-bold">Job Post</th>
                    <th className="p-4 border-b font-bold">Contractor</th>
                    <th className="p-4 border-b font-bold">Salary/Location</th>
                    <th className="p-4 border-b font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map(j => (
                    <tr key={j.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <p className="font-bold text-slate-800">{j.title}</p>
                        <p className="text-xs text-slate-500">{j.industry} • {j.applications?.length || 0} applied</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-semibold text-slate-700">{j.contractor?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">{j.contractor?.email}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-green-700 text-sm">₹{j.salary}/day</p>
                        <p className="text-xs text-slate-500">{j.district}</p>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDeleteJob(j.id)}
                          className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-3 py-1.5 rounded text-xs font-bold transition"
                        >
                          <ShieldAlert size={14}/> Flag & Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Messaging Modal */}
      {msgModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-[#0B3D91] mb-2 flex items-center gap-2">
              <MessageSquare size={20} /> Direct Message
            </h3>
            <p className="text-sm text-slate-500 mb-6">Send an official notification to <strong>{msgModal.name}</strong>. This will appear on their dashboard.</p>
            
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subject</label>
                <input required type="text" value={msgForm.title} onChange={e => setMsgForm({...msgForm, title: e.target.value})} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-[#0B3D91]" placeholder="e.g. Action required on Grievance" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Message Body</label>
                <textarea required rows={4} value={msgForm.message} onChange={e => setMsgForm({...msgForm, message: e.target.value})} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-[#0B3D91]" placeholder="Type your official message here..." />
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t mt-4">
                <button type="button" onClick={() => setMsgModal({isOpen: false, userId: '', name: ''})} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-[#FF9933] hover:bg-[#e68a2e] rounded-lg transition shadow">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
