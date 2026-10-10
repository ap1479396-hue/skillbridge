import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FollowUpActionsProps {
  prompts?: string[];
  onSelectPrompt: (prompt: string) => void;
}

export const FollowUpActions: React.FC<FollowUpActionsProps> = ({
  prompts,
  onSelectPrompt
}) => {
  if (!prompts || prompts.length === 0) return null;

  return (
    <div className="pt-2 space-y-2">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>Recommended Follow-ups:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(prompt)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/70 hover:border-indigo-500/50 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm group text-left"
          >
            <span>{prompt}</span>
            <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
};
