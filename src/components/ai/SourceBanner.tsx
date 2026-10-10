import React from 'react';
import { AISourceInfo } from './types';
import { FileText, User, Layers, ShieldCheck, Sparkles } from 'lucide-react';

interface SourceBannerProps {
  sourceInfo?: AISourceInfo;
}

export const SourceBanner: React.FC<SourceBannerProps> = ({ sourceInfo }) => {
  if (!sourceInfo) return null;

  const isResume = sourceInfo.type === 'uploaded_resume' || sourceInfo.profileUsed === 'Uploaded Resume';
  const isCombined = sourceInfo.type === 'combined' || sourceInfo.profileUsed === 'Combined / Multi-Source';

  const subtitle = isResume
    ? 'Based on your uploaded resume'
    : isCombined
    ? 'Multi-source verified evaluation'
    : 'Based on your registered profile';

  const fileName = sourceInfo.fileName || (isResume ? 'Uploaded_Resume.pdf' : 'Registered Student Profile');

  return (
    <div className="rounded-2xl p-4 bg-slate-900/95 border border-slate-800 shadow-md space-y-3.5">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <h3 className="text-sm font-black tracking-wider uppercase text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              AI CAREER ANALYSIS
            </h3>
          </div>
          <p className="text-xs text-slate-300 font-medium pl-4">
            {subtitle}
          </p>
        </div>

        <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          {isResume ? 'Isolated Resume Evaluation' : 'Verified Profile Record'}
        </span>
      </div>

      {/* Grid: SOURCE and PROFILE USED */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
        {/* SOURCE */}
        <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
            <FileText className="w-3 h-3 text-indigo-400" />
            SOURCE
          </span>
          <p className="text-white font-semibold text-xs truncate flex items-center gap-1.5">
            <span>📄</span>
            <span className="truncate">{fileName}</span>
          </p>
        </div>

        {/* PROFILE USED */}
        <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-emerald-400" />
            PROFILE USED
          </span>
          <p className="text-emerald-300 font-bold text-xs flex items-center gap-1.5">
            <span>✓</span>
            <span>{sourceInfo.profileUsed}</span>
          </p>
        </div>

        {/* CANDIDATE CONTEXT */}
        <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5 sm:col-span-2 md:col-span-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
            <User className="w-3 h-3 text-purple-400" />
            CANDIDATE
          </span>
          <p className="text-slate-200 font-semibold text-xs truncate">
            {sourceInfo.candidateName ? sourceInfo.candidateName : 'Candidate'}
            {sourceInfo.academicYear ? ` (${sourceInfo.academicYear})` : ''}
          </p>
        </div>
      </div>
    </div>
  );
};
