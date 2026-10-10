import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  School,
  Users,
  Award,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  BarChart3,
  Download,
  Building2,
  CheckCircle2,
  Layers,
  Sparkles,
  Filter,
  Eye,
  X,
  FileText,
  UserCheck,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Search,
  ArrowUpRight,
  Target,
  Sliders,
  MapPin
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import {
  DEPARTMENTS,
  ACADEMIC_YEARS,
  TARGET_ROLES,
  getInstitutionalAnalytics,
  generateInstitutionalReport
} from '../../services/collegeIntelligenceService';
import { InstitutionalStudent, ReadinessCategory } from '../../types';
import { CollegeManageData } from './CollegeManageData';

export const CollegeDashboard: React.FC = () => {
  const { addNotification, activeTab, setActiveTab, collegeAdminConfig } = useApp();

  // If Manage Data is selected from sidebar or subtabs, render dedicated editor
  if (activeTab === 'college-manage-data') {
    return <CollegeManageData onBackToDashboard={() => setActiveTab('college-dashboard')} />;
  }

  // Filters State
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [studentSearchQuery, setStudentSearchQuery] = useState<string>('');

  // Drill-Down Selection State
  const [selectedReadinessBucket, setSelectedReadinessBucket] = useState<ReadinessCategory | null>('Placement Ready');
  const [inspectingStudent, setInspectingStudent] = useState<InstitutionalStudent | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // Compute reactive analytics matching selected filters and admin configuration
  const analytics = useMemo(() => {
    return getInstitutionalAnalytics(
      {
        department: selectedDept,
        year: selectedYear,
        targetRole: selectedRole
      },
      collegeAdminConfig
    );
  }, [selectedDept, selectedYear, selectedRole, collegeAdminConfig]);

  // Filtered drill-down students based on readiness bucket & search query
  const drillDownStudents = useMemo(() => {
    let list = analytics.filteredStudents;
    if (selectedReadinessBucket) {
      list = list.filter((s) => s.readinessCategory === selectedReadinessBucket);
    }
    if (studentSearchQuery.trim()) {
      const q = studentSearchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q) ||
          s.careerTarget.toLowerCase().includes(q) ||
          s.primarySkillGap.toLowerCase().includes(q)
      );
    }
    return list;
  }, [analytics.filteredStudents, selectedReadinessBucket, studentSearchQuery]);

  const handleExportReport = () => {
    const reportText = generateInstitutionalReport(analytics);
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SkillBridge_Institutional_Report_${selectedDept}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    addNotification('Downloaded Institutional Skill & Placement Report!', 'success');
  };

  const skillChartColors = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6'];

  const getBucketBadgeStyle = (category: ReadinessCategory) => {
    switch (category) {
      case 'Placement Ready':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Almost Ready':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'Needs Improvement':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'At Risk':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div id="college-admin-dashboard-page" className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* 1. College Header with Provenance & Institutional Badges */}
      <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xl border border-emerald-500/30 shrink-0">
            {analytics.institution.shortCode}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-white">
                {analytics.institution.name}
              </h1>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {analytics.institution.placementCell}
              </span>
              {analytics.institution.institutionType && (
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-medium px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                  {analytics.institution.institutionType}
                </span>
              )}
              {!analytics.isCustomized && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-slate-800 text-slate-300 border-slate-700">
                  [Sample Data]
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
              {(analytics.institution.city || analytics.institution.country) && (
                <>
                  <span className="text-slate-300 flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    {[analytics.institution.city, analytics.institution.state, analytics.institution.country].filter(Boolean).join(', ')}
                  </span>
                  <span>•</span>
                </>
              )}
              <span>{analytics.institution.academicYear}</span>
              <span>•</span>
              <span>{analytics.institution.accreditation}</span>
              <span>•</span>
              <span className="text-indigo-400 font-semibold">SIH Problem 26044 Institutional Portal</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
          <button
            onClick={() => setActiveTab('college-manage-data')}
            className="px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-xl text-xs font-semibold border border-indigo-500/30 shadow-xs transition flex items-center gap-1.5"
            title="Edit institution details, student counts, and partner metrics"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Manage Data</span>
          </button>
          <button
            onClick={() => setShowReportModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 shadow-xs transition flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>View Summary</span>
          </button>
          <button
            onClick={handleExportReport}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Analytics Report</span>
          </button>
        </div>
      </div>

      {/* 2. Institutional Hierarchy Filter Toolbar */}
      <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Institutional Hierarchy Filter (Cohort Scope)</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Showing <strong className="text-white">{analytics.kpis.totalStudents.toLocaleString()}</strong> students in active scope
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.code === 'ALL' ? d.name : `${d.code} - ${d.name}`}
                </option>
              ))}
            </select>
          </div>

          {/* Academic Year / Batch Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Year / Batch
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {ACADEMIC_YEARS.map((y) => (
                <option key={y.code} value={y.code}>
                  {y.name}
                </option>
              ))}
            </select>
          </div>

          {/* Target Role Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Career Goal / Target Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {TARGET_ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Sub-tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('college-dashboard')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
            activeTab === 'college-dashboard'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
          }`}
        >
          Institutional Overview & Drill-Down
        </button>
        <button
          onClick={() => setActiveTab('college-analytics')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
            activeTab === 'college-analytics' || activeTab === 'college-skills'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
          }`}
        >
          Department & Skill Gaps
        </button>
        <button
          onClick={() => setActiveTab('college-curriculum')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
            activeTab === 'college-curriculum'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
          }`}
        >
          Curriculum vs Industry Demand (SIH 26044)
        </button>
        <button
          onClick={() => setActiveTab('college-manage-data')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
            activeTab === 'college-manage-data'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Manage Data</span>
        </button>
      </div>

      {/* 4. Executive KPIs Metric Cards (Reactive to Filters) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Cohort Students</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {analytics.kpis.totalStudents.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
            <span>{selectedDept === 'ALL' ? 'All Departments' : selectedDept}</span>
            {!analytics.isCustomized && (
              <span className="text-emerald-400 font-semibold">[Sample Data]</span>
            )}
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Skill Readiness Index</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {analytics.kpis.avgReadiness}%
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Benchmark against 2026 industry requirements</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Internship Applications</span>
            <Briefcase className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {analytics.kpis.internshipsApplied}
          </div>
          <div className="text-[10px] text-blue-400 mt-1 font-semibold">
            {analytics.kpis.totalInterning} currently interning
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Total Placed</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {analytics.kpis.totalPlaced}
          </div>
          <div className="text-[10px] text-purple-400 mt-1 font-semibold">
            {analytics.kpis.placementRate}% Placement Rate
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Corporate Partners</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {analytics.kpis.partnerCompanies}
          </div>
          <div className="text-[10px] text-amber-400 mt-1 font-semibold">
            {analytics.corporatePartners.activeHiringPartners} active hiring drives
          </div>
        </div>
      </div>

      {/* 5. Student Readiness Breakdown (Interactive Clickable Buckets) */}
      <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Student Readiness Breakdown & Interactive Drill-Down
            </h2>
            <p className="text-xs text-slate-400">
              Click a readiness cohort below to inspect individual student profiles and address skill bottlenecks
            </p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 font-mono">
            Scope: {selectedDept} • {selectedYear}
          </span>
        </div>

        {/* 4 Interactive Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Placement Ready */}
          <button
            onClick={() => setSelectedReadinessBucket('Placement Ready')}
            className={`p-4 rounded-xl border text-left transition relative ${
              selectedReadinessBucket === 'Placement Ready'
                ? 'bg-emerald-500/10 border-emerald-500/50 ring-2 ring-emerald-500/20'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-emerald-300">Placement Ready</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                80%–100%
              </span>
            </div>
            <div className="text-2xl font-extrabold text-white mt-1">
              {analytics.readinessBuckets.placementReady.count}
              <span className="text-xs font-normal text-slate-400 ml-1.5">
                ({analytics.readinessBuckets.placementReady.percent}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Possesses verified core skills and ready for corporate interviews
            </p>
          </button>

          {/* 2. Almost Ready */}
          <button
            onClick={() => setSelectedReadinessBucket('Almost Ready')}
            className={`p-4 rounded-xl border text-left transition relative ${
              selectedReadinessBucket === 'Almost Ready'
                ? 'bg-blue-500/10 border-blue-500/50 ring-2 ring-blue-500/20'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-blue-300">Almost Ready</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-bold">
                65%–79%
              </span>
            </div>
            <div className="text-2xl font-extrabold text-white mt-1">
              {analytics.readinessBuckets.almostReady.count}
              <span className="text-xs font-normal text-slate-400 ml-1.5">
                ({analytics.readinessBuckets.almostReady.percent}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Requires 1–2 secondary skills (e.g. TypeScript, Docker) to qualify
            </p>
          </button>

          {/* 3. Needs Improvement */}
          <button
            onClick={() => setSelectedReadinessBucket('Needs Improvement')}
            className={`p-4 rounded-xl border text-left transition relative ${
              selectedReadinessBucket === 'Needs Improvement'
                ? 'bg-amber-500/10 border-amber-500/50 ring-2 ring-amber-500/20'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-amber-300">Needs Improvement</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                45%–64%
              </span>
            </div>
            <div className="text-2xl font-extrabold text-white mt-1">
              {analytics.readinessBuckets.needsImprovement.count}
              <span className="text-xs font-normal text-slate-400 ml-1.5">
                ({analytics.readinessBuckets.needsImprovement.percent}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Lacks hands-on projects and modern framework fundamentals
            </p>
          </button>

          {/* 4. At Risk */}
          <button
            onClick={() => setSelectedReadinessBucket('At Risk')}
            className={`p-4 rounded-xl border text-left transition relative ${
              selectedReadinessBucket === 'At Risk'
                ? 'bg-rose-500/10 border-rose-500/50 ring-2 ring-rose-500/20'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-rose-300">At Risk</span>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold">
                &lt; 45%
              </span>
            </div>
            <div className="text-2xl font-extrabold text-white mt-1">
              {analytics.readinessBuckets.atRisk.count}
              <span className="text-xs font-normal text-slate-400 ml-1.5">
                ({analytics.readinessBuckets.atRisk.percent}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Immediate remedial training and portfolio mentorship recommended
            </p>
          </button>
        </div>

        {/* Drill-Down Student List Table */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                Student Cohort List:
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${selectedReadinessBucket ? getBucketBadgeStyle(selectedReadinessBucket) : 'bg-slate-800 text-slate-300'}`}>
                {selectedReadinessBucket || 'All Students'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ({drillDownStudents.length} sample records • [DEMO DATA])
              </span>
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student or skill gap..."
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold border-y border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Student & Roll No</th>
                  <th className="py-2.5 px-3">Dept & Year</th>
                  <th className="py-2.5 px-3">Target Career</th>
                  <th className="py-2.5 px-3">Readiness</th>
                  <th className="py-2.5 px-3">Primary Skill Gap</th>
                  <th className="py-2.5 px-3">Resume</th>
                  <th className="py-2.5 px-3">Internship</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {drillDownStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-slate-400">
                      No student records found matching this filter criteria.
                    </td>
                  </tr>
                ) : (
                  drillDownStudents.map((stud) => (
                    <tr
                      key={stud.id}
                      className="hover:bg-slate-900/70 transition cursor-pointer"
                      onClick={() => setInspectingStudent(stud)}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={stud.avatar}
                            alt={stud.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white hover:text-indigo-300 transition">
                              {stud.name}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500">
                              {stud.rollNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-300">
                          {stud.department}
                        </span>
                        <div className="text-[10px] text-slate-500">{stud.year}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-200">
                        {stud.careerTarget}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{stud.readinessPercentage}%</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${getBucketBadgeStyle(stud.readinessCategory)}`}>
                            {stud.readinessCategory}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-rose-300 font-medium bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 text-[11px]">
                          {stud.primarySkillGap}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          stud.resumeStatus === 'Verified & Active'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        }`}>
                          {stud.resumeStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-slate-300 font-medium">
                          {stud.internshipStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectingStudent(stud);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold transition inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Profile</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 6. Department Overview Table (Full Breakdown) */}
      {(activeTab === 'college-dashboard' || activeTab === 'college-analytics' || activeTab === 'college-skills') && (
        <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <School className="w-4 h-4 text-indigo-400" />
                Department Overview & Performance Matrix
              </h2>
              <p className="text-xs text-slate-400">
                Departmental comparison across readiness, placement rates, and major skill deficiencies
              </p>
            </div>
            {!analytics.isCustomized && (
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                [Sample Data]
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-y border-slate-800">
                <tr>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Total Students</th>
                  <th className="py-3 px-3">Readiness Index</th>
                  <th className="py-3 px-3">Placement %</th>
                  <th className="py-3 px-3">Internship %</th>
                  <th className="py-3 px-3">Major Skill Deficit</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {analytics.departmentOverviews.map((d) => (
                  <tr key={d.department} className="hover:bg-slate-950/60 transition">
                    <td className="py-3 px-3 font-bold text-white">
                      <div>{d.department}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{d.departmentName}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-200">
                      {d.totalStudents} Students
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{d.readinessAverage}%</span>
                        <div className="w-16 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${d.readinessAverage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-purple-300">
                      {d.placementPercentage}%
                    </td>
                    <td className="py-3 px-3 font-semibold text-blue-300">
                      {d.internshipParticipationPercentage}%
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-[11px] font-medium">
                        {d.majorSkillGap}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedDept(d.department);
                          setActiveTab('college-dashboard');
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded text-[11px] font-semibold transition"
                      >
                        Filter Dept
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. Two Column Charts: Skills Distribution & Institutional Skill Gaps */}
      {(activeTab === 'college-dashboard' || activeTab === 'college-analytics' || activeTab === 'college-skills' || activeTab === 'college-gaps') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Students by Skill (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                  Students by Possessed Skill ({selectedDept} • {selectedYear})
                </h2>
                <p className="text-xs text-slate-400">
                  Number of verified proficient students across technical domains
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded border border-indigo-500/30">
                {analytics.kpis.totalStudents.toLocaleString()} Enrolled
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.skillDistribution}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <XAxis
                    dataKey="skill"
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                  />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      border: '1px solid #1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {analytics.skillDistribution.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={skillChartColors[index % skillChartColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Most Common Institutional Skill Gaps (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Institutional Skill Gaps ({selectedDept})
                </h2>
                <p className="text-xs text-slate-400">% of cohort lacking industry required skills</p>
              </div>
              <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded border border-amber-500/30">
                Deficit Metric
              </span>
            </div>

            <div className="space-y-3">
              {analytics.skillGaps.map((gap) => (
                <div key={gap.skill} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{gap.skill}</span>
                    <span className="font-bold text-rose-400">{gap.missingPercent}% Missing</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${gap.missingPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-xs text-indigo-200">
              <span className="font-bold flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Dean & Placement Directive:
              </span>
              {analytics.institutionalRecommendations[0] || 'Conduct hands-on technical workshops.'}
            </div>
          </div>
        </div>
      )}

      {/* 8. Placement & Internship Funnel Pipelines */}
      {(activeTab === 'college-dashboard' || activeTab === 'college-analytics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Placement Funnel */}
          <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  Placement Conversion Funnel ({selectedDept})
                </h2>
                <p className="text-xs text-slate-400">
                  End-to-end recruitment milestones for eligible batches
                </p>
              </div>
              <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                {analytics.placementFunnel.placementRate}% Rate
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Eligible</div>
                <div className="text-lg font-extrabold text-white mt-1">{analytics.placementFunnel.eligible}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Applied</div>
                <div className="text-lg font-extrabold text-indigo-300 mt-1">{analytics.placementFunnel.applied}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Interviews</div>
                <div className="text-lg font-extrabold text-blue-300 mt-1">{analytics.placementFunnel.interviewing}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Offers</div>
                <div className="text-lg font-extrabold text-amber-300 mt-1">{analytics.placementFunnel.offersReceived}</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="text-[10px] text-emerald-400 font-bold uppercase">Placed</div>
                <div className="text-lg font-extrabold text-emerald-300 mt-1">{analytics.placementFunnel.placed}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Avg CTC:</span>
                <strong className="text-emerald-400 font-semibold">{analytics.placementFunnel.averagePackage}</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Highest CTC:</span>
                <strong className="text-purple-400 font-semibold">{analytics.placementFunnel.highestPackage}</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Campus Drives:</span>
                <strong className="text-indigo-400 font-semibold">{analytics.placementFunnel.activeDrives} Scheduled</strong>
              </div>
            </div>
          </div>

          {/* Internship Funnel */}
          <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  Internship Pipeline Overview ({selectedDept})
                </h2>
                <p className="text-xs text-slate-400">
                  Participation rate in industry apprenticeship programs
                </p>
              </div>
              <span className="text-xs font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">
                {analytics.internshipFunnel.participationRate}% Active
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Eligible</div>
                <div className="text-lg font-extrabold text-white mt-1">{analytics.internshipFunnel.eligible}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Applied</div>
                <div className="text-lg font-extrabold text-indigo-300 mt-1">{analytics.internshipFunnel.applications}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Interviews</div>
                <div className="text-lg font-extrabold text-blue-300 mt-1">{analytics.internshipFunnel.interviews}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Selected</div>
                <div className="text-lg font-extrabold text-amber-300 mt-1">{analytics.internshipFunnel.selected}</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <div className="text-[10px] text-blue-400 font-bold uppercase">Interning</div>
                <div className="text-lg font-extrabold text-blue-300 mt-1">{analytics.internshipFunnel.currentlyInterning}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. Curriculum vs Industry Demanded Skills (SIH Problem 26044 Core Section) */}
      {(activeTab === 'college-dashboard' || activeTab === 'college-curriculum') && (
        <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                Curriculum vs Industry Demand Alignment (SIH Problem 26044)
              </h2>
              <p className="text-xs text-slate-400">
                Direct comparison between college academic syllabus and partner industry hiring requirements
              </p>
            </div>
            <span className="text-xs font-semibold text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded border border-purple-500/30">
              Live Industry Gap Analysis
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.curriculumGaps.map((gap) => (
              <div
                key={gap.domain}
                className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{gap.domain}</span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                      gap.gapSeverity === 'High'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {gap.gapPercentage}% Deficit • {gap.gapSeverity} Severity
                  </span>
                </div>

                <div className="text-[11px] text-slate-400">
                  <strong className="text-slate-300">Course Subject:</strong> {gap.academicSubject}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">College Syllabus</span>
                    <div className="text-slate-300 text-[11px] flex flex-wrap gap-1">
                      {gap.academicSkills.map((s) => (
                        <span key={s} className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-950/30 rounded-lg border border-indigo-500/30 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase">Industry Demand (2026)</span>
                    <div className="text-emerald-300 text-[11px] flex flex-wrap gap-1">
                      {gap.industryDemandedSkills.map((s) => (
                        <span key={s} className="bg-indigo-900/60 text-indigo-200 px-1.5 py-0.5 rounded text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
                  <Target className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Dean Action:</strong> {gap.institutionalRecommendation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. Corporate Partners & Top Hiring Roles */}
      {(activeTab === 'college-dashboard' || activeTab === 'college-analytics') && (
        <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                Corporate Partners & Top Hiring Profiles
              </h2>
              <p className="text-xs text-slate-400">
                Partner companies offering direct campus drives, apprenticeships, and live projects
              </p>
            </div>
            {!analytics.isCustomized && (
              <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                [Sample Data]
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total Partner Companies</span>
              <div className="text-2xl font-bold text-white">{analytics.corporatePartners.totalPartners}</div>
              <span className="text-[10px] text-emerald-400 font-medium">MoU Verified</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Active Hiring Drives</span>
              <div className="text-2xl font-bold text-indigo-300">{analytics.corporatePartners.activeHiringPartners}</div>
              <span className="text-[10px] text-indigo-400 font-medium">Placement Portals Open</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Internship Partners</span>
              <div className="text-2xl font-bold text-blue-300">{analytics.corporatePartners.internshipPartners}</div>
              <span className="text-[10px] text-blue-400 font-medium">Summer & 6-Mo Stints</span>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">New Onboarded Partners</span>
              <div className="text-2xl font-bold text-amber-300">+{analytics.corporatePartners.newPartnersThisYear}</div>
              <span className="text-[10px] text-amber-400 font-medium">This Academic Year</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-300 block mb-2">Top Industry Roles Currently Hiring:</span>
            <div className="flex flex-wrap gap-2">
              {analytics.corporatePartners.topHiringRoles.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STUDENT PROFILE INSPECTOR MODAL */}
      {inspectingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setInspectingStudent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
              <img
                src={inspectingStudent.avatar}
                alt={inspectingStudent.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/40"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{inspectingStudent.name}</h3>
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    {inspectingStudent.rollNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {inspectingStudent.department} • {inspectingStudent.year} (Sec {inspectingStudent.section}) • CGPA: <strong className="text-white">{inspectingStudent.cgpa}</strong>
                </p>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Industry Readiness</span>
                <div className="text-lg font-bold text-white mt-0.5">{inspectingStudent.readinessPercentage}%</div>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${getBucketBadgeStyle(inspectingStudent.readinessCategory)}`}>
                  {inspectingStudent.readinessCategory}
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Target Career</span>
                <div className="text-xs font-bold text-indigo-300 mt-1 truncate">{inspectingStudent.careerTarget}</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Resume Status</span>
                <div className="text-xs font-semibold text-slate-200 mt-1">{inspectingStudent.resumeStatus}</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Placement Status</span>
                <div className="text-xs font-semibold text-purple-300 mt-1">{inspectingStudent.placementStatus}</div>
              </div>
            </div>

            {/* Skills & Gaps */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-300 block mb-1.5">Verified Possessed Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {inspectingStudent.verifiedSkills.map((s) => (
                    <span key={s} className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-lg text-xs font-medium">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-300 block mb-1.5">Skill Gaps to Address:</span>
                <div className="flex flex-wrap gap-1.5">
                  {inspectingStudent.missingSkills.map((s) => (
                    <span key={s} className="px-2.5 py-1 bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded-lg text-xs font-medium">
                      ✕ {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Placed Company or Internship Details */}
            {inspectingStudent.placedCompany && (
              <div className="p-3.5 bg-purple-500/10 rounded-xl border border-purple-500/30 text-xs text-purple-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-purple-400 font-bold uppercase block">Placed Company</span>
                  <div className="font-bold text-white">{inspectingStudent.placedCompany}</div>
                </div>
                {inspectingStudent.stipendOrPackage && (
                  <span className="font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded border border-emerald-500/30">
                    {inspectingStudent.stipendOrPackage}
                  </span>
                )}
              </div>
            )}

            <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-3">
              <span>Notice: Student record retrieved from SkillBridge Institutional DB.</span>
              {!analytics.isCustomized && (
                <span className="font-mono text-slate-500">
                  [Sample Data]
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* INSTITUTIONAL REPORT PREVIEW MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Institutional Skill & Placement Analytics Report
                </h3>
                <p className="text-xs text-slate-400">
                  {analytics.institution.name} • {analytics.filters.department} Cohort
                </p>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap">
              {generateInstitutionalReport(analytics)}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Exportable in plain text / CSV format
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
                >
                  Close
                </button>
                <button
                  onClick={handleExportReport}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
