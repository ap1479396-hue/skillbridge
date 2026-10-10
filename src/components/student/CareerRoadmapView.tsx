import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  CheckCircle2,
  Circle,
  Calendar,
  Sparkles,
  BookOpen,
  Code2,
  ArrowRight,
  Target,
  Clock,
  Layers,
  Award
} from 'lucide-react';

export const CareerRoadmapView: React.FC = () => {
  const {
    roadmap,
    toggleRoadmapMilestone,
    currentCareerGoal,
    student,
    setActiveTab
  } = useApp();

  const completedCount = roadmap.filter((m) => m.completed).length;
  const progressPercent = Math.round((completedCount / roadmap.length) * 100);

  return (
    <div id="career-roadmap-page" className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-2.5 py-0.5 rounded border border-indigo-500/30">
                Personalized Learning Pathway
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {currentCareerGoal.title} Roadmap
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Curated for {student.name} ({student.year}, {student.course})
            </p>
          </div>

          <div className="flex items-center gap-4 bg-indigo-500/10 p-3.5 rounded-xl border border-indigo-500/20">
            <div>
              <div className="text-lg font-extrabold text-indigo-300">
                {completedCount} of {roadmap.length}
              </div>
              <div className="text-[10px] text-indigo-200 font-semibold">Phases Completed</div>
            </div>
            <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Milestones */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 sm:before:left-6 before:w-0.5 before:bg-slate-800 before:pointer-events-none">
        {roadmap.map((milestone, idx) => (
          <div
            key={milestone.id}
            className={`relative flex items-start gap-4 sm:gap-6 ${
              milestone.completed ? 'opacity-90' : ''
            }`}
          >
            {/* Step Marker */}
            <button
              onClick={() => toggleRoadmapMilestone(milestone.id)}
              className={`w-10 sm:w-12 h-10 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 transition shadow-lg ${
                milestone.completed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-slate-300 border-2 border-indigo-500/60 hover:border-indigo-400 backdrop-blur-md'
              }`}
              title="Click to toggle completion"
            >
              {milestone.completed ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <span className="font-bold text-sm text-indigo-300">{idx + 1}</span>
              )}
            </button>

            {/* Milestone Card */}
            <div
              className={`flex-1 bg-white/5 backdrop-blur-xl p-6 rounded-2xl border transition shadow-2xl space-y-4 ${
                milestone.completed
                  ? 'border-emerald-500/30 bg-emerald-500/10'
                  : 'border-slate-800 hover:border-indigo-500/40 hover:bg-white/[0.07]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-300 bg-indigo-500/15 px-2.5 py-0.5 rounded border border-indigo-500/30">
                      {milestone.weekRange}
                    </span>
                    <span className="text-sm font-bold text-white">{milestone.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{milestone.focus}</p>
                </div>

                <button
                  onClick={() => toggleRoadmapMilestone(milestone.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                    milestone.completed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
                  }`}
                >
                  {milestone.completed ? '✓ Completed' : 'Mark Complete'}
                </button>
              </div>

              {/* Skills to acquire */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Target Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {milestone.skillsToAcquire.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-md bg-indigo-500/15 text-indigo-200 text-xs font-semibold border border-indigo-500/30"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Checklist */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Weekly Action Items:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {milestone.actionItems.map((act, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-400 mt-0.5">•</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hands-on Project */}
              <div className="p-3.5 bg-slate-900/70 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  <span>Capstone Project: {milestone.projectToBuild.title}</span>
                </div>
                <p className="text-xs text-slate-300">{milestone.projectToBuild.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {milestone.projectToBuild.technologies.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Curated Resources */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-semibold text-slate-400">Curated Guides:</span>
                {milestone.resources.map((res, rIdx) => (
                  <span
                    key={rIdx}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800 font-medium"
                  >
                    📖 {res.title} ({res.platform})
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Assistant Help Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-base flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-4 h-4 text-indigo-300" />
            Want a custom schedule tailored to your exam timetable?
          </h3>
          <p className="text-xs text-slate-400">
            Ask our AI Career Assistant to reschedule your roadmap around college internals and exams.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('ai-assistant')}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs transition shrink-0"
        >
          Ask AI Career Assistant →
        </button>
      </div>
    </div>
  );
};
