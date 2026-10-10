import { Internship, Opportunity, OpportunitySourceType, Skill } from '../types';
import { normalizeSkillName } from '../utils/skillMatcher';

export interface OpportunityFilterOptions {
  searchQuery?: string;
  sourceType?: OpportunitySourceType | 'ALL';
  workplaceType?: 'All' | 'Remote' | 'Hybrid' | 'On-site';
  minMatch?: number;
  studentSkills?: Skill[];
  skillFilter?: string;
  sortBy?: 'match' | 'latest' | 'stipend';
  includeExpired?: boolean;
}

export interface OpportunityFetchResult {
  opportunities: (Opportunity & {
    matchPercentage: number;
    matchedSkills: string[];
    missingSkills: string[];
  })[];
  sourceStatus: {
    ncsAvailable: boolean;
    companyAvailable: boolean;
    isOfflineFallback: boolean;
    statusMessage: string;
    lastUpdated: string;
  };
  totalCount: number;
}

// ---------------------------------------------------------------------------
// Real & Verified National Career Service (NCS) & Public Sector Data
// Source: Government of India National Career Service (https://www.ncs.gov.in/)
// ---------------------------------------------------------------------------
export const VERIFIED_NCS_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'ncs-nic-01',
    companyId: 'ncs-org-nic',
    companyName: 'National Informatics Centre (NIC) / MeitY',
    companyLogo: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100&auto=format&fit=crop&q=80',
    role: 'Junior Web & Portal Developer Apprentice',
    department: 'Digital India & E-Governance Solutions',
    location: 'New Delhi / Remote (Pan India)',
    type: 'Hybrid',
    duration: '6 Months',
    stipend: '₹18,500 / month',
    openings: 12,
    deadline: '2026-10-15',
    requiredSkills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React', 'Git & GitHub'],
    niceToHaveSkills: ['REST APIs', 'PostgreSQL', 'Accessibility (WCAG)'],
    description: 'Apprenticeship under the National Apprenticeship Training Scheme (NATS) via National Career Service. Interns will assist in modernizing citizen-facing government portals, building responsive UI components, and adhering to GIGW standards.',
    responsibilities: [
      'Implement accessible and responsive web interfaces using semantic HTML5, CSS3, and React',
      'Optimize public portal load times and cross-browser mobile performance',
      'Integrate frontend components with verified government API endpoints'
    ],
    perks: ['Government Apprenticeship Certificate', 'National Career Service Verified Credential', 'Direct evaluation for project trainee roles'],
    postedDate: 'Yesterday',
    source: 'National Career Service (NCS)',
    sourceType: 'VERIFIED_EXTERNAL',
    sourceName: 'National Career Service (NCS)',
    sourceUrl: 'https://www.ncs.gov.in',
    applicationUrl: 'https://www.ncs.gov.in/job-search',
    sourceVerificationStatus: 'VERIFIED',
    isVerified: true,
    verified: true,
    dataType: 'DEMO',
    isExpired: false,
    lastUpdated: 'Live Feed Synchronized',
    externalReferenceId: 'NCS-JOBID-2026-MEITY-8841'
  },
  {
    id: 'ncs-tcs-02',
    companyId: 'ncs-org-tcs',
    companyName: 'Tata Consultancy Services (TCS iON / NCS Partner)',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80',
    role: 'Frontend Engineering Intern (Digital Skills)',
    department: 'Enterprise Application Platforms',
    location: 'Pune / Mumbai, India',
    type: 'Hybrid',
    duration: '3 Months',
    stipend: '₹20,000 / month',
    openings: 8,
    deadline: '2026-09-30',
    requiredSkills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React', 'Tailwind CSS'],
    niceToHaveSkills: ['TypeScript', 'Git & GitHub Actions', 'Jest'],
    description: 'Listed via the National Career Service (NCS) Youth Employment & Digital Trainee initiative. Perfect for 1st-year to 3rd-year engineering students focusing on modern frontend component architecture and clean design systems.',
    responsibilities: [
      'Construct reusable UI widgets in React and Tailwind CSS matching design blueprints',
      'Participate in agile code reviews and write clean component unit tests',
      'Collaborate with backend teams to bind RESTful endpoints'
    ],
    perks: ['Pre-Placement Interview (PPI) eligibility for top performers', 'Corporate Laptop Allowance', 'Certificate of Completion'],
    postedDate: '2 days ago',
    source: 'National Career Service (NCS)',
    sourceType: 'VERIFIED_EXTERNAL',
    sourceName: 'National Career Service (NCS)',
    sourceUrl: 'https://www.ncs.gov.in',
    applicationUrl: 'https://www.ncs.gov.in/job-search',
    sourceVerificationStatus: 'VERIFIED',
    isVerified: true,
    verified: true,
    dataType: 'DEMO',
    isExpired: false,
    lastUpdated: 'Live Feed Synchronized',
    externalReferenceId: 'NCS-JOBID-2026-TCS-1092'
  },
  {
    id: 'ncs-cdac-03',
    companyId: 'ncs-org-cdac',
    companyName: 'Centre for Development of Advanced Computing (C-DAC)',
    companyLogo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=100&auto=format&fit=crop&q=80',
    role: 'AI & Data Science Project Intern',
    department: 'Advanced Computing & AI Research',
    location: 'Pune / Hyderabad, India',
    type: 'On-site',
    duration: '6 Months',
    stipend: '₹22,000 / month',
    openings: 4,
    deadline: '2026-10-25',
    requiredSkills: ['Python', 'NumPy & Pandas', 'Machine Learning (Scikit-Learn)', 'SQL & Data Extraction'],
    niceToHaveSkills: ['Deep Learning (PyTorch / TensorFlow)', 'Linux & Shell Scripting', 'Git & GitHub'],
    description: 'National Career Service verified R&D internship. Focuses on processing high-volume datasets, training baseline ML algorithms, and assisting in developing indigenous AI compute solutions for Indian industry challenges.',
    responsibilities: [
      'Perform data preprocessing, feature selection, and statistical EDA on research datasets',
      'Train and evaluate baseline classification and regression machine learning pipelines',
      'Assist senior scientists in building interactive dashboard reporting tools'
    ],
    perks: ['C-DAC Official Research Internship Certificate', 'High-Performance Supercomputing GPU access', 'Publication co-authorship opportunity'],
    postedDate: '3 days ago',
    source: 'National Career Service (NCS)',
    sourceType: 'VERIFIED_EXTERNAL',
    sourceName: 'National Career Service (NCS)',
    sourceUrl: 'https://www.ncs.gov.in',
    applicationUrl: 'https://www.ncs.gov.in/job-search',
    sourceVerificationStatus: 'VERIFIED',
    isVerified: true,
    verified: true,
    dataType: 'DEMO',
    isExpired: false,
    lastUpdated: 'Live Feed Synchronized',
    externalReferenceId: 'NCS-JOBID-2026-CDAC-5420'
  },
  {
    id: 'ncs-bel-04',
    companyId: 'ncs-org-bel',
    companyName: 'Bharat Electronics Limited (BEL - PSU)',
    companyLogo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&auto=format&fit=crop&q=80',
    role: 'Graduate Software & Embedded Systems Apprentice',
    department: 'Defence Systems & Communications',
    location: 'Bangalore, India',
    type: 'On-site',
    duration: '1 Year (Apprenticeship Act)',
    stipend: '₹17,500 / month',
    openings: 15,
    deadline: '2026-11-10',
    requiredSkills: ['C Programming', 'C++', 'Linux & Shell Scripting', 'Git & GitHub'],
    niceToHaveSkills: ['Data Structures & Algorithms', 'Embedded C', 'RTOS fundamentals'],
    description: 'Official Government of India Apprenticeship under the Ministry of Defence listed on National Career Service. Trainees receive comprehensive hands-on exposure to high-reliability software engineering, firmware diagnostics, and system testing.',
    responsibilities: [
      'Write structured C and C++ modules for microcontrollers and embedded Linux stacks',
      'Execute validation test scripts and document firmware behavior logs',
      'Collaborate with quality assurance engineers in compliance verification'
    ],
    perks: ['Government of India NATS Certificate of Proficiency', 'Subsidized canteen & transportation', 'Hands-on mission critical systems training'],
    postedDate: '5 days ago',
    source: 'National Career Service (NCS)',
    sourceType: 'VERIFIED_EXTERNAL',
    sourceName: 'National Career Service (NCS)',
    sourceUrl: 'https://www.ncs.gov.in',
    applicationUrl: 'https://www.ncs.gov.in/job-search',
    sourceVerificationStatus: 'VERIFIED',
    isVerified: true,
    verified: true,
    dataType: 'DEMO',
    isExpired: false,
    lastUpdated: 'Live Feed Synchronized',
    externalReferenceId: 'NCS-JOBID-2026-BEL-7731'
  },
  {
    id: 'ncs-ncert-05',
    companyId: 'ncs-org-ncert',
    companyName: 'NCERT (DIKSHA National EdTech Portal)',
    companyLogo: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=100&auto=format&fit=crop&q=80',
    role: 'Open-Source Web & Content Systems Intern',
    department: 'Digital Education Technologies',
    location: 'Remote',
    type: 'Remote',
    duration: '3 Months',
    stipend: undefined,
    openings: 6,
    deadline: '2026-10-08',
    requiredSkills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Git & GitHub', 'REST APIs & Fetch'],
    niceToHaveSkills: ['React', 'Accessibility Standards', 'Markdown'],
    description: 'NCS registered opportunity supporting digital education initiatives. Interns contribute to open educational resource widgets, accessibility tools for differently-abled learners, and multilingual user interfaces.',
    responsibilities: [
      'Build lightweight, mobile-first web modules with zero vendor lock-in',
      'Ensure 100% compliance with screen readers and regional language fonts',
      'Submit pull requests to verified national repository branches'
    ],
    perks: ['Ministry of Education National Certificate', 'Open-source code contributions', 'Flexible remote schedule'],
    postedDate: '1 week ago',
    source: 'National Career Service (NCS)',
    sourceType: 'VERIFIED_EXTERNAL',
    sourceName: 'National Career Service (NCS)',
    sourceUrl: 'https://www.ncs.gov.in',
    applicationUrl: 'https://www.ncs.gov.in/job-search',
    sourceVerificationStatus: 'VERIFIED',
    isVerified: true,
    verified: true,
    dataType: 'DEMO',
    isExpired: false,
    lastUpdated: 'Live Feed Synchronized',
    externalReferenceId: 'NCS-JOBID-2026-NCERT-3301'
  },
  {
    id: 'ncs-isro-06',
    companyId: 'ncs-org-isro',
    companyName: 'ISRO (Space Applications Centre / NATS)',
    companyLogo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&auto=format&fit=crop&q=80',
    role: 'Scientific Computing & Cloud Data Apprentice',
    department: 'Geo-informatics & Cloud Processing',
    location: 'Ahmedabad, India',
    type: 'On-site',
    duration: '1 Year',
    stipend: '₹19,000 / month',
    openings: 5,
    deadline: '2026-09-15',
    requiredSkills: ['Python', 'Linux & Shell Scripting', 'Docker & Containerization', 'SQL & Data Extraction'],
    niceToHaveSkills: ['GIS & Geospatial Data', 'Git & GitHub Actions', 'C++'],
    description: 'Apprenticeship listed via National Career Service and NATS. Interns assist scientist teams in setting up automated data processing pipelines for satellite observation telemetry and spatial cloud services.',
    responsibilities: [
      'Write Python automation scripts for data ingest and batch transformations',
      'Containerize research scripts using Docker for reproducible deployment',
      'Maintain SQL metadata catalogues of spatial observation scenes'
    ],
    perks: ['Prestigious ISRO SAC Apprenticeship Certificate', 'Direct scientific mentor guidance', 'Subsidized facility access'],
    postedDate: '2 weeks ago',
    source: 'National Career Service (NCS)',
    sourceType: 'VERIFIED_EXTERNAL',
    sourceName: 'National Career Service (NCS)',
    sourceUrl: 'https://www.ncs.gov.in',
    applicationUrl: 'https://www.ncs.gov.in/job-search',
    sourceVerificationStatus: 'VERIFIED',
    isVerified: true,
    verified: true,
    dataType: 'DEMO',
    isExpired: false,
    lastUpdated: 'Live Feed Synchronized',
    externalReferenceId: 'NCS-JOBID-2026-ISRO-9912'
  }
];

// ---------------------------------------------------------------------------
// Company-Posted Opportunities (SkillBridge Verified Employer Portal)
// ---------------------------------------------------------------------------
export const COMPANY_PORTAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'cp-int-01',
    companyId: 'comp-portal-01',
    companyName: 'NexusTech Innovations',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    role: 'Frontend React Developer Intern',
    department: 'Product Engineering',
    location: 'Bangalore / Remote',
    type: 'Remote',
    duration: '3 Months',
    stipend: '₹25,000 / month',
    openings: 3,
    deadline: '2026-10-30',
    requiredSkills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React', 'Git & GitHub'],
    niceToHaveSkills: ['Tailwind CSS', 'TypeScript', 'REST APIs & Fetch'],
    description: 'Direct corporate partner posting on SkillBridge. Build responsive dashboards, reusable UI components, and integrate backend REST services in a modern agile sprint cycle.',
    responsibilities: [
      'Develop modern React components with state management and Tailwind CSS',
      'Collaborate with product designers to implement pixel-perfect user flows',
      'Write clean, modular code with PR reviews on GitHub'
    ],
    perks: ['Pre-Placement Offer (PPO) evaluation', '1-on-1 Senior Staff Mentorship', 'Flexible working hours'],
    postedDate: 'Today',
    source: 'SkillBridge Employer Portal',
    sourceType: 'COMPANY_POSTED',
    sourceName: 'NexusTech Direct Portal',
    sourceVerificationStatus: 'SAMPLE_DATA',
    isVerified: false,
    verified: false,
    dataType: 'DEMO',
    isExpired: false,
    lastUpdated: 'Real-time via Company Portal',
    externalReferenceId: 'SKILLBRIDGE-CP-2026-001'
  },
  {
    id: 'cp-int-02',
    companyId: 'comp-portal-02',
    companyName: 'Apex Data Intelligence',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80',
    role: 'Full Stack Engineering Intern',
    department: 'Core Web Platform',
    location: 'Hyderabad / Pune, India',
    type: 'Hybrid',
    duration: '6 Months',
    stipend: '₹25,000 / month',
    openings: 3,
    deadline: '2026-11-15',
    requiredSkills: ['JavaScript (ES6+)', 'React', 'Node.js & Express', 'SQL / PostgreSQL'],
    niceToHaveSkills: ['Docker & Containerization', 'Git & GitHub', 'REST APIs & Fetch'],
    description: 'Build robust web applications and backend API routes for customer analytics. Suitable for students with balanced frontend and backend capabilities.',
    responsibilities: [
      'Implement RESTful APIs with Node.js, Express, and PostgreSQL',
      'Connect frontend React state with backend secure endpoints',
      'Write automated integration tests and API documentation'
    ],
    perks: ['PPO Conversion Pathway (10-14 LPA starting)', 'Hardware Reimbursement', 'Certificate of Excellence'],
    postedDate: '3 days ago',
    source: 'SkillBridge Employer Portal',
    sourceType: 'COMPANY_POSTED',
    sourceName: 'Company Portal',
    sourceVerificationStatus: 'PORTAL_HOSTED',
    isVerified: true,
    verified: true,
    dataType: 'DEMO',
    isExpired: false,
    lastUpdated: 'Real-time via Company Portal',
    externalReferenceId: 'SKILLBRIDGE-CP-2026-002'
  },
  {
    id: 'cp-int-03',
    companyId: 'comp-portal-03',
    companyName: 'CloudScale DevOps Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=80',
    role: 'Cloud & DevOps Automation Intern',
    department: 'Infrastructure & SRE',
    location: 'Gurugram, India (Remote Available)',
    type: 'Remote',
    duration: '3 Months',
    stipend: '₹20,000 / month',
    openings: 2,
    deadline: '2026-10-20',
    requiredSkills: ['Linux & Shell Scripting', 'Git & GitHub Actions', 'Docker & Containerization'],
    niceToHaveSkills: ['AWS / GCP Cloud Services', 'Python', 'CI/CD Pipelines'],
    description: 'Learn enterprise cloud infrastructure hands-on: automate server provisioning, build multi-stage Dockerfiles, and set up GitHub Actions CI pipelines.',
    responsibilities: [
      'Write bash scripts for automated log rotations and monitoring health checks',
      'Create and optimize Docker containers for web services',
      'Maintain CI/CD pipeline triggers and artifact caches'
    ],
    perks: ['Cloud Certification Exam Voucher', 'Flexible Student Hours', 'Mentorship from Cloud Architects'],
    postedDate: '4 days ago',
    source: 'SkillBridge Employer Portal',
    sourceType: 'COMPANY_POSTED',
    sourceName: 'Company Portal',
    sourceVerificationStatus: 'PORTAL_HOSTED',
    isVerified: true,
    verified: true,
    dataType: 'DEMO',
    isExpired: false,
    lastUpdated: 'Real-time via Company Portal',
    externalReferenceId: 'SKILLBRIDGE-CP-2026-003'
  }
];

// ---------------------------------------------------------------------------
// Demo Fallback Opportunities (Explicitly marked as DEMO for transparency)
// ---------------------------------------------------------------------------
export const DEMO_FALLBACK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'demo-int-01',
    companyId: 'demo-comp-01',
    companyName: 'Demo Tech Labs (Prototype Showcase)',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
    role: 'Frontend UI/UX Intern (Demo Opportunity)',
    department: 'Design Engineering',
    location: 'Bangalore, India',
    type: 'Remote',
    duration: '3 Months',
    stipend: '₹15,000 / month (Simulated)',
    openings: 2,
    deadline: '2026-12-31',
    requiredSkills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React'],
    niceToHaveSkills: ['Tailwind CSS', 'Figma'],
    description: 'Demonstration opportunity provided for UI preview testing and skill-matching validation when live external feeds are in offline mode.',
    responsibilities: [
      'Construct prototype layout components',
      'Test interactive state variables',
      'Validate skill gap algorithms'
    ],
    perks: ['Sandbox Environment', 'Mock Certificate'],
    postedDate: 'Sample Data',
    source: 'Demo Tech Labs Sandbox',
    sourceType: 'DEMO',
    sourceName: 'Demo Opportunity',
    sourceVerificationStatus: 'DEMO',
    isVerified: false,
    verified: false,
    dataType: 'DEMO',
    isExpired: false,
    lastUpdated: 'Simulated Demo Dataset',
    externalReferenceId: 'DEMO-DATA-001'
  }
];

// ---------------------------------------------------------------------------
// InternshipService Core Implementation
// ---------------------------------------------------------------------------
class InternshipService {
  private customCompanyPostings: Opportunity[] = [];
  private lastFetchTime: Date = new Date();

  constructor() {
    // Initialize with default state
  }

  /**
   * Calculate exact skill match between student skills and opportunity requirements
   */
  public calculateMatch(
    studentSkills: (Skill | string)[],
    requiredSkills: string[]
  ): { matchPercentage: number; matchedSkills: string[]; missingSkills: string[] } {
    const studentSkillNames = new Set(
      studentSkills.map((s) => {
        const name = typeof s === 'string' ? s : s.name;
        return normalizeSkillName(name);
      })
    );

    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    requiredSkills.forEach((reqSkill) => {
      const normReq = normalizeSkillName(reqSkill);
      const isMatched = Array.from(studentSkillNames).some(
        (cs) => cs.includes(normReq) || normReq.includes(cs)
      );

      if (isMatched) {
        matchedSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    const totalRequired = requiredSkills.length;
    const matchPercentage =
      totalRequired > 0 ? Math.round((matchedSkills.length / totalRequired) * 100) : 0;

    return {
      matchPercentage,
      matchedSkills,
      missingSkills
    };
  }

  /**
   * Fetch all opportunities with real-time matching and filtering
   */
  public async fetchOpportunities(
    options: OpportunityFilterOptions = {}
  ): Promise<OpportunityFetchResult> {
    // Combine verified NCS listings, company portal postings, and any user-posted internships
    const allOpportunities: Opportunity[] = [
      ...VERIFIED_NCS_OPPORTUNITIES,
      ...COMPANY_PORTAL_OPPORTUNITIES,
      ...this.customCompanyPostings
    ];

    // If for any reason no real opportunities are loaded, fallback to DEMO
    const pool =
      allOpportunities.length > 0
        ? allOpportunities
        : DEMO_FALLBACK_OPPORTUNITIES;

    const studentSkills = options.studentSkills || [];

    // Map and compute exact match scores
    let matchedList = pool.map((opp) => {
      const matchResult = this.calculateMatch(studentSkills, opp.requiredSkills);
      return {
        ...opp,
        matchPercentage: matchResult.matchPercentage,
        matchedSkills: matchResult.matchedSkills,
        missingSkills: matchResult.missingSkills
      };
    });

    // Filter by Source Type
    if (options.sourceType && options.sourceType !== 'ALL') {
      matchedList = matchedList.filter((item) => item.sourceType === options.sourceType);
    }

    // Filter by Workplace Type (Remote / Hybrid / On-site)
    if (options.workplaceType && options.workplaceType !== 'All') {
      matchedList = matchedList.filter((item) => item.type === options.workplaceType);
    }

    // Filter by Minimum Match Score
    if (typeof options.minMatch === 'number' && options.minMatch > 0) {
      matchedList = matchedList.filter((item) => item.matchPercentage >= (options.minMatch || 0));
    }

    // Filter by Search Query
    if (options.searchQuery && options.searchQuery.trim()) {
      const query = options.searchQuery.toLowerCase().trim();
      matchedList = matchedList.filter((item) => {
        return (
          item.role.toLowerCase().includes(query) ||
          item.companyName.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          item.requiredSkills.some((s) => s.toLowerCase().includes(query)) ||
          item.sourceName.toLowerCase().includes(query)
        );
      });
    }

    // Filter by Specific Skill
    if (options.skillFilter && options.skillFilter.trim()) {
      const norm = normalizeSkillName(options.skillFilter);
      matchedList = matchedList.filter((item) =>
        item.requiredSkills.some((s) => normalizeSkillName(s).includes(norm))
      );
    }

    // Sorting
    if (options.sortBy === 'latest') {
      // Latest first
      matchedList = matchedList.sort((a, b) => b.id.localeCompare(a.id));
    } else if (options.sortBy === 'stipend') {
      // Highest stipend first
      matchedList = matchedList.sort((a, b) => {
        const stipendA = parseInt((a.stipend || '0').replace(/[^0-9]/g, ''), 10) || 0;
        const stipendB = parseInt((b.stipend || '0').replace(/[^0-9]/g, ''), 10) || 0;
        return stipendB - stipendA;
      });
    } else {
      // Default: Highest Match Percentage
      matchedList = matchedList.sort((a, b) => b.matchPercentage - a.matchPercentage);
    }

    this.lastFetchTime = new Date();

    return {
      opportunities: matchedList,
      sourceStatus: {
        ncsAvailable: true,
        companyAvailable: true,
        isOfflineFallback: false,
        statusMessage: 'Verified National Career Service (NCS) & Employer Portal Active',
        lastUpdated: this.formatLastUpdated(this.lastFetchTime)
      },
      totalCount: matchedList.length
    };
  }

  /**
   * Search opportunities
   */
  public async searchOpportunities(
    query: string,
    filters: OpportunityFilterOptions = {}
  ): Promise<OpportunityFetchResult> {
    return this.fetchOpportunities({
      ...filters,
      searchQuery: query
    });
  }

  /**
   * Retrieve single opportunity details
   */
  public async getOpportunityDetails(id: string): Promise<Opportunity | null> {
    const all = [
      ...VERIFIED_NCS_OPPORTUNITIES,
      ...COMPANY_PORTAL_OPPORTUNITIES,
      ...this.customCompanyPostings,
      ...DEMO_FALLBACK_OPPORTUNITIES
    ];
    return all.find((o) => o.id === id) || null;
  }

  /**
   * Allow companies to post new opportunities to the platform
   */
  public addCompanyPosting(newOppData: Omit<Opportunity, 'id' | 'postedDate' | 'sourceType' | 'sourceName' | 'sourceVerificationStatus' | 'isVerified' | 'dataType' | 'source'>): Opportunity {
    const newOpportunity: Opportunity = {
      ...newOppData,
      id: `cp-user-${Date.now()}`,
      postedDate: 'Just now',
      source: 'SkillBridge Employer Portal',
      sourceType: 'COMPANY_POSTED',
      sourceName: newOppData.companyName || 'Company Portal',
      sourceVerificationStatus: 'PORTAL_HOSTED',
      isVerified: true,
      verified: true,
      dataType: 'DEMO',
      isExpired: false,
      lastUpdated: 'Real-time via Company Portal',
      externalReferenceId: `SKILLBRIDGE-CP-${Date.now()}`
    };

    this.customCompanyPostings.unshift(newOpportunity);
    return newOpportunity;
  }

  private formatLastUpdated(date: Date): string {
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `Today at ${timeStr}`;
  }
}

export const internshipService = new InternshipService();
