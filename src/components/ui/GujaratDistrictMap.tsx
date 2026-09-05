import React from 'react';
import { MapPin, Target } from 'lucide-react';

interface GujaratDistrictMapProps {
  district: string;
}

export function GujaratDistrictMap({ district }: GujaratDistrictMapProps) {
  // A stylized representation of a map card instead of a massive SVG for simplicity and elegance.
  return (
    <div className="relative bg-[#0B3D91] rounded-2xl p-6 overflow-hidden shadow-inner flex flex-col justify-between min-h-[200px]">
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
      
      {/* Decorative abstracted map elements */}
      <div className="absolute top-4 right-4 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-[#FF9933] rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur border border-white/20 rounded-full text-blue-100 text-xs font-semibold mb-4">
          <MapPin size={14} /> Gujarat State
        </div>
        <h3 className="text-3xl font-black text-white">Labor Market Map</h3>
        <p className="text-blue-200 mt-2 text-sm max-w-[80%] leading-relaxed">
          Your digital passport is currently registered to the <strong className="text-[#FF9933]">{district || 'Unknown'}</strong> district registry.
        </p>
      </div>

      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/20 pt-4">
        <div className="flex items-center gap-2">
          <Target className="text-[#138808]" size={20} />
          <span className="text-white font-bold">{district || 'Unassigned District'}</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-[#138808] animate-ping"></div>
      </div>
    </div>
  );
}
