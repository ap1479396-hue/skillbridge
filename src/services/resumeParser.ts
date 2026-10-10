import { Skill, StudentProfile, CareerGoal, RegisteredProfileData, UploadedResumeData, SourceConflict, ActiveAnalysisSource } from '../types';
import { extractSkillsAccurately, parseResumeSections, extractExperienceFromText } from './skillExtractor';

/**
 * Normalizes year strings to compare 1st Year / FY / 2nd Year / SY etc.
 */
export function normalizeYearString(yearStr?: string): string {
  if (!yearStr) return '';
  const lower = yearStr.toLowerCase().trim();
  if (lower.includes('1st') || lower.includes('first') || lower.includes('fy') || lower.includes('freshman')) return '1st Year';
  if (lower.includes('2nd') || lower.includes('second') || lower.includes('sy') || lower.includes('sophomore')) return '2nd Year';
  if (lower.includes('3rd') || lower.includes('third') || lower.includes('ty') || lower.includes('junior')) return '3rd Year';
  if (lower.includes('4th') || lower.includes('fourth') || lower.includes('final') || lower.includes('senior')) return '4th Year';
  return yearStr.trim();
}

const BANNED_NAME_WORDS_AND_PHRASES = [
  'professional summary',
  'technical skills',
  'education',
  'projects',
  'experience',
  'certifications',
  'summary',
  'objective',
  'career objective',
  'overview',
  'work experience',
  'academic background',
  'academic history',
  'achievements',
  'publications',
  'extracurricular',
  'extracurricular activities',
  'personal details',
  'profile',
  'personal profile',
  'curriculum vitae',
  'resume',
  'contact',
  'contact information',
  'references',
  'declaration',
  'skills',
  'key skills',
  'core competencies',
  'coursework',
  'highlights',
  'internship',
  'internships',
  'training',
  'details',
  'about me',
  'relevant coursework',
  'qualifications',
  'employment history',
  'interests',
  'hobbies'
];

function isBannedCandidateName(name: string): boolean {
  if (!name || name.trim().length < 2) return true;
  const lower = name.toLowerCase().trim().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ');
  
  // Exact or contains banned phrases
  for (const banned of BANNED_NAME_WORDS_AND_PHRASES) {
    if (lower === banned || lower.startsWith(banned + ' ') || lower.endsWith(' ' + banned) || lower.includes(' ' + banned + ' ')) {
      return true;
    }
  }

  // Single word checks for common section headers
  const words = lower.split(' ').filter(Boolean);
  const sectionKeywords = new Set([
    'summary', 'professional', 'technical', 'education', 'project', 'projects',
    'experience', 'certification', 'certifications', 'objective', 'overview',
    'curriculum', 'vitae', 'resume', 'skills', 'profile', 'contact', 'email',
    'phone', 'github', 'linkedin', 'portfolio', 'activities', 'coursework'
  ]);

  if (words.every((w) => sectionKeywords.has(w))) {
    return true;
  }

  return false;
}

/**
 * Extracts candidate name from resume text header lines.
 * Strictly ignores resume section headers like "PROFESSIONAL SUMMARY", "TECHNICAL SKILLS", etc.
 */
export function extractCandidateNameFromResume(text: string, fileName: string): string {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  
  // 1. Try finding explicit "Name: XYZ"
  for (const line of lines.slice(0, 8)) {
    const nameMatch = line.match(/^(?:name|candidate\s+name|student\s+name)\s*[:=-]\s*([A-Za-z\s.'-]{2,40})/i);
    if (nameMatch) {
      const candName = nameMatch[1].trim();
      if (!isBannedCandidateName(candName)) {
        return candName;
      }
    }
  }

  // 2. Look at the very first 1-4 lines for a clean person name
  for (const line of lines.slice(0, 4)) {
    // Skip email, URLs, phone numbers, addresses, headings with colons
    if (line.includes('@') || line.includes('http') || line.includes('+91') || line.includes('www.') || line.includes('://')) {
      continue;
    }

    const clean = line.replace(/[^A-Za-z\s.'-]/g, '').replace(/\s+/g, ' ').trim();
    const words = clean.split(/\s+/);

    if (words.length >= 1 && words.length <= 4 && clean.length >= 3 && clean.length <= 35) {
      if (!isBannedCandidateName(clean)) {
        return clean;
      }
    }
  }

  // 3. Fallback: Infer from filename if it has a clean person name (e.g. Priya_Mehta_Resume.pdf -> Priya Mehta)
  const cleanFileName = fileName
    .replace(/\.[a-zA-Z0-9]+$/, '')
    .replace(/[_-]/g, ' ')
    .replace(/\b(resume|cv|updated|new|fy|sy|ty|final|candidate|student|document|file|sample)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleanFileName.length >= 3 && cleanFileName.length <= 35 && !isBannedCandidateName(cleanFileName)) {
    return cleanFileName;
  }

  return 'Name unavailable';
}

/**
 * Extracts academic year from resume text.
 */
export function extractAcademicYearFromResume(text: string): string | undefined {
  // 1. Explicit Academic Year label
  const explicitMatch = text.match(/(?:academic\s+year|current\s+year|year\s+of\s+study|student\s+year)\s*[:=-]\s*([^\n|]+)/i);
  if (explicitMatch) {
    const raw = explicitMatch[1].trim();
    const normalized = normalizeYearString(raw);
    if (normalized) return normalized;
    return raw;
  }

  const yearPatterns = [
    /(?:1st|first)\s*year|(?:\bfy\b)|\b1st\s*yr\b/i,
    /(?:2nd|second)\s*year|(?:\bsy\b)|\b2nd\s*yr\b/i,
    /(?:3rd|third)\s*year|(?:\bty\b)|\b3rd\s*yr\b/i,
    /(?:4th|fourth|final)\s*year|\b4th\s*yr\b/i
  ];

  if (yearPatterns[0].test(text)) return '1st Year';
  if (yearPatterns[1].test(text)) return '2nd Year';
  if (yearPatterns[2].test(text)) return '3rd Year';
  if (yearPatterns[3].test(text)) return '4th Year';

  return undefined;
}

/**
 * Extracts email address from resume text.
 */
export function extractEmailFromResume(text: string): string | undefined {
  const explicitMatch = text.match(/(?:email|e-mail|mail)\s*[:=-]\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
  if (explicitMatch) return explicitMatch[1].trim();

  const match = text.match(/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/i);
  return match ? match[1].trim() : undefined;
}

/**
 * Extracts phone number from resume text.
 */
export function extractPhoneFromResume(text: string): string | undefined {
  const explicitMatch = text.match(/(?:phone|mobile|contact|tel|cell)\s*[:=-]\s*(\+?91[\s-]?[6-9]\d{9}|\b[6-9]\d{9}\b|\+?\d{1,3}[\s-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/i);
  if (explicitMatch) return explicitMatch[1].trim();

  const match = text.match(/(\+91[\s-]?[6-9]\d{9}|\b[6-9]\d{9}\b|\+?\d{1,3}[\s-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/i);
  return match ? match[1].trim() : undefined;
}

/**
 * Extracts location / city / state from resume text.
 */
export function extractLocationFromResume(text: string): string | undefined {
  const explicitMatch = text.match(/(?:location|address|city|state|residence)\s*[:=-]\s*([^\n|]+)/i);
  if (explicitMatch) {
    const clean = explicitMatch[1].trim();
    if (clean.length >= 2 && clean.length <= 60 && !clean.includes('@')) {
      return clean;
    }
  }

  const knownLocations = /(?:Maharashtra|Karnataka|Tamil\s*Nadu|Telangana|Delhi|NCR|Bangalore|Bengaluru|Pune|Mumbai|Hyderabad|Chennai|Noida|Gurugram|Kolkata|Ahmedabad|Gujarat|India)/i;
  const match = text.match(knownLocations);
  if (match) {
    // Check if there is a city + state or state + India pattern nearby
    const lineWithLoc = text.split('\n').find((l) => knownLocations.test(l) && !l.includes('http') && l.length < 80);
    if (lineWithLoc) {
      const sub = lineWithLoc.match(/(?:location\s*[:=-]\s*)?([A-Za-z\s,.-]+(?:Maharashtra|Karnataka|Tamil\s*Nadu|Telangana|Delhi|Bangalore|Bengaluru|Pune|Mumbai|Hyderabad|Chennai|India)[A-Za-z\s,.-]*)/i);
      if (sub && sub[1].trim().length < 50) return sub[1].trim();
    }
    return match[0];
  }
  return undefined;
}

/**
 * Extracts degree from resume text (e.g. B.Tech, B.E., Diploma, etc.).
 * Strictly isolates degree from branch/specialization.
 */
export function extractDegreeFromResume(text: string): string | undefined {
  const explicitMatch = text.match(/(?:degree|qualification)\s*[:=-]\s*([^\n|]+)/i);
  if (explicitMatch) {
    const raw = explicitMatch[1].trim();
    const degreeMatch = raw.match(/\b(B\.Tech|B\.E\.|M\.Tech|M\.E\.|BCA|MCA|B\.Sc|M\.Sc|Diploma|Bachelor\s+of\s+Technology|Bachelor\s+of\s+Engineering)\b/i);
    if (degreeMatch) return degreeMatch[1].replace(/Bachelor\s+of\s+Technology/i, 'B.Tech').replace(/Bachelor\s+of\s+Engineering/i, 'B.E.');
    return raw.split(/\s+in\s+|\s*-\s*|\s*,\s*/)[0].trim();
  }

  const match = text.match(/\b(B\.Tech|B\.E\.|M\.Tech|M\.E\.|BCA|MCA|B\.Sc|M\.Sc|Diploma)\b/i);
  return match ? match[1] : undefined;
}

/**
 * Extracts branch / specialization from resume text (e.g. Mechanical Engineering, Computer Science, etc.).
 */
export function extractBranchFromResume(text: string): string | undefined {
  const explicitMatch = text.match(/(?:branch|specialization|major|department|stream)\s*[:=-]\s*([^\n|]+)/i);
  if (explicitMatch) {
    return explicitMatch[1].trim();
  }

  const branches = [
    'Mechanical Engineering',
    'Computer Science and Engineering',
    'Computer Science & Engineering',
    'Computer Science',
    'Information Technology',
    'Electrical Engineering',
    'Electronics & Communication Engineering',
    'Electronics and Communication',
    'Electronics Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Automobile Engineering',
    'Mechatronics',
    'Robotics & Automation',
    'Data Science',
    'Artificial Intelligence'
  ];

  for (const b of branches) {
    const regex = new RegExp(`\\b${b.replace(/&/g, '(?:&|and)')}\\b`, 'i');
    if (regex.test(text)) {
      return b;
    }
  }

  return undefined;
}

/**
 * Extracts college/institution from resume text.
 * CRITICAL RULE: Strictly avoids picking lines that contain Degree or Branch definitions!
 */
export function extractCollegeFromResume(text: string): string | undefined {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  // 1. Explicit label (e.g. "College: XYZ Institute of Technology, Maharashtra" or "University: ...")
  for (const line of lines.slice(0, 15)) {
    const explicit = line.match(/^(?:college|university|institute|college\s*\/\s*university|institution)\s*[:=-]\s*([^\n|]+)/i);
    if (explicit) {
      const cand = explicit[1].trim();
      // Ensure candidate doesn't start with Degree or Branch
      if (!/^(degree|branch|b\.tech|b\.e\.|specialization)\b/i.test(cand) && cand.length >= 3) {
        return cand;
      }
    }
  }

  // 2. Keyword scan - strictly ignoring Degree/Branch/Coursework lines
  const collegeKeywords = /(college|university|institute|academy|gcet|iit|nit|iiit|bits)/i;
  const bannedKeywords = /^(?:degree|branch|specialization|department|course|academic\s+year|year|cgpa|projects?|skills?|certifications?)\b/i;

  for (const line of lines.slice(0, 15)) {
    if (collegeKeywords.test(line) && !bannedKeywords.test(line) && line.length < 100 && !line.includes('http') && !line.includes('@')) {
      // Must not just be "B.Tech in Mechanical Engineering"
      if (!/^\s*(?:b\.tech|b\.e\.|m\.tech|degree|branch)\b/i.test(line)) {
        return line.replace(/^[-*•\d.]+\s*/, '').replace(/^(?:college|university|institute|institution)\s*[:=-]\s*/i, '').trim();
      }
    }
  }
  return undefined;
}

/**
 * Extracts degree/course combined from resume text.
 */
export function extractCourseFromResume(text: string): string | undefined {
  const branch = extractBranchFromResume(text);
  const degree = extractDegreeFromResume(text);
  if (degree && branch) {
    return `${degree} ${branch}`;
  }
  if (branch) return branch;
  if (degree) return degree;

  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const courseKeywords = /(b\.tech|bachelor|b\.e\.|m\.tech|bca|mca|b\.sc|diploma|computer science|mechanical engineering|information technology|electronics|data science)/i;
  
  for (const line of lines.slice(0, 15)) {
    if (courseKeywords.test(line) && line.length < 90 && !line.includes('http') && !line.includes('@')) {
      return line.replace(/^[-*•\d.]+\s*/, '').replace(/^(?:course|degree|branch)\s*[:=-]\s*/i, '').trim();
    }
  }
  return undefined;
}

/**
 * Extracts Career Objective / Summary from resume text.
 */
export function extractCareerObjectiveFromResume(text: string): string | undefined {
  const match = text.match(/(?:career\s+objective|objective|professional\s+summary|summary)\s*[:=-]?\s*\n?([^\n]+(?:\n[^\n]+){0,2})/i);
  if (match) {
    const raw = match[1].trim();
    // Don't capture next section headers
    const cleaned = raw.split(/\n\s*(?:technical\s+skills|skills|projects|certifications|education|experience)/i)[0].trim();
    if (cleaned.length >= 15 && cleaned.length <= 350) {
      return cleaned.replace(/\s+/g, ' ');
    }
  }
  return undefined;
}

/**
 * Extracts CGPA / GPA from resume text.
 */
export function extractCgpaFromResume(text: string): string | undefined {
  const cgpaMatch = text.match(/(?:cgpa|gpa|marks)\s*[:=-]?\s*([0-9]+(?:\.[0-9]+)?(?:\s*\/\s*10)?)/i);
  if (cgpaMatch) {
    return cgpaMatch[1].trim();
  }
  const bareScoreMatch = text.match(/\b([789]\.[0-9]{1,2}(?:\s*\/\s*10)?)\b/);
  if (bareScoreMatch) {
    return bareScoreMatch[1].trim();
  }
  return undefined;
}

/**
 * Extracts soft skills list from resume text.
 */
export function extractSoftSkillsFromResume(text: string): string[] {
  const match = text.match(/(?:soft\s+skills|interpersonal\s+skills|key\s+strengths)\s*[:=-]?\s*\n?([^\n]+(?:\n[^\n]+){0,2})/i);
  if (match) {
    const raw = match[1].trim();
    const items = raw.split(/[\n,;•\-|]+/).map((s) => s.trim()).filter((s) => s.length >= 3 && s.length <= 40 && !/^(projects|certifications|work|experience)/i.test(s));
    if (items.length > 0) return items;
  }
  return [];
}

/**
 * Extracts project titles from resume text.
 */
export function extractProjectsFromResume(text: string): string[] {
  const sections = parseResumeSections(text);
  const targetText = sections.projectsText || text;
  const lines = targetText.split('\n').map((l) => l.trim()).filter(Boolean);
  const projects: string[] = [];

  // Check numbered or bulleted projects (e.g. "1. 3D Mechanical Component Design", "• CNC Machining Practice")
  for (const line of lines) {
    const projectHeaderMatch = line.match(/^(?:(?:\d+\.|\*|•|-)\s*)?([A-Za-z0-9\s()&/-]{5,70})(?:\s*[:=-]|\s*$)/);
    if (projectHeaderMatch) {
      const candidate = projectHeaderMatch[1].trim();
      if (/project|design|system|practice|application|model|portal|platform|simulation|clone|calculator|tool|dashboard/i.test(candidate) && candidate.length >= 6 && candidate.length <= 75) {
        if (!projects.includes(candidate)) {
          projects.push(candidate);
          if (projects.length >= 5) break;
        }
      }
    }
  }

  return projects;
}

/**
 * Extracts certification titles from resume text.
 */
export function extractCertificationsFromResume(text: string): string[] {
  const sections = parseResumeSections(text);
  const targetText = sections.certificationsText || text;
  const lines = targetText.split('\n').map((l) => l.trim()).filter(Boolean);
  const certs: string[] = [];

  for (const line of lines) {
    const certMatch = line.match(/^(?:(?:\d+\.|\*|•|-)\s*)?([A-Za-z0-9\s()&/:,-]{6,80})/);
    if (certMatch) {
      const candidate = certMatch[1].trim();
      if (
        /fundamentals|certification|certified|course|specialization|programming|applications|nanodegree|bootcamp|essentials/i.test(candidate) ||
        (sections.certificationsText && candidate.length >= 6 && candidate.length <= 75 && !candidate.toLowerCase().includes('certifications:'))
      ) {
        if (!certs.includes(candidate)) {
          certs.push(candidate);
          if (certs.length >= 5) break;
        }
      }
    }
  }

  return certs;
}

/**
 * Extracts work experience entries from resume text.
 * Strictly extracts only if actual work experience is described.
 * Does NOT invent dummy experience or placeholder text.
 */
export function extractWorkExperienceFromResume(text: string): { items: string[]; count: number } {
  const sections = parseResumeSections(text);
  const targetText = sections.experienceText;
  if (!targetText || targetText.trim().length < 15) {
    return { items: [], count: 0 };
  }

  const lines = targetText.split('\n').map((l) => l.trim()).filter(Boolean);
  const items: string[] = [];

  for (const line of lines) {
    // Look for role / employer / duration lines (e.g. "Software Engineer at ...", "Junior CAD Designer - 6 mos")
    if (
      /(?:engineer|developer|designer|analyst|associate|technician|consultant|manager|executive|lead|specialist|specialist|officer|supervisor)\b/i.test(line) ||
      /\b(?:ltd|pvt|inc|technologies|solutions|corp|corporation|industries|systems|studio|labs)\b/i.test(line)
    ) {
      const clean = line.replace(/^[-*•\d.]+\s*/, '').trim();
      if (clean.length >= 8 && clean.length <= 90 && !items.includes(clean)) {
        items.push(clean);
        if (items.length >= 4) break;
      }
    }
  }

  return { items, count: items.length };
}

/**
 * Extracts explicit internship entries from resume text.
 */
export function extractInternshipsFromResume(text: string): { items: string[]; count: number } {
  const sections = parseResumeSections(text);
  const searchCorpus = (sections.experienceText || '') + '\n' + (sections.projectsText || '') + '\n' + text;
  const lines = searchCorpus.split('\n').map((l) => l.trim()).filter(Boolean);
  const items: string[] = [];

  for (const line of lines) {
    if (/(?:intern|internship|trainee|apprentice|summer\s+trainee|vocational\s+trainee)\b/i.test(line)) {
      const clean = line.replace(/^[-*•\d.]+\s*/, '').trim();
      // Skip generic headings
      if (!/^(internships?|experience|work\s+experience|vocational\s+training):?$/i.test(clean) && clean.length >= 6 && clean.length <= 90) {
        if (!items.includes(clean)) {
          items.push(clean);
          if (items.length >= 4) break;
        }
      }
    }
  }

  return { items, count: items.length };
}

/**
 * Extracts areas of interest / domain interests from resume text.
 */
export function extractAreasOfInterestFromResume(text: string): string[] {
  const match = text.match(/(?:areas?\s+of\s+interest|technical\s+interests?|fields?\s+of\s+interest|interests?)\s*[:=-]?\s*\n?([^\n]+(?:\n[^\n]+){0,2})/i);
  if (match) {
    const raw = match[1].trim();
    const parts = raw.split(/[\n,;•|/]+/).map((s) => s.trim()).filter((s) => s.length >= 3 && s.length <= 40 && !/^(projects|education|experience|skills|hobbies)/i.test(s));
    if (parts.length > 0) return parts.slice(0, 8);
  }
  return [];
}

/**
 * Extracts spoken/written languages from resume text.
 */
export function extractLanguagesFromResume(text: string): string[] {
  const match = text.match(/(?:languages?\s+known|languages?|linguistic\s+proficiency)\s*[:=-]?\s*\n?([^\n]+)/i);
  if (match) {
    const raw = match[1].trim();
    const parts = raw.split(/[\n,;•|/]+/).map((s) => s.trim()).filter((s) => s.length >= 3 && s.length <= 25 && !/^(programming|technical|c\+\+|java|python|html)/i.test(s));
    if (parts.length > 0) return parts.slice(0, 6);
  }
  return [];
}

/**
 * Parses raw text into a fully structured UploadedResumeData record.
 */
export function parseUploadedResume(
  fileName: string,
  rawText: string,
  options?: { isPartial?: boolean; isUnreadable?: boolean; warning?: string }
): UploadedResumeData {
  const candidateName = extractCandidateNameFromResume(rawText, fileName);
  const year = extractAcademicYearFromResume(rawText);
  const degree = extractDegreeFromResume(rawText);
  const branch = extractBranchFromResume(rawText);
  const college = extractCollegeFromResume(rawText);
  const course = extractCourseFromResume(rawText);
  const email = extractEmailFromResume(rawText);
  const phone = extractPhoneFromResume(rawText);
  const location = extractLocationFromResume(rawText);
  const careerObjective = extractCareerObjectiveFromResume(rawText);
  const cgpa = extractCgpaFromResume(rawText);
  const rawSkills = extractSkillsAccurately(rawText);
  const skills = rawSkills.map((sk) => {
    let sourceSection = 'Technical Skills';
    if (sk.sources && sk.sources.length > 0) {
      const s = sk.sources[0];
      if (s === 'Skills Section') sourceSection = 'Technical Skills';
      else if (s === 'Projects') sourceSection = 'Projects';
      else if (s === 'Experience') sourceSection = 'Experience';
      else if (s === 'Certifications') sourceSection = 'Certifications';
      else if (s === 'Education') sourceSection = 'Education';
      else sourceSection = s;
    }
    return {
      ...sk,
      sourceSection
    };
  });
  const softSkills = extractSoftSkillsFromResume(rawText);
  const projects = extractProjectsFromResume(rawText);
  const certifications = extractCertificationsFromResume(rawText);
  const workExp = extractWorkExperienceFromResume(rawText);
  const internships = extractInternshipsFromResume(rawText);
  const areasOfInterest = extractAreasOfInterestFromResume(rawText);
  const languages = extractLanguagesFromResume(rawText);
  const sections = parseResumeSections(rawText);

  // Social links
  const socialLinks: { github?: string; linkedin?: string; portfolio?: string } = {};
  const githubMatch = rawText.match(/(https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_-]+|github\.com\/[a-zA-Z0-9_-]+)/i);
  if (githubMatch) socialLinks.github = githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`;

  const linkedinMatch = rawText.match(/(https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+|linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) socialLinks.linkedin = linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`;

  const portfolioMatch = rawText.match(/(https?:\/\/[a-zA-Z0-9.-]+\.(?:dev|me|io|in|app|com))/i);
  if (portfolioMatch && !portfolioMatch[0].includes('github') && !portfolioMatch[0].includes('linkedin')) {
    socialLinks.portfolio = portfolioMatch[0];
  }

  const resId = `res-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  return {
    resumeId: resId,
    id: resId,
    fileName,
    uploadedAt: new Date().toISOString(),
    rawText,
    name: candidateName,
    candidateName,
    email,
    phone,
    location,
    degree,
    branch,
    year,
    academicYear: year,
    college,
    collegeName: college,
    course,
    careerObjective,
    cgpa,
    skills,
    softSkills,
    projects,
    certifications,
    experience: workExp.items,
    internships: internships.items,
    workExperienceCount: workExp.count,
    internshipsCount: internships.count,
    areasOfInterest,
    languages,
    achievements: [],
    education: sections.educationText || (course ? `${course} ${year || ''}`.trim() : undefined),
    socialLinks,
    isPartial: options?.isPartial,
    isUnreadable: options?.isUnreadable,
    warning: options?.warning
  };
}

/**
 * Creates a RegisteredProfileData structure from StudentProfile and CareerGoal.
 */
export function getRegisteredProfileData(student: StudentProfile, careerGoal?: CareerGoal): RegisteredProfileData {
  return {
    name: student.name,
    email: student.email,
    college: student.college,
    course: student.course,
    degree: student.degree || 'B.Tech',
    year: student.year,
    cgpa: student.cgpa,
    targetRole: careerGoal?.title || 'Frontend Developer',
    targetCareerGoalId: student.careerGoalId,
    skills: student.currentSkills || [],
    bio: student.bio
  };
}

/**
 * Detects conflicts between Registered Profile and Uploaded Resume.
 * Returns an array of detected conflicts.
 */
export function detectSourceConflicts(
  profileOrStudent: RegisteredProfileData | StudentProfile,
  resume?: UploadedResumeData | null
): SourceConflict[] {
  if (!resume) return [];

  const profileName = profileOrStudent.name || '';
  const profileYear = profileOrStudent.year || '';
  const profileCollege = profileOrStudent.college || '';
  const profileCgpa = profileOrStudent.cgpa || 0;
  const profileSkills: Skill[] = (profileOrStudent as any).skills || (profileOrStudent as any).currentSkills || [];

  const conflicts: SourceConflict[] = [];

  // 1. Year Conflict (e.g. Profile = 1st Year vs Resume = 2nd Year)
  const resumeYear = resume.academicYear || resume.year;
  if (resumeYear) {
    const normProfileYear = normalizeYearString(profileYear);
    const normResumeYear = normalizeYearString(resumeYear);
    if (normProfileYear && normResumeYear && normProfileYear !== normResumeYear) {
      conflicts.push({
        field: 'year',
        label: 'Academic Year',
        fieldName: 'Academic Year',
        profileValue: profileYear,
        registeredValue: profileYear,
        resumeValue: resumeYear,
        conflict: true,
        explanation: `Registered profile indicates "${profileYear}", while uploaded resume indicates "${resumeYear}".`
      });
    }
  }

  // 2. Candidate Name Difference (e.g. Registered: Aditya vs Resume: Priya Mehta)
  const resumeCandidateName = resume.candidateName || resume.name;
  if (resumeCandidateName && resumeCandidateName !== 'Candidate') {
    const cleanProfileName = profileName.toLowerCase().trim();
    const cleanResumeName = resumeCandidateName.toLowerCase().trim();
    const profileFirst = cleanProfileName.split(/\s+/)[0];
    const resumeFirst = cleanResumeName.split(/\s+/)[0];

    if (profileFirst && resumeFirst && !cleanProfileName.includes(resumeFirst) && !cleanResumeName.includes(profileFirst)) {
      conflicts.push({
        field: 'name',
        label: 'Candidate Name',
        fieldName: 'Candidate Name',
        profileValue: profileName,
        registeredValue: profileName,
        resumeValue: resumeCandidateName,
        conflict: true,
        explanation: `Registered account belongs to "${profileName}", but the uploaded resume belongs to "${resumeCandidateName}".`
      });
    }
  }

  // 3. College Conflict (if both specified and distinct)
  const resumeColName = resume.collegeName || resume.college;
  if (resumeColName && profileCollege) {
    const pCol = profileCollege.toLowerCase().replace(/[^a-z0-9]/g, '');
    const rCol = resumeColName.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (pCol && rCol && !pCol.includes(rCol) && !rCol.includes(pCol) && rCol.length > 5) {
      conflicts.push({
        field: 'college',
        label: 'College / University',
        fieldName: 'College / University',
        profileValue: profileCollege,
        registeredValue: profileCollege,
        resumeValue: resumeColName,
        conflict: true,
        explanation: `Registered college is "${profileCollege}", while resume lists "${resumeColName}".`
      });
    }
  }

  // 3b. Branch / Specialization Conflict
  const profileCourseOrBranch = (profileOrStudent as any).branch || profileOrStudent.course || '';
  const resumeBranch = resume.branch;
  if (resumeBranch && profileCourseOrBranch) {
    const pBranchClean = profileCourseOrBranch.toLowerCase().replace(/[^a-z0-9]/g, '');
    const rBranchClean = resumeBranch.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (pBranchClean && rBranchClean && !pBranchClean.includes(rBranchClean) && !rBranchClean.includes(pBranchClean)) {
      conflicts.push({
        field: 'branch',
        label: 'Branch / Specialization',
        fieldName: 'Branch / Specialization',
        profileValue: profileCourseOrBranch,
        registeredValue: profileCourseOrBranch,
        resumeValue: resumeBranch,
        conflict: true,
        explanation: `Registered profile specialization is "${profileCourseOrBranch}", but resume specifies "${resumeBranch}".`
      });
    }
  }

  // 3c. Degree Conflict
  const profileDegree = (profileOrStudent as any).degree;
  const resumeDegree = resume.degree;
  if (resumeDegree && profileDegree) {
    const pDegClean = profileDegree.toLowerCase().replace(/[^a-z0-9]/g, '');
    const rDegClean = resumeDegree.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (pDegClean && rDegClean && pDegClean !== rDegClean) {
      conflicts.push({
        field: 'degree',
        label: 'Degree',
        fieldName: 'Degree',
        profileValue: profileDegree,
        registeredValue: profileDegree,
        resumeValue: resumeDegree,
        conflict: true,
        explanation: `Registered degree is "${profileDegree}", while resume specifies "${resumeDegree}".`
      });
    }
  }

  // 4. CGPA Conflict
  if (resume.cgpa && profileCgpa) {
    const resumeCgpaNum = parseFloat(String(resume.cgpa).split('/')[0]);
    if (!isNaN(resumeCgpaNum) && Math.abs(resumeCgpaNum - profileCgpa) > 0.3) {
      conflicts.push({
        field: 'cgpa',
        label: 'CGPA',
        fieldName: 'CGPA',
        profileValue: String(profileCgpa),
        registeredValue: String(profileCgpa),
        resumeValue: String(resume.cgpa),
        conflict: true,
        explanation: `Registered profile has CGPA ${profileCgpa}, while resume lists ${resume.cgpa}.`
      });
    }
  }

  // 5. Skills Difference Analysis
  const profileSkillNames = new Set(profileSkills.map((s) => s.name.toLowerCase()));
  const resumeAddedSkills = (resume.skills || []).filter((s) => !profileSkillNames.has(s.name.toLowerCase()));

  if (resumeAddedSkills.length >= 3 && profileSkills.length > 0) {
    conflicts.push({
      field: 'skills',
      label: 'Skills Inventory',
      fieldName: 'Skills Inventory',
      profileValue: `${profileSkills.length} registered skills`,
      registeredValue: `${profileSkills.length} registered skills`,
      resumeValue: `${resume.skills.length} extracted skills (${resumeAddedSkills.length} new in resume)`,
      conflict: true,
      explanation: `Resume contains ${resumeAddedSkills.length} additional skills not registered in your main profile.`
    });
  }

  return conflicts;
}

/**
 * Determines the Active Analysis Source based on user prompt and presence of uploaded resume.
 * Adheres strictly to the source priority rules:
 * - Specific resume questions -> 'uploaded_resume'
 * - Specific profile/account questions -> 'registered_profile'
 * - Combined / comparison / "analyze my profile" with conflict -> 'combined'
 * - General questions with active resume -> 'uploaded_resume'
 * - General questions without resume -> 'registered_profile'
 */
export function determineQuerySource(
  message: string,
  hasActiveResume: boolean
): { source: ActiveAnalysisSource; reason: string; isExplicitResumeRequest: boolean; isExplicitProfileRequest: boolean } {
  const lower = message.toLowerCase().trim();

  // 1. Explicit resume-targeted questions
  const resumeKeywords = [
    'in my resume',
    'in my uploaded resume',
    'uploaded resume',
    'my uploaded resume',
    'based on my resume',
    'from my resume',
    'analyze my resume',
    'how good is my resume',
    'skills in my resume',
    'skills in my uploaded resume',
    'skills are in my resume',
    'skills are in my uploaded resume',
    'what skills do i have in my resume',
    'package based on my resume',
    'internships match my resume',
    'internships matching my resume',
    'in my cv',
    'parse resume',
    'resume skills'
  ];

  const isExplicitResumeRequest = resumeKeywords.some((k) => lower.includes(k)) ||
    (lower.includes('resume') && (lower.includes('skill') || lower.includes('package') || lower.includes('analyze') || lower.includes('internship') || lower.includes('match') || lower.includes('expect')));

  if (isExplicitResumeRequest) {
    return {
      source: 'uploaded_resume',
      reason: 'User explicitly requested analysis of the uploaded resume.',
      isExplicitResumeRequest: true,
      isExplicitProfileRequest: false
    };
  }

  // 2. Explicit registered profile questions
  const profileKeywords = [
    'registered target role',
    'registered role',
    'registered college',
    'registered profile',
    'in my profile',
    'in my registered profile',
    'from my profile',
    'update my profile',
    'what is my registered',
    'what college did i register',
    'what skills are in my profile',
    'skills in my profile',
    'registered skills',
    'account details'
  ];

  const isExplicitProfileRequest = profileKeywords.some((k) => lower.includes(k));
  if (isExplicitProfileRequest) {
    return {
      source: 'registered_profile',
      reason: 'User explicitly requested registered profile information.',
      isExplicitResumeRequest: false,
      isExplicitProfileRequest: true
    };
  }

  // 3. Combined / Profile analysis / Conflict analysis questions
  const combinedKeywords = [
    'analyze my profile',
    'compare profile and resume',
    'compare resume and profile',
    'profile vs resume',
    'combined analysis',
    'all my skills',
    'what skills do i have'
  ];

  const isCombinedRequest = combinedKeywords.some((k) => lower.includes(k));
  if (isCombinedRequest) {
    return {
      source: hasActiveResume ? 'combined' : 'registered_profile',
      reason: 'User requested comprehensive profile analysis / skill inventory.',
      isExplicitResumeRequest: false,
      isExplicitProfileRequest: false
    };
  }

  // 4. General career questions (package, career options, internships, companies, roadmap):
  // If an active resume is uploaded, prioritize the active resume.
  if (hasActiveResume) {
    return {
      source: 'uploaded_resume',
      reason: 'Using current active uploaded resume as primary source for candidate analysis.',
      isExplicitResumeRequest: false,
      isExplicitProfileRequest: false
    };
  }

  // 5. Default fallback: Registered Profile
  return {
    source: 'registered_profile',
    reason: 'Using registered profile (no active resume uploaded).',
    isExplicitResumeRequest: false,
    isExplicitProfileRequest: false
  };
}
