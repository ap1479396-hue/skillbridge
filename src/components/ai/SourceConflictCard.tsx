import React from 'react';
import { AISourceConflictData } from './types';
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface SourceConflictCardProps {
  conflicts: AISourceConflictData[];
  onNavigateTab?: (tab: string) => void;
}

export const SourceConflictCard: React.FC<SourceConflictCardProps> = ({
  conflicts,
  onNavigateTab
}) => {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className="rounded-2xl p-4 bg-amber-950/30 border border-amber-500/30 shadow-md space-y-3">
      <div className="flex items-center gap-2 text-amber-400">
        <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Profile Difference Detected
          </h4>
          <p className="text-[11px] text-amber-200/80">
            Registered profile and uploaded resume contain different data
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {conflicts.map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/20 text-xs space-y-1"
          >
            <div className="font-bold text-slate-200 flex items-center justify-between">
              <span>{item.label}</span>
              <span className="text-[10px] text-amber-400 font-mono">Source Divergence</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="text-slate-500 block text-[10px] font-semibold">Registered Profile:</span>
                <strong className="text-slate-200">{item.profileValue}</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-900 border border-indigo-500/30 text-slate-300">
                <span className="text-indigo-400 block text-[10px] font-semibold">Uploaded Resume:</span>
                <strong className="text-white">{item.resumeValue}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 pt-1 text-[11px] text-amber-200/90">
        <span className="italic">These sources have not been silently merged.</span>
        <button
          onClick={() => onNavigateTab && onNavigateTab('resume-upload')}
          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1 transition-colors"
        >
          <span>Sync Profile with Resume</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
