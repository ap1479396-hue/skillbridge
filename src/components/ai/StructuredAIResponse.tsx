import React from 'react';
import Markdown from 'react-markdown';
import { ArrowRight } from 'lucide-react';
import { FollowUpActions } from './FollowUpActions';

interface StructuredAIResponseProps {
  text: string;
  actionLinks?: { label: string; tab: string }[];
  suggestedPrompts?: string[];
  onNavigateTab?: (tab: string) => void;
  onSelectPrompt?: (prompt: string) => void;
}

export const StructuredAIResponse: React.FC<StructuredAIResponseProps> = ({
  text,
  actionLinks,
  suggestedPrompts,
  onNavigateTab,
  onSelectPrompt
}) => {
  // Filter out the repetitive standard 6 quick actions from the in-bubble follow-ups
  // since they are already pinned in the UI Quick Action bar
  const isStandardSet =
    suggestedPrompts &&
    suggestedPrompts.length >= 4 &&
    suggestedPrompts.includes('Best career for me') &&
    suggestedPrompts.includes('Find internships') &&
    suggestedPrompts.includes('My skill gaps');

  const contextualPrompts = isStandardSet ? [] : suggestedPrompts;

  return (
    <div className="space-y-3">
      {/* Primary Markdown Content */}
      <div className="markdown-body text-slate-100 text-xs sm:text-[13px] leading-relaxed space-y-2">
        <Markdown>{text}</Markdown>
      </div>

      {/* Action Navigation Links */}
      {actionLinks && actionLinks.length > 0 && onNavigateTab && (
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-900/80">
          {actionLinks.map((link, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onNavigateTab(link.tab)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
            >
              <span>{link.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      )}

      {/* Contextual Follow-up prompts (Only when truly contextual) */}
      {contextualPrompts && contextualPrompts.length > 0 && onSelectPrompt && (
        <FollowUpActions prompts={contextualPrompts} onSelectPrompt={onSelectPrompt} />
      )}
    </div>
  );
};
