import React from 'react';

interface WageGaugeProps {
  percentage: number;
  verdict: string;
}

export function WageGauge({ percentage, verdict }: WageGaugeProps) {
  // Cap percentage for visual gauge
  const displayPercentage = Math.min(Math.max(percentage, 0), 150);
  
  let colors = {
    bg: "bg-green-100",
    fill: "bg-green-500",
    text: "text-green-700",
    label: "FAIR & LEGAL WAGE"
  };

  if (verdict === "UNDERPAID") {
    colors = {
      bg: "bg-orange-100",
      fill: "bg-orange-500",
      text: "text-orange-700",
      label: "UNDERPAID - BELOW LEGAL MINIMUM"
    };
  } else if (verdict === "SEVERE") {
    colors = {
      bg: "bg-red-100",
      fill: "bg-red-500",
      text: "text-red-700",
      label: "SEVERE UNDERPAYMENT - EXPLOITATION RISK"
    };
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end mb-1">
        <span className={`text-sm font-black ${colors.text}`}>{colors.label}</span>
        <span className={`text-2xl font-black ${colors.text}`}>{percentage}% <span className="text-sm font-medium">of minimum</span></span>
      </div>
      
      <div className={`w-full h-4 rounded-full overflow-hidden ${colors.bg}`}>
        <div 
          className={`h-full ${colors.fill} transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(displayPercentage, 100)}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-slate-500 font-bold mt-1">
        <span>0%</span>
        <span>Legal Minimum (100%)</span>
      </div>
    </div>
  );
}
