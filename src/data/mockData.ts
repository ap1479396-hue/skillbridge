import {
  CareerGoal,
  CompanyProfile,
  Internship,
  StudentProfile,
  CollegeStats,
  RoadmapMilestone,
  InternshipApplication
} from '../types';

export const CAREER_GOALS: CareerGoal[] = [
  {
    id: 'frontend-dev',
    title: 'Frontend Developer',
    category: 'Web Development',
    description: 'Build interactive, responsive, and high-performance user interfaces for modern web applications.',
    averageSalary: '₹6.5 - 12 LPA',
    demandLevel: 'High',
    requiredSkills: [
      { name: 'HTML', priority: 'High', category: 'Frontend', description: 'Semantic structure, accessibility, and modern web standards' },
      { name: 'CSS', priority: 'High', category: 'Frontend', description: 'Flexbox, Grid, animations, and responsive layout techniques' },
      { name: 'JavaScript', priority: 'High', category: 'Frontend', description: 'Asynchronous JS, Closures, DOM, and event lifecycle' },
      { name: 'React', priority: 'High', category: 'Frontend', description: 'Hooks, state management, component lifecycle, and virtual DOM' },
      { name: 'TypeScript', priority: 'Medium', category: 'Frontend', description: 'Static typing, interfaces, and scalable frontend code' },
      { name: 'Tailwind CSS', priority: 'Medium', category: 'Frontend', description: 'Utility-first modern styling and rapid responsive UI creation' },
      { name: 'Git', priority: 'High', category: 'DevOps', description: 'Version control, branching workflows, PRs, and team collaboration' },
      { name: 'REST APIs', priority: 'High', category: 'Frontend', description: 'Consuming backend endpoints, async error handling, and JSON payloads' },
      { name: 'Web Performance', priority: 'Low', category: 'Frontend', description: 'Lighthouse scoring, lazy loading, bundle optimization, and meta tags' }
    ]
  },
  {
    id: 'fullstack-dev',
    title: 'Full Stack Developer (MERN)',
    category: 'Software Engineering',
    description: 'Architect and deploy complete end-to-end web applications covering frontend, backend servers, and databases.',
    averageSalary: '₹8 - 16 LPA',
    demandLevel: 'Very High',
    requiredSkills: [
      { name: 'JavaScript', priority: 'High', category: 'Frontend', description: 'Core language mastery for both client and Node runtime' },
      { name: 'React', priority: 'High', category: 'Frontend', description: 'Single Page Application development and component state' },
      { name: 'Node.js', priority: 'High', category: 'Backend', description: 'RESTful API servers, middleware, authentication, and routing' },
      { name: 'Express.js', priority: 'High', category: 'Backend', description: 'Server architecture, route handlers, and middleware' },
      { name: 'MongoDB', priority: 'High', category: 'Database', description: 'NoSQL schema design, aggregation pipelines, and indexing' },
      { name: 'SQL', priority: 'Medium', category: 'Database', description: 'Relational data modeling, foreign keys, and complex queries' },
      { name: 'Git', priority: 'High', category: 'DevOps', description: 'Version control and CI/CD basics' },
      { name: 'REST APIs', priority: 'High', category: 'Backend', description: 'API contract design, tokens, status codes' }
    ]
  },
  {
    id: 'backend-dev',
    title: 'Backend Developer',
    category: 'Software Engineering',
    description: 'Develop robust server-side logic, architect REST APIs and database schemas, manage relational/NoSQL stores, and ensure secure authentication.',
    averageSalary: '₹7 - 15 LPA',
    demandLevel: 'Very High',
    requiredSkills: [
      { name: 'Node.js', priority: 'High', category: 'Backend', description: 'Server architecture, asynchronous I/O, middleware, and route handlers' },
      { name: 'Express.js', priority: 'High', category: 'Backend', description: 'RESTful routing and middleware management' },
      { name: 'SQL', priority: 'High', category: 'Database', description: 'Relational schema design, indexes, transactions, and complex joins' },
      { name: 'REST APIs', priority: 'High', category: 'Backend', description: 'RESTful API contracts, status codes, payload validation' },
      { name: 'MongoDB', priority: 'Medium', category: 'Database', description: 'NoSQL collections, queries, and aggregation pipelines' },
      { name: 'Git', priority: 'High', category: 'DevOps', description: 'Branch management, pull requests, and collaborative source control' },
      { name: 'Docker', priority: 'Medium', category: 'DevOps', description: 'Containerizing backend services for reproducible deployments' },
      { name: 'C++', priority: 'Medium', category: 'Core CS', description: 'Data structures, algorithm complexity (Big-O), and memory management' }
    ]
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI / Machine Learning Engineer',
    category: 'Artificial Intelligence',
    description: 'Design, train, and deploy predictive models, neural networks, and LLM-powered enterprise solutions.',
    averageSalary: '₹9 - 20 LPA',
    demandLevel: 'Critical',
    requiredSkills: [
      { name: 'Python', priority: 'High', category: 'Core CS', description: 'Primary scripting language and numerical computing fundamentals' },
      { name: 'NumPy & Pandas', priority: 'High', category: 'AI/ML', description: 'Data wrangling, matrix calculations, and dataset transformations' },
      { name: 'Machine Learning', priority: 'High', category: 'AI/ML', description: 'Regression, Classification, Clustering, and Evaluation metrics' },
      { name: 'Deep Learning', priority: 'High', category: 'AI/ML', description: 'Neural networks, backpropagation, CNNs, and Transformers' },
      { name: 'SQL', priority: 'Medium', category: 'Database', description: 'Extracting training batches from structured relational stores' },
      { name: 'Git', priority: 'High', category: 'DevOps', description: 'Experiment tracking and reproducible repository structure' }
    ]
  },
  {
    id: 'mechanical-design-engineer',
    title: 'Mechanical Design / CAD Engineer',
    category: 'Mechanical Engineering',
    description: 'Design 3D mechanical components, assemblies, technical drawings, and simulation models for manufacturing.',
    averageSalary: '₹5.5 - 11 LPA',
    demandLevel: 'High',
    requiredSkills: [
      { name: 'AutoCAD', priority: 'High', category: 'Design', description: '2D drafting, schematics, and engineering layouts' },
      { name: 'SolidWorks', priority: 'High', category: 'Design', description: '3D parametric modeling, sheet metal, and assembly design' },
      { name: 'CATIA', priority: 'Medium', category: 'Design', description: 'Advanced surface modeling and aerospace/automotive component styling' },
      { name: '3D Modelling', priority: 'High', category: 'Design', description: 'Part modeling, parametric constraints, and assembly validation' },
      { name: 'Engineering Drawing', priority: 'High', category: 'Design', description: 'Orthographic projections, sectional views, and manufacturing documentation' },
      { name: 'GD&T', priority: 'Medium', category: 'Design', description: 'Geometric Dimensioning & Tolerancing standards for precision machining' },
      { name: 'ANSYS', priority: 'Low', category: 'Core CS', description: 'Finite element structural and thermal simulation' },
      { name: 'MS Excel', priority: 'Medium', category: 'Core CS', description: 'Bill of materials (BOM), tolerance calculations, and test data tracking' }
    ]
  },
  {
    id: 'automation-engineer',
    title: 'Automation & Robotics Engineer',
    category: 'Industrial Automation',
    description: 'Develop PLC logic, SCADA interfaces, CNC machining programs, and automated assembly systems.',
    averageSalary: '₹6.0 - 13 LPA',
    demandLevel: 'High',
    requiredSkills: [
      { name: 'Basic PLC', priority: 'High', category: 'Core CS', description: 'Ladder logic, timers, counters, and industrial controller programming' },
      { name: 'CNC Programming', priority: 'High', category: 'Core CS', description: 'G-code, M-code generation, and automated toolpath planning' },
      { name: 'Industrial Automation', priority: 'High', category: 'Core CS', description: 'Pneumatic actuators, sensors, and automated manufacturing lines' },
      { name: 'SCADA', priority: 'Medium', category: 'Core CS', description: 'Supervisory control, HMI screens, and industrial telemetry' },
      { name: 'MATLAB', priority: 'Medium', category: 'Core CS', description: 'Control system simulation, kinematics, and data analysis' },
      { name: 'Python', priority: 'Low', category: 'Core CS', description: 'Edge computing, vision inspection scripts, and telemetry logging' }
    ]
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    category: 'Data & Analytics',
    description: 'Transform raw enterprise data into actionable dashboards, statistical reports, and predictive insights.',
    averageSalary: '₹5.0 - 10 LPA',
    demandLevel: 'High',
    requiredSkills: [
      { name: 'SQL', priority: 'High', category: 'Database', description: 'Complex queries, window functions, joins, and data extraction' },
      { name: 'Python', priority: 'High', category: 'Core CS', description: 'Data wrangling, automated scripts, and analysis workflows' },
      { name: 'NumPy & Pandas', priority: 'High', category: 'AI/ML', description: 'DataFrame operations, data cleaning, and statistical summaries' },
      { name: 'MS Excel', priority: 'High', category: 'Core CS', description: 'Pivot tables, VLOOKUP/XLOOKUP, and executive financial models' },
      { name: 'PostgreSQL', priority: 'Medium', category: 'Database', description: 'Relational data modeling, indexing, and analytics schemas' },
      { name: 'Git', priority: 'Medium', category: 'DevOps', description: 'Version control for analysis repositories and notebooks' }
    ]
  }
];

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'student-01',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@college.edu',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  college: 'Government College of Engineering & Technology (GCET)',
  course: 'B.Tech Computer Science & Engineering',
  degree: 'B.Tech',
  year: '1st Year (FY)',
  cgpa: 8.6,
  careerGoalId: 'frontend-dev',
  currentSkills: [
    { name: 'HTML', category: 'Frontend', proficiency: 'Advanced', verified: true },
    { name: 'CSS', category: 'Frontend', proficiency: 'Intermediate', verified: true },
    { name: 'JavaScript', category: 'Frontend', proficiency: 'Intermediate', verified: true },
    { name: 'React', category: 'Frontend', proficiency: 'Beginner', verified: true },
    { name: 'C++', category: 'Core CS', proficiency: 'Intermediate', verified: true },
    { name: 'SQL', category: 'Database', proficiency: 'Intermediate', verified: true },
    { name: 'Git', category: 'DevOps', proficiency: 'Intermediate', verified: true },
    { name: 'GitHub', category: 'DevOps', proficiency: 'Intermediate', verified: true }
  ],
  projects: [
    {
      title: 'Responsive Personal Portfolio',
      description: 'Clean responsive web portfolio with modern CSS Flexbox and JavaScript interactions.',
      technologies: ['HTML', 'CSS', 'JavaScript', 'Git'],
      githubUrl: 'https://github.com/aarav/portfolio'
    },
    {
      title: 'Student Database System',
      description: 'Relational query processor in C++ connected to SQL schemas with CRUD operations.',
      technologies: ['C++', 'SQL'],
      githubUrl: 'https://github.com/aarav/student-db'
    }
  ],
  certifications: [
    {
      name: 'Modern JavaScript from the Beginning',
      issuer: 'Udemy / Online Academy',
      issueDate: 'July 2026'
    },
    {
      name: 'Responsive Web Design Certification',
      issuer: 'freeCodeCamp',
      issueDate: 'May 2026'
    }
  ],
  bio: 'Passionate 1st-year CSE student aiming to become an industry-ready Frontend Engineer. Love building responsive user interfaces and eager to crack high-impact summer internships.',
  githubUrl: 'https://github.com/aarav-sharma',
  linkedinUrl: 'https://linkedin.com/in/aarav-sharma-dev',
  resumeFileName: 'Aarav_Sharma_Resume_FY.pdf',
  resumeText: `AARAV SHARMA
Email: aarav.sharma@college.edu | Phone: +91 98765 43210 | Portfolio: aarav.dev
B.Tech Computer Science and Engineering (1st Year / FY), GCET (CGPA: 8.6/10)

TECHNICAL SKILLS:
- Languages & Frontend: HTML, CSS, JavaScript, React (Basics), C++, SQL
- Version Control: Git, GitHub
- Coursework: Data Structures & Algorithms, Object-Oriented Programming, DBMS

PROJECTS:
1. Personal Portfolio Website
   - Built a fully responsive personal site using semantic HTML, CSS3, and JavaScript.
   - Hosted with version control on GitHub using Git.

2. Student Management Database
   - Designed normalized schema with SQL queries and C++ backend CLI.

CERTIFICATIONS:
- freeCodeCamp: Responsive Web Design
- Modern JavaScript from the Beginning`,
  extractedSkills: [
    { name: 'HTML', confidence: 0.98, category: 'Frontend', evidence: 'Skills: HTML', sourceSection: 'Technical Skills', sources: ['Technical Skills'] },
    { name: 'CSS', confidence: 0.95, category: 'Frontend', evidence: 'Skills: CSS', sourceSection: 'Technical Skills', sources: ['Technical Skills'] },
    { name: 'JavaScript', confidence: 0.96, category: 'Frontend', evidence: 'Skills: JavaScript', sourceSection: 'Technical Skills', sources: ['Technical Skills'] },
    { name: 'React', confidence: 0.94, category: 'Frontend', evidence: 'Skills: Basic React', sourceSection: 'Technical Skills', sources: ['Technical Skills'] },
    { name: 'C++', confidence: 0.96, category: 'Core CS', evidence: 'Skills: C++', sourceSection: 'Technical Skills', sources: ['Technical Skills'] },
    { name: 'SQL', confidence: 0.95, category: 'Database', evidence: 'Projects: SQL schema', sourceSection: 'Projects', sources: ['Projects'] },
    { name: 'Git', confidence: 0.95, category: 'DevOps', evidence: 'Tools: Git', sourceSection: 'Technical Skills', sources: ['Technical Skills'] },
    { name: 'GitHub', confidence: 0.94, category: 'DevOps', evidence: 'Tools: GitHub', sourceSection: 'Projects', sources: ['Projects'] }
  ],
  extractedExperience: [
    'Web Development Club Member at GCET',
    'Completed projects in Responsive Web Design and Relational DB management'
  ],
  extractedEducation: 'B.Tech CSE - 1st Year (FY) at GCET (CGPA: 8.6)'
};

export const SAMPLE_RESUMES = [
  {
    name: 'Frontend_Aarav_FY.pdf',
    label: 'Aarav (FY Student - Web Enthusiast)',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'C++', 'Git', 'SQL'],
    text: `AARAV SHARMA - 1st Year B.Tech CSE (GCET)
Skills: HTML, CSS, JavaScript, React, C++, SQL, Git.
Projects: Responsive Portfolio, Student Management Database with SQL.`
  },
  {
    name: 'FullStack_Priya_SY.pdf',
    label: 'Priya (2nd Year - MERN Stack Student)',
    skills: ['JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'HTML', 'CSS', 'Git', 'REST APIs'],
    text: `PRIYA PATEL - 2nd Year B.Tech IT (CGPA: 8.9)
Skills: React, Node.js, Express.js, MongoDB, REST APIs, JavaScript, Tailwind CSS, Git.
Projects: E-Commerce Store with Stripe integration, College Event Management Portal.`
  },
  {
    name: 'AIML_Rohan_TY.pdf',
    label: 'Rohan (3rd Year - AI/ML Aspirant)',
    skills: ['Python', 'NumPy & Pandas', 'Machine Learning', 'SQL', 'Git'],
    text: `ROHAN VERMA - 3rd Year CSE Data Science (CGPA: 8.4)
Skills: Python, Machine Learning, NumPy & Pandas, SQL, Git.
Projects: Placement Prediction Model (92% accuracy), Twitter Sentiment Analysis.`
  }
];

export const COMPANIES: CompanyProfile[] = [
  {
    id: 'comp-portal-01',
    name: 'NexusTech Innovations',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    industry: 'Enterprise Cloud & SaaS',
    location: 'Bangalore, India (Remote Available)',
    website: 'https://nexustech.io',
    description: 'Enterprise cloud provider building scalable multi-tenant analytics and collaboration tools.',
    contactEmail: 'careers@nexustech.io',
    size: '250-500 employees',
    verified: false
  },
  {
    id: 'ncs-org-nic',
    name: 'National Informatics Centre (NIC) / MeitY',
    logo: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100&auto=format&fit=crop&q=80',
    industry: 'Government & Digital Public Infrastructure',
    location: 'New Delhi, India (Pan India)',
    website: 'https://www.ncs.gov.in',
    description: 'Premier technology organisation of Government of India providing e-governance support across national ministries.',
    contactEmail: 'apprenticeship@nic.in',
    size: '10,000+ employees',
    verified: true
  },
  {
    id: 'ncs-org-tcs',
    name: 'Tata Consultancy Services (TCS iON / NCS Partner)',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80',
    industry: 'IT Services & Digital Solutions',
    location: 'Pune / Mumbai, India',
    website: 'https://www.tcs.com',
    description: 'Global leader in IT services, digital and business solutions partnering with NCS for digital youth employment.',
    contactEmail: 'ncs.careers@tcs.com',
    size: '100,000+ employees',
    verified: true
  },
  {
    id: 'ncs-org-cdac',
    name: 'Centre for Development of Advanced Computing (C-DAC)',
    logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=100&auto=format&fit=crop&q=80',
    industry: 'Advanced Computing & AI Research',
    location: 'Pune / Hyderabad, India',
    website: 'https://www.cdac.in',
    description: 'Premier R&D institution of the Ministry of Electronics and IT for carrying out R&D in Supercomputing and AI.',
    contactEmail: 'hrd@cdac.in',
    size: '2,500+ employees',
    verified: true
  }
];

export const INITIAL_INTERNSHIPS: Internship[] = [
  {
    id: 'job-nex-001',
    companyId: 'comp-portal-01',
    companyName: 'NexusTech Innovations',
    companyType: 'Enterprise SaaS Partner',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    role: 'Frontend Developer Intern',
    jobType: 'Internship',
    department: 'Web Engineering',
    location: 'Bangalore, India',
    workMode: 'Remote',
    type: 'Remote',
    duration: '3 Months',
    stipend: '₹25,000 / month',
    openings: 3,
    deadline: '2026-10-30',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'TypeScript'],
    preferredSkills: ['Tailwind CSS', 'REST APIs'],
    eligibility: {
      minimumDegree: 'B.Tech / BCA / MCA',
      eligibleYears: ['1st Year (FY)', '2nd Year (SY)', '3rd Year (TY)'],
      minCgpa: 7.5
    },
    description: 'Direct recruitment posting on SkillBridge. Build responsive user interfaces, dashboard widgets, and client-side state engines in modern React.',
    responsibilities: [
      'Implement reusable UI components in React and modern CSS',
      'Integrate RESTful backend endpoints with robust error states',
      'Participate in weekly sprint code reviews via Git pull requests'
    ],
    perks: ['Pre-Placement Offer (PPO) Evaluation', '1-on-1 Staff Mentorship', 'Flexible Remote Hours'],
    postedDate: 'Today',
    source: 'SkillBridge Employer Portal',
    sourceType: 'COMPANY_POSTED',
    sourceName: 'NexusTech Direct Portal',
    sourceVerificationStatus: 'SAMPLE_DATA',
    isVerified: false,
    verified: false,
    dataType: 'DEMO',
    lastUpdated: 'Live Portal Feed'
  },
  {
    id: 'ncs-nic-01',
    companyId: 'ncs-org-nic',
    companyName: 'National Informatics Centre (NIC) / MeitY',
    companyType: 'Government / PSU',
    companyLogo: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100&auto=format&fit=crop&q=80',
    role: 'Junior Web & Portal Developer Apprentice',
    jobType: 'Apprenticeship',
    department: 'Digital India & E-Governance',
    location: 'New Delhi / Remote (Pan India)',
    workMode: 'Hybrid',
    type: 'Hybrid',
    duration: '6 Months',
    stipend: '₹18,500 / month',
    openings: 12,
    deadline: '2026-10-15',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
    preferredSkills: ['REST APIs', 'SQL', 'Accessibility Standards'],
    eligibility: {
      minimumDegree: 'Diploma / B.Tech',
      eligibleYears: ['1st Year (FY)', '2nd Year (SY)', '3rd Year (TY)', '4th Year (Final)'],
      minCgpa: 7.0
    },
    description: 'Apprenticeship under the National Apprenticeship Training Scheme (NATS) via National Career Service (NCS). Build and optimize citizen-facing government portals adhering to GIGW standards.',
    responsibilities: [
      'Construct accessible web interfaces in HTML, CSS, and React',
      'Optimize public portal rendering speed on mobile browsers',
      'Connect frontend widgets with verified government API endpoints'
    ],
    perks: ['Govt NATS Apprenticeship Certificate', 'NCS Verified Credential', 'Trainee Evaluation'],
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
    lastUpdated: 'Synchronized via NCS Portal Feed',
    externalReferenceId: 'NCS-JOBID-2026-MEITY-8841'
  },
  {
    id: 'ncs-tcs-02',
    companyId: 'ncs-org-tcs',
    companyName: 'Tata Consultancy Services (TCS iON)',
    companyType: 'IT Enterprise',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80',
    role: 'Frontend Engineering Intern',
    jobType: 'Internship',
    department: 'Enterprise Platforms',
    location: 'Pune / Mumbai, India',
    workMode: 'Hybrid',
    type: 'Hybrid',
    duration: '3 Months',
    stipend: '₹20,000 / month',
    openings: 8,
    deadline: '2026-09-30',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'],
    preferredSkills: ['TypeScript', 'Git'],
    eligibility: {
      minimumDegree: 'B.Tech CSE / IT',
      eligibleYears: ['1st Year (FY)', '2nd Year (SY)', '3rd Year (TY)'],
      minCgpa: 8.0
    },
    description: 'Listed via National Career Service Youth Employment initiative. Focus on modern frontend UI components, responsive layout frameworks, and clean code standards.',
    responsibilities: [
      'Build reusable React components with Tailwind CSS',
      'Write modular code complying with corporate design systems',
      'Assist in sprint bug tracking and UI performance testing'
    ],
    perks: ['Pre-Placement Interview (PPI) Eligibility', 'Corporate Laptop Allowance', 'Certificate of Completion'],
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
    lastUpdated: 'Synchronized via NCS Portal Feed',
    externalReferenceId: 'NCS-JOBID-2026-TCS-1092'
  },
  {
    id: 'ncs-cdac-03',
    companyId: 'ncs-org-cdac',
    companyName: 'Centre for Development of Advanced Computing (C-DAC)',
    companyType: 'R&D Institution',
    companyLogo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=100&auto=format&fit=crop&q=80',
    role: 'AI & Data Science Project Intern',
    jobType: 'Internship',
    department: 'Advanced Computing & AI',
    location: 'Pune / Hyderabad, India',
    workMode: 'On-site',
    type: 'On-site',
    duration: '6 Months',
    stipend: '₹22,000 / month',
    openings: 4,
    deadline: '2026-10-25',
    requiredSkills: ['Python', 'NumPy & Pandas', 'Machine Learning', 'SQL'],
    preferredSkills: ['Deep Learning', 'Git'],
    eligibility: {
      minimumDegree: 'B.Tech / M.Tech',
      eligibleYears: ['2nd Year (SY)', '3rd Year (TY)', '4th Year (Final)'],
      minCgpa: 8.0
    },
    description: 'National Career Service R&D project internship. Process experimental datasets, build baseline classification pipelines, and support AI benchmarking.',
    responsibilities: [
      'Execute exploratory data analysis and feature engineering on scientific datasets',
      'Train Scikit-Learn baseline predictive models',
      'Document experiment parameters and model accuracy curves'
    ],
    perks: ['C-DAC Official R&D Certificate', 'GPU Supercomputing Access', 'Publication Mentorship'],
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
    lastUpdated: 'Synchronized via NCS Portal Feed',
    externalReferenceId: 'NCS-JOBID-2026-CDAC-5420'
  },
  {
    id: 'job-nex-002',
    companyId: 'comp-portal-01',
    companyName: 'NexusTech Innovations',
    companyType: 'Enterprise SaaS Partner',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    role: 'Full Stack Engineer Intern (MERN)',
    jobType: 'Internship',
    department: 'Cloud Platform Engineering',
    location: 'Bangalore / Hybrid',
    workMode: 'Hybrid',
    type: 'Hybrid',
    duration: '6 Months',
    stipend: '₹30,000 / month',
    openings: 2,
    deadline: '2026-11-15',
    requiredSkills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Git'],
    preferredSkills: ['TypeScript', 'Docker', 'REST APIs'],
    eligibility: {
      minimumDegree: 'B.Tech CSE / IT',
      eligibleYears: ['3rd Year (TY)', '4th Year (Final)'],
      minCgpa: 8.0
    },
    description: 'Work with core engineering on high-throughput microservices, real-time WebSocket communication pipelines, and database optimization.',
    responsibilities: [
      'Build end-to-end full-stack feature modules in React and Node.js',
      'Design RESTful API schemas and MongoDB aggregation pipelines',
      'Participate in CI/CD pipeline automation and code reviews'
    ],
    perks: ['Competitive Full-time PPO Package (₹14+ LPA)', 'Health Insurance Cover', 'Gym & Tech Setup Stipend'],
    postedDate: '3 days ago',
    source: 'SkillBridge Employer Portal',
    sourceType: 'COMPANY_POSTED',
    sourceName: 'NexusTech Direct Portal',
    sourceVerificationStatus: 'SAMPLE_DATA',
    isVerified: false,
    verified: false,
    dataType: 'DEMO',
    lastUpdated: 'Live Portal Feed'
  },
  {
    id: 'ncs-mech-01',
    companyId: 'comp-portal-01',
    companyName: 'L&T Technology Services',
    companyType: 'Engineering & Manufacturing R&D',
    companyLogo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&auto=format&fit=crop&q=80',
    role: 'Mechanical CAD & Design Intern',
    jobType: 'Internship',
    department: 'Product Design & Engineering',
    location: 'Pune / Vadodara, India',
    workMode: 'Hybrid',
    type: 'Hybrid',
    duration: '6 Months',
    stipend: '₹22,000 / month',
    openings: 5,
    deadline: '2026-10-31',
    requiredSkills: ['AutoCAD', 'SolidWorks', '3D Modelling', 'Engineering Drawing', 'GD&T'],
    preferredSkills: ['CATIA', 'ANSYS', 'MS Excel'],
    eligibility: {
      minimumDegree: 'B.Tech Mechanical / Production',
      eligibleYears: ['2nd Year (SY)', '3rd Year (TY)', '4th Year (Final)'],
      minCgpa: 7.5
    },
    description: 'Design and draft mechanical components, create 3D CAD assemblies, and validate manufacturing blueprints using GD&T standards.',
    responsibilities: [
      'Create 3D parametric models and assembly drawings in SolidWorks and AutoCAD',
      'Generate Bills of Materials (BOM) and check manufacturing tolerances with GD&T',
      'Assist senior design engineers in finite element stress analysis and prototype testing'
    ],
    perks: ['Pre-Placement Interview (PPI) Eligibility', 'SolidWorks Professional Certification Sponsorship', 'Travel Allowance'],
    postedDate: '1 day ago',
    source: 'National Career Service (NCS)',
    sourceType: 'VERIFIED_EXTERNAL',
    sourceName: 'National Career Service (NCS)',
    sourceUrl: 'https://www.ncs.gov.in',
    applicationUrl: 'https://www.ncs.gov.in/job-search',
    sourceVerificationStatus: 'VERIFIED',
    isVerified: true,
    verified: true,
    dataType: 'DEMO',
    lastUpdated: 'Synchronized via NCS Portal Feed',
    externalReferenceId: 'NCS-JOBID-2026-LTTS-9021'
  },
  {
    id: 'ncs-auto-02',
    companyId: 'comp-portal-01',
    companyName: 'Siemens Industrial Automation',
    companyType: 'Industrial Automation & Robotics',
    companyLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=80',
    role: 'Automation & PLC Controls Intern',
    jobType: 'Internship',
    department: 'Industrial Digitalization',
    location: 'Bangalore / Chennai, India',
    workMode: 'On-site',
    type: 'On-site',
    duration: '6 Months',
    stipend: '₹24,000 / month',
    openings: 4,
    deadline: '2026-11-10',
    requiredSkills: ['Basic PLC', 'CNC Programming', 'Industrial Automation', 'MATLAB'],
    preferredSkills: ['SCADA', 'Python', 'MS Excel'],
    eligibility: {
      minimumDegree: 'B.Tech Mechanical / Mechatronics / Electrical',
      eligibleYears: ['2nd Year (SY)', '3rd Year (TY)', '4th Year (Final)'],
      minCgpa: 7.8
    },
    description: 'Program industrial controllers, implement ladder logic for manufacturing lines, and simulate automated robotics cells.',
    responsibilities: [
      'Write and test PLC ladder logic routines and SCADA visualization screens',
      'Develop CNC toolpaths and verify G-code for precision machining operations',
      'Conduct system testing and signal calibration with hardware sensors'
    ],
    perks: ['Siemens TIA Portal Certification', 'Hands-on Hardware Lab Access', 'Stipend Bonus on Project Delivery'],
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
    lastUpdated: 'Synchronized via NCS Portal Feed',
    externalReferenceId: 'NCS-JOBID-2026-SIEM-4412'
  }
];

export const INITIAL_APPLICATIONS: InternshipApplication[] = [
  {
    id: 'app-1',
    internshipId: 'job-nex-001',
    studentId: 'student-01',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@college.edu',
    studentCollege: 'Government College of Engineering & Technology (GCET)',
    studentCourse: 'B.Tech CSE',
    studentDegree: 'B.Tech',
    studentYear: '1st Year (FY)',
    studentCgpa: 8.6,
    studentSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'C++', 'SQL', 'Git', 'GitHub'],
    matchedSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
    missingSkills: ['TypeScript'],
    matchScore: 82,
    matchExplanation: 'Possesses 5 of 6 required skills with verified hands-on projects in React and responsive UI.',
    status: 'Shortlisted',
    appliedDate: '2026-08-24',
    internshipRole: 'Frontend Developer Intern',
    companyName: 'NexusTech Innovations',
    companyId: 'comp-portal-01',
    resumeFileName: 'Aarav_Sharma_Resume_FY.pdf',
    resumeText: `AARAV SHARMA
Email: aarav.sharma@college.edu | Phone: +91 98765 43210 | GitHub: github.com/aaravsharma
Education: B.Tech in Computer Science & Engineering - GCET (2026 Batch, CGPA: 8.6)
Skills: HTML, CSS, JavaScript, React, C++, SQL, Git, GitHub
Projects:
• Responsive Personal Portfolio - Built with React and Tailwind CSS
• Student Database Management System - Relational DBMS project with SQL schema`,
    projects: [
      { title: 'Responsive Portfolio', description: 'Single-page portfolio in React & Tailwind', technologies: ['React', 'Tailwind CSS', 'JavaScript'] },
      { title: 'Student DBMS', description: 'Relational DB system with SQL', technologies: ['SQL', 'C++'] }
    ],
    experienceHighlights: ['Web Development Club Technical Coordinator at GCET'],
    certifications: ['freeCodeCamp Responsive Web Design', 'HackerRank Problem Solving (Intermediate)'],
    interviewDate: '2026-09-02, 11:00 AM IST',
    dataType: 'DEMO',
    candidateAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'app-3',
    internshipId: 'job-nex-001',
    studentId: 'inst-stud-002',
    studentName: 'Priya Mehta',
    studentEmail: 'priya.mehta@college.edu',
    studentCollege: 'Government College of Engineering & Technology (GCET)',
    studentCourse: 'B.Tech CSE',
    studentDegree: 'B.Tech',
    studentYear: '4th Year (Final)',
    studentCgpa: 9.1,
    studentSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'SQL', 'Docker', 'Git'],
    matchedSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'TypeScript'],
    missingSkills: [],
    matchScore: 94,
    matchExplanation: 'Exceptional match! 100% core technical requirements satisfied with prior 3-month frontend internship.',
    status: 'Interview',
    appliedDate: '2026-08-22',
    internshipRole: 'Frontend Developer Intern',
    companyName: 'NexusTech Innovations',
    companyId: 'comp-portal-01',
    resumeFileName: 'Priya_Mehta_Resume.pdf',
    resumeText: `PRIYA MEHTA
Email: priya.mehta@college.edu | GitHub: github.com/priyamehta | LinkedIn: linkedin.com/in/priyamehta
Education: B.Tech Computer Science - GCET (CGPA: 9.1 / 10)
Skills: React, TypeScript, JavaScript, Node.js, Express.js, MongoDB, SQL, Docker, Git
Experience:
• Frontend Developer Intern at TechNova Labs (3 Months) - Built analytics dashboard with React & TypeScript
Projects:
• E-Commerce Store with Stripe - Full-stack store with real-time checkout
• College Event Management Portal - Scalable event ticketing system`,
    projects: [
      { title: 'E-Commerce Store with Stripe', description: 'Full-stack store with real-time checkout', technologies: ['React', 'Node.js', 'MongoDB'] },
      { title: 'College Event Portal', description: 'Interactive ticketing platform', technologies: ['React', 'TypeScript', 'Tailwind'] }
    ],
    experienceHighlights: ['Frontend Intern at TechNova Labs (3 months)', 'Open Source Contributor to React UI ecosystem'],
    certifications: ['AWS Certified Cloud Practitioner', 'Meta Front-End Developer Professional Certificate'],
    interviewDate: '2026-09-01, 02:30 PM IST',
    dataType: 'DEMO',
    candidateAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'app-4',
    internshipId: 'job-nex-001',
    studentId: 'inst-stud-006',
    studentName: 'Sneha Patil',
    studentEmail: 'sneha.p@college.edu',
    studentCollege: 'Government College of Engineering & Technology (GCET)',
    studentCourse: 'B.Tech IT',
    studentDegree: 'B.Tech',
    studentYear: '3rd Year (TY)',
    studentCgpa: 8.8,
    studentSkills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Tailwind CSS', 'REST APIs', 'Git'],
    matchedSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'TypeScript'],
    missingSkills: [],
    matchScore: 89,
    matchExplanation: 'High qualification match with deep experience in TypeScript, React component libraries, and Tailwind.',
    status: 'Selected',
    appliedDate: '2026-08-20',
    internshipRole: 'Frontend Developer Intern',
    companyName: 'NexusTech Innovations',
    companyId: 'comp-portal-01',
    resumeFileName: 'Sneha_Patil_Resume.pdf',
    resumeText: `SNEHA PATIL
Email: sneha.p@college.edu | GitHub: github.com/snehapatil | Portfolio: sneha-dev.io
Education: B.Tech Information Technology - GCET (CGPA: 8.8)
Skills: React, TypeScript, JavaScript, Tailwind CSS, REST APIs, Git, HTML, CSS
Projects:
• Cloud SaaS Analytics Dashboard - End-to-end dashboard with charts and dark theme
• Interactive Code Sandbox - In-browser code runner using WebWorkers`,
    projects: [
      { title: 'Cloud SaaS Dashboard', description: 'Modern dashboard with charts & filters', technologies: ['React', 'TypeScript', 'Tailwind'] },
      { title: 'Interactive Code Sandbox', description: 'In-browser editor with live rendering', technologies: ['React', 'JavaScript'] }
    ],
    experienceHighlights: ['Hackathon Winner - Smart India Hackathon Internal Round (1st Place)'],
    certifications: ['Frontend Masters React Track', 'freeCodeCamp JavaScript Algorithms'],
    dataType: 'DEMO',
    candidateAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'app-5',
    internshipId: 'job-nex-002',
    studentId: 'inst-stud-004',
    studentName: 'Ananya Verma',
    studentEmail: 'ananya.v@college.edu',
    studentCollege: 'Government College of Engineering & Technology (GCET)',
    studentCourse: 'B.Tech CSE',
    studentDegree: 'B.Tech',
    studentYear: '4th Year (Final)',
    studentCgpa: 8.4,
    studentSkills: ['Node.js', 'Express.js', 'SQL', 'MongoDB', 'REST APIs', 'Git', 'C++', 'JavaScript', 'React'],
    matchedSkills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Git'],
    missingSkills: [],
    matchScore: 86,
    matchExplanation: 'Meets all 6 required full-stack technical competencies with demonstrated API and database architecture.',
    status: 'Under Review',
    appliedDate: '2026-08-23',
    internshipRole: 'Full Stack Engineer Intern (MERN)',
    companyName: 'NexusTech Innovations',
    companyId: 'comp-portal-01',
    resumeFileName: 'Ananya_Verma_Resume.pdf',
    resumeText: `ANANYA VERMA
Email: ananya.v@college.edu | GitHub: github.com/ananyaverma
Education: B.Tech CSE - GCET (CGPA: 8.4)
Skills: Node.js, Express.js, MongoDB, SQL, React, REST APIs, Git, C++
Projects:
• Microservices Auth Server - JWT authentication with rate limiting
• Task Collaboration Engine - Real-time task board with WebSocket sync`,
    projects: [
      { title: 'Microservices Auth Server', description: 'JWT auth with Redis caching', technologies: ['Node.js', 'Express.js', 'MongoDB'] },
      { title: 'Task Collaboration Engine', description: 'Real-time kanban board', technologies: ['React', 'Node.js', 'WebSockets'] }
    ],
    experienceHighlights: ['Backend Engineering Intern at CodeCraft Labs (2 months)'],
    certifications: ['MongoDB Certified Developer', 'Node.js Application Developer'],
    dataType: 'DEMO',
    candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'app-6',
    internshipId: 'job-nex-001',
    studentId: 'inst-stud-003',
    studentName: 'Rohan Deshmukh',
    studentEmail: 'rohan.d@college.edu',
    studentCollege: 'Government College of Engineering & Technology (GCET)',
    studentCourse: 'B.Tech CSE',
    studentDegree: 'B.Tech',
    studentYear: '3rd Year (TY)',
    studentCgpa: 7.8,
    studentSkills: ['HTML', 'CSS', 'JavaScript', 'Git', 'Bootstrap'],
    matchedSkills: ['HTML', 'CSS', 'JavaScript', 'Git'],
    missingSkills: ['React', 'TypeScript'],
    matchScore: 64,
    matchExplanation: 'Solid foundation in HTML/CSS and JavaScript. Currently developing React and TypeScript proficiency.',
    status: 'Applied',
    appliedDate: '2026-08-25',
    internshipRole: 'Frontend Developer Intern',
    companyName: 'NexusTech Innovations',
    companyId: 'comp-portal-01',
    resumeFileName: 'Rohan_Deshmukh_Resume.pdf',
    resumeText: `ROHAN DESHMUKH
Email: rohan.d@college.edu | Phone: +91 91234 56789
Education: B.Tech CSE - 3rd Year - GCET (CGPA: 7.8)
Skills: HTML, CSS, JavaScript, Git, Bootstrap
Projects:
• Personal Blog Website - Semantic HTML5 and responsive CSS grid
• Weather Forecast Application - Consumes OpenWeatherMap API with vanilla JavaScript`,
    projects: [
      { title: 'Personal Blog Website', description: 'Responsive CSS layout', technologies: ['HTML', 'CSS', 'JavaScript'] },
      { title: 'Weather Forecast App', description: 'Vanilla JS API consumer', technologies: ['JavaScript', 'HTML'] }
    ],
    experienceHighlights: ['Active member of GCET Open Source Club'],
    certifications: ['HackerRank JavaScript (Basic)'],
    dataType: 'DEMO',
    candidateAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'app-7',
    internshipId: 'job-nex-001',
    studentId: 'inst-stud-005',
    studentName: 'Vikram Joshi',
    studentEmail: 'vikram.j@college.edu',
    studentCollege: 'Government College of Engineering & Technology (GCET)',
    studentCourse: 'B.Tech CSE',
    studentDegree: 'B.Tech',
    studentYear: '2nd Year (SY)',
    studentCgpa: 6.9,
    studentSkills: ['C++', 'HTML', 'CSS', 'JavaScript'],
    matchedSkills: ['HTML', 'CSS', 'JavaScript'],
    missingSkills: ['React', 'Git', 'TypeScript'],
    matchScore: 45,
    matchExplanation: 'Early-stage student. Needs React framework experience and version control (Git) to meet position benchmark.',
    status: 'Applied',
    appliedDate: '2026-08-26',
    internshipRole: 'Frontend Developer Intern',
    companyName: 'NexusTech Innovations',
    companyId: 'comp-portal-01',
    resumeFileName: 'Vikram_Joshi_Resume.pdf',
    resumeText: `VIKRAM JOSHI
Email: vikram.j@college.edu | Phone: +91 98980 12345
Education: B.Tech CSE - 2nd Year - GCET (CGPA: 6.9)
Skills: C++, Data Structures, HTML, CSS, Basic JavaScript
Projects:
• CLI Calculator in C++
• Static Landing Page for College Fest`,
    projects: [
      { title: 'CLI Calculator', description: 'Command line tool with C++', technologies: ['C++'] },
      { title: 'Fest Landing Page', description: 'Static HTML/CSS website', technologies: ['HTML', 'CSS'] }
    ],
    experienceHighlights: ['Participated in Intra-college coding challenges'],
    certifications: ['C++ Programming Fundamentals'],
    dataType: 'DEMO',
    candidateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'app-2',
    internshipId: 'ncs-nic-01',
    studentId: 'student-01',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@college.edu',
    studentCollege: 'Government College of Engineering & Technology (GCET)',
    studentCourse: 'B.Tech CSE',
    studentDegree: 'B.Tech',
    studentYear: '1st Year (FY)',
    studentCgpa: 8.6,
    studentSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'C++', 'SQL', 'Git', 'GitHub'],
    matchedSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
    missingSkills: [],
    matchScore: 95,
    matchExplanation: '100% core skill match! Meets academic eligibility and possesses all required web development skills.',
    status: 'Under Review',
    appliedDate: '2026-08-25',
    internshipRole: 'Junior Web & Portal Developer Apprentice',
    companyName: 'National Informatics Centre (NIC) / MeitY',
    resumeFileName: 'Aarav_Sharma_Resume_FY.pdf',
    dataType: 'DEMO'
  }
];

export const INITIAL_ROADMAP_FRONTEND: RoadmapMilestone[] = [
  {
    id: 'ms-1',
    weekRange: 'Weeks 1–2',
    title: 'Modern JavaScript (ES6+) & DOM Engineering',
    focus: 'Master Promises, async/await, closures, fetch API, and responsive DOM events',
    skillsToAcquire: ['JavaScript', 'REST APIs', 'Git'],
    actionItems: [
      'Refactor personal portfolio with modular ES6 modules',
      'Build a live Weather & Currency converter consuming public REST API',
      'Publish codebase to GitHub with descriptive semantic commit history'
    ],
    projectToBuild: {
      title: 'Real-Time Crypto & Stock Ticker Dashboard',
      description: 'Single-page JavaScript dashboard fetching live price feeds with search debounce and localStorage persistence.',
      technologies: ['JavaScript', 'HTML', 'CSS', 'REST APIs']
    },
    resources: [
      { title: 'JavaScript.info Complete Guide', platform: 'javascript.info', type: 'Docs' },
      { title: 'Asynchronous JavaScript Deep Dive', platform: 'MDN Web Docs', type: 'Docs' }
    ],
    completed: true
  },
  {
    id: 'ms-2',
    weekRange: 'Weeks 3–4',
    title: 'React Fundamentals & Component Architecture',
    focus: 'Master React JSX, Props, State, Hooks (useState, useEffect, useMemo)',
    skillsToAcquire: ['React', 'Tailwind CSS'],
    actionItems: [
      'Deconstruct complex Figma wireframes into reusable React functional components',
      'Master useEffect for data fetching and side effects without infinite loops',
      'Incorporate Tailwind CSS for responsive utility-first layouts'
    ],
    projectToBuild: {
      title: 'DevCollab Project Matcher',
      description: 'A full-fledged TypeScript React application allowing students to post project ideas and match based on complementary skills.',
      technologies: ['React', 'Tailwind CSS', 'JavaScript']
    },
    resources: [
      { title: 'React Official Documentation (react.dev)', platform: 'React Docs', type: 'Docs' },
      { title: 'Complete React & Hooks Bootcamp', platform: 'freeCodeCamp', type: 'Free Course' }
    ],
    completed: false
  },
  {
    id: 'ms-3',
    weekRange: 'Weeks 5–6',
    title: 'TypeScript for Frontend Scalability',
    focus: 'Static typing, Interfaces, Generics, and strict compiler configs',
    skillsToAcquire: ['TypeScript'],
    actionItems: [
      'Migrate JavaScript React components to typed `.tsx` interfaces',
      'Define strict API payload contracts with TypeScript generic types',
      'Set up ESLint & TypeScript strict null checking'
    ],
    projectToBuild: {
      title: 'TaskFlow Agile Kanban Board',
      description: 'Drag-and-drop interactive Kanban board with column filters and TypeScript type safety.',
      technologies: ['React', 'TypeScript', 'Tailwind CSS']
    },
    resources: [
      { title: 'TypeScript Handbook', platform: 'typescriptlang.org', type: 'Docs' },
      { title: 'Total TypeScript Essentials', platform: 'Matt Pocock Tutorial', type: 'Interactive' }
    ],
    completed: false
  },
  {
    id: 'ms-4',
    weekRange: 'Weeks 7–8',
    title: 'Internship Portfolio, System Polish & Mock Interviews',
    focus: 'Lighthouse 95+ web performance, responsive mobile UX, and interview readiness',
    skillsToAcquire: ['Web Performance', 'REST APIs'],
    actionItems: [
      'Optimize bundle size with code-splitting and dynamic imports',
      'Deploy 3 production-grade capstones on Vercel / Netlify with live demo links',
      'Complete 5 simulated frontend technical interviews on SkillBridge AI Assistant'
    ],
    projectToBuild: {
      title: 'Production Capstone: Cloud SaaS Analytics Dashboard',
      description: 'End-to-end frontend SaaS portal with charts, filter queries, dark/light theme, and 98+ Lighthouse performance.',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'REST APIs']
    },
    resources: [
      { title: 'Web Dev Performance Best Practices', platform: 'web.dev', type: 'Docs' },
      { title: 'Frontend Interview Preparation Kit', platform: 'GreatFrontEnd', type: 'Practice' }
    ],
    completed: false
  }
];

export const COLLEGE_ANALYTICS: CollegeStats = {
  totalStudents: 1420,
  skillReadinessAverage: 78,
  totalInternshipsApplied: 184,
  totalPlaced: 215,
  partnerCompanies: 52,
  studentsBySkill: [
    { skill: 'HTML / CSS', count: 1280, category: 'Frontend' },
    { skill: 'JavaScript', count: 1040, category: 'Frontend' },
    { skill: 'C / C++', count: 1190, category: 'Core CS' },
    { skill: 'SQL', count: 850, category: 'Database' },
    { skill: 'Python', count: 720, category: 'Core CS' },
    { skill: 'React', count: 540, category: 'Frontend' },
    { skill: 'Git / GitHub', count: 890, category: 'DevOps' }
  ],
  mostCommonSkillGaps: [
    {
      skill: 'TypeScript',
      missingPercent: 62,
      category: 'Frontend',
      industryDemand: 'High',
      priority: 'High',
      aiRecommendation: 'Introduce a TypeScript + REST API workshop for 2nd & 3rd year engineering batches.'
    },
    {
      skill: 'Docker',
      missingPercent: 55,
      category: 'DevOps',
      industryDemand: 'High',
      priority: 'High',
      aiRecommendation: 'Deploy hands-on Docker containerization lab modules in cloud infrastructure course.'
    },
    {
      skill: 'REST APIs & Backend Integration',
      missingPercent: 38,
      category: 'Backend',
      industryDemand: 'High',
      priority: 'Medium',
      aiRecommendation: 'Organize a 2-day hands-on Hackathon focused on API server architecture.'
    },
    {
      skill: 'PostgreSQL / SQL Optimization',
      missingPercent: 32,
      category: 'Database',
      industryDemand: 'Medium',
      priority: 'Medium',
      aiRecommendation: 'Add database query indexing and transaction isolation drills to DBMS coursework.'
    }
  ],
  placementStatsByBranch: [
    { branch: 'Computer Science & Engineering', placed: 94, total: 120, avgStipend: '₹24,500/mo' },
    { branch: 'Information Technology', placed: 62, total: 80, avgStipend: '₹22,000/mo' },
    { branch: 'Electronics & Communication', placed: 38, total: 60, avgStipend: '₹18,000/mo' },
    { branch: 'AI & Data Science', placed: 21, total: 30, avgStipend: '₹26,000/mo' }
  ],
  industrySkillTrends: [
    { skill: 'React & Modern Frontend', growth: '+45%', demandLevel: 'Critical' },
    { skill: 'TypeScript & Next.js', growth: '+38%', demandLevel: 'Very High' },
    { skill: 'Python & Generative AI', growth: '+52%', demandLevel: 'Critical' },
    { skill: 'Docker & Cloud Native', growth: '+31%', demandLevel: 'High' }
  ]
};
