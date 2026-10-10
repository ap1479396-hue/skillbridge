import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { NotificationToast } from './components/common/NotificationToast';
import { AuthModal } from './components/AuthModal';

import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentProfileView } from './components/student/StudentProfileView';
import { ResumeUploadView } from './components/student/ResumeUploadView';
import { SkillGapView } from './components/student/SkillGapView';
import { CareerRoadmapView } from './components/student/CareerRoadmapView';
import { AICareerAssistantView } from './components/student/AICareerAssistantView';
import { InternshipMarketplace } from './components/student/InternshipMarketplace';

import { CompanyDashboard } from './components/company/CompanyDashboard';
import { CollegeDashboard } from './components/college/CollegeDashboard';

const MainContent: React.FC = () => {
  const { userRole, activeTab } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    // If Role is Company
    if (userRole === 'company') {
      return <CompanyDashboard />;
    }

    // If Role is College Dean/Admin
    if (userRole === 'college') {
      return <CollegeDashboard />;
    }

    // If Role is Student
    switch (activeTab) {
      case 'student-dashboard':
        return <StudentDashboard />;
      case 'student-profile':
        return <StudentProfileView />;
      case 'resume-upload':
        return <ResumeUploadView />;
      case 'skill-analysis':
        return <SkillGapView />;
      case 'career-roadmap':
        return <CareerRoadmapView />;
      case 'ai-assistant':
        return <AICareerAssistantView />;
      case 'internships':
        return <InternshipMarketplace />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] flex flex-col text-slate-100 selection:bg-indigo-600 selection:text-white relative">
      <Navbar
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        onToggleMobileSidebar={() => setMobileOpen((prev) => !prev)}
      />

      <div className="flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6 transition-all duration-300">
        <Sidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileOpen}
          onToggleCollapse={() => setSidebarCollapsed(true)}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <main className={`flex-1 min-w-0 pb-12 transition-all duration-300 ${sidebarCollapsed ? 'w-full' : ''}`}>
          {renderContent()}
        </main>
      </div>

      {/* Footer Info for SIH Problem Statement 26044 */}
      <footer className="border-t border-slate-800 bg-slate-950/60 py-4 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">SkillBridge Portal</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Smart India Hackathon Problem Statement 26044</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Academia-Industry Collaboration for Skill Mapping, Internships & Placement
          </div>
        </div>
      </footer>

      {/* Modals & Notifications */}
      <AuthModal />
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
