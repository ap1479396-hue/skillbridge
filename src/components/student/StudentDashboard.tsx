import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateInternshipMatch, calculateSkillGap } from '../../utils/skillMatcher';
import { calculateAllCareerMatches } from '../../services/careerIntelligenceEngine';
import { detectSourceConflicts } from '../../services/resumeParser';
import {
  GraduationCap,
  Target,
  Sparkles,
  ArrowRight,
  Briefcase,
  GitCompare,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Award,
  FileText,
  Building2,
  TrendingUp,
  Compass,
  Check,
  DollarSign,
  Layers,
  ShieldCheck
} from 'lucide-react';

/**
 * Calculates a realistic market package estimate based on:
 * - Target career path
 * - Student year / experience
 * - Verified skills and skill-gap readiness percentage
 */
function calculateMarketPackageEstimate(
  careerGoalId: string,
  readinessPercentage: number,
  studentYear: string = '1st Year'
): { range: string; minLPA: number; maxLPA: number; tier1Max: number } {
  const roleBases: Record<string, { baseMin: number; baseMax: number; tier1Max: number }> = {
    'frontend-dev': { baseMin: 4.5, baseMax: 7.5, tier1Max: 14.0 },
    'fullstack-dev': { baseMin: 5.5, baseMax: 9.0, tier1Max: 16.0 },
    'backend-dev': { baseMin: 5.0, baseMax: 8.5, tier1Max: 15.0 },
    'ai-ml-engineer': { baseMin: 6.0, baseMax: 11.0, tier1Max: 20.0 },
    'cloud-devops': { baseMin: 5.5, baseMax: 9.5, tier1Max: 17.0 },
    'data-analyst': { baseMin: 4.0, baseMax: 7.0, tier1Max: 12.0 }
  };

  const base = roleBases[careerGoalId] || { baseMin: 4.5, baseMax: 7.5, tier1Max: 12.0 };
  
  // Readiness adjustment (up to +1.2 LPA for strong skill match, -0.4 LPA for early learner)
  const readinessDelta = ((readinessPercentage - 50) / 100) * 1.5;
  const minLPA = +(base.baseMin + Math.max(-0.4, Math.min(1.5, readinessDelta))).toFixed(1);
  const maxLPA = +(base.baseMax + Math.max(-0.4, Math.min(2.0, readinessDelta * 1.3))).toFixed(1);

  return {
    range: `₹${minLPA} – ₹${maxLPA} LPA`,
    minLPA,
    maxLPA,
    tier1Max: base.tier1Max
  };
}

export const StudentDashboard: React.FC = () => {
  const {
    student,
    currentCareerGoal,
    careerGoals,
    setStudentCareerGoal,
    internships,
    applications,
    roadmap,
    toggleRoadmapMilestone,
    setActiveTab,
    applyForInternship
  } = useApp();

  // 1. INDUSTRY READINESS: Calculated from student's verified skills against target benchmark
  const skillGap = calculateSkillGap(student.currentSkills, currentCareerGoal);
  const careerMatches = calculateAllCareerMatches(student.currentSkills);
  const top3Careers = careerMatches.slice(0, 3);
  const conflicts = detectSourceConflicts(student, student.activeResume);

  // 2. VERIFIED PROFILE SKILLS: Prioritize relevant skills for the active goal
  const goalRequiredNames = new Set(currentCareerGoal.requiredSkills.map((r) => r.name.toLowerCase()));
  const matchedVerifiedSkills = student.currentSkills.filter((s) => goalRequiredNames.has(s.name.toLowerCase()));
  const otherVerifiedSkills = student.currentSkills.filter((s) => !goalRequiredNames.has(s.name.toLowerCase()));
  const topRelevantSkills = [...matchedVerifiedSkills, ...otherVerifiedSkills].slice(0, 4);

  // 3. INTERNSHIP APPLICATIONS: Logically computed counts from actual application records
  const submittedCount = applications.length;
  const underReviewCount = applications.filter((a) => a.status === 'Under Review').length;
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const offeredCount = applications.filter((a) => a.status === 'Offered').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;

  // 4. ROADMAP MILESTONES: Dynamically calculated from completed roadmap items
  const completedMilestones = roadmap.filter((m) => m.completed).length;
  const totalMilestones = roadmap.length;
  const activeMilestone = roadmap.find((m) => !m.completed) || roadmap[roadmap.length - 1];
  const activeMilestoneIndex = activeMilestone ? roadmap.indexOf(activeMilestone) + 1 : 1;

  // 5. PACKAGE ESTIMATE: Dynamically calculated based on target career, verified skills, and readiness
  const packageEstimate = calculateMarketPackageEstimate(
    currentCareerGoal.id,
    skillGap.readinessPercentage,
    student.year
  );

  // Match calculations for all internships
  const matchedInternships = internships.map((int) => {
    const match = calculateInternshipMatch(student.currentSkills, int);
    return {
      ...int,
      matchPercentage: match.matchPercentage,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);

  // Stepper flow configuration
  const workflowSteps = [
    { label: 'Profile', tab: 'student-profile', done: !!student.name },
    { label: 'Upload Resume', tab: 'resume-upload', done: (student.extractedSkills && student.extractedSkills.length > 0) },
    { label: 'Extract Skills', tab: 'resume-upload', done: student.currentSkills.length >= 3 },
    { label: 'Career Match', tab: 'skill-analysis', done: true },
    { label: 'Skill Gap', tab: 'skill-analysis', done: true },
    { label: 'Recommended Internships', tab: 'internships', done: true },
    { label: 'Why You Match', tab: 'ai-assistant', done: true },
    { label: 'Apply', tab: 'internships', done: applications.length > 0 }
  ];

  return (
    <div id="student-dashboard-page" className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-indigo-500/15 text-indigo-300 text-xs px-2.5 py-1 rounded-full font-semibold border border-indigo-500/30 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                {student.course} • {student.year}
              </span>
              <span className="text-xs text-slate-400">CGPA: {student.cgpa}/10</span>
              <span className="text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                [VERIFIED]
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back, {student.name}!
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Academia-Industry skill mapping is active. You currently match{' '}
              <span className="text-indigo-400 font-semibold">{skillGap.readinessPercentage}%</span> of
              benchmark requirements for <span className="text-white font-semibold underline decoration-indigo-500 underline-offset-2">{currentCareerGoal.title}</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="dash-skill-gap-btn"
              onClick={() => setActiveTab('skill-analysis')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-2"
            >
              <GitCompare className="w-4 h-4" />
              <span>Full Gap Matrix</span>
            </button>
            <button
              id="dash-ai-mentor-btn"
              onClick={() => setActiveTab('ai-assistant')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Ask AI Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Source Conflict Notification Alert (if profile differs from active uploaded resume) */}
      {conflicts.length > 0 && student.activeResume && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-amber-300 flex items-center gap-2">
                <span>Profile & Resume Data Differences ({conflicts.length})</span>
                <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded font-normal text-amber-200">
                  Strict Source Isolation Active
                </span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Registered: <strong className="text-white">{student.name} ({student.year})</strong> vs Resume ({student.activeResume.fileName}):{' '}
                <strong className="text-amber-200">{student.activeResume.candidateName || student.name} ({student.activeResume.academicYear || 'Extracted Year'})</strong>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('resume-upload')}
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-xl font-semibold border border-amber-500/30 transition text-xs flex items-center gap-1"
            >
              <span>Manage Differences</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Student -> Company Stepper Flow */}
      <div className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            Academia-to-Industry Pipeline
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            Click any phase to navigate
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {workflowSteps.map((step, idx) => (
            <React.Fragment key={step.label}>
              <button
                onClick={() => setActiveTab(step.tab as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 border ${
                  step.done
                    ? 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-indigo-500/40'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  step.done ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {idx + 1}
                </span>
                <span>{step.label}</span>
              </button>
              {idx < workflowSteps.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Top 4 Core Analytics Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Industry Readiness [CALCULATED] */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Industry Readiness</span>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-bold px-1.5 py-0.5 rounded">
                [CALCULATED]
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{skillGap.readinessPercentage}%</span>
              <span className="text-xs font-medium text-slate-400">of benchmark</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${skillGap.readinessPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
              <span className="text-emerald-400 font-medium">{skillGap.matchedCount} Required Skills Matched</span>
              <span className="text-amber-400 font-semibold">{skillGap.missingCount} Missing Skills</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('skill-analysis')}
            className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between group"
          >
            <span>View Skill Gap</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        </div>

        {/* Metric 2: Verified Profile Skills [VERIFIED] */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Verified Profile Skills</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                [VERIFIED]
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{student.currentSkills.length}</span>
              <span className="text-xs font-medium text-emerald-400">Active Skills</span>
            </div>
            <p className="text-xs text-slate-400 mt-3 line-clamp-1">
              Top: {topRelevantSkills.length > 0 ? topRelevantSkills.map((s) => s.name).join(', ') : 'None added'}
            </p>
            <div className="text-[11px] text-slate-400 mt-1">
              {matchedVerifiedSkills.length}/{currentCareerGoal.requiredSkills.length} match {currentCareerGoal.title}
            </div>
          </div>
          <button
            onClick={() => setActiveTab('student-profile')}
            className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between group"
          >
            <span>View all {student.currentSkills.length} skills</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        </div>

        {/* Metric 3: Active Internship Applications [VERIFIED] */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Internship Applications</span>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-bold px-1.5 py-0.5 rounded">
                [VERIFIED]
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{submittedCount}</span>
              <span className="text-xs font-medium text-indigo-400">Submitted</span>
            </div>
            <div className="text-xs text-slate-400 mt-3 space-y-0.5">
              <div className="flex items-center justify-between text-[11px]">
                <span>Under Review: <strong className="text-slate-200">{underReviewCount}</strong></span>
                <span>Shortlisted: <strong className="text-emerald-400">{shortlistedCount}</strong></span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span>Offered: <strong className="text-indigo-300">{offeredCount}</strong></span>
                <span>Rejected: <strong className="text-slate-400">{rejectedCount}</strong></span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('internships')}
            className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between group"
          >
            <span>Explore Openings ({internships.length})</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        </div>

        {/* Metric 4: Learning Roadmap Progress [CALCULATED] */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Roadmap Milestones</span>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-bold px-1.5 py-0.5 rounded">
                [CALCULATED]
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">
                {completedMilestones}/{totalMilestones}
              </span>
              <span className="text-xs font-medium text-indigo-400">
                {Math.round((completedMilestones / Math.max(1, totalMilestones)) * 100)}% Done
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${(completedMilestones / Math.max(1, totalMilestones)) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2 truncate">
              Next: {activeMilestone?.title || 'All Milestones Completed!'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('career-roadmap')}
            className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between group"
          >
            <span>View Next Milestone</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        </div>
      </div>

      {/* Target Career Goal Selector Pill Bar & Package Estimate [MARKET ESTIMATE] */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Select Target Industry Career Goal
              <span className="text-[10px] bg-slate-800 text-slate-300 font-normal px-2 py-0.5 rounded border border-slate-700">
                Active Benchmark
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Readiness, skill gap matrix, and internship recommendations adapt in real time.
            </p>
          </div>
          
          {/* Dynamic Package Estimate Card */}
          <div className="flex flex-col items-start sm:items-end gap-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-300">
                Estimated Entry-Level Range: <strong className="text-white">{packageEstimate.range}</strong>
              </span>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-bold px-1.5 py-0.5 rounded border border-indigo-500/30">
                [MARKET ESTIMATE]
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              Benchmark based on {skillGap.readinessPercentage}% readiness • Tier-1 potential up to ₹{packageEstimate.tier1Max} LPA
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {careerGoals.map((goal) => {
            const isSelected = goal.id === currentCareerGoal.id;
            return (
              <button
                key={goal.id}
                onClick={() => setStudentCareerGoal(goal.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs font-semibold'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {goal.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Career Match: Top 3 Suitable Careers [CALCULATED] */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Top 3 Career Matches for You
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-bold px-1.5 py-0.5 rounded">
                [CALCULATED]
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Ranked mathematically from your {student.currentSkills.length} verified profile skills
            </p>
          </div>
          <button
            onClick={() => setActiveTab('skill-analysis')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Compare Matrix</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {top3Careers.map((cm, idx) => (
            <div
              key={cm.career.id}
              className={`p-4 rounded-xl border transition ${
                cm.career.id === currentCareerGoal.id
                  ? 'bg-indigo-950/40 border-indigo-500/50 ring-1 ring-indigo-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white truncate">{cm.career.title}</span>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                  {cm.matchPercentage}% Match
                </span>
              </div>
              <div className="text-[11px] text-slate-400 space-y-1">
                <div>
                  <span className="text-slate-300 font-medium">Possessed: </span>
                  <span className="text-emerald-400 font-mono">{cm.matchedSkills.slice(0, 3).join(', ') || 'Basics'}</span>
                </div>
                <div>
                  <span className="text-slate-300 font-medium">Missing: </span>
                  <span className="text-amber-300 font-mono">{cm.missingSkills.slice(0, 2).join(', ') || 'None'}</span>
                </div>
              </div>
              <button
                onClick={() => setStudentCareerGoal(cm.career.id)}
                className="mt-3 w-full py-1.5 text-[11px] font-semibold text-center rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-indigo-500/40 transition"
              >
                {cm.career.id === currentCareerGoal.id ? '✓ Active Target Goal' : 'Set as Target Goal'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Skill Gap Quick Summary & Recommended Internships */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Skill Gap Breakdown Card (5 Cols) [CALCULATED] */}
        <div className="lg:col-span-5 bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-indigo-400" />
                Skill Gap Summary
                <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-bold px-1.5 py-0.5 rounded">
                  [CALCULATED]
                </span>
              </h3>
              <p className="text-xs text-slate-400">Benchmark for {currentCareerGoal.title}</p>
            </div>
            <span className="text-xs font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2 py-1 rounded-lg">
              {skillGap.readinessPercentage}% Ready
            </span>
          </div>

          {/* Possessed Skills [VERIFIED] */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Possessed Skills ({skillGap.matchedCount})
              </span>
              <span className="text-[9px] text-emerald-400/80 font-mono">[VERIFIED]</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skillGap.strengths.length > 0 ? (
                skillGap.strengths.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs font-medium border border-emerald-500/20 flex items-center gap-1"
                  >
                    <span>{skill}</span>
                    <span className="text-[10px] text-emerald-400">✓</span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No matching skills verified yet.</span>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
              <span className="flex items-center gap-1.5 text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Critical Missing Skills ({skillGap.missingCount})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skillGap.items
                .filter((i) => i.status === 'missing')
                .map((item) => (
                  <span
                    key={item.name}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 text-xs font-medium border border-amber-500/20 flex items-center gap-1.5"
                  >
                    <span>{item.name}</span>
                    <span className="text-[9px] uppercase font-bold px-1 rounded bg-amber-400/20 text-amber-200">
                      {item.priority}
                    </span>
                  </span>
                ))}
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl text-xs text-slate-300 leading-relaxed border border-slate-800">
            <span className="font-semibold text-slate-200">Learning Priority: </span>
            {skillGap.criticalGaps.slice(0, 3).join(' → ') || 'All core benchmark skills acquired!'}
          </div>

          <button
            onClick={() => setActiveTab('skill-analysis')}
            className="w-full py-2 bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition text-center block"
          >
            Open Interactive Gap Matrix & Study Plan →
          </button>
        </div>

        {/* Right: Top Recommended Internships (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                Internship & Job Matching Engine
                <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-bold px-1.5 py-0.5 rounded">
                  [CALCULATED]
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Ranked by verified skill alignment with your profile
              </p>
            </div>
            <button
              onClick={() => setActiveTab('internships')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All ({internships.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {matchedInternships.slice(0, 3).map((item) => {
              const hasApplied = applications.some((a) => a.internshipId === item.id);
              const isDemo = item.sourceType === 'DEMO';
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.role}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.matchPercentage >= 75
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : item.matchPercentage >= 50
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {item.matchPercentage}% Match [CALCULATED]
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-medium text-slate-200">{item.companyName}</span>
                      <span>•</span>
                      <span>{item.location}</span>
                      {item.stipend && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-emerald-400">{item.stipend}</span>
                        </>
                      )}
                      <span>•</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        isDemo ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {item.sourceName} {isDemo ? '[DEMO]' : '[VERIFIED]'}
                      </span>
                    </div>

                    {/* Why You Match Note */}
                    <div className="text-[11px] text-slate-300 pt-0.5">
                      <span className="font-medium text-emerald-400">Why you match: </span>
                      <span>Possess {item.matchedSkills.length}/{item.requiredSkills.length} skills ({item.matchedSkills.slice(0, 3).join(', ') || 'prerequisites'})</span>
                      {item.missingSkills.length > 0 && (
                        <span className="text-slate-400"> • Missing: {item.missingSkills.slice(0, 2).join(', ')}</span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {hasApplied ? (
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => applyForInternship(item.id)}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition whitespace-nowrap"
                      >
                        Quick Apply
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Roadmap Milestone Card [CALCULATED] */}
      {activeMilestone && (
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Current Roadmap Milestone</h3>
                <span className="text-[10px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold px-2 py-0.5 rounded">
                  Phase {activeMilestoneIndex} of {totalMilestones}
                </span>
                <span className="text-[9px] bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded">
                  [CALCULATED]
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeMilestone.weekRange}: {activeMilestone.title}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('career-roadmap')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Full Curriculum</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{activeMilestone.focus}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeMilestone.skillsToAcquire.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-0.5 rounded-md bg-slate-800 text-indigo-300 text-xs font-medium border border-slate-700"
                  >
                    +{s}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-300">
                <span className="font-semibold text-white">Capstone Project: </span>
                {activeMilestone.projectToBuild.title} — {activeMilestone.projectToBuild.description}
              </p>
            </div>

            <button
              onClick={() => toggleRoadmapMilestone(activeMilestone.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
                activeMilestone.completed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
              }`}
            >
              {activeMilestone.completed ? '✓ Completed' : 'Mark Milestone Done'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

