import React, { useState } from 'react';
import { Application, Internship } from '../../types';
import { getSafeCandidateName } from '../../services/recruiterIntelligenceService';
import {
  X,
  User,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
  Clock,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Award,
  Send,
  Check,
  XCircle,
  Mail,
  Building2,
  GitPullRequest,
  Code2
} from 'lucide-react';

interface CandidateProfileModalProps {
  application: Application;
  job?: Internship;
  onClose: () => void;
  onUpdateStatus: (appId: string, status: Application['status']) => void;
}

export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  application,
  job,
  onClose,
  onUpdateStatus
}) => {
  const [activeTab, setActiveTab] = useState<'match' | 'sources' | 'experience' | 'resume'>('match');
  const [interviewDate, setInterviewDate] = useState(application.interviewDate || '');
  const [showInterviewPicker, setShowInterviewPicker] = useState(false);
  const [offerSalary, setOfferSalary] = useState(job?.stipend || '₹25,000 / month');
  const [showOfferForm, setShowOfferForm] = useState(false);

  const safeName = getSafeCandidateName(application);

  const handleStatusChange = (newStatus: Application['status']) => {
    onUpdateStatus(application.id, newStatus);
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewDate) return;
    onUpdateStatus(application.id, 'Interview');
    setShowInterviewPicker(false);
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(application.id, 'Offer Sent');
    setShowOfferForm(false);
  };

  // Check if registered profile differs from resume data
  const hasNameDifference = application.resumeCandidateName && application.resumeCandidateName !== application.studentName;
  const hasYearDifference = application.resumeAcademicYear && application.resumeAcademicYear !== application.studentYear;
  const hasDifferences = hasNameDifference || hasYearDifference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0f172a] rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-800 text-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900/90 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {application.candidateAvatar ? (
              <img
                src={application.candidateAvatar}
                alt={safeName}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/40 shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xl shrink-0">
                {safeName.charAt(0)}
              </div>
            )}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{safeName}</h2>
                <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  {application.studentYear}
                </span>
                <span className="text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                  CGPA: {application.studentCgpa}/10
                </span>
                {application.dataType === 'DEMO' && (
                  <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                    [DEMO DATA]
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Applied for <span className="text-white font-semibold">{application.internshipRole}</span> •{' '}
                <span className="text-slate-300">{application.studentCollege}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-400 block">Match Score</span>
              <span
                className={`text-lg font-black ${
                  application.matchScore >= 85
                    ? 'text-emerald-400'
                    : application.matchScore >= 70
                    ? 'text-indigo-400'
                    : 'text-amber-400'
                }`}
              >
                {application.matchScore}%
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stage Status Action Bar */}
        <div className="px-6 py-3 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Current Stage:</span>
            <span
              className={`px-2.5 py-1 rounded-lg font-bold text-xs border ${
                application.status === 'Offer Sent' || application.status === 'Offered' || application.status === 'Accepted'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : application.status === 'Selected'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : application.status === 'Interview'
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  : application.status === 'Shortlisted'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  : application.status === 'Under Review'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : application.status === 'Declined' || application.status === 'Rejected'
                  ? 'bg-red-500/20 text-red-300 border-red-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {application.status}
            </span>
          </div>

          {/* Quick Stage Transition Actions */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => handleStatusChange('Under Review')}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition border ${
                application.status === 'Under Review'
                  ? 'bg-amber-500/30 text-amber-200 border-amber-500/50'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              Under Review
            </button>
            <button
              onClick={() => handleStatusChange('Shortlisted')}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition border ${
                application.status === 'Shortlisted'
                  ? 'bg-blue-500/30 text-blue-200 border-blue-500/50'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              Shortlist
            </button>
            <button
              onClick={() => setShowInterviewPicker(!showInterviewPicker)}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition border ${
                application.status === 'Interview'
                  ? 'bg-indigo-500/30 text-indigo-200 border-indigo-500/50'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              Interview
            </button>
            <button
              onClick={() => handleStatusChange('Selected')}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition border ${
                application.status === 'Selected'
                  ? 'bg-purple-500/30 text-purple-200 border-purple-500/50'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              Select
            </button>
            <button
              onClick={() => setShowOfferForm(!showOfferForm)}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition border ${
                application.status === 'Offer Sent' || application.status === 'Offered'
                  ? 'bg-emerald-500/30 text-emerald-200 border-emerald-500/50'
                  : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/30'
              }`}
            >
              Send Offer
            </button>
            <button
              onClick={() => handleStatusChange('Rejected')}
              className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg font-semibold text-[11px] transition"
            >
              Reject
            </button>
          </div>
        </div>

        {/* Interview Scheduler Popover Form */}
        {showInterviewPicker && (
          <form onSubmit={handleScheduleInterview} className="p-4 bg-indigo-950/40 border-b border-indigo-500/30 flex flex-wrap items-center gap-3 text-xs">
            <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="font-semibold text-indigo-200">Schedule Interview Date & Time:</span>
            <input
              type="text"
              placeholder="e.g. 2026-09-05, 11:00 AM IST"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 text-white rounded-lg text-xs focus:outline-none focus:border-indigo-500 grow max-w-sm"
              required
            />
            <button type="submit" className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs transition">
              Confirm & Notify Candidate
            </button>
            <button type="button" onClick={() => setShowInterviewPicker(false)} className="px-2.5 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs">
              Cancel
            </button>
          </form>
        )}

        {/* Offer Form Popover */}
        {showOfferForm && (
          <form onSubmit={handleSendOffer} className="p-4 bg-emerald-950/40 border-b border-emerald-500/30 flex flex-wrap items-center gap-3 text-xs">
            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold text-emerald-200">Extend Official Internship Offer:</span>
            <input
              type="text"
              placeholder="e.g. ₹25,000 / month"
              value={offerSalary}
              onChange={(e) => setOfferSalary(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 text-white rounded-lg text-xs focus:outline-none focus:border-emerald-500 max-w-xs"
              required
            />
            <button type="submit" className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs transition flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              <span>Issue Offer Letter</span>
            </button>
            <button type="button" onClick={() => setShowOfferForm(false)} className="px-2.5 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs">
              Cancel
            </button>
          </form>
        )}

        {/* Offer Stage Follow-ups (Accepted / Declined) */}
        {(application.status === 'Offer Sent' || application.status === 'Offered') && (
          <div className="px-6 py-2.5 bg-emerald-950/30 border-b border-emerald-500/20 flex items-center justify-between text-xs">
            <span className="text-emerald-300 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Offer letter dispatched to candidate ({application.studentEmail}). Awaiting student response.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStatusChange('Accepted')}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-[10px] transition flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Mark Accepted
              </button>
              <button
                onClick={() => handleStatusChange('Declined')}
                className="px-2.5 py-1 bg-red-600/30 hover:bg-red-600/40 text-red-300 border border-red-500/30 rounded-lg font-semibold text-[10px] transition flex items-center gap-1"
              >
                <XCircle className="w-3 h-3" /> Mark Declined
              </button>
            </div>
          </div>
        )}

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('match')}
            className={`px-3.5 py-2 font-semibold text-xs rounded-t-xl transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'match'
                ? 'text-indigo-400 border-indigo-500 bg-slate-900'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Match Analysis</span>
          </button>

          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3.5 py-2 font-semibold text-xs rounded-t-xl transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'sources'
                ? 'text-indigo-400 border-indigo-500 bg-slate-900'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Profile vs Resume Sources</span>
            {hasDifferences && (
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('experience')}
            className={`px-3.5 py-2 font-semibold text-xs rounded-t-xl transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'experience'
                ? 'text-indigo-400 border-indigo-500 bg-slate-900'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Projects & Credentials</span>
          </button>

          <button
            onClick={() => setActiveTab('resume')}
            className={`px-3.5 py-2 font-semibold text-xs rounded-t-xl transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'resume'
                ? 'text-indigo-400 border-indigo-500 bg-slate-900'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Candidate Resume ({application.resumeFileName || 'Document'})</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: Match Analysis */}
          {activeTab === 'match' && (
            <div className="space-y-6">
              {/* Match Score & Summary Banner */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">Deterministic Match Explanation</span>
                    <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                      [CALCULATED]
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {application.matchExplanation ||
                      `Candidate possesses ${application.matchedSkills.length} of the required skills for ${application.internshipRole}. Evaluated via strict verified skill matching.`}
                  </p>
                </div>
                <div className="shrink-0 p-3 bg-slate-950 rounded-xl border border-slate-800 text-center min-w-[120px]">
                  <span className="text-[10px] text-slate-400 block font-medium">Match Percentage</span>
                  <span className="text-2xl font-black text-indigo-400">{application.matchScore}%</span>
                </div>
              </div>

              {/* Matched & Missing Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Matched Skills */}
                <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Matched Skills ({application.matchedSkills.length})
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">[VERIFIED]</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {application.matchedSkills.length > 0 ? (
                      application.matchedSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs font-medium border border-emerald-500/20 flex items-center gap-1"
                        >
                          <span>{s}</span>
                          <span className="text-[10px] text-emerald-400">✓</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">No skills directly matched yet.</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      Missing Skills ({application.missingSkills.length})
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">[SKILL DEFICIT]</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {application.missingSkills.length > 0 ? (
                      application.missingSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 text-xs font-medium border border-amber-500/20 flex items-center gap-1"
                        >
                          <span>{s}</span>
                          <span className="text-[10px] text-amber-400">!</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-emerald-400 font-semibold">
                        ✓ Candidate possesses all required technical competencies for this opening!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* All Student Skills */}
              <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 block">Total Candidate Skill Profile:</span>
                <div className="flex flex-wrap gap-1.5">
                  {application.studentSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[11px]"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Source Isolation (Profile vs Resume) */}
          {activeTab === 'sources' && (
            <div className="space-y-4">
              {hasDifferences && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Source Data Separation Active</span>
                    <span>
                      The candidate's registered student profile contains fields that differ from their uploaded resume document. Both sources are preserved independently without merging.
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Registered Profile Source */}
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      1. Registered Student Profile
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">[AUTHENTICATED]</span>
                  </div>
                  <div className="space-y-2 text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Registered Name:</span>
                      <strong className="text-white">{application.studentName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Institution / College:</span>
                      <span>{application.studentCollege}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Course / Degree:</span>
                        <span>{application.studentCourse}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Academic Year:</span>
                        <span>{application.studentYear}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">CGPA:</span>
                      <span className="text-emerald-400 font-bold">{application.studentCgpa} / 10</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Email:</span>
                      <span>{application.studentEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Uploaded Resume Source */}
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      2. Uploaded Resume Data
                    </span>
                    <span className="text-[10px] text-indigo-400 font-mono">[PARSED DOCUMENT]</span>
                  </div>
                  <div className="space-y-2 text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px]">File Name:</span>
                      <span className="font-mono text-indigo-300">{application.resumeFileName || 'Resume.pdf'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Candidate Name in Resume:</span>
                      <strong className="text-white">{safeName}</strong>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Extracted Year:</span>
                        <span>{application.resumeAcademicYear || application.studentYear}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Extracted CGPA:</span>
                        <span>{application.studentCgpa} / 10</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Extracted Experience:</span>
                      <span>
                        {application.experienceHighlights && application.experienceHighlights.length > 0
                          ? application.experienceHighlights[0]
                          : 'Student project work'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Projects & Credentials */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              {/* Projects */}
              <div className="space-y-3">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  Key Candidate Projects
                </h3>
                {application.projects && application.projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {application.projects.map((p, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <strong className="text-white text-xs">{p.title}</strong>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">{p.description}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {p.technologies.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 text-[10px] rounded border border-indigo-500/20"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-slate-400 text-center">
                    No individual project records listed.
                  </div>
                )}
              </div>

              {/* Experience Highlights */}
              <div className="space-y-3">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  Work & Internship Experience
                </h3>
                {application.experienceHighlights && application.experienceHighlights.length > 0 ? (
                  <div className="space-y-2">
                    {application.experienceHighlights.map((exp, idx) => (
                      <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-2">
                        <span className="text-indigo-400 mt-0.5">•</span>
                        <span className="text-slate-300">{exp}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">No formal prior internships listed.</p>
                )}
              </div>

              {/* Certifications */}
              {application.certifications && application.certifications.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    Verified Certifications & Badges
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {application.certifications.map((c, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{c}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Resume Document Viewer */}
          {activeTab === 'resume' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span className="font-semibold text-white">
                    {application.resumeFileName || 'Resume_Document.pdf'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Applied on {application.appliedDate}
                </span>
              </div>

              {application.resumeText ? (
                <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                  {application.resumeText}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400 space-y-2">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>Resume text not uploaded by candidate. Applied using SkillBridge registered profile.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Application ID: <strong className="font-mono text-slate-300">{application.id}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold transition"
          >
            Close Candidate View
          </button>
        </div>
      </div>
    </div>
  );
};
