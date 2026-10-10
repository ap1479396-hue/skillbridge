import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, Internship } from '../../types';
import { getSafeCandidateName } from '../../services/recruiterIntelligenceService';
import { CandidateProfileModal } from './CandidateProfileModal';
import { AIRecruiterAssistant } from './AIRecruiterAssistant';
import { JobPostingsManager } from './JobPostingsManager';
import {
  Building2,
  Briefcase,
  Users,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Eye,
  Check,
  XCircle,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Search,
  Filter,
  ArrowUpDown,
  Bot,
  Layers,
  Send,
  Calendar,
  AlertTriangle,
  Award
} from 'lucide-react';

export const CompanyDashboard: React.FC = () => {
  const {
    companies,
    internships,
    applications,
    postNewInternship,
    updateApplicationStatus,
    student,
    addNotification,
    activeTab,
    setActiveTab
  } = useApp();

  const company = companies[0] || {
    id: 'comp-portal-01',
    name: 'NexusTech Innovations',
    industry: 'Enterprise SaaS Partner',
    location: 'Bangalore, India',
    size: '150-500 employees',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    verified: true
  };

  const companyInternships = internships.filter(
    (i) => i.companyId === company.id || i.companyName === company.name
  );

  // Applications targeting this company's internships
  const companyApplications = useMemo(() => {
    const jobIds = new Set(companyInternships.map((j) => j.id));
    return applications.filter(
      (a) => jobIds.has(a.internshipId) || a.companyName === company.name || a.companyId === company.id
    );
  }, [applications, companyInternships, company]);

  // Selected Candidate Modal State
  const [selectedCandidateApp, setSelectedCandidateApp] = useState<Application | null>(null);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedMatchFilter, setSelectedMatchFilter] = useState<string>('ALL');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'MATCH_DESC' | 'DATE_DESC' | 'CGPA_DESC'>('MATCH_DESC');

  // Filtered and Sorted Applications
  const filteredApplications = useMemo(() => {
    return companyApplications
      .filter((app) => {
        // Safe candidate name
        const safeName = getSafeCandidateName(app);

        // Text Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = safeName.toLowerCase().includes(q);
          const matchesCollege = app.studentCollege?.toLowerCase().includes(q);
          const matchesRole = app.internshipRole?.toLowerCase().includes(q);
          const matchesSkills = app.studentSkills?.some((s) => s.toLowerCase().includes(q));
          if (!matchesName && !matchesCollege && !matchesRole && !matchesSkills) {
            return false;
          }
        }

        // Job Filter
        if (selectedJobFilter !== 'ALL' && app.internshipId !== selectedJobFilter) {
          return false;
        }

        // Status Filter
        if (selectedStatusFilter !== 'ALL') {
          if (selectedStatusFilter === 'OFFER_ALL') {
            if (app.status !== 'Offer Sent' && app.status !== 'Offered' && app.status !== 'Accepted') {
              return false;
            }
          } else if (app.status !== selectedStatusFilter) {
            return false;
          }
        }

        // Match Score Filter
        if (selectedMatchFilter === '90_PLUS' && app.matchScore < 90) return false;
        if (selectedMatchFilter === '75_PLUS' && app.matchScore < 75) return false;
        if (selectedMatchFilter === '50_PLUS' && app.matchScore < 50) return false;

        // Year Filter
        if (selectedYearFilter !== 'ALL' && !app.studentYear?.toLowerCase().includes(selectedYearFilter.toLowerCase())) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'MATCH_DESC') return b.matchScore - a.matchScore;
        if (sortBy === 'CGPA_DESC') return b.studentCgpa - a.studentCgpa;
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      });
  }, [
    companyApplications,
    searchQuery,
    selectedJobFilter,
    selectedStatusFilter,
    selectedMatchFilter,
    selectedYearFilter,
    sortBy
  ]);

  // Aggregate Metrics Calculations
  const metrics = useMemo(() => {
    const total = companyApplications.length;
    const underReview = companyApplications.filter((a) => a.status === 'Under Review').length;
    const shortlisted = companyApplications.filter((a) => a.status === 'Shortlisted').length;
    const interview = companyApplications.filter((a) => a.status === 'Interview').length;
    const selected = companyApplications.filter((a) => a.status === 'Selected').length;
    const offerSent = companyApplications.filter(
      (a) => a.status === 'Offer Sent' || a.status === 'Offered' || a.status === 'Accepted'
    ).length;
    const avgMatch = total > 0 ? Math.round(companyApplications.reduce((acc, a) => acc + a.matchScore, 0) / total) : 0;

    return { total, underReview, shortlisted, interview, selected, offerSent, avgMatch };
  }, [companyApplications]);

  const handleUpdateStatus = (appId: string, status: Application['status']) => {
    updateApplicationStatus(appId, status);
    if (selectedCandidateApp && selectedCandidateApp.id === appId) {
      setSelectedCandidateApp((prev) => (prev ? { ...prev, status } : null));
    }
  };

  return (
    <div id="company-dashboard-page" className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Company Header Card */}
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={company.logo}
            alt={company.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40 shrink-0"
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">{company.name}</h1>
              <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified Corporate Employer
              </span>
              <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                [DEMO DATA]
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {company.industry} • {company.location} • {company.size || '150-500 employees'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('company-assistant')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
              activeTab === 'company-assistant'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 hover:bg-slate-800 text-indigo-300 border-indigo-500/30'
            }`}
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>AI Recruiter</span>
          </button>

          <button
            onClick={() => setActiveTab('company-postings')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Opening</span>
          </button>
        </div>
      </div>

      {/* Recruiter Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('company-dashboard')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
            activeTab === 'company-dashboard'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
          }`}
        >
          Overview & Metrics
        </button>
        <button
          onClick={() => setActiveTab('company-applicants')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
            activeTab === 'company-applicants'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Candidate Pipeline ({companyApplications.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('company-postings')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
            activeTab === 'company-postings'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Job Postings ({companyInternships.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('company-assistant')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
            activeTab === 'company-assistant'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI Recruiter Assistant</span>
        </button>
      </div>

      {/* Recruiter Analytics KPI Cards */}
      {(activeTab === 'company-dashboard' || activeTab === 'company-applicants') && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow">
            <span className="text-[11px] font-medium text-slate-400 block">Total Applicants</span>
            <span className="text-xl font-black text-white mt-1 block">{metrics.total}</span>
            <span className="text-[10px] text-slate-500 font-mono">100% evaluated</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow">
            <span className="text-[11px] font-medium text-slate-400 block">Under Review</span>
            <span className="text-xl font-black text-amber-400 mt-1 block">{metrics.underReview}</span>
            <span className="text-[10px] text-amber-400/80 font-semibold">Initial screening</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow">
            <span className="text-[11px] font-medium text-slate-400 block">Shortlisted</span>
            <span className="text-xl font-black text-blue-400 mt-1 block">{metrics.shortlisted}</span>
            <span className="text-[10px] text-blue-400/80 font-semibold">Ready for interview</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow">
            <span className="text-[11px] font-medium text-slate-400 block">In Interview</span>
            <span className="text-xl font-black text-indigo-400 mt-1 block">{metrics.interview}</span>
            <span className="text-[10px] text-indigo-400/80 font-semibold">Technical rounds</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow">
            <span className="text-[11px] font-medium text-slate-400 block">Selected / Offered</span>
            <span className="text-xl font-black text-emerald-400 mt-1 block">
              {metrics.selected + metrics.offerSent}
            </span>
            <span className="text-[10px] text-emerald-400/80 font-semibold">Final offers</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow">
            <span className="text-[11px] font-medium text-slate-400 block">Avg Match Rating</span>
            <span className="text-xl font-black text-purple-400 mt-1 block">{metrics.avgMatch}%</span>
            <span className="text-[10px] text-purple-400/80 font-semibold">Skill relevance</span>
          </div>
        </div>
      )}

      {/* VIEW 1: Candidate Pipeline & Table */}
      {(activeTab === 'company-dashboard' || activeTab === 'company-applicants') && (
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white tracking-tight">
                  Candidate Matching Pipeline
                </h2>
                <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  {filteredApplications.length} Candidates
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Students ranked deterministically based on verified skills matching your job requirements
              </p>
            </div>

            {/* Quick Actions */}
            <button
              onClick={() => setActiveTab('company-assistant')}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 self-start md:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ask AI Recruiter</span>
            </button>
          </div>

          {/* Search, Filter & Sort Toolbar */}
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {/* Text Search */}
              <div className="relative lg:col-span-2">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by student name, skill, college..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-xl focus:outline-none focus:border-indigo-500 placeholder-slate-500 text-xs"
                />
              </div>

              {/* Job Filter */}
              <select
                value={selectedJobFilter}
                onChange={(e) => setSelectedJobFilter(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 text-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
              >
                <option value="ALL">All Open Positions ({companyInternships.length})</option>
                {companyInternships.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.role}
                  </option>
                ))}
              </select>

              {/* Pipeline Stage Filter */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 text-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
              >
                <option value="ALL">All Stages</option>
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="OFFER_ALL">Offer Sent / Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>

              {/* Match Score Threshold */}
              <select
                value={selectedMatchFilter}
                onChange={(e) => setSelectedMatchFilter(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 text-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs"
              >
                <option value="ALL">All Match Scores</option>
                <option value="90_PLUS">≥ 90% (Top Match)</option>
                <option value="75_PLUS">≥ 75% (Strong Match)</option>
                <option value="50_PLUS">≥ 50% (Moderate Match)</option>
              </select>
            </div>

            {/* Sub-Filters: Year & Sorting */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Academic Year:</span>
                {['ALL', '1st', '2nd', '3rd', '4th'].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYearFilter(yr)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      selectedYearFilter === yr
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {yr === 'ALL' ? 'All Years' : `${yr} Year`}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded-lg focus:outline-none text-[11px]"
                >
                  <option value="MATCH_DESC">Highest Match Score</option>
                  <option value="DATE_DESC">Newest Application</option>
                  <option value="CGPA_DESC">Highest CGPA</option>
                </select>
              </div>
            </div>
          </div>

          {/* Candidate Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-3">Applied Role</th>
                  <th className="py-3.5 px-3 text-center">Match Score</th>
                  <th className="py-3.5 px-3">Matched Skills</th>
                  <th className="py-3.5 px-3">Skill Deficit</th>
                  <th className="py-3.5 px-3">Education</th>
                  <th className="py-3.5 px-3">Pipeline Stage</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((app) => {
                    const safeName = getSafeCandidateName(app);

                    return (
                      <tr
                        key={app.id}
                        className="hover:bg-slate-900/60 transition group cursor-pointer"
                        onClick={() => setSelectedCandidateApp(app)}
                      >
                        {/* Student Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {app.candidateAvatar ? (
                              <img
                                src={app.candidateAvatar}
                                alt={safeName}
                                className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-xs shrink-0">
                                {safeName.charAt(0)}
                              </div>
                            )}
                            <div className="space-y-0.5">
                              <div className="font-bold text-white group-hover:text-indigo-300 transition flex items-center gap-1.5">
                                <span>{safeName}</span>
                                {app.dataType === 'DEMO' && (
                                  <span className="text-[8px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 py-0.2 rounded">
                                    DEMO
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 line-clamp-1">
                                {app.studentCollege}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Applied Role */}
                        <td className="py-3.5 px-3">
                          <strong className="text-slate-200 block text-xs">{app.internshipRole}</strong>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Applied: {app.appliedDate}
                          </span>
                        </td>

                        {/* Match Score */}
                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-xl text-xs font-black border ${
                              app.matchScore >= 85
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : app.matchScore >= 70
                                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {app.matchScore}%
                          </span>
                        </td>

                        {/* Matched Skills */}
                        <td className="py-3.5 px-3">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {app.matchedSkills.slice(0, 3).map((sk) => (
                              <span
                                key={sk}
                                className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-medium border border-emerald-500/20"
                              >
                                {sk}
                              </span>
                            ))}
                            {app.matchedSkills.length > 3 && (
                              <span className="text-[10px] text-emerald-400 font-semibold">
                                +{app.matchedSkills.length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Missing Skills */}
                        <td className="py-3.5 px-3">
                          {app.missingSkills.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {app.missingSkills.slice(0, 2).map((sk) => (
                                <span
                                  key={sk}
                                  className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-medium border border-amber-500/20"
                                >
                                  {sk}
                                </span>
                              ))}
                              {app.missingSkills.length > 2 && (
                                <span className="text-[10px] text-amber-400 font-semibold">
                                  +{app.missingSkills.length - 2}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> None
                            </span>
                          )}
                        </td>

                        {/* Education */}
                        <td className="py-3.5 px-3 text-slate-300 text-xs">
                          <div>{app.studentYear}</div>
                          <div className="text-[10px] font-semibold text-indigo-400">
                            CGPA: {app.studentCgpa}/10
                          </div>
                        </td>

                        {/* Pipeline Stage */}
                        <td className="py-3.5 px-3" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateStatus(app.id, e.target.value as any)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border focus:outline-none transition ${
                              app.status === 'Offer Sent' || app.status === 'Offered' || app.status === 'Accepted'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : app.status === 'Selected'
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                : app.status === 'Interview'
                                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                                : app.status === 'Shortlisted'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                : app.status === 'Under Review'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : app.status === 'Declined' || app.status === 'Rejected'
                                ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                : 'bg-slate-900 text-slate-300 border-slate-700'
                            }`}
                          >
                            <option value="Applied">Applied</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interview">Interview</option>
                            <option value="Selected">Selected</option>
                            <option value="Offer Sent">Offer Sent</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Declined">Declined</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedCandidateApp(app)}
                              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold text-[11px] transition flex items-center gap-1"
                              title="View Full Profile & Resume"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Details</span>
                            </button>

                            {app.status === 'Applied' && (
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'Shortlisted')}
                                className="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg font-semibold text-[11px] transition"
                              >
                                Shortlist
                              </button>
                            )}

                            {(app.status === 'Shortlisted' || app.status === 'Interview') && (
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'Selected')}
                                className="px-2.5 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-lg font-semibold text-[11px] transition"
                              >
                                Select
                              </button>
                            )}

                            {app.status === 'Selected' && (
                              <button
                                onClick={() => handleUpdateStatus(app.id, 'Offer Sent')}
                                className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg font-semibold text-[11px] transition flex items-center gap-1"
                              >
                                <Send className="w-3 h-3" />
                                <span>Offer</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 space-y-2">
                      <Users className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="font-semibold text-slate-300">No matching candidates found</p>
                      <p className="text-[11px] text-slate-500">
                        Try adjusting your search criteria, role filters, or match score threshold.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: Job Postings Manager */}
      {activeTab === 'company-postings' && (
        <JobPostingsManager
          internships={companyInternships}
          applications={companyApplications}
          companyName={company.name}
          onPostJob={(newJob) => postNewInternship(newJob as any)}
          onSelectJobFilter={(jobId) => {
            setSelectedJobFilter(jobId);
            setActiveTab('company-applicants');
          }}
        />
      )}

      {/* VIEW 3: AI Recruiter Assistant */}
      {activeTab === 'company-assistant' && (
        <AIRecruiterAssistant
          applications={companyApplications}
          internships={companyInternships}
          companyName={company.name}
          onSelectCandidate={(app) => setSelectedCandidateApp(app)}
        />
      )}

      {/* Candidate Profile & Resume Modal */}
      {selectedCandidateApp && (
        <CandidateProfileModal
          application={selectedCandidateApp}
          job={internships.find((j) => j.id === selectedCandidateApp.internshipId)}
          onClose={() => setSelectedCandidateApp(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};
