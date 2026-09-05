'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, ArrowRight, Fingerprint, 
  Cpu, Lock, CheckCircle2, User, Briefcase, Building2, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const { t, language, setLanguage } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const SLIDES = [
    {
      image: "https://images.unsplash.com/photo-1574689049597-7e6e58ebaec3?auto=format&fit=crop&q=80&w=1400",
      title: t('slide1_title'),
      subtitle: t('slide1_subtitle'),
      tag: t('slide1_tag')
    },
    {
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1400",
      title: t('slide2_title'),
      subtitle: t('slide2_subtitle'),
      tag: t('slide2_tag')
    },
    {
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1400",
      title: t('slide3_title'),
      subtitle: t('slide3_subtitle'),
      tag: t('slide3_tag')
    },
    {
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1400",
      title: t('slide4_title'),
      subtitle: t('slide4_subtitle'),
      tag: t('slide4_tag')
    }
  ];

  // Auto slide every 2 seconds (2000ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [SLIDES.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#FF9933] selection:text-white overflow-x-hidden">
      
      {/* 1. Official Gov Header */}
      <div className="bg-[#0B3D91] text-white py-2 px-6 text-xs md:text-sm flex justify-between items-center w-full z-50 relative border-b border-blue-800">
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <span className="inline-block w-2.5 h-2.5 bg-[#FF9933] rounded-full animate-pulse"></span>
          <span>{t('gov_header')}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-blue-200 text-xs font-semibold">{t('official_portal')}</span>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-[#082a63] border border-blue-400/30 text-white text-xs outline-none cursor-pointer rounded px-2.5 py-1 transition-colors hover:bg-blue-900 font-bold"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="gu">ગુજરાતી</option>
          </select>
        </div>
      </div>

      {/* 2. Navigation */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-md border-b-4 border-[#FF9933] z-40 px-6 md:px-12 py-3.5 flex justify-between items-center shadow-md">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-[#0B3D91] to-blue-700 rounded-xl flex items-center justify-center text-white shadow-md">
            <ShieldCheck size={24} className="text-[#FF9933]" />
          </div>
          <div>
            <span className="text-2xl font-black text-[#0B3D91] tracking-tight block leading-none">ShramikSetu AI</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Smart Migrant Welfare</span>
          </div>
        </motion.div>
        <div className="hidden lg:flex items-center gap-8 font-semibold text-slate-600 text-sm">
          <a href="#portals" className="hover:text-[#FF9933] transition-colors">{t('portals')}</a>
          <a href="#showcase" className="hover:text-[#FF9933] transition-colors">{t('highlights')}</a>
          <a href="#features" className="hover:text-[#FF9933] transition-colors">{t('features')}</a>
          <a href="#security" className="hover:text-[#FF9933] transition-colors">{t('privacy')}</a>
        </div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Link href="/login" className="px-5 py-2.5 bg-[#0B3D91] text-white font-bold rounded-xl hover:bg-[#082a63] transition-all shadow hover:shadow-md flex items-center gap-2 text-sm transform hover:scale-105">
            {t('worker_login')} <ArrowRight size={16} />
          </Link>
        </motion.div>
      </nav>

      {/* 3. Hero Section */}
      <header className="relative pt-16 pb-20 px-6 overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-white">
        
        {/* Animated Background Glowing Spheres */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#FF9933]/20 to-transparent blur-3xl pointer-events-none"
        />
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-tr from-[#138808]/20 to-transparent blur-3xl pointer-events-none"
        />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/80 text-[#FF9933] font-bold text-xs border border-orange-200 mb-6 shadow-sm"
          >
            <Sparkles size={14} className="text-[#FF9933] animate-spin" style={{ animationDuration: '6s' }} />
            <span>{t('tagline')}</span>
          </motion.div>

          <motion.h1 
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#0B3D91] leading-tight mb-6"
          >
            {t('hero_title')}
          </motion.h1>

          <motion.p 
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            {t('hero_subtitle')}
          </motion.p>
        </div>
      </header>

      {/* 4. 2-Second Image Slider (Gujarat & Government Schemes Showcase) */}
      <section id="showcase" className="max-w-6xl mx-auto px-6 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[350px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-200"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <img 
                src={SLIDES[currentSlide].image} 
                alt={SLIDES[currentSlide].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent"></div>
              
              {/* Slide Caption Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                <span className="inline-block px-3 py-1 bg-[#FF9933] text-white text-xs font-bold rounded-md mb-3 shadow">
                  {SLIDES[currentSlide].tag}
                </span>
                <h3 className="text-2xl md:text-4xl font-extrabold mb-2 drop-shadow-md">
                  {SLIDES[currentSlide].title}
                </h3>
                <p className="text-slate-200 text-sm md:text-base max-w-2xl font-medium drop-shadow">
                  {SLIDES[currentSlide].subtitle}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls */}
          <button 
            onClick={prevSlide} 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur transition border border-white/20 z-20"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide} 
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur transition border border-white/20 z-20"
          >
            <ChevronRight size={24} />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-4 right-6 flex gap-2 z-20">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${idx === currentSlide ? 'w-8 bg-[#FF9933]' : 'w-2 bg-white/60'}`}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* 5. PORTAL SELECTOR (3 Prominent Roles with Motion Stagger) */}
      <section id="portals" className="py-16 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <span className="text-xs font-black uppercase tracking-widest text-[#FF9933] bg-orange-100 px-3 py-1 rounded-full border border-orange-200 inline-block mb-3">
              {t('judge_hub_badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0B3D91]">
              {t('select_portal_role')}
            </h2>
            <p className="text-slate-600 text-sm md:text-base mt-2 max-w-xl mx-auto font-medium">
              {t('select_portal_desc')}
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            
            {/* ROLE 1: WORKER */}
            <motion.div 
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl p-8 border-2 border-green-500/30 hover:border-green-500 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
              <div>
                <div className="w-16 h-16 bg-green-100 text-[#138808] rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-green-200">
                  <User size={36} />
                </div>
                <div className="inline-block px-2.5 py-0.5 bg-green-100 text-green-800 text-[11px] font-extrabold rounded-md mb-2">
                  {t('role1_badge')}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">{t('worker_portal_title')}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {t('worker_portal_desc')}
                </p>
              </div>
              <div>
                <Link 
                  href="/login" 
                  className="w-full py-4 bg-[#138808] hover:bg-green-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition text-base"
                >
                  {t('enter_worker_dash')} <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>

            {/* ROLE 2: CONTRACTOR */}
            <motion.div 
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl p-8 border-2 border-blue-500/30 hover:border-blue-500 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
              <div>
                <div className="w-16 h-16 bg-blue-100 text-[#0B3D91] rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-blue-200">
                  <Briefcase size={36} />
                </div>
                <div className="inline-block px-2.5 py-0.5 bg-blue-100 text-[#0B3D91] text-[11px] font-extrabold rounded-md mb-2">
                  {t('role2_badge')}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">{t('contractor_portal_title')}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {t('contractor_portal_desc')}
                </p>
              </div>
              <div>
                <Link 
                  href="/login" 
                  className="w-full py-4 bg-[#0B3D91] hover:bg-blue-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition text-base"
                >
                  {t('enter_contractor_dash')} <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>

            {/* ROLE 3: ADMIN */}
            <motion.div 
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl p-8 border-2 border-orange-500/30 hover:border-orange-500 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
              <div>
                <div className="w-16 h-16 bg-orange-100 text-[#FF9933] rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-orange-200">
                  <Building2 size={36} />
                </div>
                <div className="inline-block px-2.5 py-0.5 bg-orange-100 text-orange-800 text-[11px] font-extrabold rounded-md mb-2">
                  {t('role3_badge')}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">{t('admin_portal_title')}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {t('admin_portal_desc')}
                </p>
              </div>
              <div>
                <Link 
                  href="/login" 
                  className="w-full py-4 bg-[#FF9933] hover:bg-[#e68a2e] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition text-base"
                >
                  {t('enter_admin_dash')} <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* 6. Feature Showcase */}
      <section id="features" className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-32">
          
          {/* Skill Passport Showcase */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-[#0B3D91] mb-6 shadow-inner border border-blue-100">
                <Fingerprint size={28} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">{t('skill_passport_title')}</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {t('skill_passport_desc')}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-50 transform rotate-3 rounded-3xl"></div>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl relative z-10">
                <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="h-20 bg-gradient-to-r from-[#0B3D91] to-blue-600 relative overflow-hidden">
                     <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                  </div>
                  <div className="p-6 pt-0 relative">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-md border-4 border-white -mt-10 flex items-center justify-center text-blue-600 mb-4 mx-auto md:mx-0">
                      <Fingerprint size={40}/>
                    </div>
                    <div className="text-center md:text-left">
                      <h4 className="font-black text-xl text-slate-900">Rahul Kumar</h4>
                      <p className="text-sm text-slate-500 mb-4 font-medium">Textile Weaving • 4 Yrs Experience</p>
                      <div className="flex justify-center md:justify-start gap-2">
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md border border-green-200">Verified Skill</span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md border border-slate-200">Surat, Gujarat</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* AI Orchestrator */}
          <div className="grid md:grid-cols-2 gap-16 items-center flex-col-reverse md:flex-row-reverse">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-50 text-[#FF9933] mb-6 shadow-inner border border-orange-100">
                <Cpu size={28} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">{t('ai_engine_title')}</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {t('ai_engine_desc')}
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
               <div className="absolute inset-0 bg-gradient-to-l from-orange-100 to-amber-50 transform -rotate-3 rounded-3xl"></div>
               <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl flex flex-col gap-6 relative z-10">
                 <div className="bg-slate-50 p-4 rounded-xl shadow-sm border border-slate-200 self-start max-w-[85%] rounded-tl-sm">
                   <p className="text-sm font-medium text-slate-800">क्या मुझे सिलाई मशीन योजना का लाभ मिल सकता है?</p>
                 </div>
                 <div className="bg-blue-50/50 p-5 rounded-xl shadow-sm border border-blue-100 self-end max-w-[95%] rounded-br-sm relative overflow-hidden">
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#138808]"></div>
                   <div className="flex items-center gap-2 text-xs text-[#0B3D91] font-black mb-3 bg-white inline-flex px-2 py-1 rounded shadow-sm border border-slate-100">
                     <ShieldCheck size={14} className="text-[#138808]"/> SYSTEM: VERIFIED RULES
                   </div>
                   <p className="text-sm text-slate-800 leading-relaxed font-medium">जी हाँ। आपके प्रोफाइल के अनुसार, आप <strong className="text-[#0B3D91]">"मानव कल्याण योजना"</strong> के अंतर्गत सिलाई मशीन टूलकिट के लिए पात्र हैं।</p>
                 </div>
               </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 7. Privacy & Security */}
      <section id="security" className="bg-[#0B3D91] text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-6 shadow-2xl">
              <Lock size={32} className="text-[#FF9933]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4">{t('privacy_title')}</h2>
            <p className="text-slate-200 text-base md:text-lg mb-12 max-w-2xl mx-auto font-normal">
              {t('privacy_desc')}
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6 text-left"
          >
            {[
              { title: "Role-Based Security", desc: "Strict separation between Worker profiles, Contractor query scope, and Admin analytics." },
              { title: "K-Anonymity Heatmaps", desc: "District density maps mask exact identities to prevent targeted exploitation." },
              { title: "Voice & Speech Privacy", desc: "Speech recognition converts audio directly to text in-browser without storing raw audio." }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-[#082a63]/80 backdrop-blur-md p-6 rounded-2xl border border-blue-400/20 shadow-lg">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mb-3 text-blue-300">
                  <CheckCircle2 size={18}/>
                </div>
                <h4 className="font-bold text-base text-white mb-2">{feature.title}</h4>
                <p className="text-xs text-blue-200 leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}