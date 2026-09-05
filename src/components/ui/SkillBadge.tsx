import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

interface SkillBadgeProps {
  skillName: string;
  proficiency: string; // BEGINNER, INTERMEDIATE, ADVANCED
  verificationStatus?: string; // SELF_DECLARED, VERIFIED
  experienceMonths?: number;
}

export function SkillBadge({ skillName, proficiency, verificationStatus = "SELF_DECLARED", experienceMonths }: SkillBadgeProps) {
  const isVerified = verificationStatus === "VERIFIED";

  const profColors: Record<string, string> = {
    BEGINNER: "bg-blue-100 text-blue-800 border-blue-200",
    INTERMEDIATE: "bg-orange-100 text-orange-800 border-orange-200",
    ADVANCED: "bg-green-100 text-green-800 border-green-200"
  };

  const profColor = profColors[proficiency.toUpperCase()] || "bg-slate-100 text-slate-800 border-slate-200";

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-2 relative overflow-hidden transition-all hover:shadow-md">
      {isVerified && (
        <div className="absolute top-0 right-0 w-2 h-full bg-[#138808]"></div>
      )}
      {!isVerified && (
        <div className="absolute top-0 right-0 w-2 h-full bg-slate-300"></div>
      )}
      
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-slate-800 text-lg">{skillName}</h4>
        {isVerified ? (
          <div className="flex items-center gap-1 text-xs font-bold text-[#138808] bg-green-50 px-2 py-1 rounded">
            <ShieldCheck size={14} /> Verified
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
            <ShieldAlert size={14} /> Self-Declared
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mt-1">
        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${profColor}`}>
          {proficiency.toUpperCase()}
        </span>
        {experienceMonths !== undefined && (
          <span className="text-sm text-slate-600 font-medium">
            {experienceMonths > 11 ? `${(experienceMonths / 12).toFixed(1)} Years` : `${experienceMonths} Months`}
          </span>
        )}
      </div>
    </div>
  );
}
