import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  GraduationCap,
  Building2,
  School,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, setUserRole, setActiveTab, addNotification, student, collegeAdminConfig } = useApp();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState(collegeAdminConfig.institution.name);

  if (!authModalOpen) return null;

  const handleQuickDemoLogin = (role: UserRole) => {
    setUserRole(role);
    if (role === 'student') {
      setActiveTab('student-dashboard');
      addNotification(`Logged in as ${student.name} (${student.year} Student)`, 'success');
    } else if (role === 'company') {
      setActiveTab('company-dashboard');
      addNotification('Logged in as NexusTech Innovations (Recruitment Lead)', 'success');
    } else {
      setActiveTab('college-dashboard');
      addNotification(`Logged in as ${collegeAdminConfig?.institution?.shortCode || 'GCET'} Academic Dean / Placement Head`, 'success');
    }
    setAuthModalOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRole(selectedRole);
    if (selectedRole === 'student') setActiveTab('student-dashboard');
    else if (selectedRole === 'company') setActiveTab('company-dashboard');
    else setActiveTab('college-dashboard');

    addNotification(
      authMode === 'login'
        ? `Logged in successfully as ${selectedRole}!`
        : `Account created and verified! Welcome to SkillBridge.`,
      'success'
    );
    setAuthModalOpen(false);
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
    >
      <div
        id="auth-modal-card"
        className="bg-[#0f172a]/95 backdrop-blur-2xl rounded-2xl max-w-md w-full shadow-2xl border border-white/15 overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="bg-white/5 border-b border-white/10 p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white">SkillBridge Portal</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                SIH 26044
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {authMode === 'login' ? 'Sign in to access your dashboard' : 'Create a verified student/industry profile'}
            </p>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Fast Prototype Switcher */}
        <div className="p-5 bg-white/5 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Instant SIH Demo Profiles (1-Click)
            </span>
            <span className="text-[10px] text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
              No password needed
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('student')}
              className="p-2.5 bg-white/5 hover:bg-indigo-500/30 hover:border-indigo-500/50 rounded-xl border border-white/10 text-left transition group shadow-2xs"
            >
              <GraduationCap className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 mb-1" />
              <div className="text-xs font-bold text-white leading-tight">Student</div>
              <div className="text-[10px] text-slate-400 truncate">
                1st Year CSE
              </div>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('company')}
              className="p-2.5 bg-white/5 hover:bg-teal-500/30 hover:border-teal-500/50 rounded-xl border border-white/10 text-left transition group shadow-2xs"
            >
              <Building2 className="w-4 h-4 text-teal-400 group-hover:text-teal-300 mb-1" />
              <div className="text-xs font-bold text-white leading-tight">Company</div>
              <div className="text-[10px] text-slate-400 truncate">
                Recruiter
              </div>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('college')}
              className="p-2.5 bg-white/5 hover:bg-emerald-500/30 hover:border-emerald-500/50 rounded-xl border border-white/10 text-left transition group shadow-2xs"
            >
              <School className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 mb-1" />
              <div className="text-xs font-bold text-white leading-tight">College</div>
              <div className="text-[10px] text-slate-400 truncate">
                Admin / Dean
              </div>
            </button>
          </div>
        </div>

        {/* Tab Selector & Form */}
        <div className="p-5">
          <div className="flex border-b border-white/10 mb-4">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 pb-2 text-xs font-semibold border-b-2 text-center transition ${
                authMode === 'login'
                  ? 'border-indigo-400 text-indigo-300'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Sign In Form
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 pb-2 text-xs font-semibold border-b-2 text-center transition ${
                authMode === 'register'
                  ? 'border-indigo-400 text-indigo-300'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              New Registration
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['student', 'company', 'college'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center capitalize transition ${
                      selectedRole === r
                        ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300 font-semibold'
                        : 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Full Name / Organization Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Institutional / Work Email
              </label>
              <input
                type="email"
                required
                placeholder="student@college.edu or hr@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                defaultValue="••••••••"
                className="w-full text-xs px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/30 transition flex items-center justify-center gap-1.5"
            >
              <span>{authMode === 'login' ? 'Sign In & Launch Dashboard' : 'Complete Registration'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
