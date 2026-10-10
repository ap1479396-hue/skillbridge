import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Building2,
  School,
  Sparkles,
  Menu,
  PanelLeftClose,
  PanelLeft,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  sidebarCollapsed,
  onToggleSidebar,
  onToggleMobileSidebar
}) => {
  const {
    userRole,
    setUserRole,
    activeTab,
    setActiveTab,
    student,
    setAuthModalOpen,
    collegeAdminConfig
  } = useApp();

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    if (role === 'student') {
      setActiveTab('student-dashboard');
    } else if (role === 'company') {
      setActiveTab('company-dashboard');
    } else if (role === 'college') {
      setActiveTab('college-dashboard');
    } else {
      setActiveTab('home');
    }
  };

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 transition-colors duration-200"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Hamburger & Brand */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Drawer Trigger */}
            <button
              id="mobile-sidebar-toggle-btn"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              aria-label="Toggle navigation drawer"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Sidebar Collapse / Expand Toggle */}
            <button
              id="desktop-sidebar-toggle-btn"
              onClick={onToggleSidebar}
              className="hidden lg:flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <PanelLeft className="w-5 h-5 text-indigo-400" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>

            {/* Brand Title */}
            <div
              id="brand-logo-btn"
              onClick={() => setActiveTab('student-dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs shadow-indigo-900/50 group-hover:bg-indigo-500 transition">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base tracking-tight text-white">
                    Skill<span className="text-indigo-400">Bridge</span>
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider bg-indigo-500/15 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
                    SIH 26044
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 hidden xl:inline font-normal">
                  Academia-Industry Skill & Placement Portal
                </span>
              </div>
            </div>
          </div>

          {/* Center: Role Switcher Pills */}
          <div className="hidden md:flex items-center bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <span className="text-xs font-medium text-slate-400 px-2.5">Persona:</span>

            <button
              id="role-switch-student-btn"
              onClick={() => handleRoleChange('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                userRole === 'student'
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>

            <button
              id="role-switch-company-btn"
              onClick={() => handleRoleChange('company')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                userRole === 'company'
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Company / Recruiter</span>
            </button>

            <button
              id="role-switch-college-btn"
              onClick={() => handleRoleChange('college')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                userRole === 'college'
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>College Admin</span>
            </button>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5">
            {/* AI Assistant Quick Pill */}
            <button
              id="navbar-ai-assistant-btn"
              onClick={() => {
                setUserRole('student');
                setActiveTab('ai-assistant');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Assistant</span>
            </button>

            {/* Profile Tag */}
            {userRole === 'student' ? (
              <div
                id="student-header-badge"
                onClick={() => setActiveTab('student-profile')}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1 bg-slate-800/80 border border-slate-700/60 rounded-full hover:bg-slate-800 cursor-pointer transition"
                title="View Student Profile"
              >
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-500/50"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-200 leading-tight">
                    {student.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400">1st Year CSE</div>
                </div>
              </div>
            ) : userRole === 'company' ? (
              <div
                id="company-header-badge"
                onClick={() => setActiveTab('company-dashboard')}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-full cursor-pointer hover:bg-slate-800 transition text-xs font-semibold text-slate-200"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">NexusTech</span>
              </div>
            ) : (
              <div
                id="college-header-badge"
                onClick={() => setActiveTab('college-dashboard')}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-full cursor-pointer hover:bg-slate-800 transition text-xs font-semibold text-slate-200"
              >
                <School className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">
                  {collegeAdminConfig?.institution?.shortCode || 'GCET'} Dean
                </span>
              </div>
            )}

            {/* Auth / Demo Switch Modal Trigger */}
            <button
              id="navbar-login-btn"
              onClick={() => setAuthModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium border border-slate-700 transition"
            >
              Switch Role
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
