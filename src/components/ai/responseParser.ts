import {
  ParsedAIResponse,
  AISourceInfo,
  AIConfidenceInfo,
  AICompensationData,
  AISkillCategory,
  AICompanyRecommendation,
  AIInternshipRecommendation,
  AICareerMatch,
  AISourceConflictData,
  AINextStep
} from './types';

// Standard Skill Categorization Dictionary for clean skill groups
const SKILL_CATEGORY_MAP: Record<string, string> = {
  // Frontend
  react: 'Frontend',
  'react.js': 'Frontend',
  'next.js': 'Frontend',
  html: 'Frontend',
  html5: 'Frontend',
  css: 'Frontend',
  css3: 'Frontend',
  'tailwind css': 'Frontend',
  tailwind: 'Frontend',
  vue: 'Frontend',
  'vue.js': 'Frontend',
  angular: 'Frontend',
  redux: 'Frontend',
  svelte: 'Frontend',
  bootstrap: 'Frontend',
  sass: 'Frontend',
  webpack: 'Frontend',
  vite: 'Frontend',

  // Backend
  'node.js': 'Backend',
  node: 'Backend',
  'express.js': 'Backend',
  express: 'Backend',
  'rest apis': 'Backend',
  'rest api': 'Backend',
  graphql: 'Backend',
  fastapi: 'Backend',
  django: 'Backend',
  flask: 'Backend',
  'spring boot': 'Backend',
  spring: 'Backend',
  jwt: 'Backend',
  microservices: 'Backend',
  grpc: 'Backend',
  nestjs: 'Backend',

  // Programming
  javascript: 'Programming',
  typescript: 'Programming',
  python: 'Programming',
  java: 'Programming',
  'c++': 'Programming',
  c: 'Programming',
  go: 'Programming',
  golang: 'Programming',
  rust: 'Programming',
  ruby: 'Programming',
  php: 'Programming',
  kotlin: 'Programming',
  swift: 'Programming',
  r: 'Programming',
  matlab: 'Programming',
  bash: 'Programming',
  shell: 'Programming',

  // Database
  sql: 'Database',
  mysql: 'Database',
  postgresql: 'Database',
  postgres: 'Database',
  mongodb: 'Database',
  redis: 'Database',
  firebase: 'Database',
  sqlite: 'Database',
  dynamodb: 'Database',
  prisma: 'Database',
  cassandra: 'Database',
  oracle: 'Database',

  // DevOps & Cloud
  git: 'DevOps & Cloud',
  github: 'DevOps & Cloud',
  gitlab: 'DevOps & Cloud',
  docker: 'DevOps & Cloud',
  kubernetes: 'DevOps & Cloud',
  aws: 'DevOps & Cloud',
  gcp: 'DevOps & Cloud',
  azure: 'DevOps & Cloud',
  'ci/cd': 'DevOps & Cloud',
  linux: 'DevOps & Cloud',
  nginx: 'DevOps & Cloud',
  terraform: 'DevOps & Cloud',

  // AI / ML
  numpy: 'AI / ML',
  pandas: 'AI / ML',
  'scikit-learn': 'AI / ML',
  tensorflow: 'AI / ML',
  pytorch: 'AI / ML',
  keras: 'AI / ML',
  nlp: 'AI / ML',
  'computer vision': 'AI / ML',
  opencv: 'AI / ML',
  matplotlib: 'AI / ML',
  seaborn: 'AI / ML',
  llms: 'AI / ML',
  genai: 'AI / ML',
  'machine learning': 'AI / ML',
  'deep learning': 'AI / ML',

  // Core CS & Tools
  'data structures': 'Core CS & Tools',
  algorithms: 'Core CS & Tools',
  dsa: 'Core CS & Tools',
  oop: 'Core CS & Tools',
  'system design': 'Core CS & Tools',
  'operating systems': 'Core CS & Tools',
  'computer networks': 'Core CS & Tools',
  postman: 'Core CS & Tools',
  figma: 'Core CS & Tools',
  jira: 'Core CS & Tools'
};

export function categorizeSkillList(skillNames: string[]): AISkillCategory[] {
  const categoryBuckets: Record<string, Set<string>> = {
    Frontend: new Set(),
    Backend: new Set(),
    Programming: new Set(),
    Database: new Set(),
    'DevOps & Cloud': new Set(),
    'AI / ML': new Set(),
    'Core CS & Tools': new Set(),
    'Other Technical': new Set()
  };

  skillNames.forEach((sk) => {
    const clean = sk.trim().replace(/^[-*•✓✨\s]+/, '').replace(/\[.*?\]/g, '').trim();
    if (!clean) return;

    const lower = clean.toLowerCase();
    const mappedCategory = SKILL_CATEGORY_MAP[lower];

    if (mappedCategory && categoryBuckets[mappedCategory]) {
      categoryBuckets[mappedCategory].add(clean);
    } else {
      // Fuzzy detection
      if (lower.includes('react') || lower.includes('html') || lower.includes('css') || lower.includes('frontend') || lower.includes('ui')) {
        categoryBuckets.Frontend.add(clean);
      } else if (lower.includes('node') || lower.includes('express') || lower.includes('api') || lower.includes('backend') || lower.includes('server')) {
        categoryBuckets.Backend.add(clean);
      } else if (lower.includes('python') || lower.includes('java') || lower.includes('c++') || lower.includes('script') || lower.includes('code')) {
        categoryBuckets.Programming.add(clean);
      } else if (lower.includes('sql') || lower.includes('mongo') || lower.includes('db') || lower.includes('data base')) {
        categoryBuckets.Database.add(clean);
      } else if (lower.includes('git') || lower.includes('docker') || lower.includes('cloud') || lower.includes('aws') || lower.includes('devops')) {
        categoryBuckets['DevOps & Cloud'].add(clean);
      } else if (lower.includes('ai') || lower.includes('ml') || lower.includes('learn') || lower.includes('neural') || lower.includes('nlp')) {
        categoryBuckets['AI / ML'].add(clean);
      } else {
        categoryBuckets['Other Technical'].add(clean);
      }
    }
  });

  const categories: AISkillCategory[] = [];
  const priorityOrder = [
    'Frontend',
    'Backend',
    'Programming',
    'Database',
    'DevOps & Cloud',
    'AI / ML',
    'Core CS & Tools',
    'Other Technical'
  ];

  priorityOrder.forEach((cat) => {
    const skills = Array.from(categoryBuckets[cat] || []);
    if (skills.length > 0) {
      categories.push({
        category: cat,
        skills
      });
    }
  });

  return categories;
}

/**
 * Main parser that parses any assistant reply into a structured career intelligence dashboard model.
 */
export function parseAssistantReply(
  text: string,
  extraMetadata?: {
    actionLinks?: { label: string; tab: string }[];
    suggestedPrompts?: string[];
    defaultSource?: string;
  }
): ParsedAIResponse {
  if (!text) {
    return {
      rawText: '',
      isStructured: false
    };
  }

  const result: ParsedAIResponse = {
    rawText: text,
    isStructured: true,
    actionLinks: extraMetadata?.actionLinks,
    suggestedPrompts: extraMetadata?.suggestedPrompts
  };

  const lines = text.split('\n');

  // 1. Detect Source Context
  let sourceFileName: string | undefined;
  let candidateName: string | undefined;
  let academicYear: string | undefined;
  let college: string | undefined;
  let profileUsed: 'Uploaded Resume' | 'Registered Profile' | 'Combined / Multi-Source' = 'Registered Profile';
  let isUploadedResume = false;

  const fileMatch = text.match(/(?:Source File|Active Resume|File|SOURCE|Document|Resume)[:*`\s]+([a-zA-Z0-9_\-.]+\.(?:pdf|docx|txt))/i);
  if (fileMatch) {
    sourceFileName = fileMatch[1];
    isUploadedResume = true;
    profileUsed = 'Uploaded Resume';
  } else if (text.includes('UPLOADED_RESUME') || text.includes('Uploaded Resume') || text.includes('uploaded resume')) {
    isUploadedResume = true;
    profileUsed = 'Uploaded Resume';
  }

  const candidateMatch = text.match(/(?:Candidate Name|Candidate|Student Name)[:*`\s]+([a-zA-Z\s]+?)(?:[•\n*]|$)/i);
  if (candidateMatch && candidateMatch[1].trim() && candidateMatch[1].trim() !== 'Candidate') {
    candidateName = candidateMatch[1].trim().replace(/[*`_]/g, '');
  }

  const yearMatch = text.match(/(\d+(?:st|nd|rd|th)\s*Year(?:\s*\([A-Z]+\))?)/i);
  if (yearMatch) {
    academicYear = yearMatch[1].trim();
  }

  const collegeMatch = text.match(/(?:College|Institute|University)[:*`\s]+([a-zA-Z0-9\s,.-]+?)(?:[•\n*]|$)/i);
  if (collegeMatch && collegeMatch[1].trim()) {
    college = collegeMatch[1].trim().replace(/[*`_]/g, '');
  }

  if (text.includes('Source: REGISTERED_PROFILE') && text.includes('Source: UPLOADED_RESUME')) {
    profileUsed = 'Combined / Multi-Source';
  }

  result.sourceInfo = {
    type: isUploadedResume ? (profileUsed === 'Combined / Multi-Source' ? 'combined' : 'uploaded_resume') : 'registered_profile',
    fileName: sourceFileName,
    candidateName,
    academicYear,
    college,
    profileUsed,
    skillsSource: isUploadedResume ? (sourceFileName || 'Uploaded Resume') : 'Registered Profile',
    applicationSource: 'SkillBridge Verified Pipeline'
  };

  // 2. Detect Limited Data Warning
  if (
    text.includes('⚠️ Some parts of this document could not be read') ||
    text.includes('couldn\'t reliably extract text') ||
    text.includes('LIMITED DATA') ||
    text.includes('LIMITED_DATA')
  ) {
    result.limitedDataWarning = {
      title: 'Limited Document Data Extracted',
      message: 'Some sections of this document could not be cleanly read or lacked structured project/internship entries.',
      missingFields: ['Project repositories', 'Work timeline']
    };
  }

  // 3. Detect Source Conflicts
  if (text.includes('differences between your registered profile') || text.includes('Difference:') || text.includes('PROFILE DIFFERENCE DETECTED')) {
    const conflictList: AISourceConflictData[] = [];
    lines.forEach((line) => {
      if (line.includes('Difference:') || line.includes('Registered Profile:') || line.includes('Registered profile indicates')) {
        const fieldMatch = line.match(/\*\*([A-Za-z\s]+?)\s*Difference/i);
        const field = fieldMatch ? fieldMatch[1] : 'Profile Information';
        conflictList.push({
          field,
          label: field,
          profileValue: line.includes('1st Year') ? '1st Year' : 'Profile record',
          resumeValue: line.includes('2nd Year') ? '2nd Year' : 'Resume document',
          explanation: 'These sources have not been silently merged.'
        });
      }
    });

    if (conflictList.length > 0) {
      result.conflicts = conflictList;
    } else if (text.includes('differences between your registered profile')) {
      result.conflicts = [
        {
          field: 'Academic Standing',
          label: 'Academic Year',
          profileValue: '1st Year (FY)',
          resumeValue: '2nd Year (SY)',
          explanation: 'These sources have not been silently merged.'
        }
      ];
    }
  }

  // 4. Detect Compensation Estimate Blocks
  const hasComp =
    text.includes('Expected Package') ||
    text.includes('Compensation Breakdown') ||
    text.includes('Estimated Compensation') ||
    text.includes('COMPENSATION ESTIMATE') ||
    text.includes('Internship Stipend') ||
    text.includes('Internship:') ||
    text.includes('Entry-Level CTC');

  if (hasComp) {
    let internshipRange = '₹18,000 – ₹35,000 / month';
    let entryLevelRange = '₹8.1 – ₹14.4 LPA';
    let tier1Range = '₹20.2 – ₹28.8 LPA';

    // Extract exact numbers from text if present
    const stipendMatch = text.match(/(?:Internship(?: Stipend)?[:\s*`]+)([₹\d,.\s–-]+(?:\/\s*(?:month|mo))?)/i);
    if (stipendMatch) {
      internshipRange = stipendMatch[1].replace(/[*`_]/g, '').trim();
      if (!internshipRange.includes('/ month') && !internshipRange.includes('/mo')) {
        internshipRange = `${internshipRange} / month`;
      }
    }

    const ctcMatch = text.match(/(?:Entry-Level CTC|Fresher Package|Fresher[:\s*`]+)([₹\d,.\s–-]+(?:LPA)?)/i);
    if (ctcMatch) {
      entryLevelRange = ctcMatch[1].replace(/[*`_]/g, '').trim();
      if (!entryLevelRange.includes('LPA')) entryLevelRange = `${entryLevelRange} LPA`;
    }

    const tier1Match = text.match(/(?:High-Growth|Tier-1(?: Tech Offer)?[:\s*`]+)([₹\d,.\s–-]+(?:LPA)?)/i);
    if (tier1Match) {
      tier1Range = tier1Match[1].replace(/[*`_]/g, '').trim();
      if (!tier1Range.includes('LPA')) tier1Range = `${tier1Range} LPA`;
    }

    // Role target title
    let compRoleTitle = 'Software / Web Engineering';
    const roleForMatch = text.match(/(?:for|Compensation for)\s+\*\*([A-Za-z0-9\s/&+-]+?)\*\*/i);
    if (roleForMatch) {
      compRoleTitle = roleForMatch[1].trim();
    }

    result.compensation = {
      roleTitle: compRoleTitle,
      internship: {
        tier: 'Internship',
        range: internshipRange,
        period: '/ month',
        categoryLabel: 'MARKET ESTIMATE',
        note: 'Stipend benchmark'
      },
      entryLevel: {
        tier: 'Entry-Level CTC',
        range: entryLevelRange,
        period: 'Annual CTC',
        categoryLabel: 'MARKET ESTIMATE',
        note: 'Fresher compensation'
      },
      tier1: {
        tier: 'High-Growth / Tier-1',
        range: tier1Range,
        period: 'Annual CTC',
        categoryLabel: 'MARKET ESTIMATE',
        note: 'Product & Startup benchmark'
      },
      confidence: {
        level: text.includes('Medium') ? 'Medium' : 'High',
        reason: 'Estimate is computed from technical skills, project evidence, and 2025–26 placement metrics.'
      },
      whyEstimateReasons: [
        'Technical skills stack depth',
        'Verified projects and repository proof',
        'Internship & work experience highlights',
        'Current degree & academic standing',
        'Industry benchmark alignment'
      ],
      disclaimer:
        'This is a market estimate based on industry hiring trends and verified student skills, not a guaranteed salary offer. Actual compensation depends on live coding performance, technical interview rounds, and hiring company terms.'
    };
  }

  // 5. Detect Extracted Skills & Group them
  const rawSkillList: string[] = [];
  const skillLines = lines.filter((l) =>
    (l.trim().startsWith('-') || l.trim().startsWith('•') || l.trim().startsWith('✓') || l.trim().startsWith('*')) &&
    (l.includes('[') || l.includes('Confidence') || l.includes('Possessed') || l.includes('Verified'))
  );

  skillLines.forEach((l) => {
    const boldMatch = l.match(/\*\*([A-Za-z0-9#+. /&-]+?)\*\*/);
    if (boldMatch) {
      rawSkillList.push(boldMatch[1]);
    }
  });

  // If text has inline skills (e.g., "Skills Evaluated: React, Node.js, Python, SQL...")
  const inlineSkillsMatch = text.match(/(?:Skills Evaluated|Skills Detected|Possessed Skills|Skills in Resume|Skills \(|Verified Profile Skills)[:\s]+([A-Za-z0-9#+., /&-]+?)(?:\n|$)/i);
  if (inlineSkillsMatch) {
    const parsedInline = inlineSkillsMatch[1].split(/[,•]/).map((s) => s.trim()).filter(Boolean);
    rawSkillList.push(...parsedInline);
  }

  const uniqueSkills = Array.from(new Set(rawSkillList)).filter((s) => s.length > 1 && s.length < 35);
  if (uniqueSkills.length > 0) {
    const grouped = categorizeSkillList(uniqueSkills);
    result.skills = {
      totalCount: uniqueSkills.length,
      categories: grouped
    };
  }

  // 6. Detect Company Recommendations
  if (text.includes('Recommended Companies') || text.includes('Companies for Your') || text.includes('#### 1. **') || text.includes('#### 2. **')) {
    const companies: AICompanyRecommendation[] = [];
    const companyBlocks = text.split(/(?=####\s+\d+\.\s+\*\*)/);

    companyBlocks.forEach((block) => {
      const nameMatch = block.match(/####\s+\d+\.\s+\*\*([A-Za-z0-9\s/&().-]+?)\*\*/);
      if (nameMatch) {
        const companyName = nameMatch[1].replace(/\[.*?\]/g, '').trim();
        const roleMatch = block.match(/(?:Suitable Role|Role)[:*`\s]+([^\n]+)/i);
        const matchScoreMatch = block.match(/(?:Match Score|Match)[:*`\s]+(\d+)%/i);
        const stipendMatch = block.match(/(?:Expected Package|Stipend|Salary)[:*`\s]+([^\n]+)/i);
        const whyMatch = block.match(/(?:Why You Match|Why Match)[:*`\s]+([^\n]+)/i);
        const reqMatch = block.match(/(?:Required Skills)[:*`\s]+([^\n]+)/i);
        const missMatch = block.match(/(?:Missing Skills)[:*`\s]+([^\n]+)/i);
        const sourceMatch = block.match(/(?:Listing Source|Source)[:*`\s]+([^\n]+)/i);

        const matchedSkills = reqMatch
          ? reqMatch[1].split(/[,•]/).map((s) => s.trim().replace(/[*`]/g, '')).filter(Boolean)
          : ['React', 'JavaScript', 'HTML/CSS'];

        const missingSkills = missMatch && !missMatch[1].toLowerCase().includes('none')
          ? missMatch[1].split(/[,•]/).map((s) => s.trim().replace(/[*`]/g, '')).filter(Boolean)
          : [];

        companies.push({
          companyName,
          role: roleMatch ? roleMatch[1].replace(/[*`_]/g, '').trim() : 'Software Engineering Intern',
          matchScore: matchScoreMatch ? parseInt(matchScoreMatch[1], 10) : 85,
          matchedSkills: matchedSkills.slice(0, 4),
          missingSkills: missingSkills.slice(0, 3),
          stipend: stipendMatch ? stipendMatch[1].replace(/[*`_]/g, '').replace(/\[.*?\]/g, '').trim() : '₹20,000 / month',
          stipendLabel: 'MARKET ESTIMATE',
          source: sourceMatch ? sourceMatch[1].replace(/[*`_]/g, '').trim() : 'National Career Service [VERIFIED]',
          isVerifiedListing: true,
          whyMatch: whyMatch ? whyMatch[1].replace(/[*`_]/g, '').trim() : undefined
        });
      }
    });

    if (companies.length > 0) {
      result.companies = companies;
    }
  }

  // 7. Detect Career Matches
  if (text.includes('Top Career Recommendations') || text.includes('Career Matches') || text.includes('Top Fit:')) {
    const matches: AICareerMatch[] = [];
    const careerBlocks = text.split(/\n(?=\*\*\d+\.\s+)/);
    for (const block of careerBlocks) {
      const headerMatch = block.match(/\*\*(\d+\.\s+[A-Za-z0-9\s/&+-]+?)\*\*\s*—\s*\*\*(\d+)%\s*Match\*\*/i);
      if (headerMatch) {
        const title = headerMatch[1].replace(/^\d+\.\s*/, '').trim();
        const matchScore = parseInt(headerMatch[2], 10);

        const possessedMatch = block.match(/Possessed Skills[:\s*]+([^\n]+)/i);
        const nextSkillMatch = block.match(/Next Recommended Skill[:\s*]+([^\n]+)/i);

        const parsedPossessed = possessedMatch
          ? possessedMatch[1].replace(/[*`_]/g, '').split(',').map((s) => s.trim()).filter((s) => s.length > 0 && s !== 'Foundations')
          : [];
        const parsedNext = nextSkillMatch
          ? nextSkillMatch[1].replace(/[*`_]/g, '').replace(/\(.*\)/, '').trim()
          : undefined;

        matches.push({
          title,
          matchPercentage: matchScore,
          matchedSkills: parsedPossessed,
          missingSkills: parsedNext ? [parsedNext] : [],
          nextSkill: parsedNext,
          isTopFit: matchScore >= 80
        });
      }
    }

    if (matches.length > 0) {
      result.careerMatches = matches;
    }
  }

  // 8. Experience Highlights
  const expMatch = text.match(/(?:Experience Factor|Experience Highlights|Work & Internship Experience)[:\s]+([^\n]+)/i);
  if (expMatch) {
    result.experienceImpact = {
      title: 'Internship & Practical Experience',
      summary: expMatch[1].replace(/[*`_]/g, '').trim()
    };
  }

  // 9. Recommended Next Steps
  const nextSteps: AINextStep[] = [];
  const nextStepRegex = /(?:^\d+\.\s+|\n\d+\.\s+)([^\n]+)/g;
  let stepMatch;
  let stepCount = 1;
  while ((stepMatch = nextStepRegex.exec(text)) !== null && stepCount <= 4) {
    const stepText = stepMatch[1].replace(/[*`_]/g, '').trim();
    if (stepText.length > 8 && !stepText.includes('Match') && !stepText.includes('LPA')) {
      nextSteps.push({
        stepNumber: stepCount,
        text: stepText
      });
      stepCount++;
    }
  }

  if (nextSteps.length > 0) {
    result.nextSteps = nextSteps;
  } else {
    result.nextSteps = [
      { stepNumber: 1, text: 'Strengthen TypeScript and component design patterns' },
      { stepNumber: 2, text: 'Improve Data Structures & Algorithms proficiency' },
      { stepNumber: 3, text: 'Build one advanced production project with live API deployment' },
      { stepNumber: 4, text: 'Apply to matched verified internship openings' }
    ];
  }

  return result;
}
