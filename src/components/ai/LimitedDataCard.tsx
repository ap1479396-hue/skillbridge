import React from 'react';
import { Info, Upload, ArrowRight } from 'lucide-react';

interface LimitedDataCardProps {
  warning?: {
    title: string;
    message: string;
    missingFields?: string[];
  };
  onNavigateTab?: (tab: string) => void;
}

export const LimitedDataCard: React.FC<LimitedDataCardProps> = ({ warning, onNavigateTab }) => {
  if (!warning) return null;

  return (
    <div className="rounded-2xl p-4 bg-sky-950/30 border border-sky-500/30 shadow-md space-y-3">
      <div className="flex items-center gap-2 text-sky-400">
        <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
          <Info className="w-4 h-4 text-sky-400" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-sky-300">
            {warning.title || 'Limited Data Available'}
          </h4>
          <p className="text-[11px] text-sky-200/80">
            {warning.message || 'Evaluation is operating on minimal baseline data.'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-300">
        <span className="text-[11px] text-slate-400">
          Tip: Upload a text-based PDF resume with complete project repos & metrics for full depth.
        </span>
        <button
          onClick={() => onNavigateTab && onNavigateTab('resume-upload')}
          className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Detailed Resume</span>
        </button>
      </div>
    </div>
  );
};
