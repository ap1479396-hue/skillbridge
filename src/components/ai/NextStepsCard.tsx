import React from 'react';
import { AINextStep } from './types';
import { Compass, ArrowRight, ExternalLink } from 'lucide-react';

interface NextStepsCardProps {
  nextSteps?: AINextStep[];
  actionLinks?: { label: string; tab: string }[];
  onNavigateTab?: (tab: string) => void;
}

export const NextStepsCard: React.FC<NextStepsCardProps> = ({
  nextSteps,
  actionLinks,
  onNavigateTab
}) => {
  if ((!nextSteps || nextSteps.length === 0) && (!actionLinks || actionLinks.length === 0)) {
    return null;
  }

  return (
    <div className="rounded-2xl p-4 bg-slate-900/95 border border-slate-800 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Recommended Next Steps
            </h4>
            <p className="text-[11px] text-slate-400">
              High-impact actions to maximize your career readiness and compensation
            </p>
          </div>
        </div>
      </div>

      {/* Steps List */}
      {nextSteps && nextSteps.length > 0 && (
        <div className="space-y-2">
          {nextSteps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/70 text-xs"
            >
              <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                {step.stepNumber || idx + 1}
              </span>
              <div className="space-y-1 flex-1">
                <p className="text-slate-200 leading-relaxed font-medium">{step.text}</p>
                {step.actionLabel && (
                  <button
                    onClick={() => onNavigateTab && onNavigateTab(step.actionTab || 'roadmap')}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold text-[11px] flex items-center gap-1"
                  >
                    {step.actionLabel} <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Links / Buttons */}
      {actionLinks && actionLinks.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800/60">
          {actionLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={() => onNavigateTab && onNavigateTab(link.tab)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>{link.label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
