import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Application,
  CareerGoal,
  CollegeStats,
  CompanyProfile,
  Internship,
  RoadmapMilestone,
  Skill,
  StudentProfile,
  UploadedResumeData,
  UserRole,
  CollegeAdminConfig
} from '../types';
import {
  CAREER_GOALS,
  COLLEGE_ANALYTICS,
  COMPANIES,
  INITIAL_APPLICATIONS,
  INITIAL_INTERNSHIPS,
  INITIAL_ROADMAP_FRONTEND,
  INITIAL_STUDENT_PROFILE,
  SAMPLE_RESUMES
} from '../data/mockData';
import {
  calculateOverallMatch,
  calculateCollegeAnalytics
} from '../utils/skillMatcher';
import { extractSkillsFromText, extractExperienceFromText } from '../services/skillExtractor';
import { parseUploadedResume } from '../services/resumeParser';
import { DEFAULT_COLLEGE_CONFIG, DEFAULT_PLACEMENT_PIPELINE } from '../services/collegeIntelligenceService';

interface NotificationItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  timestamp: string;
}

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  student: StudentProfile;
  setStudent: React.Dispatch<React.SetStateAction<StudentProfile>>;
  careerGoals: CareerGoal[];
  currentCareerGoal: CareerGoal;
  internships: Internship[];
  applications: Application[];
  companies: CompanyProfile[];
  collegeStats: CollegeStats;
  collegeAdminConfig: CollegeAdminConfig;
  updateCollegeAdminConfig: (newConfig: CollegeAdminConfig) => void;
  resetCollegeAdminConfig: () => void;
  roadmap: RoadmapMilestone[];
  notifications: NotificationItem[];
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  // Source-Aware Resume Actions
  setActiveResume: (resume: UploadedResumeData | null) => void;
  clearActiveResume: () => void;
  registerUploadedResume: (fileName: string, rawText: string, fileType?: string) => UploadedResumeData;
  deleteResumeFromHistory: (resumeId: string) => void;
  deleteMultipleResumesFromHistory: (resumeIds: string[]) => void;
  renameResumeInHistory: (resumeId: string, newFileName: string) => void;
  updateExtractedSkillsForActiveResume: (skills: { name: string; category: Skill['category']; confidence: number; evidence?: string | string[]; sources?: string[]; sourceSection?: string }[]) => void;
  // Actions
  addSkillToStudent: (skill: Skill) => void;
  removeSkillFromStudent: (skillName: string) => void;
  updateStudentProfile: (updates: Partial<StudentProfile>) => void;
  setStudentCareerGoal: (goalId: string) => void;
  applyForInternship: (internshipId: string) => boolean;
  postNewInternship: (newInternship: Omit<Internship, 'id' | 'postedDate' | 'sourceType' | 'sourceName' | 'sourceVerificationStatus' | 'isVerified' | 'dataType' | 'source'> & Partial<Internship>) => void;
  updateApplicationStatus: (appId: string, status: Application['status']) => void;
  toggleRoadmapMilestone: (milestoneId: string) => void;
  loadSampleResume: (sampleIndex: number) => void;
  applyExtractedSkillsToProfile: (extractedSkills: { name: string; category: any }[]) => void;
  addNotification: (message: string, type?: 'success' | 'info' | 'warning') => void;
  dismissNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_STUDENT = 'skillbridge_student_profile_v2';
const STORAGE_KEY_INTERNSHIPS = 'skillbridge_internships_v2';
const STORAGE_KEY_APPLICATIONS = 'skillbridge_applications_v2';
const STORAGE_KEY_ROADMAP = 'skillbridge_roadmap_v2';
const STORAGE_KEY_ROLE = 'skillbridge_user_role_v2';
const STORAGE_KEY_TAB = 'skillbridge_active_tab_v2';
const STORAGE_KEY_COLLEGE_CONFIG = 'skillbridge_college_admin_config_v2';

let globalNotifCounter = 0;
const getUniqueId = (prefix: string) => {
  globalNotifCounter += 1;
  return `${prefix}-${Date.now()}-${globalNotifCounter}-${Math.random().toString(36).slice(2, 8)}`;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROLE);
      if (saved === 'student' || saved === 'company' || saved === 'college') return saved;
    } catch {}
    return 'student';
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TAB);
      if (saved) return saved;
    } catch {}
    return 'student-dashboard';
  });

  const [student, setStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.id) {
          return { ...INITIAL_STUDENT_PROFILE, ...parsed };
        }
      }
    } catch (err) {
      console.error('Failed to load student profile from localStorage:', err);
    }
    return INITIAL_STUDENT_PROFILE;
  });

  const [careerGoals] = useState<CareerGoal[]>(CAREER_GOALS);

  const [internships, setInternships] = useState<Internship[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INTERNSHIPS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_INTERNSHIPS;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPLICATIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_APPLICATIONS;
  });

  const [companies] = useState<CompanyProfile[]>(COMPANIES);

  const [roadmap, setRoadmap] = useState<RoadmapMilestone[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROADMAP);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_ROADMAP_FRONTEND;
  });

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      message: 'Welcome to SkillBridge! Your skill gap analysis for Frontend Developer is ready.',
      type: 'info',
      timestamp: 'Just now'
    }
  ]);

  // Dynamically compute college stats from student profiles & jobs
  const [collegeStats, setCollegeStats] = useState<CollegeStats>(() =>
    calculateCollegeAnalytics([student], internships)
  );

  const [collegeAdminConfig, setCollegeAdminConfig] = useState<CollegeAdminConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COLLEGE_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...DEFAULT_COLLEGE_CONFIG,
            ...parsed,
            institution: {
              ...DEFAULT_COLLEGE_CONFIG.institution,
              ...(parsed.institution || {})
            },
            departments: {
              ...DEFAULT_COLLEGE_CONFIG.departments,
              ...(parsed.departments || {})
            },
            corporatePartners: {
              ...DEFAULT_COLLEGE_CONFIG.corporatePartners,
              ...(parsed.corporatePartners || {}),
              topHiringRoles: Array.isArray(parsed.corporatePartners?.topHiringRoles)
                ? parsed.corporatePartners.topHiringRoles
                : [...DEFAULT_COLLEGE_CONFIG.corporatePartners.topHiringRoles]
            },
            placementPipeline: {
              ...DEFAULT_PLACEMENT_PIPELINE,
              ...(parsed.placementPipeline || {})
            }
          };
        }
      }
    } catch (err) {
      console.error('Failed to load college config from localStorage:', err);
    }
    return DEFAULT_COLLEGE_CONFIG;
  });

  // Persist college config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COLLEGE_CONFIG, JSON.stringify(collegeAdminConfig));
    } catch (err) {
      console.error('Failed to save college config to localStorage:', err);
    }
  }, [collegeAdminConfig]);

  const updateCollegeAdminConfig = (newConfig: CollegeAdminConfig) => {
    const updated: CollegeAdminConfig = {
      ...newConfig,
      institution: {
        ...newConfig.institution,
        dataType: 'Custom'
      },
      corporatePartners: {
        ...newConfig.corporatePartners,
        dataType: 'Custom'
      },
      placementPipeline: newConfig.placementPipeline ? {
        ...newConfig.placementPipeline,
        dataType: 'Custom'
      } : undefined,
      isCustomized: true,
      lastUpdated: new Date().toISOString()
    };
    setCollegeAdminConfig(updated);

    // Propagate institution name throughout app: student profile & applications
    if (newConfig.institution?.name) {
      setStudent((prev) => ({
        ...prev,
        college: newConfig.institution.name
      }));
      setApplications((prev) =>
        prev.map((app) => ({
          ...app,
          studentCollege: newConfig.institution.name
        }))
      );
    }

    addNotification('College institutional data updated & saved across SkillBridge.', 'success');
  };

  const resetCollegeAdminConfig = () => {
    setCollegeAdminConfig(DEFAULT_COLLEGE_CONFIG);
    setStudent((prev) => ({
      ...prev,
      college: DEFAULT_COLLEGE_CONFIG.institution.name
    }));
    setApplications((prev) =>
      prev.map((app) => ({
        ...app,
        studentCollege: DEFAULT_COLLEGE_CONFIG.institution.name
      }))
    );
    addNotification('Institutional data reset to default Sample Data.', 'info');
  };

  // Synchronize student profile and applications with custom institution name across sessions
  useEffect(() => {
    if (collegeAdminConfig.isCustomized && collegeAdminConfig.institution?.name) {
      setStudent((prev) => {
        if (prev.college !== collegeAdminConfig.institution.name) {
          return { ...prev, college: collegeAdminConfig.institution.name };
        }
        return prev;
      });
      setApplications((prev) => {
        let needsUpdate = false;
        const mapped = prev.map((app) => {
          if (app.studentCollege !== collegeAdminConfig.institution.name) {
            needsUpdate = true;
            return { ...app, studentCollege: collegeAdminConfig.institution.name };
          }
          return app;
        });
        return needsUpdate ? mapped : prev;
      });
    }
  }, [collegeAdminConfig.isCustomized, collegeAdminConfig.institution?.name]);

  // Recalculate college analytics whenever student skills or jobs change
  useEffect(() => {
    setCollegeStats(calculateCollegeAnalytics([student], internships));
  }, [student.currentSkills, internships]);

  // Recalculate student candidate applications whenever student skills or profile changes
  useEffect(() => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.studentId === student.id) {
          const job = internships.find((i) => i.id === app.internshipId);
          if (job) {
            const currentGoal = careerGoals.find((g) => g.id === student.careerGoalId);
            const match = calculateOverallMatch(student, job, currentGoal);
            return {
              ...app,
              studentName: student.name,
              studentEmail: student.email,
              studentCollege: student.college,
              studentCourse: student.course,
              studentYear: student.year,
              studentCgpa: student.cgpa,
              studentSkills: student.currentSkills.map((s) => s.name),
              matchedSkills: match.matchedSkills,
              missingSkills: match.missingSkills,
              matchScore: match.overallMatch,
              matchExplanation: match.explanation
            };
          }
        }
        return app;
      })
    );
  }, [student, internships, careerGoals]);

  // Persist student profile changes automatically to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(student));
    } catch (err) {
      console.error('Failed to save student profile to localStorage:', err);
    }
  }, [student]);

  // Persist internships changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INTERNSHIPS, JSON.stringify(internships));
    } catch {}
  }, [internships]);

  // Persist applications changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(applications));
    } catch {}
  }, [applications]);

  // Persist roadmap changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROADMAP, JSON.stringify(roadmap));
    } catch {}
  }, [roadmap]);

  // Persist role & active tab to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROLE, userRole);
    } catch {}
  }, [userRole]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TAB, activeTab);
    } catch {}
  }, [activeTab]);

  const currentCareerGoal =
    careerGoals.find((g) => g.id === student.careerGoalId) || careerGoals[0];

  const addNotification = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const newNotif: NotificationItem = {
      id: getUniqueId('notif'),
      message,
      type,
      timestamp: 'Just now'
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 4)]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const updateStudentProfile = (updates: Partial<StudentProfile>) => {
    setStudent((prev) => ({ ...prev, ...updates }));
    addNotification('Profile updated successfully.', 'success');
  };

  const addSkillToStudent = (newSkill: Skill) => {
    if (student.currentSkills.some((s) => s.name.toLowerCase() === newSkill.name.toLowerCase())) {
      addNotification(`Skill "${newSkill.name}" is already in your profile.`, 'warning');
      return;
    }
    setStudent((prev) => ({
      ...prev,
      currentSkills: [...prev.currentSkills, newSkill]
    }));
    addNotification(`Added "${newSkill.name}" to verified skills! Match percentages updated.`, 'success');
  };

  const removeSkillFromStudent = (skillName: string) => {
    setStudent((prev) => ({
      ...prev,
      currentSkills: prev.currentSkills.filter(
        (s) => s.name.toLowerCase() !== skillName.toLowerCase()
      )
    }));
    addNotification(`Removed "${skillName}" from profile.`, 'info');
  };

  const setStudentCareerGoal = (goalId: string) => {
    setStudent((prev) => ({ ...prev, careerGoalId: goalId }));
    const goal = careerGoals.find((g) => g.id === goalId);
    addNotification(`Target career goal updated to "${goal?.title || goalId}".`, 'success');
  };

  const applyForInternship = (internshipId: string): boolean => {
    const internship = internships.find((i) => i.id === internshipId);
    if (!internship) return false;

    const alreadyApplied = applications.some(
      (a) => a.internshipId === internshipId && a.studentId === student.id
    );

    if (alreadyApplied) {
      addNotification(`You have already applied for "${internship.role}".`, 'warning');
      return false;
    }

    const match = calculateOverallMatch(student, internship, currentCareerGoal);

    const newApp: Application = {
      id: getUniqueId('app'),
      internshipId: internship.id,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      studentCollege: student.college,
      studentCourse: student.course,
      studentDegree: student.degree || 'B.Tech',
      studentYear: student.year,
      studentCgpa: student.cgpa,
      studentSkills: student.currentSkills.map((s) => s.name),
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      matchScore: match.overallMatch,
      matchExplanation: match.explanation,
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      internshipRole: internship.role,
      companyName: internship.companyName,
      resumeFileName: student.resumeFileName
    };

    setApplications((prev) => [newApp, ...prev]);
    addNotification(`Successfully submitted application for "${internship.role}" at ${internship.companyName}!`, 'success');
    return true;
  };

  const postNewInternship = (newInternshipData: Omit<Internship, 'id' | 'postedDate' | 'sourceType' | 'sourceName' | 'sourceVerificationStatus' | 'isVerified' | 'dataType' | 'source'> & Partial<Internship>) => {
    const newInt: Internship = {
      ...newInternshipData,
      id: getUniqueId('job-rec'),
      postedDate: 'Today',
      source: 'SkillBridge Employer Portal',
      sourceType: 'COMPANY_POSTED',
      sourceName: newInternshipData.sourceName || newInternshipData.companyName || 'Company Portal',
      sourceVerificationStatus: 'PORTAL_HOSTED',
      isVerified: true,
      verified: true,
      dataType: 'DEMO',
      lastUpdated: 'Live Portal Feed'
    };
    setInternships((prev) => [newInt, ...prev]);
    addNotification(`Published new opening: "${newInt.role}" (${newInt.openings || 1} openings)!`, 'success');
  };

  const updateApplicationStatus = (appId: string, status: Application['status']) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status } : app))
    );
    addNotification(`Candidate application status updated to "${status}".`, 'info');
  };

  const toggleRoadmapMilestone = (milestoneId: string) => {
    setRoadmap((prev) =>
      prev.map((m) => {
        if (m.id === milestoneId) {
          const nextVal = !m.completed;
          addNotification(
            nextVal
              ? `Milestone "${m.title}" marked completed! 🎉`
              : `Milestone "${m.title}" marked incomplete.`,
            nextVal ? 'success' : 'info'
          );
          return { ...m, completed: nextVal };
        }
        return m;
      })
    );
  };

  const registerUploadedResume = (fileName: string, rawText: string, fileType?: string): UploadedResumeData => {
    const parsedData = parseUploadedResume(fileName, rawText);
    setStudent((prev) => {
      const existingHistory = prev.resumeHistory || [];
      const resId = parsedData.id || parsedData.resumeId;
      const updatedHistory = [parsedData, ...existingHistory.filter((r) => (r.id || r.resumeId) !== resId)];
      return {
        ...prev,
        activeResume: parsedData,
        resumeHistory: updatedHistory,
        resumeFileName: fileName,
        resumeText: rawText,
        extractedSkills: parsedData.skills,
        extractedExperience: parsedData.experience,
        extractedEducation: parsedData.education || prev.extractedEducation
      };
    });
    return parsedData;
  };

  const setActiveResume = (resume: UploadedResumeData | null) => {
    setStudent((prev) => ({
      ...prev,
      activeResume: resume,
      resumeFileName: resume?.fileName || prev.resumeFileName,
      resumeText: resume?.rawText || prev.resumeText,
      extractedSkills: resume?.skills || prev.extractedSkills,
      extractedExperience: resume?.experience || prev.extractedExperience,
      extractedEducation: resume?.education || prev.extractedEducation
    }));
    if (resume) {
      addNotification(`Switched active resume to "${resume.fileName}".`, 'info');
    } else {
      addNotification('Cleared active resume from context.', 'info');
    }
  };

  const deleteResumeFromHistory = (resumeId: string) => {
    setStudent((prev) => {
      const remainingHistory = (prev.resumeHistory || []).filter(
        (r) => (r.id || r.resumeId) !== resumeId
      );
      const wasActive = (prev.activeResume?.id || prev.activeResume?.resumeId) === resumeId;
      if (wasActive) {
        if (remainingHistory.length > 0) {
          const nextActive = remainingHistory[0];
          return {
            ...prev,
            resumeHistory: remainingHistory,
            activeResume: nextActive,
            resumeFileName: nextActive.fileName,
            resumeText: nextActive.rawText,
            extractedSkills: [...nextActive.skills],
            extractedExperience: [...nextActive.experience],
            extractedEducation: nextActive.education
          };
        } else {
          return {
            ...prev,
            resumeHistory: [],
            activeResume: null,
            resumeFileName: '',
            resumeText: '',
            extractedSkills: [],
            extractedExperience: [],
            extractedEducation: undefined
          };
        }
      }
      return {
        ...prev,
        resumeHistory: remainingHistory
      };
    });
    addNotification('Resume removed from history.', 'info');
  };

  const deleteMultipleResumesFromHistory = (resumeIds: string[]) => {
    const idSet = new Set(resumeIds);
    setStudent((prev) => {
      const remainingHistory = (prev.resumeHistory || []).filter(
        (r) => !idSet.has(r.id || r.resumeId)
      );
      const wasActiveInDeleted = prev.activeResume && idSet.has(prev.activeResume.id || prev.activeResume.resumeId);
      if (wasActiveInDeleted) {
        if (remainingHistory.length > 0) {
          const nextActive = remainingHistory[0];
          return {
            ...prev,
            resumeHistory: remainingHistory,
            activeResume: nextActive,
            resumeFileName: nextActive.fileName,
            resumeText: nextActive.rawText,
            extractedSkills: [...nextActive.skills],
            extractedExperience: [...nextActive.experience],
            extractedEducation: nextActive.education
          };
        } else {
          return {
            ...prev,
            resumeHistory: [],
            activeResume: null,
            resumeFileName: '',
            resumeText: '',
            extractedSkills: [],
            extractedExperience: [],
            extractedEducation: undefined
          };
        }
      }
      return {
        ...prev,
        resumeHistory: remainingHistory
      };
    });
    addNotification(`Deleted ${resumeIds.length} resumes from history.`, 'info');
  };

  const renameResumeInHistory = (resumeId: string, newFileName: string) => {
    const trimmed = newFileName.trim();
    if (!trimmed) return;
    setStudent((prev) => {
      const updatedHistory = (prev.resumeHistory || []).map((r) => {
        if ((r.id || r.resumeId) === resumeId) {
          return { ...r, fileName: trimmed };
        }
        return r;
      });
      const isActive = (prev.activeResume?.id || prev.activeResume?.resumeId) === resumeId;
      return {
        ...prev,
        resumeHistory: updatedHistory,
        activeResume: isActive && prev.activeResume ? { ...prev.activeResume, fileName: trimmed } : prev.activeResume,
        resumeFileName: isActive ? trimmed : prev.resumeFileName
      };
    });
    addNotification(`Renamed resume to "${trimmed}".`, 'success');
  };

  const updateExtractedSkillsForActiveResume = (
    skills: {
      name: string;
      category: Skill['category'];
      confidence: number;
      evidence?: string | string[];
      sources?: string[];
      sourceSection?: string;
    }[]
  ) => {
    setStudent((prev) => {
      const updatedResume = prev.activeResume ? { ...prev.activeResume, skills } : null;
      const updatedHistory = (prev.resumeHistory || []).map((r) => {
        if (prev.activeResume && (r.id || r.resumeId) === (prev.activeResume.id || prev.activeResume.resumeId)) {
          return { ...r, skills };
        }
        return r;
      });
      return {
        ...prev,
        extractedSkills: skills,
        activeResume: updatedResume,
        resumeHistory: updatedHistory
      };
    });
  };

  const clearActiveResume = () => {
    setStudent((prev) => ({
      ...prev,
      activeResume: null
    }));
    addNotification('Active uploaded resume cleared. Now analyzing registered profile.', 'info');
  };

  const loadSampleResume = (sampleIndex: number) => {
    const sample = SAMPLE_RESUMES[sampleIndex % SAMPLE_RESUMES.length];
    const parsed = parseUploadedResume(sample.name, sample.text);

    setStudent((prev) => {
      const existingHistory = prev.resumeHistory || [];
      const resId = parsed.id || parsed.resumeId;
      const updatedHistory = [parsed, ...existingHistory.filter((r) => (r.id || r.resumeId) !== resId)];
      return {
        ...prev,
        activeResume: parsed,
        resumeHistory: updatedHistory,
        resumeFileName: sample.name,
        resumeText: sample.text,
        extractedSkills: parsed.skills,
        extractedExperience: parsed.experience.length > 0 ? parsed.experience : [`Projects matching ${sample.label}`],
        extractedEducation: parsed.education || 'B.Tech CSE - Active Student'
      };
    });

    addNotification(`Loaded sample resume: "${sample.name}" with ${parsed.skills.length} detected skills!`, 'info');
  };

  const applyExtractedSkillsToProfile = (extractedSkills: { name: string; category: any }[]) => {
    const existing = new Set(student.currentSkills.map((s) => s.name.toLowerCase()));
    const newSkillsToAdd: Skill[] = [];

    extractedSkills.forEach((ext) => {
      if (!existing.has(ext.name.toLowerCase())) {
        newSkillsToAdd.push({
          name: ext.name,
          category: ext.category || 'Frontend',
          proficiency: 'Intermediate',
          verified: true
        });
      }
    });

    if (newSkillsToAdd.length === 0) {
      addNotification('All selected skills are already present in your verified profile.', 'info');
      return;
    }

    setStudent((prev) => ({
      ...prev,
      currentSkills: [...prev.currentSkills, ...newSkillsToAdd]
    }));

    addNotification(`Added ${newSkillsToAdd.length} confirmed skills to your verified profile!`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        activeTab,
        setActiveTab,
        student,
        setStudent,
        careerGoals,
        currentCareerGoal,
        internships,
        applications,
        companies,
        collegeStats,
        collegeAdminConfig,
        updateCollegeAdminConfig,
        resetCollegeAdminConfig,
        roadmap,
        notifications,
        authModalOpen,
        setAuthModalOpen,
        addSkillToStudent,
        removeSkillFromStudent,
        updateStudentProfile,
        setStudentCareerGoal,
        applyForInternship,
        postNewInternship,
        updateApplicationStatus,
        toggleRoadmapMilestone,
        loadSampleResume,
        setActiveResume,
        clearActiveResume,
        registerUploadedResume,
        deleteResumeFromHistory,
        deleteMultipleResumesFromHistory,
        renameResumeInHistory,
        updateExtractedSkillsForActiveResume,
        applyExtractedSkillsToProfile,
        addNotification,
        dismissNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
