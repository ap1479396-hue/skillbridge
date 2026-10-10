import React from 'react';
import { DataLabelType } from '../../types';
import { ShieldCheck, Cpu, Calculator, Sparkles, BarChart2, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  type: DataLabelType;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, className = '', size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'text-[9px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1';

  switch (type) {
    case 'VERIFIED':
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider ${sizeClasses} ${className}`}
          title="Verified information verified directly against source/employer"
        >
          <ShieldCheck className="w-2.5 h-2.5 shrink-0" />
          <span>[VERIFIED]</span>
        </span>
      );

    case 'DEMO':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider ${sizeClasses} ${className}`}
          title="Sample/Demo dataset record for prototype representation"
        >
          <AlertCircle className="w-2.5 h-2.5 shrink-0" />
          <span>[DEMO]</span>
        </span>
      );

    case 'CALCULATED':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider ${sizeClasses} ${className}`}
          title="Calculated deterministically by SkillBridge matching algorithms"
        >
          <Calculator className="w-2.5 h-2.5 shrink-0" />
          <span>[CALCULATED]</span>
        </span>
      );

    case 'MARKET ESTIMATE':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider ${sizeClasses} ${className}`}
          title="Market estimate based on industry hiring benchmarks. Actual compensation varies by employer."
        >
          <BarChart2 className="w-2.5 h-2.5 shrink-0" />
          <span>[MARKET ESTIMATE]</span>
        </span>
      );

    case 'SIMULATED':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase tracking-wider ${sizeClasses} ${className}`}
          title="Simulated analytics for prototype demonstration"
        >
          <Cpu className="w-2.5 h-2.5 shrink-0" />
          <span>[SIMULATED]</span>
        </span>
      );

    case 'AI RECOMMENDATION':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-md bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30 uppercase tracking-wider ${sizeClasses} ${className}`}
          title="AI-generated recommendation based on verified skill gaps"
        >
          <Sparkles className="w-2.5 h-2.5 shrink-0" />
          <span>[AI RECOMMENDATION]</span>
        </span>
      );

    default:
      return null;
  }
};
