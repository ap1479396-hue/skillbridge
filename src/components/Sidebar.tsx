import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  User,
  FileText,
  GitCompare,
  MapPin,
  Sparkles,
  Briefcase,
  Building2,
  School,
  Home,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  X,
  PanelLeftClose,
  Target,
  Sliders
} from 'lucide-react';
import { calculateSkillGap } from '../utils/skillMatcher';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile
}) => {
  const {
    userRole,
    setUserRole,
    activeTab,
    setActiveTab,
    student,
    currentCareerGoal,
    internships,
    applications,
    collegeAdminConfig
  } = useApp();

  const collegeTotalStudents = collegeAdminConfig?.departments
    ? Object.values(collegeAdminConfig.departments).reduce((sum, d) => sum + (d.totalStudents || 0), 0)
    : 1420;

  const skillGap = calculateSkillGap(student.currentSkills, currentCareerGoal);

  const studentNavItems = [
    {
      id: 'student-dashboard',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      badge: `${skillGap.readinessPercentage}%`
    },
    {
      id: 'student-profile',
      label: 'Profile & Skills',
      icon: User,
      badge: `${student.currentSkills.length}`
    },
    {
      id: 'resume-upload',
      label: 'Resume Upload & AI Parse',
      icon: FileText,
      badge: student.resumeFileName ? 'Uploaded' : 'New'
    },
    {
      id: 'skill-analysis',
      label: 'Skill-Gap Matrix',
      icon: GitCompare,
      badge: `${skillGap.missingCount} Gaps`,
      highlight: true
    },
    {
      id: 'career-roadmap',
      label: 'Personalized Roadmap',
      icon: MapPin,
      badge: '4 Phases'
    },
    {
      id: 'ai-assistant',
      label: 'AI Career Assistant',
      icon: Sparkles,
      badge: 'Interactive',
      isAi: true
    },
    {
      id: 'internships',
      label: 'Internship Marketplace',
      icon: Briefcase,
      badge: `${internships.length}`
    }
  ];

  const companyActiveJobs = internships.filter(
    (i) => i.companyId === 'comp-portal-01' || i.companyName === 'NexusTech Innovations'
  );
  const companyActiveApps = applications.filter(
    (a) =>
      a.companyName === 'NexusTech Innovations' ||
      a.companyId === 'comp-portal-01' ||
      companyActiveJobs.some((j) => j.id === a.internshipId)
  );

  const companyNavItems = [
    {
      id: 'company-dashboard',
      label: 'Overview & Metrics',
      icon: Building2,
      badge: 'NexusTech'
    },
    {
      id: 'company-applicants',
      label: 'Candidate Match Pipeline',
      icon: CheckCircle2,
      badge: `${companyActiveApps.length}`
    },
    {
      id: 'company-postings',
      label: 'Manage Job Postings',
      icon: Briefcase,
      badge: `${companyActiveJobs.length}`
    },
    {
      id: 'company-assistant',
      label: 'AI Recruiter Assistant',
      icon: Sparkles,
      badge: 'Context-Aware',
      isAi: true
    }
  ];

  const collegeNavItems = [
    {
      id: 'college-dashboard',
      label: 'Institutional Overview',
      icon: School,
      badge: collegeTotalStudents.toLocaleString()
    },
    {
      id: 'college-skills',
      label: 'Batch Skill Breakdown',
      icon: BarChart3,
      badge: '10 Tracks'
    },
    {
      id: 'college-gaps',
      label: 'Industry Gap Aggregates',
      icon: TrendingUp,
      badge: '6 Deficits'
    },
    {
      id: 'college-curriculum',
      label: 'Curriculum Alignment',
      icon: BookOpen,
      badge: 'Live'
    },
    {
      id: 'college-manage-data',
      label: 'Manage Data',
      icon: Sliders,
      badge: 'Admin',
      highlight: true
    }
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full select-none">
      {/* Sidebar Header with Collapse Button */}
      <div className="flex items-center justify-between p-3.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {userRole === 'student'
              ? 'Student Portal'
              : userRole === 'company'
              ? 'Industry Portal'
              : 'College Portal'}
          </span>
        </div>

        {/* Desktop Collapse Button */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex items-center justify-center p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Collapse sidebar"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>

        {/* Mobile Drawer Close Button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links Scroll Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {/* Student Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Student Modules
            </span>
            {userRole === 'student' && (
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
            )}
          </div>
          <div className="space-y-1">
            {studentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = userRole === 'student' && activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    setUserRole('student');
                    handleNavClick(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? 'text-white'
                          : item.isAi
                          ? 'text-indigo-400'
                          : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0 ml-1.5 ${
                        isActive
                          ? 'bg-indigo-700/80 text-white'
                          : item.highlight
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : item.isAi
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Company Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Industry Recruiter
            </span>
            {userRole === 'company' && (
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
            )}
          </div>
          <div className="space-y-1">
            {companyNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = userRole === 'company' && activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    setUserRole('company');
                    handleNavClick(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0 ml-1.5 ${
                        isActive
                          ? 'bg-indigo-700/80 text-white'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* College Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Academia / Dean
            </span>
            {userRole === 'college' && (
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
            )}
          </div>
          <div className="space-y-1">
            {collegeNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = userRole === 'college' && activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    setUserRole('college');
                    handleNavClick(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0 ml-1.5 ${
                        isActive
                          ? 'bg-indigo-700/80 text-white'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Benchmark Footnote */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="bg-slate-900 rounded-lg p-2.5 border border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-300 truncate">
              {currentCareerGoal.title}
            </span>
            <span className="text-[11px] font-bold text-indigo-400">
              {skillGap.readinessPercentage}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${skillGap.readinessPercentage}%` }}
            />
          </div>
          <button
            onClick={() => {
              setUserRole('student');
              setActiveTab('skill-analysis');
              onCloseMobile();
            }}
            className="text-[10px] font-medium text-indigo-400 hover:text-indigo-300 transition block text-left"
          >
            Review {skillGap.missingCount} missing skill gaps →
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          id="mobile-sidebar-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* 2. Mobile Drawer Panel */}
      <div
        id="mobile-sidebar-drawer"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-slate-900 border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </div>

      {/* 3. Desktop Collapsible Sidebar */}
      <aside
        id="desktop-app-sidebar"
        className={`hidden lg:flex flex-col shrink-0 bg-slate-900/90 rounded-2xl border border-slate-800 transition-all duration-300 overflow-hidden sticky top-20 max-h-[calc(100vh-6rem)] ${
          collapsed ? 'w-0 opacity-0 border-0 pointer-events-none' : 'w-64 xl:w-68 opacity-100'
        }`}
      >
        <div className="w-64 xl:w-68 flex flex-col h-full">
          {navContent}
        </div>
      </aside>
    </>
  );
};
