import React from 'react';
import { AICareerMatch } from './types';
import { Target, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CareerMatchCardProps {
  careerMatches: AICareerMatch[];
  onNavigateTab?: (tab: string) => void;
}

export const CareerMatchCard: React.FC<CareerMatchCardProps> = ({
  careerMatches,
  onNavigateTab
}) => {
  if (!careerMatches || careerMatches.length === 0) return null;

  return (
    <div className="rounded-2xl p-4 bg-slate-900/95 border border-slate-800 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Target className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Career Recommendations & Fit
            </h4>
            <p className="text-[11px] text-slate-400">
              Ranked by verified technical skill overlap
            </p>
          </div>
        </div>
      </div>

      {/* Matches List */}
      <div className="space-y-2.5">
        {careerMatches.map((match, idx) => {
          const isTop = match.isTopFit || idx === 0;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all space-y-2 ${
                isTop
                  ? 'bg-indigo-950/40 border-indigo-500/30'
                  : 'bg-slate-950/70 border-slate-800/70'
              }`}
            >
              {/* Title & Badge */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {isTop && (
                    <span className="p-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Award className="w-3 h-3" />
                    </span>
                  )}
                  <span className="font-bold text-sm text-white">{match.title}</span>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
                  <span>{match.matchPercentage}%</span>
                  <span className="text-[9px] uppercase font-semibold text-indigo-200">Match</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    match.matchPercentage >= 80
                      ? 'bg-emerald-400'
                      : match.matchPercentage >= 60
                      ? 'bg-indigo-400'
                      : 'bg-amber-400'
                  }`}
                  style={{ width: `${Math.max(10, match.matchPercentage)}%` }}
                />
              </div>

              {/* Matched Skills Tags */}
              {match.matchedSkills && match.matchedSkills.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] text-slate-400 font-medium">Matched Skills:</span>
                  {match.matchedSkills.map((sk, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-medium flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                      {sk}
                    </span>
                  ))}
                </div>
              )}

              {/* Next recommended skill */}
              {match.nextSkill && (
                <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
                  <span>
                    Priority to learn: <strong className="text-slate-200">{match.nextSkill}</strong>
                  </span>
                  <button
                    onClick={() => onNavigateTab && onNavigateTab('skill-analysis')}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 text-[11px]"
                  >
                    View Gap Matrix <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
