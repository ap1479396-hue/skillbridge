import React, { useState } from 'react';
import { Internship, Application } from '../../types';
import {
  Briefcase,
  Plus,
  Users,
  Calendar,
  MapPin,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  X,
  Building2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface JobPostingsManagerProps {
  internships: Internship[];
  applications: Application[];
  companyName: string;
  onPostJob: (newJob: Partial<Internship>) => void;
  onSelectJobFilter: (jobId: string) => void;
}

export const JobPostingsManager: React.FC<JobPostingsManagerProps> = ({
  internships,
  applications,
  companyName,
  onPostJob,
  onSelectJobFilter
}) => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Web Engineering');
  const [stipend, setStipend] = useState('₹25,000 / month');
  const [duration, setDuration] = useState('3 Months');
  const [workMode, setWorkMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('Remote');
  const [openings, setOpenings] = useState(2);
  const [requiredSkillsStr, setRequiredSkillsStr] = useState('React, JavaScript, TypeScript, HTML, CSS, Git');
  const [description, setDescription] = useState('');
  const [minCgpa, setMinCgpa] = useState('7.5');

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) return;

    const skills = requiredSkillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newJob: Partial<Internship> = {
      id: `job-nex-${Date.now()}`,
      companyId: 'comp-portal-01',
      companyName,
      companyType: 'Enterprise SaaS Partner',
      role,
      department,
      jobType: 'Internship',
      location: 'Bangalore, India',
      workMode,
      type: workMode,
      duration,
      stipend,
      openings: Number(openings) || 1,
      deadline: '2026-11-30',
      requiredSkills: skills,
      preferredSkills: ['REST APIs', 'Tailwind CSS'],
      eligibility: {
        minimumDegree: 'B.Tech / BCA / MCA',
        eligibleYears: ['1st Year (FY)', '2nd Year (SY)', '3rd Year (TY)', '4th Year (Final)'],
        minCgpa: parseFloat(minCgpa) || 7.0
      },
      description: description || `Internship role at ${companyName} for ${role}.`,
      responsibilities: [
        'Collaborate with engineering mentors on production deliverables',
        'Write tested, modular code complying with company standards'
      ],
      perks: ['Pre-Placement Offer (PPO) Evaluation', 'Flexible Hours', 'Certificate of Completion'],
      postedDate: 'Just now',
      source: 'SkillBridge Employer Portal',
      sourceType: 'COMPANY_POSTED',
      sourceName: `${companyName} Direct Portal`,
      sourceVerificationStatus: 'PORTAL_HOSTED',
      isVerified: true,
      verified: true,
      dataType: 'DEMO',
      lastUpdated: 'Live Portal Feed'
    };

    onPostJob(newJob);
    setShowPostModal(false);
    setRole('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-base">Active Job Postings</h3>
            <span className="text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
              {internships.length} Open Positions
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Directly managed from the {companyName} Recruiter Portal
          </p>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Opening</span>
        </button>
      </div>

      {/* Postings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {internships.map((job) => {
          const jobApplicants = applications.filter((a) => a.internshipId === job.id);
          const shortlisted = jobApplicants.filter((a) => a.status === 'Shortlisted').length;
          const inInterview = jobApplicants.filter((a) => a.status === 'Interview').length;
          const selected = jobApplicants.filter((a) => a.status === 'Selected' || a.status === 'Offer Sent' || a.status === 'Accepted').length;

          return (
            <div
              key={job.id}
              className="p-5 bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">
                      {job.department || 'Engineering'}
                    </span>
                    <h4 className="text-base font-bold text-white tracking-tight">{job.role}</h4>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    {job.workMode || 'Remote'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Metadata details */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{job.stipend}</span>
                    <span className="text-[9px] text-emerald-400 font-mono">[VERIFIED]</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{job.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>{job.openings} Openings</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Deadline: {job.deadline || 'Rolling'}</span>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 block font-semibold">Required Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {job.requiredSkills.map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 bg-slate-950 text-slate-300 rounded border border-slate-800 text-[10px] font-medium"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Applicant Pipeline Counter Card */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 block">Applicants</span>
                    <span className="font-bold text-white text-sm">{jobApplicants.length}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 block">Shortlisted</span>
                    <span className="font-bold text-blue-400 text-sm">{shortlisted}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 block">Interview</span>
                    <span className="font-bold text-indigo-400 text-sm">{inInterview}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 block">Selected</span>
                    <span className="font-bold text-emerald-400 text-sm">{selected}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectJobFilter(job.id)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                >
                  <span>View Pipeline</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Post New Job Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] rounded-2xl max-w-2xl w-full border border-slate-800 shadow-2xl p-6 space-y-4 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Create New Internship Posting</h3>
              </div>
              <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Role Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cloud & DevOps Apprentice"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Stipend / Salary *</label>
                  <input
                    type="text"
                    value={stipend}
                    onChange={(e) => setStipend(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Work Mode</label>
                  <select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Openings Count</label>
                  <input
                    type="number"
                    min="1"
                    value={openings}
                    onChange={(e) => setOpenings(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Minimum CGPA Benchmark</label>
                  <input
                    type="text"
                    value={minCgpa}
                    onChange={(e) => setMinCgpa(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Required Skills (Comma separated) *</label>
                <input
                  type="text"
                  required
                  value={requiredSkillsStr}
                  onChange={(e) => setRequiredSkillsStr(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Job Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline key responsibilities and expectations..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition shadow-lg shadow-indigo-600/30"
                >
                  Publish Job Posting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
