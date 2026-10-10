import React from 'react';
import { AICompensationData } from './types';
import { TrendingUp, AlertTriangle, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface CompensationCardProps {
  compensation?: AICompensationData;
}

export const CompensationCard: React.FC<CompensationCardProps> = ({ compensation }) => {
  if (!compensation) return null;

  return (
    <div className="rounded-2xl p-4 bg-slate-900/95 border border-slate-800 shadow-md space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Compensation Estimate
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                MARKET ESTIMATE
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Role: <span className="text-slate-200 font-semibold">{compensation.roleTitle || 'Software / Web Engineering'}</span> • 2025–26 Industry Benchmarks
            </p>
          </div>
        </div>

        {/* Benchmark Estimate Tag */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs text-slate-300">
            Estimated Range: <strong className="text-indigo-300 font-bold">Market Benchmark</strong>
          </span>
        </div>
      </div>

      {/* Salary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Internship Stipend */}
        {compensation.internship && (
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 hover:border-emerald-500/30 transition-all space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase">
              <span>Internship</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Stipend</span>
            </div>
            <div className="text-lg font-black text-emerald-400">
              {compensation.internship.range}
            </div>
            <p className="text-[11px] text-slate-400">
              Monthly stipend for active students during internship
            </p>
          </div>
        )}

        {/* Entry Level CTC */}
        {compensation.entryLevel && (
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 hover:border-indigo-500/30 transition-all space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase">
              <span>Entry-Level CTC</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Fresher</span>
            </div>
            <div className="text-lg font-black text-indigo-300">
              {compensation.entryLevel.range}
            </div>
            <p className="text-[11px] text-slate-400">
              Annual package for graduate hiring and full-time conversion
            </p>
          </div>
        )}

        {/* High Growth / Tier-1 */}
        {compensation.tier1 && (
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 hover:border-purple-500/30 transition-all space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase">
              <span>High-Growth / Tier-1</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">Top Tier</span>
            </div>
            <div className="text-lg font-black text-purple-300">
              {compensation.tier1.range}
            </div>
            <p className="text-[11px] text-slate-400">
              Target packages at funded product companies & tech unicorns
            </p>
          </div>
        )}
      </div>

      {/* Why This Estimate (Checklist) */}
      {compensation.whyEstimateReasons && compensation.whyEstimateReasons.length > 0 && (
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Why this estimate was computed:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {compensation.whyEstimateReasons.map((reason, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Important Market Disclaimer */}
      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-200/90 text-xs">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-amber-300 text-xs">
            Market Estimate Notice
          </p>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {compensation.disclaimer ||
              'This is a market estimate based on verified student skills and industry hiring benchmarks, not a guaranteed salary offer. Actual compensation is determined during live technical rounds and employer evaluations.'}
          </p>
        </div>
      </div>
    </div>
  );
};
