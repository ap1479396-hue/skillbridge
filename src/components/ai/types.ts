export interface AISourceInfo {
  type: 'uploaded_resume' | 'registered_profile' | 'combined' | 'limited_data';
  fileName?: string;
  candidateName?: string;
  academicYear?: string;
  college?: string;
  profileUsed: 'Uploaded Resume' | 'Registered Profile' | 'Combined / Multi-Source';
  skillsSource?: string;
  applicationSource?: string;
}

export interface AIConfidenceInfo {
  level: 'High' | 'Medium' | 'Low';
  reason?: string;
}

export interface AICompensationItem {
  tier: string;
  range: string;
  period?: string;
  categoryLabel?: 'MARKET ESTIMATE' | 'VERIFIED LISTING' | 'ESTIMATED';
  note?: string;
}

export interface AICompensationData {
  roleTitle?: string;
  internship?: AICompensationItem;
  entryLevel?: AICompensationItem;
  tier1?: AICompensationItem;
  confidence?: AIConfidenceInfo;
  whyEstimateReasons?: string[];
  disclaimer?: string;
}

export interface AISkillCategory {
  category: string;
  skills: string[];
}

export interface AICompanyRecommendation {
  companyName: string;
  role: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  stipend?: string;
  package?: string;
  stipendLabel?: 'MARKET ESTIMATE' | 'VERIFIED LISTING';
  source?: string;
  isVerifiedListing?: boolean;
  opportunityId?: string;
  targetTab?: string;
  whyMatch?: string;
}

export interface AIInternshipRecommendation {
  id?: string;
  role: string;
  companyName: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  stipend?: string;
  stipendLabel?: 'MARKET ESTIMATE' | 'VERIFIED LISTING';
  eligibility?: string;
  duration?: string;
  source?: string;
  isVerified?: boolean;
  targetTab?: string;
}

export interface AICareerMatch {
  title: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  nextSkill?: string;
  isTopFit?: boolean;
}

export interface AISourceConflictData {
  field: string;
  label: string;
  profileValue: string;
  resumeValue: string;
  explanation?: string;
}

export interface AINextStep {
  stepNumber: number;
  text: string;
  actionLabel?: string;
  actionTab?: string;
}

export interface ParsedAIResponse {
  rawText: string;
  isStructured: boolean;
  title?: string;
  subtitle?: string;
  sourceInfo?: AISourceInfo;
  confidence?: AIConfidenceInfo;
  compensation?: AICompensationData;
  targetRole?: {
    title: string;
    confidence?: AIConfidenceInfo;
    matchScore?: number;
    description?: string;
  };
  skills?: {
    totalCount: number;
    categories: AISkillCategory[];
    uncategorized?: string[];
  };
  experienceImpact?: {
    title: string;
    organization?: string;
    summary: string;
  };
  whyThisEstimate?: string[];
  disclaimer?: string;
  companies?: AICompanyRecommendation[];
  internships?: AIInternshipRecommendation[];
  careerMatches?: AICareerMatch[];
  conflicts?: AISourceConflictData[];
  limitedDataWarning?: {
    title: string;
    message: string;
    missingFields: string[];
  };
  nextSteps?: AINextStep[];
  actionLinks?: { label: string; tab: string }[];
  suggestedPrompts?: string[];
  generalMarkdown?: string;
}
