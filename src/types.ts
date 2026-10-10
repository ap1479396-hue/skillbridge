export type UserRole = 'student' | 'company' | 'college' | 'guest';

export type DataLabelType =
  | 'VERIFIED'
  | 'DEMO'
  | 'CALCULATED'
  | 'MARKET ESTIMATE'
  | 'SIMULATED'
  | 'AI RECOMMENDATION';

export interface Skill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'AI/ML' | 'Core CS' | 'Soft Skills' | 'Mobile' | 'Design' | 'Security' | 'Mechanical' | 'Manufacturing' | 'Automation';
  proficiency?: 'Beginner' | 'Intermediate' | 'Advanced';
  verified?: boolean;
}

export interface CareerGoal {
  id: string;
  title: string;
  category: string;
  description: string;
  averageSalary: string;
  demandLevel: 'High' | 'Very High' | 'Critical';
  requiredSkills: {
    name: string;
    priority: 'High' | 'Medium' | 'Low';
    category: Skill['category'];
    description: string;
  }[];
}

export interface StudentProject {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface StudentCertification {
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
}

export interface RegisteredProfileData {
  name: string;
  email: string;
  college: string;
  course: string;
  degree?: string;
  year: '1st Year (FY)' | '2nd Year (SY)' | '3rd Year (TY)' | '4th Year (Final)' | string;
  cgpa: number;
  targetRole: string;
  targetCareerGoalId: string;
  skills: Skill[];
  bio?: string;
}

export interface UploadedResumeData {
  resumeId: string;
  id?: string; // alias for resumeId
  fileName: string;
  uploadedAt: string;
  rawText: string;
  name?: string;
  candidateName?: string; // alias for name
  email?: string;
  phone?: string;
  location?: string;
  degree?: string;
  branch?: string; // Branch / Specialization
  course?: string;
  year?: string;
  academicYear?: string; // alias for year
  college?: string;
  collegeName?: string; // alias for college
  careerObjective?: string;
  cgpa?: number | string;
  skills: {
    name: string;
    category: Skill['category'];
    confidence: number;
    evidence?: string | string[];
    sources?: string[];
    sourceSection?: string;
  }[];
  softSkills?: string[];
  projects: string[];
  certifications: string[];
  experience: string[];
  internships?: string[];
  workExperienceCount?: number;
  internshipsCount?: number;
  areasOfInterest?: string[];
  languages?: string[];
  achievements?: string[];
  education?: string;
  socialLinks?: { github?: string; linkedin?: string; portfolio?: string };
  isPartial?: boolean;
  isUnreadable?: boolean;
  warning?: string;
}

export type ActiveAnalysisSource = 'registered_profile' | 'uploaded_resume' | 'combined';

export interface SourceConflict {
  field: 'name' | 'year' | 'college' | 'course' | 'degree' | 'branch' | 'cgpa' | 'skills';
  label: string;
  fieldName?: string; // alias for label
  profileValue: string;
  registeredValue?: string; // alias for profileValue
  resumeValue: string;
  conflict: boolean;
  explanation: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  college: string;
  course: string;
  degree?: string;
  year: '1st Year (FY)' | '2nd Year (SY)' | '3rd Year (TY)' | '4th Year (Final)';
  cgpa: number;
  careerGoalId: string;
  currentSkills: Skill[];
  projects?: StudentProject[];
  certifications?: StudentCertification[];
  activeResume?: UploadedResumeData | null;
  resumeHistory?: UploadedResumeData[];
  resumeText?: string;
  resumeFileName?: string;
  extractedSkills?: {
    name: string;
    confidence: number;
    category: Skill['category'];
    evidence?: string | string[];
    sources?: string[];
    sourceSection?: string;
  }[];
  extractedExperience?: string[];
  extractedEducation?: string;
  bio: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export type OpportunitySourceType = 'VERIFIED_EXTERNAL' | 'COMPANY_POSTED' | 'DEMO';
export type OpportunityVerificationStatus = 'VERIFIED' | 'PORTAL_HOSTED' | 'DEMO' | 'SAMPLE_DATA';

export interface Internship {
  id: string;
  companyId: string;
  companyName: string;
  companyType?: string;
  companyLogo: string;
  role: string;
  jobType?: 'Internship' | 'Full-time' | 'Apprenticeship';
  department: string;
  location: string;
  workMode?: 'Remote' | 'Hybrid' | 'On-site';
  type: 'Remote' | 'Hybrid' | 'On-site';
  duration?: string;
  stipend?: string;
  salary?: string;
  openings?: number;
  deadline?: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  niceToHaveSkills?: string[];
  eligibility?: {
    minimumDegree?: string;
    eligibleYears?: string[];
    minCgpa?: number;
  };
  description: string;
  responsibilities?: string[];
  perks?: string[];
  postedDate: string;
  source: string;
  sourceType: OpportunitySourceType;
  sourceName: string;
  sourceUrl?: string;
  applicationUrl?: string;
  sourceVerificationStatus: OpportunityVerificationStatus;
  isVerified: boolean;
  verified?: boolean;
  dataType: 'DEMO' | 'VERIFIED';
  isExpired?: boolean;
  lastUpdated?: string;
  externalReferenceId?: string;
}

export type Opportunity = Internship;

export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Offer Sent'
  | 'Accepted'
  | 'Declined'
  | 'Rejected'
  | 'Offered'; // for backward compatibility

export interface Application {
  id: string;
  internshipId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCollege: string;
  studentCourse: string;
  studentDegree?: string;
  studentYear: string;
  studentCgpa: number;
  studentSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  matchScore: number;
  matchExplanation?: string;
  status: ApplicationStatus;
  appliedDate: string;
  internshipRole: string;
  companyName: string;
  companyId?: string;
  resumeFileName?: string;
  resumeText?: string;
  resumeSkills?: string[];
  resumeProjects?: string[];
  resumeExperience?: string[];
  resumeEducation?: string;
  resumeAcademicYear?: string;
  resumeCandidateName?: string;
  projects?: { title: string; description: string; technologies: string[]; githubUrl?: string }[];
  experienceHighlights?: string[];
  certifications?: string[];
  interviewDate?: string;
  offerDetails?: { stipendOrSalary: string; joiningDate: string; duration: string };
  dataType?: 'DEMO' | 'REAL';
  candidateAvatar?: string;
}

export type InternshipApplication = Application;

export interface CompanyProfile {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  website: string;
  description: string;
  contactEmail: string;
  size: string;
  verified: boolean;
}

export interface SkillGapItem {
  name: string;
  status: 'possessed' | 'missing';
  priority: 'High' | 'Medium' | 'Low';
  category: Skill['category'];
  description: string;
  learningOrder: number;
  estimatedWeeks: number;
  recommendedResource: {
    title: string;
    type: 'Course' | 'Project' | 'Documentation' | 'Practice';
    link?: string;
    platform: string;
  };
}

export interface SkillGapAnalysisResult {
  careerGoal: string;
  readinessPercentage: number;
  totalRequired: number;
  matchedCount: number;
  missingCount: number;
  items: SkillGapItem[];
  summary: string;
  strengths: string[];
  criticalGaps: string[];
}

export interface RoadmapMilestone {
  id: string;
  weekRange: string;
  title: string;
  focus: string;
  skillsToAcquire: string[];
  actionItems: string[];
  projectToBuild: {
    title: string;
    description: string;
    technologies: string[];
  };
  resources: {
    title: string;
    platform: string;
    type: 'Free Course' | 'Interactive' | 'Docs' | 'Video' | 'Practice';
  }[];
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
  actionLinks?: {
    label: string;
    tab: string;
  }[];
}

export interface ConversationHistoryItem {
  role: 'user' | 'model';
  content: string;
}

export type ReadinessCategory = 'Placement Ready' | 'Almost Ready' | 'Needs Improvement' | 'At Risk';

export interface InstitutionalStudent {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  year: string;
  section: string;
  cgpa: number;
  careerTarget: string;
  readinessPercentage: number;
  readinessCategory: ReadinessCategory;
  verifiedSkills: string[];
  missingSkills: string[];
  primarySkillGap: string;
  projectsCount: number;
  resumeStatus: 'Verified & Active' | 'Draft' | 'Missing';
  internshipStatus: 'Currently Interning' | 'Offer Received' | 'Interviewing' | 'Applied' | 'Not Started';
  placementStatus: 'Placed' | 'Pre-Placement Offer (PPO)' | 'Interview Stage' | 'Seeking';
  placedCompany?: string;
  internshipCompany?: string;
  stipendOrPackage?: string;
  dataType: 'DEMO' | 'VERIFIED';
}

export interface DepartmentOverviewData {
  department: string;
  departmentName: string;
  totalStudents: number;
  readinessAverage: number;
  placementPercentage: number;
  internshipParticipationPercentage: number;
  majorSkillGap: string;
  placedCount: number;
  interningCount: number;
  activeOpportunitiesCount: number;
  dataType: 'DEMO' | 'VERIFIED';
}

export interface CurriculumVsIndustryGap {
  domain: string;
  academicSubject: string;
  academicSkills: string[];
  industryDemandedSkills: string[];
  gapSeverity: 'High' | 'Medium' | 'Low';
  gapPercentage: number;
  missingTech: string[];
  institutionalRecommendation: string;
  actionType: 'Workshop' | 'Curriculum Elective' | 'Lab Module' | 'Hackathon';
  dataType: 'DEMO' | 'VERIFIED';
}

export interface CollegeStats {
  totalStudents: number;
  skillReadinessAverage: number;
  totalInternshipsApplied: number;
  totalPlaced: number;
  partnerCompanies: number;
  studentsBySkill: { skill: string; count: number; category: string }[];
  mostCommonSkillGaps: {
    skill: string;
    missingPercent: number;
    category: string;
    industryDemand: 'High' | 'Medium' | 'Low';
    priority: 'High' | 'Medium' | 'Low';
    aiRecommendation?: string;
  }[];
  placementStatsByBranch: { branch: string; placed: number; total: number; avgStipend: string }[];
  industrySkillTrends: { skill: string; growth: string; demandLevel: 'High' | 'Very High' | 'Critical' }[];
}

export interface InstitutionInfo {
  name: string;
  shortCode: string;
  academicYear: string;
  placementCell: string;
  accreditation: string;
  dataType: 'Sample Data' | 'Custom';
  city?: string;
  state?: string;
  country?: string;
  institutionId?: string;
  institutionType?: string;
}

export interface DepartmentMetric {
  code: string;
  name: string;
  totalStudents: number;
  avgReadiness: number;
  placementRate: number;
  internshipRate: number;
  placedCount: number;
  interningCount: number;
  majorGap: string;
  skillGaps?: {
    skill: string;
    missingPercent: number;
    category: string;
    priority: string;
    industryDemand: string;
    recommendation: string;
  }[];
}

export interface CorporatePartnerInfo {
  totalPartners: number;
  activeHiringPartners: number;
  internshipPartners: number;
  newPartnersThisYear: number;
  topHiringRoles: string[];
  dataType: 'Sample Data' | 'Custom';
}

export interface PlacementPipelineConfig {
  internshipApplications: number;
  placementOffers: number;
  averagePackage: string;
  highestPackage: string;
  placementRateBenchmark: number;
  activePlacementDrives: number;
  dataType?: 'Sample Data' | 'Custom';
}

export interface CollegeAdminConfig {
  institution: InstitutionInfo;
  departments: Record<string, DepartmentMetric>;
  corporatePartners: CorporatePartnerInfo;
  placementPipeline?: PlacementPipelineConfig;
  internshipApplicationsOverride?: number;
  isCustomized?: boolean;
  lastUpdated?: string;
}

