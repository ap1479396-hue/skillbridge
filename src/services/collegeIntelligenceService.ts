import {
  InstitutionalStudent,
  DepartmentOverviewData,
  CurriculumVsIndustryGap,
  ReadinessCategory,
  InstitutionInfo,
  DepartmentMetric,
  CorporatePartnerInfo,
  CollegeAdminConfig,
  PlacementPipelineConfig
} from '../types';

export const INSTITUTION_INFO: InstitutionInfo = {
  name: 'Government College of Engineering & Technology (GCET)',
  shortCode: 'GCET',
  academicYear: 'Academic Year 2026–27',
  placementCell: 'Training & Placement Cell (T&P)',
  accreditation: 'NAAC A+ Accredited • AICTE Approved',
  dataType: 'Sample Data'
};

export const DEPARTMENTS = [
  { code: 'ALL', name: 'All Departments' },
  { code: 'CSE', name: 'Computer Science & Engineering' },
  { code: 'IT', name: 'Information Technology' },
  { code: 'AI-DS', name: 'AI & Data Science' },
  { code: 'ECE', name: 'Electronics & Communication' },
  { code: 'MECH', name: 'Mechanical Engineering' },
  { code: 'CIVIL', name: 'Civil Engineering' }
];

export const ACADEMIC_YEARS = [
  { code: 'ALL', name: 'All Batches / Years' },
  { code: '1st Year (FY)', name: '1st Year (FY) - 2026 Batch' },
  { code: '2nd Year (SY)', name: '2nd Year (SY) - 2025 Batch' },
  { code: '3rd Year (TY)', name: '3rd Year (TY) - 2024 Batch' },
  { code: '4th Year (Final)', name: '4th Year (Final) - 2023 Batch' }
];

export const TARGET_ROLES = [
  { id: 'ALL', title: 'All Target Roles' },
  { id: 'frontend-dev', title: 'Frontend Developer' },
  { id: 'fullstack-dev', title: 'Full Stack Developer (MERN)' },
  { id: 'backend-dev', title: 'Backend Developer' },
  { id: 'ai-ml-engineer', title: 'AI / Machine Learning Engineer' },
  { id: 'devops-cloud', title: 'DevOps & Cloud Engineer' },
  { id: 'embedded-systems', title: 'Embedded & IoT Systems' }
];

// Rich deterministic student pool for institutional drill-downs
export const INSTITUTIONAL_STUDENTS: InstitutionalStudent[] = [
  {
    id: 'inst-stud-001',
    rollNumber: 'GCET-2023-CSE-014',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    department: 'CSE',
    year: '1st Year (FY)',
    section: 'A',
    cgpa: 8.6,
    careerTarget: 'Frontend Developer',
    readinessPercentage: 82,
    readinessCategory: 'Placement Ready',
    verifiedSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'C++', 'SQL', 'Git', 'GitHub'],
    missingSkills: ['TypeScript', 'REST APIs'],
    primarySkillGap: 'TypeScript',
    projectsCount: 2,
    resumeStatus: 'Verified & Active',
    internshipStatus: 'Interviewing',
    placementStatus: 'Seeking',
    dataType: 'DEMO'
  },
  {
    id: 'inst-stud-002',
    rollNumber: 'GCET-2023-CSE-028',
    name: 'Priya Mehta',
    email: 'priya.mehta@college.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'CSE',
    year: '4th Year (Final)',
    section: 'A',
    cgpa: 9.1,
    careerTarget: 'Full Stack Developer (MERN)',
    readinessPercentage: 92,
    readinessCategory: 'Placement Ready',
    verifiedSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'SQL', 'Docker', 'Git'],
    missingSkills: ['Kubernetes'],
    primarySkillGap: 'Kubernetes',
    projectsCount: 4,
    resumeStatus: 'Verified & Active',
    internshipStatus: 'Offer Received',
    placementStatus: 'Pre-Placement Offer (PPO)',
    placedCompany: 'NexusTech Innovations',
    stipendOrPackage: '₹14.5 LPA (PPO)',
    dataType: 'DEMO'
  },
  {
    id: 'inst-stud-003',
    rollNumber: 'GCET-2023-CSE-045',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@college.edu',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    department: 'CSE',
    year: '3rd Year (TY)',
    section: 'B',
    cgpa: 7.8,
    careerTarget: 'Frontend Developer',
    readinessPercentage: 68,
    readinessCategory: 'Almost Ready',
    verifiedSkills: ['HTML', 'CSS', 'JavaScript', 'Git'],
    missingSkills: ['React', 'TypeScript', 'Tailwind CSS'],
    primarySkillGap: 'React',
    projectsCount: 1,
    resumeStatus: 'Verified & Active',
    internshipStatus: 'Applied',
    placementStatus: 'Seeking',
    dataType: 'DEMO'
  },
  {
    id: 'inst-stud-004',
    rollNumber: 'GCET-2023-CSE-061',
    name: 'Ananya Verma',
    email: 'ananya.v@college.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'CSE',
    year: '4th Year (Final)',
    section: 'A',
    cgpa: 8.4,
    careerTarget: 'Backend Developer',
    readinessPercentage: 88,
    readinessCategory: 'Placement Ready',
    verifiedSkills: ['Node.js', 'Express.js', 'SQL', 'MongoDB', 'REST APIs', 'Git', 'C++'],
    missingSkills: ['Docker', 'AWS'],
    primarySkillGap: 'Docker',
    projectsCount: 3,
    resumeStatus: 'Verified & Active',
    internshipStatus: 'Currently Interning',
    placementStatus: 'Placed',
    placedCompany: 'FinTech Cloud Labs',
    stipendOrPackage: '₹12 LPA',
    dataType: 'DEMO'
  },
  {
    id: 'inst-stud-005',
    rollNumber: 'GCET-2023-CSE-089',
    name: 'Vikram Joshi',
    email: 'vikram.j@college.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'CSE',
    year: '2nd Year (SY)',
    section: 'B',
    cgpa: 6.9,
    careerTarget: 'Frontend Developer',
    readinessPercentage: 48,
    readinessCategory: 'Needs Improvement',
    verifiedSkills: ['C++', 'HTML', 'CSS'],
    missingSkills: ['JavaScript', 'React', 'Git', 'REST APIs'],
    primarySkillGap: 'JavaScript',
    projectsCount: 1,
    resumeStatus: 'Draft',
    internshipStatus: 'Not Started',
    placementStatus: 'Seeking',
    dataType: 'DEMO'
  },
  {
    id: 'inst-stud-006',
    rollNumber: 'GCET-2023-CSE-112',
    name: 'Sneha Kulkarni',
    email: 'sneha.k@college.edu',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    department: 'CSE',
    year: '4th Year (Final)',
    section: 'B',
    cgpa: 6.2,
    careerTarget: 'Backend Developer',
    readinessPercentage: 38,
    readinessCategory: 'At Risk',
    verifiedSkills: ['C++', 'DBMS Basics'],
    missingSkills: ['Node.js', 'SQL', 'REST APIs', 'Git', 'Express.js'],
    primarySkillGap: 'REST APIs & Node.js',
    projectsCount: 0,
    resumeStatus: 'Missing',
    internshipStatus: 'Not Started',
    placementStatus: 'Seeking',
    dataType: 'DEMO'
  },
  {
    id: 'inst-stud-007',
    rollNumber: 'GCET-2023-IT-008',
    name: 'Karan Patel',
    email: 'karan.p@college.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'IT',
    year: '4th Year (Final)',
    section: 'A',
    cgpa: 8.8,
    careerTarget: 'DevOps & Cloud Engineer',
    readinessPercentage: 86,
    readinessCategory: 'Placement Ready',
    verifiedSkills: ['Linux', 'Docker', 'Git', 'AWS Basics', 'Python', 'CI/CD Pipelines', 'SQL'],
    missingSkills: ['Kubernetes', 'Terraform'],
    primarySkillGap: 'Kubernetes',
    projectsCount: 3,
    resumeStatus: 'Verified & Active',
    internshipStatus: 'Currently Interning',
    placementStatus: 'Placed',
    placedCompany: 'InfraScale Systems',
    stipendOrPackage: '₹13 LPA',
    dataType: 'DEMO'
  },
  {
    id: 'inst-stud-008',
    rollNumber: 'GCET-2023-IT-034',
    name: 'Meera Iyer',
    email: 'meera.i@college.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    department: 'IT',
    year: '3rd Year (TY)',
    section: 'A',
    cgpa: 8.2,
    careerTarget: 'Full Stack Developer (MERN)',
    readinessPercentage: 74,
    readinessCategory: 'Almost Ready',
    verifiedSkills: ['JavaScript', 'React', 'HTML', 'CSS', 'Node.js', 'Git'],
    missingSkills: ['MongoDB', 'TypeScript', 'Express.js'],
    primarySkillGap: 'MongoDB',
    projectsCount: 2,
    resumeStatus: 'Verified & Active',
    internshipStatus: 'Applied',
    placementStatus: 'Seeking',
    dataType: 'DEMO'
  },
  {
    id: 'inst-stud-009',
    rollNumber: 'GCET-2023-IT-056',
    name: 'Siddharth Nair',
    email: 'siddharth.n@college.edu',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    department: 'IT',
    year: '2nd Year (SY)',
    section: 'A',
    cgpa: 7.1,
    careerTarget: 'Frontend Developer',
    readinessPercentage: 55,
    readinessCategory: 'Needs Improvement',
    verifiedSkills: ['HTML', 'CSS', 'JavaScript', 'Git'],
    missingSkills: ['React', 'TypeScript', 'Tailwind CSS'],
    primarySkillGap: 'React',
    projectsCount: 1,
    resumeStatus: 'Draft',
    internshipStatus: 'Not Started',
    placementStatus: 'Seeking',
    dataType: 'DEMO'
  },
  {
    id: 'inst-stud-010',
    rollNumber: 'GCET-2023-AIDS-012',
    name: 'Tanvi Saxena',
    email: 'tanvi.s@college.edu',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    department: 'AI-DS',
    year: '4th Year (Final)',
    section: 'A',
    cgpa: 9.3,
    careerTarget: 'AI / Machine Learning Engineer',
    readinessPercentage: 94,
    readinessCategory: 'Placement Ready',
    verifiedSkills: ['Python', 'NumPy & Pandas', 'Machine Learning', 'Deep Learning', 'SQL', 'Git', 'PyTorch'],
    missingSkills: ['MLOps & Docker'],
    primarySkillGap: 'MLOps',
    projectsCount: 4,
    resumeStatus: 'Verified & Active',
    internshipStatus: 'Currently Interning',
    placementStatus: 'Placed',
    placedCompany: 'DeepVision AI Labs',
    stipendOrPackage: '₹18 LPA',
    dataType: 'DEMO'
  },
  {
    id: 'inst-stud-011',
    rollNumber: 'GCET-2023-AIDS-029',
    name: 'Arjun Singhal',
    email: 'arjun.s@college.edu',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    department: 'AI-DS',
    year: '3rd Year (TY)',
    section: 'A',
    cgpa: 7.9,
    careerTarget: 'AI / Machine Learning Engineer',
    readinessPercentage: 70,
    readinessCategory: 'Almost Ready',
    verifiedSkills: ['Python', 'NumPy & Pandas', 'SQL', 'Git'],
    missingSkills: ['Machine Learning Models', 'Deep Learning'],
    primarySkillGap: 'Machine Learning',
    projectsCount: 2,
    resumeStatus: 'Verified & Active',
    internshipStatus: 'Applied',
    placementStatus: 'Seeking',
    dataType: 'DEMO'
  },
  {
    id: 'inst-stud-012',
    rollNumber: 'GCET-2023-ECE-019',
    name: 'Rahul Sen',
    email: 'rahul.s@college.edu',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    department: 'ECE',
    year: '4th Year (Final)',
    section: 'A',
    cgpa: 8.1,
    careerTarget: 'Embedded & IoT Systems',
    readinessPercentage: 80,
    readinessCategory: 'Placement Ready',
    verifiedSkills: ['C', 'C++', 'Microcontrollers', 'Embedded C', 'IoT Protocols', 'Git'],
    missingSkills: ['RTOS', 'PCB Design'],
    primarySkillGap: 'RTOS',
    projectsCount: 3,
    resumeStatus: 'Verified & Active',
    internshipStatus: 'Offer Received',
    placementStatus: 'Placed',
    placedCompany: 'Semicon Devices India',
    stipendOrPackage: '₹9.5 LPA',
    dataType: 'DEMO'
  },
  {
    id: 'inst-stud-013',
    rollNumber: 'GCET-2023-ECE-044',
    name: 'Divya Rao',
    email: 'divya.r@college.edu',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    department: 'ECE',
    year: '3rd Year (TY)',
    section: 'B',
    cgpa: 7.2,
    careerTarget: 'Embedded & IoT Systems',
    readinessPercentage: 62,
    readinessCategory: 'Needs Improvement',
    verifiedSkills: ['C', 'Basic Electronics', 'Arduino'],
    missingSkills: ['Embedded C', 'ARM Cortex', 'IoT Protocols'],
    primarySkillGap: 'Embedded C',
    projectsCount: 1,
    resumeStatus: 'Verified & Active',
    internshipStatus: 'Applied',
    placementStatus: 'Seeking',
    dataType: 'DEMO'
  },
  {
    id: 'inst-stud-014',
    rollNumber: 'GCET-2023-MECH-015',
    name: 'Aditya Patil',
    email: 'aditya.p@college.edu',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    department: 'MECH',
    year: '4th Year (Final)',
    section: 'A',
    cgpa: 7.9,
    careerTarget: 'Mechanical CAD/CAM & Automation',
    readinessPercentage: 72,
    readinessCategory: 'Almost Ready',
    verifiedSkills: ['AutoCAD', 'SolidWorks', 'ANSYS', 'Engineering Thermodynamics', 'Python for Eng'],
    missingSkills: ['GD&T', 'Industrial IoT'],
    primarySkillGap: 'GD&T',
    projectsCount: 2,
    resumeStatus: 'Verified & Active',
    internshipStatus: 'Currently Interning',
    placementStatus: 'Placed',
    placedCompany: 'Thermax Industries',
    stipendOrPackage: '₹7.5 LPA',
    dataType: 'DEMO'
  },
  {
    id: 'inst-stud-015',
    rollNumber: 'GCET-2023-CIVIL-022',
    name: 'Pooja Hegde',
    email: 'pooja.h@college.edu',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
    department: 'CIVIL',
    year: '4th Year (Final)',
    section: 'A',
    cgpa: 7.6,
    careerTarget: 'Structural Analysis & BIM',
    readinessPercentage: 66,
    readinessCategory: 'Almost Ready',
    verifiedSkills: ['AutoCAD Civil', 'STAAD.Pro', 'Surveying', 'Revit BIM'],
    missingSkills: ['ETABS', 'Project Estimation (MSP)'],
    primarySkillGap: 'ETABS',
    projectsCount: 2,
    resumeStatus: 'Verified & Active',
    internshipStatus: 'Currently Interning',
    placementStatus: 'Placed',
    placedCompany: 'L&T Infrastructure',
    stipendOrPackage: '₹7.2 LPA',
    dataType: 'DEMO'
  }
];

// Department Baseline Aggregates (Used for cohort math)
export const DEPARTMENT_BASELINES: Record<
  string,
  {
    code: string;
    name: string;
    totalStudents: number;
    avgReadiness: number;
    placementRate: number;
    internshipRate: number;
    placedCount: number;
    interningCount: number;
    majorGap: string;
    skillGaps: { skill: string; missingPercent: number; category: string; priority: string; industryDemand: string; recommendation: string }[];
  }
> = {
  CSE: {
    code: 'CSE',
    name: 'Computer Science & Engineering',
    totalStudents: 420,
    avgReadiness: 82,
    placementRate: 76,
    internshipRate: 84,
    placedCount: 88, // out of 115 eligible final year
    interningCount: 96,
    majorGap: 'TypeScript & Cloud Native',
    skillGaps: [
      { skill: 'TypeScript', missingPercent: 62, category: 'Frontend', priority: 'High', industryDemand: 'High', recommendation: 'Conduct TypeScript + React hands-on bootcamp.' },
      { skill: 'Docker & Containers', missingPercent: 55, category: 'DevOps', priority: 'High', industryDemand: 'High', recommendation: 'Add containerization labs to cloud course.' },
      { skill: 'REST API Security', missingPercent: 38, category: 'Backend', priority: 'Medium', industryDemand: 'High', recommendation: 'Organize API contract design workshop.' },
      { skill: 'Data Structures & Algorithms (Advanced)', missingPercent: 32, category: 'Core CS', priority: 'High', industryDemand: 'Critical', recommendation: 'Weekly coding challenge series on LeetCode/CodeChef.' }
    ]
  },
  IT: {
    code: 'IT',
    name: 'Information Technology',
    totalStudents: 280,
    avgReadiness: 78,
    placementRate: 71,
    internshipRate: 78,
    placedCount: 57,
    interningCount: 62,
    majorGap: 'Docker & Kubernetes',
    skillGaps: [
      { skill: 'Docker & Cloud Native', missingPercent: 58, category: 'DevOps', priority: 'High', industryDemand: 'High', recommendation: 'Introduce AWS/GCP cloud labs.' },
      { skill: 'React & State Management', missingPercent: 44, category: 'Frontend', priority: 'High', industryDemand: 'High', recommendation: 'React.js project-based coursework.' },
      { skill: 'PostgreSQL Optimization', missingPercent: 36, category: 'Database', priority: 'Medium', industryDemand: 'Medium', recommendation: 'DB indexing and query plan drills.' }
    ]
  },
  'AI-DS': {
    code: 'AI-DS',
    name: 'AI & Data Science',
    totalStudents: 180,
    avgReadiness: 84,
    placementRate: 80,
    internshipRate: 88,
    placedCount: 38,
    interningCount: 42,
    majorGap: 'MLOps & LLM Deployment',
    skillGaps: [
      { skill: 'MLOps & Model Serving', missingPercent: 65, category: 'AI/ML', priority: 'High', industryDemand: 'Critical', recommendation: 'Deploy FastAPIs with ONNX/TorchServe.' },
      { skill: 'Generative AI & LLM Agents', missingPercent: 48, category: 'AI/ML', priority: 'High', industryDemand: 'Critical', recommendation: 'Conduct Gemini / LangChain application sprint.' },
      { skill: 'PyTorch Advanced', missingPercent: 40, category: 'AI/ML', priority: 'Medium', industryDemand: 'High', recommendation: 'Hands-on Transformer architecture labs.' }
    ]
  },
  ECE: {
    code: 'ECE',
    name: 'Electronics & Communication',
    totalStudents: 350,
    avgReadiness: 69,
    placementRate: 62,
    internshipRate: 68,
    placedCount: 48,
    interningCount: 54,
    majorGap: 'RTOS & Embedded C',
    skillGaps: [
      { skill: 'RTOS (FreeRTOS)', missingPercent: 68, category: 'Embedded', priority: 'High', industryDemand: 'High', recommendation: 'STM32 / ESP32 FreeRTOS practical module.' },
      { skill: 'Embedded Linux', missingPercent: 60, category: 'Embedded', priority: 'High', industryDemand: 'High', recommendation: 'Raspberry Pi / Yocto Linux workshops.' },
      { skill: 'Verilog / VLSI Design', missingPercent: 45, category: 'Hardware', priority: 'Medium', industryDemand: 'High', recommendation: 'FPGA hardware description drills.' }
    ]
  },
  MECH: {
    code: 'MECH',
    name: 'Mechanical Engineering',
    totalStudents: 370,
    avgReadiness: 61,
    placementRate: 54,
    internshipRate: 58,
    placedCount: 42,
    interningCount: 46,
    majorGap: 'GD&T and Industrial IoT',
    skillGaps: [
      { skill: 'GD&T (Geometric Dimensioning)', missingPercent: 64, category: 'Design', priority: 'High', industryDemand: 'High', recommendation: 'Standard ASME Y14.5 drawing certification.' },
      { skill: 'Industrial IoT & Automation', missingPercent: 58, category: 'Automation', priority: 'High', industryDemand: 'Medium', recommendation: 'PLC / SCADA lab integration.' },
      { skill: 'Python for Simulation', missingPercent: 50, category: 'Programming', priority: 'Medium', industryDemand: 'Medium', recommendation: 'Numerical computing for mechanical analysis.' }
    ]
  },
  CIVIL: {
    code: 'CIVIL',
    name: 'Civil Engineering',
    totalStudents: 220,
    avgReadiness: 58,
    placementRate: 51,
    internshipRate: 55,
    placedCount: 26,
    interningCount: 28,
    majorGap: 'BIM & Structural Simulation',
    skillGaps: [
      { skill: 'Revit BIM & Navisworks', missingPercent: 66, category: 'Design', priority: 'High', industryDemand: 'High', recommendation: 'Introduce 3D BIM coordination elective.' },
      { skill: 'ETABS & Dynamic Loading', missingPercent: 54, category: 'Structures', priority: 'High', industryDemand: 'High', recommendation: 'Earthquake-resistant design labs.' },
      { skill: 'GIS & Drone Surveying', missingPercent: 46, category: 'Survey', priority: 'Medium', industryDemand: 'Medium', recommendation: 'QGIS spatial analysis training.' }
    ]
  }
};

// Curriculum vs Industry Demand Alignment Data (SIH Problem 26044 Core Feature)
export const CURRICULUM_VS_INDUSTRY_GAPS: CurriculumVsIndustryGap[] = [
  {
    domain: 'Web Application Engineering',
    academicSubject: 'Web Technologies & Internet Programming (Semester 4/5)',
    academicSkills: ['HTML 4/5', 'Basic CSS', 'Vanilla JavaScript (ES5)', 'PHP', 'MySQL', 'Apache XML'],
    industryDemandedSkills: ['React.js / Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js / Express', 'REST APIs', 'Cloud Deployment'],
    gapSeverity: 'High',
    gapPercentage: 68,
    missingTech: ['TypeScript', 'React.js', 'Modern Node/REST APIs', 'Docker Containers'],
    institutionalRecommendation: 'Modernize Web Tech syllabus to replace PHP/Apache with React + TypeScript full-stack stack and modern REST APIs.',
    actionType: 'Curriculum Elective',
    dataType: 'DEMO'
  },
  {
    domain: 'Software Architecture & Cloud Native',
    academicSubject: 'Operating Systems & Distributed Systems (Semester 4/6)',
    academicSkills: ['Process Scheduling', 'Deadlocks', 'POSIX Threads', 'Paging & Virtual Memory', 'C Socket Programming'],
    industryDemandedSkills: ['Docker Containerization', 'Kubernetes Orchestration', 'Microservices Architecture', 'CI/CD Pipelines', 'AWS/GCP Basics'],
    gapSeverity: 'High',
    gapPercentage: 62,
    missingTech: ['Docker', 'Kubernetes', 'CI/CD Actions', 'Microservices'],
    institutionalRecommendation: 'Establish a hands-on Cloud Native Lab module where students containerize multi-service applications using Docker.',
    actionType: 'Lab Module',
    dataType: 'DEMO'
  },
  {
    domain: 'Database Engineering & Modern Data Stores',
    academicSubject: 'Database Management Systems (Semester 3/4)',
    academicSkills: ['Relational Algebra', 'ER Diagrams', 'Basic SQL DDL/DML', 'B-Trees', 'Normalization up to 3NF/BCNF'],
    industryDemandedSkills: ['PostgreSQL Indexing & Optimization', 'NoSQL (MongoDB / Redis)', 'ORM / Prisma', 'Vector Databases', 'Connection Pooling'],
    gapSeverity: 'Medium',
    gapPercentage: 42,
    missingTech: ['NoSQL / MongoDB', 'Redis Caching', 'Query Performance Tuning', 'Prisma ORM'],
    institutionalRecommendation: 'Introduce a 2-week module on NoSQL databases (MongoDB) and SQL query plan profiling into DBMS coursework.',
    actionType: 'Workshop',
    dataType: 'DEMO'
  },
  {
    domain: 'Artificial Intelligence & Machine Learning',
    academicSubject: 'Artificial Intelligence & Soft Computing (Semester 6/7)',
    academicSkills: ['A* Search', 'Minimax Algorithm', 'Expert Systems', 'Basic Perceptrons', 'Fuzzy Logic'],
    industryDemandedSkills: ['Python (NumPy/Pandas)', 'Scikit-Learn Regression & Classification', 'PyTorch / TensorFlow Deep Learning', 'LLM Agents & APIs', 'MLOps'],
    gapSeverity: 'High',
    gapPercentage: 74,
    missingTech: ['PyTorch', 'Transformer Models', 'LLM API Integration', 'MLOps Model Serving'],
    institutionalRecommendation: 'Replace legacy Prolog/Fuzzy logic syllabus with Python-first deep learning and LLM engineering tracks.',
    actionType: 'Curriculum Elective',
    dataType: 'DEMO'
  },
  {
    domain: 'Embedded Systems & IoT',
    academicSubject: 'Microprocessors & Microcontrollers (Semester 5)',
    academicSkills: ['8085 / 8086 Assembly', '8051 Architecture', 'Assembly Instructions', 'Interfacing 8255 PPI'],
    industryDemandedSkills: ['ARM Cortex-M', 'STM32 / ESP32', 'FreeRTOS Real-Time OS', 'Embedded C / Modern C++', 'MQTT / BLE IoT Protocols'],
    gapSeverity: 'High',
    gapPercentage: 70,
    missingTech: ['ARM Cortex-M', 'FreeRTOS', 'Embedded C', 'IoT Protocols (MQTT)'],
    institutionalRecommendation: 'Upgrade hardware lab equipment from legacy 8085/8051 kits to modern 32-bit ARM Cortex / ESP32 development boards.',
    actionType: 'Lab Module',
    dataType: 'DEMO'
  }
];

export const CORPORATE_PARTNER_INFO: CorporatePartnerInfo = {
  totalPartners: 52,
  activeHiringPartners: 34,
  internshipPartners: 46,
  newPartnersThisYear: 14,
  topHiringRoles: [
    'Frontend Developer (React / TS)',
    'Full Stack Engineer (MERN)',
    'Backend Engineer (Node/Python)',
    'DevOps / Cloud Apprentice',
    'AI / ML Research Intern'
  ],
  dataType: 'Sample Data'
};

export const DEFAULT_PLACEMENT_PIPELINE: PlacementPipelineConfig = {
  internshipApplications: 890,
  placementOffers: 486,
  averagePackage: '7.8 LPA',
  highestPackage: '34.5 LPA',
  placementRateBenchmark: 76,
  activePlacementDrives: 28,
  dataType: 'Sample Data'
};

export const DEFAULT_COLLEGE_CONFIG: CollegeAdminConfig = {
  institution: { ...INSTITUTION_INFO },
  departments: { ...DEPARTMENT_BASELINES },
  corporatePartners: { ...CORPORATE_PARTNER_INFO },
  placementPipeline: { ...DEFAULT_PLACEMENT_PIPELINE },
  internshipApplicationsOverride: 890,
  isCustomized: false
};

/**
 * Filter and compute institutional metrics dynamically with mathematical consistency.
 */
export function getInstitutionalAnalytics(
  params?: {
    department?: string;
    year?: string;
    targetRole?: string;
  },
  config?: CollegeAdminConfig
) {
  const deptFilter = params?.department || 'ALL';
  const yearFilter = params?.year || 'ALL';
  const roleFilter = params?.targetRole || 'ALL';

  const currentInstitution = config?.institution || INSTITUTION_INFO;
  const currentDepartments = config?.departments || DEPARTMENT_BASELINES;
  const currentCorporatePartners = config?.corporatePartners || CORPORATE_PARTNER_INFO;

  // 1. Filter students from pool
  let filteredStudents = INSTITUTIONAL_STUDENTS;
  if (deptFilter !== 'ALL') {
    filteredStudents = filteredStudents.filter((s) => s.department === deptFilter);
  }
  if (yearFilter !== 'ALL') {
    filteredStudents = filteredStudents.filter((s) => s.year === yearFilter);
  }
  if (roleFilter !== 'ALL') {
    filteredStudents = filteredStudents.filter(
      (s) => s.careerTarget.toLowerCase().includes(roleFilter.toLowerCase()) || roleFilter === 'ALL'
    );
  }

  // 2. Compute aggregate department totals
  let totalStudents = 0;
  let totalPlaced = 0;
  let totalInterning = 0;
  let weightedReadinessSum = 0;

  const relevantDepts = deptFilter === 'ALL' ? Object.keys(currentDepartments) : [deptFilter];

  relevantDepts.forEach((dKey) => {
    const base = currentDepartments[dKey] || DEPARTMENT_BASELINES[dKey];
    if (!base) return;

    // Apply year multiplier if filtered by year
    const yearMultiplier = yearFilter === 'ALL' ? 1 : 0.25;
    const deptStudents = Math.round(base.totalStudents * yearMultiplier);
    const deptPlaced = Math.round(base.placedCount * (yearFilter === '4th Year (Final)' ? 1 : yearFilter === 'ALL' ? 1 : 0.1));
    const deptInterning = Math.round(base.interningCount * (yearFilter === 'ALL' ? 1 : yearFilter === '1st Year (FY)' ? 0.2 : 0.6));

    totalStudents += deptStudents;
    totalPlaced += deptPlaced;
    totalInterning += deptInterning;
    weightedReadinessSum += base.avgReadiness * deptStudents;
  });

  const avgReadiness = totalStudents > 0 ? Math.round(weightedReadinessSum / totalStudents) : 76;
  const placementRate = totalStudents > 0 ? Math.min(100, Math.round((totalPlaced / Math.max(1, Math.round(totalStudents * 0.3))) * 100)) : 72;

  // 3. Compute readiness breakdown categories
  const readyStudents = filteredStudents.filter((s) => s.readinessPercentage >= 80);
  const almostStudents = filteredStudents.filter((s) => s.readinessPercentage >= 65 && s.readinessPercentage < 80);
  const needsImprovementStudents = filteredStudents.filter((s) => s.readinessPercentage >= 45 && s.readinessPercentage < 65);
  const atRiskStudents = filteredStudents.filter((s) => s.readinessPercentage < 45);

  const sampleTotal = Math.max(1, filteredStudents.length);
  const scaleToCohort = (count: number) => {
    if (totalStudents === 0) return 0;
    return Math.round((count / sampleTotal) * totalStudents);
  };

  const readinessBuckets = {
    placementReady: {
      category: 'Placement Ready' as ReadinessCategory,
      count: scaleToCohort(readyStudents.length),
      percent: Math.round((readyStudents.length / sampleTotal) * 100),
      students: readyStudents
    },
    almostReady: {
      category: 'Almost Ready' as ReadinessCategory,
      count: scaleToCohort(almostStudents.length),
      percent: Math.round((almostStudents.length / sampleTotal) * 100),
      students: almostStudents
    },
    needsImprovement: {
      category: 'Needs Improvement' as ReadinessCategory,
      count: scaleToCohort(needsImprovementStudents.length),
      percent: Math.round((needsImprovementStudents.length / sampleTotal) * 100),
      students: needsImprovementStudents
    },
    atRisk: {
      category: 'At Risk' as ReadinessCategory,
      count: scaleToCohort(atRiskStudents.length),
      percent: Math.round((atRiskStudents.length / sampleTotal) * 100),
      students: atRiskStudents
    }
  };

  // 4. Department summary table rows
  const departmentOverviews: DepartmentOverviewData[] = Object.values(currentDepartments).map((b) => ({
    department: b.code,
    departmentName: b.name,
    totalStudents: b.totalStudents,
    readinessAverage: b.avgReadiness,
    placementPercentage: b.placementRate,
    internshipParticipationPercentage: b.internshipRate,
    majorSkillGap: b.majorGap,
    placedCount: b.placedCount,
    interningCount: b.interningCount,
    activeOpportunitiesCount: Math.round(b.totalStudents * 0.18),
    dataType: config?.isCustomized ? 'VERIFIED' : 'DEMO'
  }));

  // 5. Compute institutional skill gaps for filtered view
  let computedGaps: { skill: string; missingPercent: number; category: string; priority: string; industryDemand: string; recommendation: string }[] = [];
  if (deptFilter !== 'ALL' && currentDepartments[deptFilter]?.skillGaps) {
    computedGaps = currentDepartments[deptFilter].skillGaps || [];
  } else if (deptFilter !== 'ALL' && DEPARTMENT_BASELINES[deptFilter]?.skillGaps) {
    computedGaps = DEPARTMENT_BASELINES[deptFilter].skillGaps;
  } else {
    // Aggregated top skill gaps across institution
    computedGaps = [
      {
        skill: 'TypeScript & Type Systems',
        missingPercent: 62,
        category: 'Frontend',
        priority: 'High',
        industryDemand: 'High',
        recommendation: 'Incorporate TypeScript in 2nd & 3rd year Web Technology and Frontend electives.'
      },
      {
        skill: 'Docker & Containerization',
        missingPercent: 55,
        category: 'DevOps',
        priority: 'High',
        industryDemand: 'High',
        recommendation: 'Deploy hands-on Docker container labs in Cloud & OS coursework.'
      },
      {
        skill: 'REST APIs & Backend Architecture',
        missingPercent: 38,
        category: 'Backend',
        priority: 'Medium',
        industryDemand: 'High',
        recommendation: 'Conduct a weekend 48-hour API design hackathon for all engineering branches.'
      },
      {
        skill: 'Data Structures & Algorithms',
        missingPercent: 34,
        category: 'Core CS',
        priority: 'High',
        industryDemand: 'Critical',
        recommendation: 'Introduce competitive coding training and live coding assessments.'
      },
      {
        skill: 'PostgreSQL / SQL Optimization',
        missingPercent: 32,
        category: 'Database',
        priority: 'Medium',
        industryDemand: 'Medium',
        recommendation: 'Add query indexing, execution plans, and transaction isolation drills to DBMS.'
      }
    ];
  }

  // 6. Placement Funnel Metrics
  const fullOrgStudents = Object.values(currentDepartments).reduce((acc, d) => acc + d.totalStudents, 0);
  const eligiblePlacement = Math.round(totalStudents * (yearFilter === '4th Year (Final)' ? 0.95 : yearFilter === 'ALL' ? 0.28 : 0.15));
  const pipelineConfig = config?.placementPipeline || DEFAULT_PLACEMENT_PIPELINE;
  const configuredOffers = config?.placementPipeline?.placementOffers !== undefined
    ? Math.round(config.placementPipeline.placementOffers * (deptFilter === 'ALL' && yearFilter === 'ALL' ? 1 : Math.max(0.1, totalStudents / Math.max(1, fullOrgStudents))))
    : totalPlaced;
  const placementRateVal = config?.placementPipeline?.placementRateBenchmark !== undefined && config.isCustomized
    ? config.placementPipeline.placementRateBenchmark
    : eligiblePlacement > 0 ? Math.min(100, Math.round((totalPlaced / eligiblePlacement) * 100)) : 76;

  const placementFunnel = {
    eligible: eligiblePlacement,
    applied: Math.round(eligiblePlacement * 0.88),
    interviewing: Math.round(eligiblePlacement * 0.65),
    offersReceived: configuredOffers,
    placed: totalPlaced,
    placementRate: placementRateVal,
    averagePackage: pipelineConfig.averagePackage || '7.8 LPA',
    highestPackage: pipelineConfig.highestPackage || '34.5 LPA',
    activeDrives: pipelineConfig.activePlacementDrives || 28,
    dataType: config?.isCustomized ? ('Custom' as const) : ('Sample Data' as const)
  };

  // 7. Internship Pipeline Metrics
  const eligibleInternship = Math.round(totalStudents * (yearFilter === '1st Year (FY)' ? 0.4 : 0.85));
  const ratio = fullOrgStudents > 0 ? totalStudents / fullOrgStudents : 1;
  const baseApplications = config?.placementPipeline?.internshipApplications !== undefined
    ? config.placementPipeline.internshipApplications
    : (config?.internshipApplicationsOverride !== undefined ? config.internshipApplicationsOverride : 890);
  const calculatedApplications = Math.round(
    baseApplications * (deptFilter === 'ALL' && yearFilter === 'ALL' ? 1 : Math.max(0.1, ratio))
  );

  const internshipFunnel = {
    eligible: eligibleInternship,
    applications: calculatedApplications,
    interviews: Math.round(calculatedApplications * 0.62),
    selected: totalInterning,
    currentlyInterning: totalInterning,
    participationRate: eligibleInternship > 0 ? Math.round((totalInterning / eligibleInternship) * 100) : 68
  };

  // 8. Skill Distribution for chart
  const skillDistribution = [
    { skill: 'HTML / CSS', count: Math.round(totalStudents * 0.88), category: 'Frontend' },
    { skill: 'C / C++', count: Math.round(totalStudents * 0.82), category: 'Core CS' },
    { skill: 'JavaScript', count: Math.round(totalStudents * 0.72), category: 'Frontend' },
    { skill: 'SQL & DBMS', count: Math.round(totalStudents * 0.61), category: 'Database' },
    { skill: 'Git & GitHub', count: Math.round(totalStudents * 0.59), category: 'DevOps' },
    { skill: 'Python', count: Math.round(totalStudents * 0.52), category: 'Core CS' },
    { skill: 'React', count: Math.round(totalStudents * 0.38), category: 'Frontend' },
    { skill: 'Docker', count: Math.round(totalStudents * 0.24), category: 'DevOps' },
    { skill: 'TypeScript', count: Math.round(totalStudents * 0.21), category: 'Frontend' }
  ];

  // 9. Data-driven institutional recommendations
  const recommendations: string[] = [];
  if (avgReadiness < 75) {
    recommendations.push(
      `Institutional Readiness Index is ${avgReadiness}%. Organize remedial coding bootcamps for at-risk cohorts.`
    );
  }
  if (computedGaps.length > 0) {
    const topGap = computedGaps[0];
    recommendations.push(
      `${topGap.missingPercent}% of students lack ${topGap.skill}. ${topGap.recommendation}`
    );
  }
  if (placementFunnel.placementRate < 80) {
    recommendations.push(
      `Placement conversion is currently ${placementFunnel.placementRate}%. Increase corporate partner interview drives and mock technical rounds.`
    );
  }
  recommendations.push(
    `Align 2nd and 3rd year syllabus with industry-demanded tools: React, TypeScript, Docker, and Cloud Native deployment.`
  );

  return {
    institution: currentInstitution,
    filters: {
      department: deptFilter,
      year: yearFilter,
      targetRole: roleFilter
    },
    kpis: {
      totalStudents,
      avgReadiness,
      totalPlaced,
      totalInterning,
      placementRate,
      partnerCompanies: currentCorporatePartners.totalPartners,
      internshipsApplied: calculatedApplications
    },
    isCustomized: !!config?.isCustomized,
    readinessBuckets,
    departmentOverviews,
    filteredStudents,
    skillGaps: computedGaps,
    curriculumGaps: CURRICULUM_VS_INDUSTRY_GAPS,
    placementFunnel,
    internshipFunnel,
    skillDistribution,
    corporatePartners: currentCorporatePartners,
    institutionalRecommendations: recommendations
  };
}

/**
 * Generate formatted text report for institutional export (CSV or Printable Summary)
 */
export function generateInstitutionalReport(analytics: ReturnType<typeof getInstitutionalAnalytics>): string {
  const { institution, filters, kpis, readinessBuckets, skillGaps, curriculumGaps, institutionalRecommendations, isCustomized } = analytics;
  const statusLabel = isCustomized ? 'CUSTOMIZED ADMIN DATA' : 'SAMPLE DATA';

  return `=============================================================================
SKILLBRIDGE INSTITUTIONAL SKILL & PLACEMENT ANALYTICS REPORT
${institution.name}
${institution.academicYear} | ${institution.placementCell}
${institution.accreditation}
Generated: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}
Filter Scope: Dept: [${filters.department}] | Cohort: [${filters.year}] | Role: [${filters.targetRole}]
Data Provenance: [${statusLabel}]
=============================================================================

1. EXECUTIVE KPI SUMMARY [${statusLabel}]
-----------------------------------------------------------------------------
- Total Students Enrolled:         ${kpis.totalStudents.toLocaleString()}
- Institutional Readiness Index:   ${kpis.avgReadiness}%
- Total Students Placed:           ${kpis.totalPlaced} (${kpis.placementRate}% Placement Rate)
- Students Active in Internships:  ${kpis.totalInterning}
- Corporate Hiring Partners:       ${kpis.partnerCompanies} Active Partners
- Total Internship Applications:   ${kpis.internshipsApplied}

2. STUDENT READINESS BREAKDOWN
-----------------------------------------------------------------------------
- Placement Ready (80-100%):       ${readinessBuckets.placementReady.count} students (${readinessBuckets.placementReady.percent}%)
- Almost Ready (65-79%):           ${readinessBuckets.almostReady.count} students (${readinessBuckets.almostReady.percent}%)
- Needs Improvement (45-64%):      ${readinessBuckets.needsImprovement.count} students (${readinessBuckets.needsImprovement.percent}%)
- At Risk (<45%):                  ${readinessBuckets.atRisk.count} students (${readinessBuckets.atRisk.percent}%)

3. TOP INSTITUTIONAL SKILL GAPS (INDUSTRY DEFICITS)
-----------------------------------------------------------------------------
${skillGaps
  .map(
    (g, i) =>
      `${i + 1}. ${g.skill.padEnd(30)} | Missing: ${String(g.missingPercent).padStart(2)}% | Priority: ${g.priority}\n   Action: ${g.recommendation}`
  )
  .join('\n\n')}

4. CURRICULUM VS INDUSTRY DEMAND ALIGNMENT (SIH 26044)
-----------------------------------------------------------------------------
${curriculumGaps
  .map(
    (c, i) =>
      `${i + 1}. Domain: ${c.domain} (Gap: ${c.gapPercentage}% - ${c.gapSeverity} Severity)\n   Academic Syllabus: ${c.academicSkills.join(', ')}\n   Industry Demands:  ${c.industryDemandedSkills.join(', ')}\n   Dean Directive:    ${c.institutionalRecommendation}`
  )
  .join('\n\n')}

5. ACTIONABLE INSTITUTIONAL DIRECTIVES
-----------------------------------------------------------------------------
${institutionalRecommendations.map((r, i) => `[Directive ${i + 1}] ${r}`).join('\n')}

=============================================================================
Report compiled by SkillBridge Automated Career Intelligence Engine (SIH 26044).
Notice: ${isCustomized ? 'Institutional statistics customized and approved by college administration.' : 'Simulated statistics are marked as [Sample Data] for demonstration purposes.'}
=============================================================================`;
}
