import React from 'react';
import { AIInternshipRecommendation } from './types';
import { Briefcase, CheckCircle2, AlertCircle, ArrowUpRight, ShieldCheck, MapPin, Calendar } from 'lucide-react';

interface InternshipRecommendationCardProps {
  internships: AIInternshipRecommendation[];
  onNavigateTab?: (tab: string) => void;
}

export const InternshipRecommendationCard: React.FC<InternshipRecommendationCardProps> = ({
  internships,
  onNavigateTab
}) => {
  if (!internships || internships.length === 0) return null;

  return (
    <div className="rounded-2xl p-4 bg-slate-900/95 border border-slate-800 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Briefcase className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Matched Internship Openings
            </h4>
            <p className="text-[11px] text-slate-400">
              Verified active opportunities matching your technical skills
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          {internships.length} Openings
        </span>
      </div>

      {/* Internships List */}
      <div className="space-y-3">
        {internships.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-emerald-500/30 transition-all space-y-2.5"
          >
            {/* Top row */}
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h5 className="font-bold text-white text-sm">{item.role}</h5>
                  {item.isVerified ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      VERIFIED
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                      SAMPLE DATA
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-semibold">{item.companyName}</p>
              </div>

              {/* Match Score Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs font-black text-emerald-400">{item.matchScore}%</span>
                <span className="text-[10px] uppercase font-bold text-emerald-300">Match</span>
              </div>
            </div>

            {/* Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-emerald-400 uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Matched Skills
                </span>
                <div className="flex flex-wrap gap-1">
                  {item.matchedSkills.map((sk, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    >
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              {item.missingSkills && item.missingSkills.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-amber-400 uppercase flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Missing Skills
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item.missingSkills.map((sk, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20"
                      >
                        + {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
              <div className="text-xs space-x-2">
                <span className="text-slate-400">Stipend:</span>
                <span className="text-emerald-400 font-bold">{item.stipend || '₹20,000 / month'}</span>
                {item.source && (
                  <span className="text-[10px] text-slate-500 font-medium">
                    • Source: {item.source}
                  </span>
                )}
              </div>

              <button
                onClick={() => onNavigateTab && onNavigateTab(item.targetTab || 'internships')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>View Opening</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
