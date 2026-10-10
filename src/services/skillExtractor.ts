import { Skill } from '../types';

export type SkillConfidenceLevel = 'High' | 'Medium' | 'Low';

export interface ExtractedSkill {
  name: string;
  category: Skill['category'];
  confidence: number;
  confidenceLevel: SkillConfidenceLevel;
  sources: string[];
  evidence?: string[];
}

export interface ParsedResumeSections {
  skillsText: string;
  projectsText: string;
  experienceText: string;
  educationText: string;
  certificationsText: string;
  achievementsText: string;
  fullText: string;
}

export interface SkillExtractionResult {
  skills: ExtractedSkill[];
  sections: ParsedResumeSections;
  education?: string;
  projects: string[];
  experience: string[];
  certifications: string[];
  socialLinks: { github?: string; linkedin?: string; portfolio?: string };
  rawTextLength: number;
  isPartial?: boolean;
  isUnreadable?: boolean;
  warning?: string;
}

interface SkillDefinition {
  name: string;
  category: Skill['category'];
  // Matcher for strict presence in text
  test: (text: string, sectionType?: string) => { matched: boolean; confidence: number; matchedText?: string; evidence?: string };
}

// Helper to escape regex special characters
function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Strip URLs like https://github.com/... or linkedin.com/... before pure technical skill matching
// so that a URL in header doesn't accidentally trigger a false skill match
function stripUrls(text: string): string {
  return text.replace(/https?:\/\/[^\s]+/gi, ' ').replace(/www\.[^\s]+/gi, ' ');
}

// Master skill definitions catalog with strictly validated regexes & evidence extractors
export const SKILL_DEFINITIONS: SkillDefinition[] = [
  // 1. HTML
  {
    name: 'HTML',
    category: 'Frontend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(html5|html)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.96, matchedText: match[1] } : { matched: false, confidence: 0 };
    }
  },

  // 2. CSS
  {
    name: 'CSS',
    category: 'Frontend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(css3|css)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.95, matchedText: match[1] } : { matched: false, confidence: 0 };
    }
  },

  // 3. JavaScript
  {
    name: 'JavaScript',
    category: 'Frontend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(javascript\s*\(es6\+\)|javascript|es6\+|es6|vanilla\s+js|\bjs\b|ecmascript)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.96, matchedText: match[1] } : { matched: false, confidence: 0 };
    }
  },

  // 4. React
  {
    name: 'React',
    category: 'Frontend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(basic\s+react|react\.js|reactjs|react\s+native|\breact\b)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.96, matchedText: match[1] } : { matched: false, confidence: 0 };
    }
  },

  // 5. Node.js
  {
    name: 'Node.js',
    category: 'Backend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(node\.js|nodejs|\bnode\b)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: match[1] } : { matched: false, confidence: 0 };
    }
  },

  // 6. Express.js
  {
    name: 'Express.js',
    category: 'Backend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(express\.js|expressjs|\bexpress\b)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: match[1] } : { matched: false, confidence: 0 };
    }
  },

  // 7. MongoDB
  {
    name: 'MongoDB',
    category: 'Database',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(mongodb|mongo)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: match[1] } : { matched: false, confidence: 0 };
    }
  },

  // 8. SQL
  {
    name: 'SQL',
    category: 'Database',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(sql|mysql|postgresql|sqlite|pl\/sql|tsql|t-sql|nosql)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.95, matchedText: match[1] } : { matched: false, confidence: 0 };
    }
  },

  // 9. Java (Must not match JavaScript)
  {
    name: 'Java',
    category: 'Core CS',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(java)(?!\s*script)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'Java' } : { matched: false, confidence: 0 };
    }
  },

  // 10. C++ (Never convert C++ to C)
  {
    name: 'C++',
    category: 'Core CS',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9#+])(c\+\+|cpp|c\/c\+\+|c\s*\/\s*c\+\+)(?:$|[^a-zA-Z0-9#+])/i);
      return match ? { matched: true, confidence: 0.96, matchedText: 'C++' } : { matched: false, confidence: 0 };
    }
  },

  // 11. C (Strict only if explicitly present as "C Programming", "C language", or explicitly listed in a programming languages list, NEVER C++ or standalone random letter C)
  {
    name: 'C',
    category: 'Core CS',
    test: (text: string) => {
      // Negative lookahead to ensure NO + or # follows C and not part of C++
      const explicitMatch = text.match(/(?:c\s+programming|c\s+language|programming\s+in\s+c|programming\s+with\s+c|(?:^|[^a-zA-Z0-9+#])c(?:\s*,\s*|\s*\/\s*|\s+and\s+)c\+\+|\b(?:languages|languages\s+known|programming\s+languages)\s*:[^.\n]*?(?:^|[\s,;])c(?![+#a-zA-Z0-9]))/i);
      if (explicitMatch) {
        return { matched: true, confidence: 0.94, matchedText: 'C' };
      }
      return { matched: false, confidence: 0 };
    }
  },

  // 12. Git
  {
    name: 'Git',
    category: 'DevOps',
    test: (text: string) => {
      const clean = stripUrls(text);
      const match = clean.match(/(?:^|[^a-zA-Z0-9])git(?!(?:hub|lab|tea))(?:$|[^a-zA-Z0-9])/i);
      if (match) return { matched: true, confidence: 0.95, matchedText: 'Git' };
      if (/(?:git\s*(?:&|\+|\/|and)\s*github)/i.test(clean) || /\bgit\/github\b/i.test(clean)) {
        return { matched: true, confidence: 0.96, matchedText: 'Git' };
      }
      return { matched: false, confidence: 0 };
    }
  },

  // 13. GitHub
  {
    name: 'GitHub',
    category: 'DevOps',
    test: (text: string) => {
      const clean = stripUrls(text);
      const match = clean.match(/(?:^|[^a-zA-Z0-9])(github)(?:$|[^a-zA-Z0-9])/i);
      if (match) return { matched: true, confidence: 0.94, matchedText: 'GitHub' };
      if (/(?:git\s*(?:&|\+|\/|and)\s*github)/i.test(clean) || /\bgit\/github\b/i.test(clean)) {
        return { matched: true, confidence: 0.95, matchedText: 'GitHub' };
      }
      // If github.com/user is in text AND there's mention of github repositories/hosting
      if (/github\.com\//i.test(text) && /(repo|repository|hosted on github|github profile|version control)/i.test(text)) {
        return { matched: true, confidence: 0.88, matchedText: 'GitHub' };
      }
      return { matched: false, confidence: 0 };
    }
  },

  // 14. Postman
  {
    name: 'Postman',
    category: 'Backend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(postman)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'Postman' } : { matched: false, confidence: 0 };
    }
  },

  // 15. REST APIs
  {
    name: 'REST APIs',
    category: 'Backend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(rest\s*apis?|restful\s*apis?|rest\s*api|\brestful\b|\brest\b)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.95, matchedText: 'REST APIs' } : { matched: false, confidence: 0 };
    }
  },

  // 16. Responsive Web Design
  {
    name: 'Responsive Web Design',
    category: 'Frontend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(responsive\s+web\s+design|responsive\s+design|responsive\s+ui|mobile\s+responsive|mobile-friendly\s+ui)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.95, matchedText: 'Responsive Web Design' } : { matched: false, confidence: 0 };
    }
  },

  // 17. TypeScript
  {
    name: 'TypeScript',
    category: 'Frontend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(typescript|\bts\b)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'TypeScript' } : { matched: false, confidence: 0 };
    }
  },

  // 18. Tailwind CSS
  {
    name: 'Tailwind CSS',
    category: 'Frontend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(tailwind\s+css|tailwind|tailwindcss)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'Tailwind CSS' } : { matched: false, confidence: 0 };
    }
  },

  // 19. Python
  {
    name: 'Python',
    category: 'Core CS',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(python3?)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.95, matchedText: 'Python' } : { matched: false, confidence: 0 };
    }
  },

  // 20. C#
  {
    name: 'C#',
    category: 'Backend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9#+])(c#|c-sharp|csharp)(?:$|[^a-zA-Z0-9#+])/i);
      return match ? { matched: true, confidence: 0.95, matchedText: 'C#' } : { matched: false, confidence: 0 };
    }
  },

  // 21. PostgreSQL
  {
    name: 'PostgreSQL',
    category: 'Database',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(postgresql|postgres|psql)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.95, matchedText: 'PostgreSQL' } : { matched: false, confidence: 0 };
    }
  },

  // 22. MySQL
  {
    name: 'MySQL',
    category: 'Database',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(mysql)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.95, matchedText: 'MySQL' } : { matched: false, confidence: 0 };
    }
  },

  // 23. Docker
  {
    name: 'Docker',
    category: 'DevOps',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(docker|dockerfile|docker-compose)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'Docker' } : { matched: false, confidence: 0 };
    }
  },

  // 24. AWS
  {
    name: 'AWS',
    category: 'DevOps',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(aws|amazon\s+web\s+services|ec2|s3|aws\s+lambda)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'AWS' } : { matched: false, confidence: 0 };
    }
  },

  // 25. Machine Learning
  {
    name: 'Machine Learning',
    category: 'AI/ML',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(machine\s+learning|deep\s+learning|neural\s+networks|\bml\b(?:\s+(?:model|algorithm|pipeline|project)))(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'Machine Learning' } : { matched: false, confidence: 0 };
    }
  },

  // 26. Pandas
  {
    name: 'Pandas',
    category: 'AI/ML',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(pandas)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.93, matchedText: 'Pandas' } : { matched: false, confidence: 0 };
    }
  },

  // 27. NumPy
  {
    name: 'NumPy',
    category: 'AI/ML',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(numpy)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.93, matchedText: 'NumPy' } : { matched: false, confidence: 0 };
    }
  },

  // 28. Next.js
  {
    name: 'Next.js',
    category: 'Frontend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(next\.js|nextjs|\bnext\b)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'Next.js' } : { matched: false, confidence: 0 };
    }
  },

  // 29. Vue.js
  {
    name: 'Vue.js',
    category: 'Frontend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(vue\.js|vuejs|\bvue\b)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'Vue.js' } : { matched: false, confidence: 0 };
    }
  },

  // 30. Angular
  {
    name: 'Angular',
    category: 'Frontend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(angular\.js|angularjs|\bangular\b)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'Angular' } : { matched: false, confidence: 0 };
    }
  },

  // 31. GraphQL
  {
    name: 'GraphQL',
    category: 'Backend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(graphql)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'GraphQL' } : { matched: false, confidence: 0 };
    }
  },

  // 32. Redux
  {
    name: 'Redux',
    category: 'Frontend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(redux\s+toolkit|redux)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'Redux' } : { matched: false, confidence: 0 };
    }
  },

  // 33. Linux
  {
    name: 'Linux',
    category: 'DevOps',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(linux|ubuntu|debian|unix|bash\s+scripting|\bbash\b)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.93, matchedText: 'Linux' } : { matched: false, confidence: 0 };
    }
  },

  // 34. Kubernetes
  {
    name: 'Kubernetes',
    category: 'DevOps',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(kubernetes|k8s)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'Kubernetes' } : { matched: false, confidence: 0 };
    }
  },

  // 35. Firebase
  {
    name: 'Firebase',
    category: 'Backend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(firebase|firestore)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'Firebase' } : { matched: false, confidence: 0 };
    }
  },

  // 36. Django
  {
    name: 'Django',
    category: 'Backend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(django)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'Django' } : { matched: false, confidence: 0 };
    }
  },

  // 37. Flask
  {
    name: 'Flask',
    category: 'Backend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(flask)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'Flask' } : { matched: false, confidence: 0 };
    }
  },

  // 38. FastAPI
  {
    name: 'FastAPI',
    category: 'Backend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(fastapi)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'FastAPI' } : { matched: false, confidence: 0 };
    }
  },

  // 39. Spring Boot
  {
    name: 'Spring Boot',
    category: 'Backend',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(spring\s+boot|springboot|\bspring\b)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'Spring Boot' } : { matched: false, confidence: 0 };
    }
  },

  // 40. Data Structures & Algorithms
  {
    name: 'Data Structures & Algorithms',
    category: 'Core CS',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(data\s+structures\s*(?:&|and|\+)\s*algorithms|data\s+structures|\bdsa\b)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.95, matchedText: 'Data Structures & Algorithms' } : { matched: false, confidence: 0 };
    }
  },

  // 41. OOP
  {
    name: 'OOP',
    category: 'Core CS',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(object[\s-]oriented\s+programming|\boops?\b)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'OOP' } : { matched: false, confidence: 0 };
    }
  },

  // 42. Operating Systems
  {
    name: 'Operating Systems',
    category: 'Core CS',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(operating\s+systems?|\bos\s+concepts)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.93, matchedText: 'Operating Systems' } : { matched: false, confidence: 0 };
    }
  },

  // 43. Computer Networks
  {
    name: 'Computer Networks',
    category: 'Core CS',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(computer\s+networks?|networking\s+protocols|tcp\/ip|http\/https)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.93, matchedText: 'Computer Networks' } : { matched: false, confidence: 0 };
    }
  },

  // 44. DBMS
  {
    name: 'DBMS',
    category: 'Core CS',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(database\s+management\s+systems?|\bdbms\b|\brdbms\b)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'DBMS' } : { matched: false, confidence: 0 };
    }
  },

  // 45. Flutter
  {
    name: 'Flutter',
    category: 'Mobile',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(flutter|dart)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'Flutter' } : { matched: false, confidence: 0 };
    }
  },

  // 46. Figma
  {
    name: 'Figma',
    category: 'Design',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(figma|ui\/ux\s+design|wireframing)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.93, matchedText: 'Figma' } : { matched: false, confidence: 0 };
    }
  },

  // 47. AutoCAD
  {
    name: 'AutoCAD',
    category: 'Mechanical',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(autocad|auto\s*cad)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.96, matchedText: 'AutoCAD' } : { matched: false, confidence: 0 };
    }
  },

  // 48. SolidWorks
  {
    name: 'SolidWorks',
    category: 'Mechanical',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(solidworks|solid\s*works)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.96, matchedText: 'SolidWorks' } : { matched: false, confidence: 0 };
    }
  },

  // 49. CATIA
  {
    name: 'CATIA',
    category: 'Mechanical',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(catia)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.96, matchedText: 'CATIA' } : { matched: false, confidence: 0 };
    }
  },

  // 50. CNC Programming
  {
    name: 'CNC Programming',
    category: 'Manufacturing',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(cnc\s+programming|cnc\s+machining|cnc\s+milling|\bcnc\b)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.96, matchedText: 'CNC Programming' } : { matched: false, confidence: 0 };
    }
  },

  // 51. MATLAB
  {
    name: 'MATLAB',
    category: 'Core CS',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(matlab|simulink)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.96, matchedText: 'MATLAB' } : { matched: false, confidence: 0 };
    }
  },

  // 52. Basic PLC
  {
    name: 'Basic PLC',
    category: 'Automation',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(basic\s+plc|plc\s+programming|\bplc\b|programmable\s+logic\s+controller)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.95, matchedText: 'Basic PLC' } : { matched: false, confidence: 0 };
    }
  },

  // 53. 3D Modelling
  {
    name: '3D Modelling',
    category: 'Mechanical',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(3d\s+modell?ing|3d\s+cad|parametric\s+modell?ing)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.95, matchedText: '3D Modelling' } : { matched: false, confidence: 0 };
    }
  },

  // 54. Engineering Drawing
  {
    name: 'Engineering Drawing',
    category: 'Mechanical',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(engineering\s+drawing|technical\s+drawing|machine\s+drawing|drafting)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.95, matchedText: 'Engineering Drawing' } : { matched: false, confidence: 0 };
    }
  },

  // 55. MS Excel
  {
    name: 'MS Excel',
    category: 'Core CS',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(ms\s*excel|microsoft\s+excel|\bexcel\b)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.95, matchedText: 'MS Excel' } : { matched: false, confidence: 0 };
    }
  },

  // 56. GD&T
  {
    name: 'GD&T',
    category: 'Mechanical',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(gd&t|gdt|geometric\s+dimensioning\s+and\s+tolerancing)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'GD&T' } : { matched: false, confidence: 0 };
    }
  },

  // 57. Industrial Automation
  {
    name: 'Industrial Automation',
    category: 'Automation',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(industrial\s+automation|factory\s+automation)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'Industrial Automation' } : { matched: false, confidence: 0 };
    }
  },

  // 58. SCADA
  {
    name: 'SCADA',
    category: 'Automation',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(scada)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'SCADA' } : { matched: false, confidence: 0 };
    }
  },

  // 59. ANSYS
  {
    name: 'ANSYS',
    category: 'Mechanical',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(ansys)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'ANSYS' } : { matched: false, confidence: 0 };
    }
  },

  // 60. Finite Element Analysis
  {
    name: 'Finite Element Analysis',
    category: 'Mechanical',
    test: (text: string) => {
      const match = text.match(/(?:^|[^a-zA-Z0-9])(finite\s+element\s+analysis|\bfea\b|\bfem\b)(?:$|[^a-zA-Z0-9])/i);
      return match ? { matched: true, confidence: 0.94, matchedText: 'Finite Element Analysis' } : { matched: false, confidence: 0 };
    }
  }
];

/**
 * Parses raw text into semantic resume sections:
 * Skills, Projects, Experience, Education, Certifications, Achievements
 */
export function parseResumeSections(text: string): ParsedResumeSections {
  const lines = text.split('\n');
  const sections: ParsedResumeSections = {
    skillsText: '',
    projectsText: '',
    experienceText: '',
    educationText: '',
    certificationsText: '',
    achievementsText: '',
    fullText: text
  };

  let currentSection: 'skills' | 'projects' | 'experience' | 'education' | 'certifications' | 'achievements' | 'none' = 'none';

  // Section Header Regular Expressions
  const skillsHeaderRegex = /^(?:technical\s+skills|skills\s*(?:&|and|\+)?\s*abilities|skills\s+summary|core\s+competencies|programming\s+languages|technologies|tools\s*(&|and|\+)?\s*technologies|frameworks|technical\s+expertise|technical\s+proficiencies|key\s+skills|skill\s+set|skills)(?:\s*:|\s*$)/i;
  const projectsHeaderRegex = /^(?:academic\s+projects|personal\s+projects|key\s+projects|selected\s+projects|technical\s+projects|software\s+projects|project\s+work|projects)(?:\s*:|\s*$)/i;
  const experienceHeaderRegex = /^(?:work\s+experience|employment\s+history|professional\s+experience|internships?|internship\s+experience|work\s+history|professional\s+background|career\s+history|experience)(?:\s*:|\s*$)/i;
  const educationHeaderRegex = /^(?:academic\s+background|educational\s+qualifications|qualifications|academic\s+profile|education\s*(&|and|\+)?\s*training|education)(?:\s*:|\s*$)/i;
  const certHeaderRegex = /^(?:certifications?|certificates?|courses|licenses|training|online\s+courses|professional\s+certifications|accreditations)(?:\s*:|\s*$)/i;
  const achieveHeaderRegex = /^(?:achievements?|awards?|honors?|extracurricular\s+activities|extracurricular|publications?|leadership)(?:\s*:|\s*$)/i;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Check if line is a new section header
    const cleanHeader = trimmed.replace(/^[-*•#_=>\d.]+\s*/, '').trim();

    if (skillsHeaderRegex.test(cleanHeader)) {
      currentSection = 'skills';
      sections.skillsText += '\n' + trimmed;
      continue;
    } else if (projectsHeaderRegex.test(cleanHeader)) {
      currentSection = 'projects';
      sections.projectsText += '\n' + trimmed;
      continue;
    } else if (experienceHeaderRegex.test(cleanHeader)) {
      currentSection = 'experience';
      sections.experienceText += '\n' + trimmed;
      continue;
    } else if (educationHeaderRegex.test(cleanHeader)) {
      currentSection = 'education';
      sections.educationText += '\n' + trimmed;
      continue;
    } else if (certHeaderRegex.test(cleanHeader)) {
      currentSection = 'certifications';
      sections.certificationsText += '\n' + trimmed;
      continue;
    } else if (achieveHeaderRegex.test(cleanHeader)) {
      currentSection = 'achievements';
      sections.achievementsText += '\n' + trimmed;
      continue;
    }

    // Append line to active section
    switch (currentSection) {
      case 'skills':
        sections.skillsText += '\n' + trimmed;
        break;
      case 'projects':
        sections.projectsText += '\n' + trimmed;
        break;
      case 'experience':
        sections.experienceText += '\n' + trimmed;
        break;
      case 'education':
        sections.educationText += '\n' + trimmed;
        break;
      case 'certifications':
        sections.certificationsText += '\n' + trimmed;
        break;
      case 'achievements':
        sections.achievementsText += '\n' + trimmed;
        break;
      default:
        break;
    }
  }

  return sections;
}

/**
 * Strict validation helper: verifies that a skill actually occurs in the given resume text.
 * Prevents false positives from partial matches or external hallucination.
 */
export function isSkillInResumeText(skillName: string, resumeText: string): boolean {
  if (!skillName || !resumeText) return false;
  const lowerName = skillName.toLowerCase().trim();

  // Edge Case 1: "C" programming
  if (lowerName === 'c') {
    // Must NOT match inside words like CNC, CATIA, CAD, CGPA, CSE, CBSE, etc.
    const explicitC = /(?:c\s+programming|c\s+language|programming\s+in\s+c|programming\s+with\s+c|(?:^|[^a-zA-Z0-9+#])c(?:\s*,\s*|\s*\/\s*|\s+and\s+)c\+\+|\b(?:languages|programming\s+languages|technologies)\s*:[^.\n]*?(?:^|[\s,;])c(?![+#a-zA-Z0-9]))/i;
    return explicitC.test(resumeText);
  }

  // Edge Case 2: "Git"
  if (lowerName === 'git') {
    const textWithoutUrls = resumeText.replace(/https?:\/\/[^\s]+/gi, ' ').replace(/www\.[^\s]+/gi, ' ');
    const gitMatch = textWithoutUrls.match(/(?:^|[^a-zA-Z0-9])git(?!(?:hub|lab|tea|[a-zA-Z]))(?:$|[^a-zA-Z0-9])/i);
    return Boolean(gitMatch);
  }

  // Edge Case 3: "Java"
  if (lowerName === 'java') {
    const javaMatch = resumeText.match(/(?:^|[^a-zA-Z0-9])java(?!\s*script)(?:$|[^a-zA-Z0-9])/i);
    return Boolean(javaMatch);
  }

  // Edge Case 4: "AutoCAD"
  if (lowerName === 'autocad') {
    return /(?:autocad|auto\s*cad)/i.test(resumeText);
  }

  // Edge Case 5: "SolidWorks"
  if (lowerName === 'solidworks') {
    return /(?:solidworks|solid\s*works)/i.test(resumeText);
  }

  // Edge Case 6: "CATIA"
  if (lowerName === 'catia') {
    return /\bcatia\b/i.test(resumeText);
  }

  // Edge Case 7: "CNC Programming" or "CNC"
  if (lowerName === 'cnc programming' || lowerName === 'cnc') {
    return /\bcnc\b/i.test(resumeText);
  }

  // Edge Case 8: "MATLAB"
  if (lowerName === 'matlab') {
    return /\bmatlab\b/i.test(resumeText);
  }

  // Edge Case 9: "Basic PLC" or "PLC"
  if (lowerName === 'basic plc' || lowerName === 'plc') {
    return /\bplc\b|programmable\s+logic\s+controller/i.test(resumeText);
  }

  // Edge Case 10: "3D Modelling" or "3D Modeling"
  if (lowerName.includes('3d model')) {
    return /3d\s*(?:model|cad)/i.test(resumeText);
  }

  // Edge Case 11: "Engineering Drawing"
  if (lowerName === 'engineering drawing') {
    return /engineering\s+drawing|technical\s+drawing|machine\s+drawing|drafting/i.test(resumeText);
  }

  // Edge Case 12: "MS Excel"
  if (lowerName === 'ms excel' || lowerName === 'excel') {
    return /ms\s*excel|microsoft\s*excel|\bexcel\b/i.test(resumeText);
  }

  // Edge Case 13: "GD&T"
  if (lowerName === 'gd&t' || lowerName === 'gdt') {
    return /gd&t|gdt|geometric\s+dimensioning/i.test(resumeText);
  }

  // Edge Case 14: "Industrial Automation"
  if (lowerName === 'industrial automation') {
    return /industrial\s+automation|factory\s+automation/i.test(resumeText);
  }

  // General check:
  const escaped = lowerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(?:^|[^a-zA-Z0-9])${escaped}(?:$|[^a-zA-Z0-9])`, 'i');
  if (regex.test(resumeText)) return true;

  return resumeText.toLowerCase().includes(lowerName);
}

/**
 * Validates a list of extracted skills against raw resume text.
 * Strictly removes any skill that is not present in the text.
 */
export function validateExtractedSkillsAgainstText<T extends { name: string }>(
  skills: T[],
  resumeText: string
): T[] {
  if (!resumeText || !skills) return [];
  return skills.filter((s) => isSkillInResumeText(s.name, resumeText));
}

/**
 * Pure extraction function that scans raw resume text and extracts ONLY skills that are present.
 * Strictly avoids inventing skills that do not exist in the resume.
 * Assigns High, Medium, or Low confidence based on section evidence.
 */
export function extractSkillsAccurately(resumeText: string): ExtractedSkill[] {
  if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length === 0) {
    return [];
  }

  const sections = parseResumeSections(resumeText);
  const detected: ExtractedSkill[] = [];
  const addedNames = new Set<string>();

  for (const def of SKILL_DEFINITIONS) {
    // 1. Test presence across sections
    const inSkills = sections.skillsText ? def.test(sections.skillsText).matched : false;
    const inProjects = sections.projectsText ? def.test(sections.projectsText).matched : false;
    const inExperience = sections.experienceText ? def.test(sections.experienceText).matched : false;
    const inCerts = sections.certificationsText ? def.test(sections.certificationsText).matched : false;
    const inEducation = sections.educationText ? def.test(sections.educationText).matched : false;
    const inFullText = def.test(resumeText).matched;

    if (!inSkills && !inProjects && !inExperience && !inCerts && !inEducation && !inFullText) {
      continue; // Skill is not present in document
    }

    const normalizedName = def.name;
    if (addedNames.has(normalizedName.toLowerCase())) {
      continue;
    }

    // Determine sources & confidence
    const sources: string[] = [];
    let confidence = 0.70;
    let confidenceLevel: SkillConfidenceLevel = 'Low';

    if (inSkills) {
      sources.push('Skills Section');
      confidence = 0.96;
      confidenceLevel = 'High';
    }
    if (inProjects) {
      sources.push('Projects');
      if (confidenceLevel !== 'High') {
        confidence = 0.88;
        confidenceLevel = 'Medium';
      }
    }
    if (inExperience) {
      sources.push('Experience');
      if (confidenceLevel !== 'High') {
        confidence = 0.88;
        confidenceLevel = 'Medium';
      }
    }
    if (inCerts) {
      sources.push('Certifications');
      if (confidenceLevel !== 'High') {
        confidence = 0.85;
        confidenceLevel = 'Medium';
      }
    }
    if (inEducation && sources.length === 0) {
      sources.push('Education');
      confidence = 0.75;
      confidenceLevel = 'Low';
    }
    if (sources.length === 0) {
      sources.push('Resume Text');
      confidence = 0.70;
      confidenceLevel = 'Low';
    }

    // Find snippet evidence (matching sentence)
    const lines = resumeText.split('\n');
    const evidenceLines: string[] = [];
    for (const line of lines) {
      if (def.test(line).matched && line.trim().length > 10 && line.trim().length < 160) {
        evidenceLines.push(line.replace(/^[-*•\d.]+\s*/, '').trim());
        if (evidenceLines.length >= 2) break;
      }
    }

    addedNames.add(normalizedName.toLowerCase());
    detected.push({
      name: normalizedName,
      category: def.category,
      confidence,
      confidenceLevel,
      sources,
      evidence: evidenceLines
    });
  }

  // 2. Scan explicit items in Skills section if any comma-separated or bulleted items exist
  if (sections.skillsText) {
    const rawItems = sections.skillsText
      .split(/[\n,;•\-|]+/)
      .map((item) => item.replace(/^[^a-zA-Z0-9#+]+/, '').trim())
      .filter((item) => item.length >= 2 && item.length <= 35);

    for (const item of rawItems) {
      const lower = item.toLowerCase();
      // Skip generic section labels
      if (/^(technical skills|skills|soft skills|tools|frameworks|languages|coursework)$/i.test(lower)) continue;

      for (const def of SKILL_DEFINITIONS) {
        if (def.test(item).matched && !addedNames.has(def.name.toLowerCase())) {
          if (isSkillInResumeText(def.name, resumeText)) {
            addedNames.add(def.name.toLowerCase());
            detected.push({
              name: def.name,
              category: def.category,
              confidence: 0.95,
              confidenceLevel: 'High',
              sources: ['Skills Section'],
              evidence: [`Skills: ${item}`]
            });
          }
        }
      }
    }
  }

  // 3. STRICT VALIDATION: Every detected skill MUST actually occur in the resume text
  const validated = detected.filter((s) => isSkillInResumeText(s.name, resumeText));

  return validated;
}

// Alias for backward compatibility
export const extractSkillsFromText = extractSkillsAccurately;

/**
 * Extracts experience and project snippets from resume text.
 */
export function extractExperienceFromText(resumeText: string): string[] {
  if (!resumeText) return [];
  const lines = resumeText.split('\n').map((l) => l.trim()).filter(Boolean);
  const highlights: string[] = [];

  for (const line of lines) {
    if (/project|built|developed|created|implemented|designed|collaborated|solved/i.test(line) && line.length > 20 && line.length < 160) {
      highlights.push(line.replace(/^[-*•\d.]+\s*/, ''));
      if (highlights.length >= 4) break;
    }
  }

  return highlights;
}
