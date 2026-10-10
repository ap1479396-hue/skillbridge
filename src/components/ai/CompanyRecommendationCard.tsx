import React from 'react';
import { AICompanyRecommendation } from './types';
import { Building2, CheckCircle2, AlertCircle, ArrowUpRight, ShieldCheck, MapPin } from 'lucide-react';

interface CompanyRecommendationCardProps {
  companies: AICompanyRecommendation[];
  onNavigateTab?: (tab: string) => void;
}

export const CompanyRecommendationCard: React.FC<CompanyRecommendationCardProps> = ({
  companies,
  onNavigateTab
}) => {
  if (!companies || companies.length === 0) return null;

  return (
    <div className="rounded-2xl p-4 bg-slate-900/95 border border-slate-800 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Company Recommendations
            </h4>
            <p className="text-[11px] text-slate-400">
              Ranked deterministically by verified skill alignment
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
          {companies.length} Matches
        </span>
      </div>

      {/* Company Cards List */}
      <div className="space-y-3">
        {companies.map((comp, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-purple-500/30 transition-all space-y-2.5"
          >
            {/* Top row: Company name, Role, Match score */}
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h5 className="font-bold text-white text-sm">{comp.companyName}</h5>
                  {comp.isVerifiedListing ? (
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
                <p className="text-xs text-indigo-300 font-medium">{comp.role}</p>
              </div>

              {/* Match Score Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs font-black text-emerald-400">{comp.matchScore}%</span>
                <span className="text-[10px] uppercase font-bold text-emerald-300">Match</span>
              </div>
            </div>

            {/* Why You Match */}
            {comp.whyMatch && (
              <p className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60 leading-relaxed">
                💡 <span className="font-semibold text-slate-200">Alignment:</span> {comp.whyMatch}
              </p>
            )}

            {/* Matched vs Missing Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Matched Skills */}
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-emerald-400 uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Matched Skills ({comp.matchedSkills.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {comp.matchedSkills.map((sk, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    >
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              {comp.missingSkills && comp.missingSkills.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-amber-400 uppercase flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Missing Skills ({comp.missingSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {comp.missingSkills.map((sk, sIdx) => (
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

            {/* Bottom Row: Package & Action Button */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
              <div className="text-xs">
                <span className="text-slate-400">Package: </span>
                <span className="text-slate-200 font-bold">{comp.stipend || comp.package || '₹20,000 / month'}</span>
                <span className="text-[9px] font-bold ml-1.5 px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                  {comp.stipendLabel || 'MARKET ESTIMATE'}
                </span>
              </div>

              <button
                onClick={() => onNavigateTab && onNavigateTab(comp.targetTab || 'internships')}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>View Opportunity</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
