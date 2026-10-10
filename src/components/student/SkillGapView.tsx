import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateSkillGap } from '../../utils/skillMatcher';
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  Target,
  ArrowRight,
  Sparkles,
  BookOpen,
  Layers,
  ChevronRight,
  TrendingUp,
  Clock,
  Plus
} from 'lucide-react';

export const SkillGapView: React.FC = () => {
  const {
    student,
    currentCareerGoal,
    careerGoals,
    setStudentCareerGoal,
    addSkillToStudent,
    setActiveTab
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('All');

  const skillGap = calculateSkillGap(student.currentSkills, currentCareerGoal);

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'DevOps', 'Core CS', 'AI/ML'];

  const filteredItems = skillGap.items.filter((item) => {
    if (filterCategory === 'All') return true;
    return item.category === filterCategory;
  });

  return (
    <div id="skill-gap-page" className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-indigo-300 bg-indigo-500/15 px-2.5 py-0.5 rounded border border-indigo-500/30">
                SIH Problem 26044 Benchmark
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-1.5">
              Skill-Gap Analysis Matrix
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Evaluating student competencies against industry standard benchmarks for{' '}
              <span className="font-semibold text-indigo-300">{currentCareerGoal.title}</span>.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-extrabold text-white">
                {skillGap.readinessPercentage}%
              </div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">
                Readiness Score
              </div>
            </div>

            <div className="w-14 h-14 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-500 transition-all duration-700"
                  strokeDasharray={`${skillGap.readinessPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <Target className="w-4 h-4 text-indigo-400 absolute" />
            </div>
          </div>
        </div>
      </div>

      {/* Target Career Goal Selector & Filter Chips */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-300">Target Role Benchmark:</span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {careerGoals.map((g) => (
              <button
                key={g.id}
                onClick={() => setStudentCareerGoal(g.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  g.id === currentCareerGoal.id
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {g.title}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Filter Domain:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Visual Cards: Current vs Missing Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1: Possessed Skills (✓) */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Current Possessed Skills ({skillGap.matchedCount})
            </h2>
            <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              Acquired ✓
            </span>
          </div>

          <div className="space-y-2">
            {filteredItems.filter((i) => i.status === 'possessed').length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                No matching skills found in this domain yet.
              </p>
            ) : (
              filteredItems
                .filter((i) => i.status === 'possessed')
                .map((item) => (
                  <div
                    key={item.name}
                    className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-200 flex items-center gap-1.5">
                        <span>{item.name}</span>
                        <span className="text-[10px] text-emerald-400 font-medium">
                          ({item.category})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.description}</div>
                    </div>
                    <span className="text-emerald-400 font-bold text-sm">✓</span>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Column 2: Missing Skills (✗) */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Missing Skills to Acquire ({skillGap.missingCount})
            </h2>
            <span className="text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
              Gaps Detected
            </span>
          </div>

          <div className="space-y-2">
            {filteredItems.filter((i) => i.status === 'missing').length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto mb-1" />
                <p className="text-xs font-semibold text-white">
                  No missing skills detected in this domain.
                </p>
              </div>
            ) : (
              filteredItems
                .filter((i) => i.status === 'missing')
                .map((item) => (
                  <div
                    key={item.name}
                    className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">{item.name}</span>
                        <span
                          className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            item.priority === 'High'
                              ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                              : item.priority === 'Medium'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {item.priority} Priority
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{item.description}</p>
                      <div className="text-[10px] text-indigo-300 font-medium flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-indigo-400" />
                        <span>Recommended: {item.recommendedResource.title} ({item.recommendedResource.platform})</span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        addSkillToStudent({
                          name: item.name,
                          category: item.category,
                          proficiency: 'Intermediate',
                          verified: true
                        })
                      }
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-lg text-[10px] font-semibold transition shrink-0 whitespace-nowrap"
                      title="Mark as learned & add to profile"
                    >
                      + I Learned This
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Recommended Learning Order Sequence */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Sequential Skill Acquisition Order
            </h2>
            <p className="text-xs text-slate-400">
              Optimal order of learning to bridge gaps rapidly and qualify for summer internships
            </p>
          </div>
          <button
            onClick={() => setActiveTab('career-roadmap')}
            className="px-3.5 py-1.5 bg-indigo-600/15 text-indigo-300 hover:bg-indigo-600/25 rounded-xl text-xs font-semibold border border-indigo-500/30 transition flex items-center gap-1.5"
          >
            <span>Open Milestone Roadmap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {skillGap.items.map((item, index) => (
            <div
              key={item.name}
              className={`p-3.5 rounded-xl border text-xs relative ${
                item.status === 'possessed'
                  ? 'bg-slate-950/40 border-slate-800 opacity-75'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span
                  className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    item.status === 'possessed'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {item.status === 'possessed' ? 'Possessed ✓' : `${item.priority} Priority`}
                </span>
              </div>
              <div className="font-bold text-slate-200">{item.name}</div>
              <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{item.description}</div>
              <div className="text-[10px] text-indigo-300 font-medium mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-400" />
                <span>Est: {item.estimatedWeeks === 0 ? 'Mastered' : `${item.estimatedWeeks} Weeks`}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
