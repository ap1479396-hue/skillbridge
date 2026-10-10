import { Skill } from '../types';

export interface IndustrySkill {
  name: string;
  category: Skill['category'];
  aliases?: string[];
  inDemand?: boolean;
}

/**
 * Approved predefined industry skills database
 * Strictly validated technical skills mapped to canonical names and industry domains
 */
export const PREDEFINED_INDUSTRY_SKILLS: IndustrySkill[] = [
  // Programming & Core CS
  { name: 'JavaScript', category: 'Frontend', aliases: ['js', 'vanilla js', 'es6', 'es6+', 'ecmascript'], inDemand: true },
  { name: 'Java', category: 'Core CS', aliases: ['core java', 'java 8', 'java 17', 'java 21', 'jdk'], inDemand: true },
  { name: 'JSON', category: 'Frontend', aliases: ['json api', 'json format'] },
  { name: 'Python', category: 'Core CS', aliases: ['py', 'python3', 'python 3'], inDemand: true },
  { name: 'TypeScript', category: 'Frontend', aliases: ['ts'], inDemand: true },
  { name: 'C++', category: 'Core CS', aliases: ['cpp', 'c plus plus'], inDemand: true },
  { name: 'C', category: 'Core CS', aliases: ['c programming', 'c language'] },
  { name: 'C#', category: 'Backend', aliases: ['csharp', 'c-sharp', '.net c#'] },
  { name: 'Go', category: 'Backend', aliases: ['golang'] },
  { name: 'Rust', category: 'Core CS', aliases: ['rustlang'] },
  { name: 'PHP', category: 'Backend', aliases: ['php8', 'php 8'] },
  { name: 'Ruby', category: 'Backend', aliases: ['ruby lang'] },
  { name: 'Dart', category: 'Mobile', aliases: ['dartlang'] },
  { name: 'Kotlin', category: 'Mobile', aliases: ['kotlin android'] },
  { name: 'Swift', category: 'Mobile', aliases: ['swift ios', 'swiftui'] },
  { name: 'R', category: 'AI/ML', aliases: ['r programming', 'r language'] },
  { name: 'Scala', category: 'Backend', aliases: ['scala lang'] },
  { name: 'Julia', category: 'AI/ML', aliases: ['julia lang'] },

  // Frontend & Web
  { name: 'React', category: 'Frontend', aliases: ['reactjs', 'react.js'], inDemand: true },
  { name: 'Next.js', category: 'Frontend', aliases: ['nextjs', 'next'], inDemand: true },
  { name: 'HTML', category: 'Frontend', aliases: ['html5'], inDemand: true },
  { name: 'CSS', category: 'Frontend', aliases: ['css3'], inDemand: true },
  { name: 'Tailwind CSS', category: 'Frontend', aliases: ['tailwind', 'tailwindcss'], inDemand: true },
  { name: 'Bootstrap', category: 'Frontend', aliases: ['bootstrap 5', 'bootstrap css'] },
  { name: 'Redux', category: 'Frontend', aliases: ['redux toolkit', 'rtk', 'react-redux'] },
  { name: 'Vue.js', category: 'Frontend', aliases: ['vue', 'vuejs', 'vue 3'] },
  { name: 'Angular', category: 'Frontend', aliases: ['angularjs', 'angular 2+'] },
  { name: 'Svelte', category: 'Frontend', aliases: ['sveltekit', 'svelte js'] },
  { name: 'Sass / SCSS', category: 'Frontend', aliases: ['scss', 'sass'] },
  { name: 'jQuery', category: 'Frontend', aliases: ['jquery js'] },
  { name: 'Webpack', category: 'Frontend', aliases: ['webpack bundler'] },
  { name: 'Vite', category: 'Frontend', aliases: ['vitejs'] },
  { name: 'Responsive Web Design', category: 'Frontend', aliases: ['responsive design', 'mobile first design'] },

  // Backend & APIs
  { name: 'Node.js', category: 'Backend', aliases: ['nodejs', 'node'], inDemand: true },
  { name: 'Express.js', category: 'Backend', aliases: ['express', 'expressjs'], inDemand: true },
  { name: 'NestJS', category: 'Backend', aliases: ['nest.js', 'nest'] },
  { name: 'Django', category: 'Backend', aliases: ['django framework', 'django rest framework', 'drf'] },
  { name: 'Flask', category: 'Backend', aliases: ['flask python', 'flask api'] },
  { name: 'FastAPI', category: 'Backend', aliases: ['fast api', 'fastapi python'] },
  { name: 'Spring Boot', category: 'Backend', aliases: ['springboot', 'spring framework', 'spring'], inDemand: true },
  { name: 'Laravel', category: 'Backend', aliases: ['laravel php'] },
  { name: 'Ruby on Rails', category: 'Backend', aliases: ['rails', 'ror'] },
  { name: 'REST APIs', category: 'Backend', aliases: ['rest api', 'restful api', 'restful apis', 'rest services'], inDemand: true },
  { name: 'GraphQL', category: 'Backend', aliases: ['graphql api', 'apollo graphql'] },
  { name: 'gRPC', category: 'Backend', aliases: ['grpc api', 'protobuf'] },
  { name: 'WebSockets', category: 'Backend', aliases: ['socket.io', 'websocket'] },
  { name: 'Postman', category: 'Backend', aliases: ['postman api testing', 'newman'] },
  { name: 'JWT', category: 'Backend', aliases: ['json web token', 'jwt auth'] },

  // Database
  { name: 'MongoDB', category: 'Database', aliases: ['mongo', 'mongodb database', 'nosql mongodb'], inDemand: true },
  { name: 'SQL', category: 'Database', aliases: ['structured query language', 'rdbms'], inDemand: true },
  { name: 'PostgreSQL', category: 'Database', aliases: ['postgres', 'psql'], inDemand: true },
  { name: 'MySQL', category: 'Database', aliases: ['mysql database'] },
  { name: 'Redis', category: 'Database', aliases: ['redis cache', 'redis db'], inDemand: true },
  { name: 'SQLite', category: 'Database', aliases: ['sqlite3'] },
  { name: 'Oracle Database', category: 'Database', aliases: ['oracle sql', 'pl/sql', 'oracle db'] },
  { name: 'Cassandra', category: 'Database', aliases: ['apache cassandra'] },
  { name: 'DynamoDB', category: 'Database', aliases: ['aws dynamodb'] },
  { name: 'Elasticsearch', category: 'Database', aliases: ['elastic search', 'elk stack'] },
  { name: 'Firebase', category: 'Database', aliases: ['firebase firestore', 'cloud firestore'] },
  { name: 'Supabase', category: 'Database', aliases: ['supabase postgres'] },
  { name: 'Prisma', category: 'Database', aliases: ['prisma orm'] },
  { name: 'Mongoose', category: 'Database', aliases: ['mongoose orm', 'mongoose odm'] },

  // DevOps & Cloud
  { name: 'Git', category: 'DevOps', aliases: ['git version control'], inDemand: true },
  { name: 'GitHub', category: 'DevOps', aliases: ['github actions', 'github workflows'], inDemand: true },
  { name: 'GitLab', category: 'DevOps', aliases: ['gitlab ci', 'gitlab ci/cd'] },
  { name: 'Docker', category: 'DevOps', aliases: ['docker container', 'docker compose', 'dockerfile'], inDemand: true },
  { name: 'Kubernetes', category: 'DevOps', aliases: ['k8s', 'k8s cluster'], inDemand: true },
  { name: 'AWS', category: 'DevOps', aliases: ['amazon web services', 'ec2', 's3', 'aws lambda'], inDemand: true },
  { name: 'Azure', category: 'DevOps', aliases: ['microsoft azure', 'azure cloud'] },
  { name: 'GCP', category: 'DevOps', aliases: ['google cloud', 'google cloud platform'] },
  { name: 'Linux', category: 'DevOps', aliases: ['ubuntu', 'debian', 'unix', 'bash', 'shell scripting'] },
  { name: 'CI/CD', category: 'DevOps', aliases: ['continuous integration', 'continuous deployment', 'ci cd pipeline'] },
  { name: 'Terraform', category: 'DevOps', aliases: ['hashicorp terraform', 'iac'] },
  { name: 'Nginx', category: 'DevOps', aliases: ['nginx reverse proxy'] },
  { name: 'Jenkins', category: 'DevOps', aliases: ['jenkins ci'] },
  { name: 'Ansible', category: 'DevOps', aliases: ['ansible automation'] },

  // AI / ML & Data Science
  { name: 'Machine Learning', category: 'AI/ML', aliases: ['ml', 'supervised learning', 'unsupervised learning'], inDemand: true },
  { name: 'Deep Learning', category: 'AI/ML', aliases: ['dl', 'neural networks', 'cnn', 'rnn'], inDemand: true },
  { name: 'NumPy', category: 'AI/ML', aliases: ['numpy python'], inDemand: true },
  { name: 'Pandas', category: 'AI/ML', aliases: ['pandas python', 'dataframe'], inDemand: true },
  { name: 'Scikit-Learn', category: 'AI/ML', aliases: ['sklearn', 'scikit learn'] },
  { name: 'PyTorch', category: 'AI/ML', aliases: ['torch', 'pytorch python'], inDemand: true },
  { name: 'TensorFlow', category: 'AI/ML', aliases: ['tf', 'tensorflow 2'] },
  { name: 'Keras', category: 'AI/ML', aliases: ['keras tf'] },
  { name: 'NLP', category: 'AI/ML', aliases: ['natural language processing', 'text analytics'] },
  { name: 'Computer Vision', category: 'AI/ML', aliases: ['cv', 'image processing', 'opencv'] },
  { name: 'Generative AI', category: 'AI/ML', aliases: ['genai', 'generative models'], inDemand: true },
  { name: 'Large Language Models (LLMs)', category: 'AI/ML', aliases: ['llm', 'llms', 'prompt engineering', 'rag'] },
  { name: 'LangChain', category: 'AI/ML', aliases: ['langchain ai'] },
  { name: 'Hugging Face', category: 'AI/ML', aliases: ['transformers', 'huggingface'] },

  // Core Computer Science Fundamentals
  { name: 'Data Structures & Algorithms', category: 'Core CS', aliases: ['dsa', 'algorithms', 'data structures'], inDemand: true },
  { name: 'OOP', category: 'Core CS', aliases: ['object oriented programming', 'oops'] },
  { name: 'Operating Systems', category: 'Core CS', aliases: ['os', 'os concepts'] },
  { name: 'Computer Networks', category: 'Core CS', aliases: ['networking', 'cn', 'tcp/ip'] },
  { name: 'DBMS', category: 'Core CS', aliases: ['database management system', 'dbms concepts'] },
  { name: 'System Design', category: 'Core CS', aliases: ['lld', 'hld', 'system architecture'] },

  // Mobile Development
  { name: 'React Native', category: 'Mobile', aliases: ['react-native', 'rn'], inDemand: true },
  { name: 'Flutter', category: 'Mobile', aliases: ['flutter framework', 'flutter dart'], inDemand: true },
  { name: 'Android Development', category: 'Mobile', aliases: ['android sdk', 'android app'] },
  { name: 'iOS Development', category: 'Mobile', aliases: ['ios sdk', 'ios app'] },

  // Design & UI/UX
  { name: 'Figma', category: 'Design', aliases: ['figma design', 'figma wireframing'], inDemand: true },
  { name: 'UI/UX Design', category: 'Design', aliases: ['ui design', 'ux design', 'user interface design'] },
  { name: 'Wireframing', category: 'Design', aliases: ['prototyping', 'mockups'] },

  // Testing & Quality
  { name: 'Jest', category: 'Frontend', aliases: ['jest testing', 'unit testing'] },
  { name: 'Cypress', category: 'Frontend', aliases: ['cypress e2e'] },
  { name: 'Selenium', category: 'Frontend', aliases: ['selenium webdriver'] },

  // Mechanical, CAD, Manufacturing & Automation
  { name: 'AutoCAD', category: 'Mechanical', aliases: ['autocad 2d', 'autocad 3d', 'auto cad'], inDemand: true },
  { name: 'SolidWorks', category: 'Mechanical', aliases: ['solid works', 'solidworks cad'], inDemand: true },
  { name: 'CATIA', category: 'Mechanical', aliases: ['catia v5', 'catia v6', 'dassault catia'], inDemand: true },
  { name: 'CNC Programming', category: 'Manufacturing', aliases: ['cnc', 'cnc machining', 'g-code', 'm-code', 'cnc turning', 'cnc milling'], inDemand: true },
  { name: 'MATLAB', category: 'Core CS', aliases: ['matlab simulink', 'simulink'], inDemand: true },
  { name: 'Basic PLC', category: 'Automation', aliases: ['plc', 'plc programming', 'programmable logic controller', 'ladder logic'], inDemand: true },
  { name: '3D Modelling', category: 'Mechanical', aliases: ['3d modeling', '3d cad', 'parametric modeling'], inDemand: true },
  { name: 'Engineering Drawing', category: 'Mechanical', aliases: ['technical drawing', 'drafting', 'machine drawing', 'blueprint reading'], inDemand: true },
  { name: 'MS Excel', category: 'Core CS', aliases: ['excel', 'microsoft excel', 'advanced excel', 'spreadsheets'], inDemand: true },
  { name: 'GD&T', category: 'Mechanical', aliases: ['geometric dimensioning and tolerancing', 'gdt'], inDemand: true },
  { name: 'Industrial Automation', category: 'Automation', aliases: ['automation engineering', 'factory automation'], inDemand: true },
  { name: 'SCADA', category: 'Automation', aliases: ['scada systems', 'hmi scada'] },
  { name: 'ANSYS', category: 'Mechanical', aliases: ['ansys workbench', 'fea ansys'] },
  { name: 'Finite Element Analysis', category: 'Mechanical', aliases: ['fea', 'fem'] },
  { name: 'Creo', category: 'Mechanical', aliases: ['creo parametric', 'pro/engineer', 'pro-e'] }
];

/**
 * Searches predefined industry skills with smart ranking:
 * 1. Exact match (e.g. "java" -> Java)
 * 2. Starts with query (e.g. "jav" -> JavaScript, Java; "dock" -> Docker)
 * 3. Word inside name starts with query (e.g. "css" -> CSS, Tailwind CSS)
 * 4. Aliases start with query
 * 5. Contains query as substring
 * 
 * Case-insensitive, deduplicated, and ranked for instant responsiveness.
 */
export function searchIndustrySkills(query: string, limit: number = 8): IndustrySkill[] {
  if (!query || typeof query !== 'string') return [];
  const clean = query.trim().toLowerCase();
  if (clean.length === 0) return [];

  interface ScoredMatch {
    skill: IndustrySkill;
    score: number;
    nameLength: number;
  }

  const matches: ScoredMatch[] = [];

  for (const skill of PREDEFINED_INDUSTRY_SKILLS) {
    const nameLower = skill.name.toLowerCase();
    let score = 999;

    if (nameLower === clean) {
      score = 1; // Exact match
    } else if (nameLower.startsWith(clean)) {
      score = 2; // Prefix match
    } else {
      // Check if any word inside skill name starts with query (e.g. "css" -> "Tailwind CSS")
      const words = nameLower.split(/[\s/&+-]+/);
      const wordMatch = words.some((w) => w.startsWith(clean));
      if (wordMatch) {
        score = 3;
      } else if (skill.aliases && skill.aliases.some((a) => a.toLowerCase() === clean)) {
        score = 4; // Exact alias match (e.g. "js" -> JavaScript)
      } else if (skill.aliases && skill.aliases.some((a) => a.toLowerCase().startsWith(clean))) {
        score = 5; // Alias prefix match
      } else if (nameLower.includes(clean)) {
        score = 6; // Substring in name
      } else if (skill.aliases && skill.aliases.some((a) => a.toLowerCase().includes(clean))) {
        score = 7; // Substring in alias
      }
    }

    if (score < 999) {
      matches.push({
        skill,
        score,
        nameLength: skill.name.length
      });
    }
  }

  // Sort by match score ascending, then by name length ascending (closer match first), then alphabetically
  matches.sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;
    if (a.nameLength !== b.nameLength) return a.nameLength - b.nameLength;
    return a.skill.name.localeCompare(b.skill.name);
  });

  return matches.slice(0, limit).map((m) => m.skill);
}
