import React, { useState } from 'react';
import { AISkillCategory } from './types';
import { Cpu, ChevronDown, ChevronUp, Code2, Database, Layout, Server, Cloud, Brain, Wrench } from 'lucide-react';

interface SkillGroupDisplayProps {
  totalCount: number;
  categories: AISkillCategory[];
}

export const SkillGroupDisplay: React.FC<SkillGroupDisplayProps> = ({ totalCount, categories }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!categories || categories.length === 0) return null;

  // Icon mapping for categories
  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('frontend')) return <Layout className="w-3.5 h-3.5 text-sky-400" />;
    if (lower.includes('backend')) return <Server className="w-3.5 h-3.5 text-emerald-400" />;
    if (lower.includes('programming')) return <Code2 className="w-3.5 h-3.5 text-indigo-400" />;
    if (lower.includes('database')) return <Database className="w-3.5 h-3.5 text-amber-400" />;
    if (lower.includes('devops') || lower.includes('cloud')) return <Cloud className="w-3.5 h-3.5 text-cyan-400" />;
    if (lower.includes('ai') || lower.includes('ml')) return <Brain className="w-3.5 h-3.5 text-purple-400" />;
    return <Wrench className="w-3.5 h-3.5 text-slate-400" />;
  };

  // Badge background styling
  const getCategoryBadgeClass = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('frontend')) return 'bg-sky-500/10 text-sky-300 border-sky-500/20';
    if (lower.includes('backend')) return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
    if (lower.includes('programming')) return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
    if (lower.includes('database')) return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
    if (lower.includes('devops') || lower.includes('cloud')) return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
    if (lower.includes('ai') || lower.includes('ml')) return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  // Limit categories when collapsed if there are more than 3
  const visibleCategories = isExpanded ? categories : categories.slice(0, 3);
  const hiddenCount = categories.slice(3).reduce((acc, cat) => acc + cat.skills.length, 0);

  return (
    <div className="rounded-2xl p-4 bg-slate-900/95 border border-slate-800 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Skills Considered / Detected
            </h4>
            <p className="text-[11px] text-slate-400">
              {totalCount} verified technical skills evaluated across {categories.length} domains
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          {totalCount} Skills
        </span>
      </div>

      {/* Grouped Skills Matrix */}
      <div className="space-y-2.5">
        {visibleCategories.map((group, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/70 space-y-1.5"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                {getCategoryIcon(group.category)}
                {group.category}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {group.skills.length} skills
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {group.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className={`text-xs px-2 py-0.5 rounded-lg border font-medium transition-colors ${getCategoryBadgeClass(
                    group.category
                  )}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Toggle Expand / Collapse */}
      {categories.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-1.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors border border-slate-700/60"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              Show all {totalCount} skills ({hiddenCount} more across {categories.length - 3} categories)
            </>
          )}
        </button>
      )}
    </div>
  );
};
