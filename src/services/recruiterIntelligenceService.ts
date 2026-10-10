import { Application, Internship, StudentProfile } from '../types';

/**
 * Ensures candidate name is clean and never a resume section header.
 */
export function getSafeCandidateName(app: Partial<Application>, profile?: StudentProfile): string {
  // 1. Authenticated student profile name if available
  if (profile?.name && isValidPersonName(profile.name)) {
    return profile.name.trim();
  }

  // 2. Application student name if valid
  if (app.studentName && isValidPersonName(app.studentName)) {
    return app.studentName.trim();
  }

  // 3. Resume extracted candidate name if valid
  if (app.resumeCandidateName && isValidPersonName(app.resumeCandidateName)) {
    return app.resumeCandidateName.trim();
  }

  return 'Name unavailable';
}

const INVALID_NAME_HEADINGS = new Set([
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
  'personal details',
  'profile',
  'curriculum vitae',
  'resume',
  'contact',
  'references',
  'declaration',
  'skills',
  'key skills',
  'coursework',
  'candidate'
]);

export function isValidPersonName(name?: string): boolean {
  if (!name || name.trim().length < 2) return false;
  const lower = name.toLowerCase().trim().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ');
  if (INVALID_NAME_HEADINGS.has(lower)) return false;

  const words = lower.split(' ').filter(Boolean);
  if (words.length === 0 || words.length > 5) return false;
  if (words.every((w) => INVALID_NAME_HEADINGS.has(w))) return false;

  return true;
}

/**
 * Calculates aggregate skill analytics for a company's applicant pool.
 */
export function calculateApplicantSkillInsights(applications: Application[]) {
  const matchedSkillCounts: Record<string, number> = {};
  const missingSkillCounts: Record<string, number> = {};

  applications.forEach((app) => {
    app.matchedSkills.forEach((s) => {
      matchedSkillCounts[s] = (matchedSkillCounts[s] || 0) + 1;
    });
    app.missingSkills.forEach((s) => {
      missingSkillCounts[s] = (missingSkillCounts[s] || 0) + 1;
    });
  });

  const topMatchedSkills = Object.entries(matchedSkillCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([skill, count]) => ({ skill, count, percentage: Math.round((count / (applications.length || 1)) * 100) }));

  const topMissingSkills = Object.entries(missingSkillCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([skill, count]) => ({ skill, count, percentage: Math.round((count / (applications.length || 1)) * 100) }));

  return {
    topMatchedSkills,
    topMissingSkills,
    totalApplicants: applications.length
  };
}

/**
 * Generates intelligent answers for recruiter questions based on actual company applicants and postings.
 */
export function answerRecruiterQuery(
  query: string,
  applications: Application[],
  internships: Internship[],
  companyName: string
): { answer: string; relevantApplicants?: Application[]; relevantJobs?: Internship[] } {
  const q = query.toLowerCase().trim();

  // 1. Top candidates query
  if (q.includes('best') || q.includes('top') || q.includes('strongest') || q.includes('highest match')) {
    const sorted = [...applications].sort((a, b) => b.matchScore - a.matchScore);
    const top = sorted.slice(0, 3);
    if (top.length === 0) {
      return { answer: `No applicants have applied yet to ${companyName}.` };
    }
    const list = top
      .map(
        (c, idx) =>
          `${idx + 1}. **${c.studentName}** (${c.studentYear}) — **${c.matchScore}% Match** for *${c.internshipRole}*. Possesses: ${c.matchedSkills.slice(0, 4).join(', ')}.`
      )
      .join('\n');
    return {
      answer: `Here are the top-ranked candidates based on verified skills and job match calculations for ${companyName}:\n\n${list}\n\n*All candidates are evaluated using deterministic skill benchmarks.* [DEMO DATA]`,
      relevantApplicants: top
    };
  }

  // 2. Why is [Candidate] a strong match query
  const matchedCandidate = applications.find((a) => q.includes(a.studentName.toLowerCase()));
  if (matchedCandidate) {
    const matchedStr = matchedCandidate.matchedSkills.join(', ') || 'Core prerequisites';
    const missingStr = matchedCandidate.missingSkills.length > 0 ? matchedCandidate.missingSkills.join(', ') : 'None (100% matched)';
    const expStr = matchedCandidate.experienceHighlights && matchedCandidate.experienceHighlights.length > 0
      ? `\n• **Experience**: ${matchedCandidate.experienceHighlights[0]}`
      : '';
    const projStr = matchedCandidate.projects && matchedCandidate.projects.length > 0
      ? `\n• **Key Projects**: ${matchedCandidate.projects.map((p) => p.title).join(', ')}`
      : '';

    return {
      answer: `### Candidate Analysis: **${matchedCandidate.studentName}**
• **Applied Role**: ${matchedCandidate.internshipRole}
• **Match Score**: ${matchedCandidate.matchScore}% (Deterministic skill alignment)
• **Academic Profile**: ${matchedCandidate.studentDegree || 'B.Tech'} in ${matchedCandidate.studentCourse}, ${matchedCandidate.studentYear} at ${matchedCandidate.studentCollege} (CGPA: ${matchedCandidate.studentCgpa}/10)
• **Matched Skills**: ${matchedStr}
• **Missing / Skill Deficits**: ${missingStr}${expStr}${projStr}
• **Current Pipeline Status**: \`${matchedCandidate.status}\`

${matchedCandidate.matchExplanation || 'Candidate meets required technical criteria for this role.'}`,
      relevantApplicants: [matchedCandidate]
    };
  }

  // 3. Missing skills or skill deficit query
  if (q.includes('missing') || q.includes('deficit') || q.includes('gap') || q.includes('weakness')) {
    const insights = calculateApplicantSkillInsights(applications);
    if (insights.topMissingSkills.length === 0) {
      return { answer: `Applicants for ${companyName} currently possess all required skills for their target openings.` };
    }
    const list = insights.topMissingSkills
      .slice(0, 4)
      .map((s) => `• **${s.skill}**: Missing in ${s.count} of ${insights.totalApplicants} applicants (${s.percentage}%)`)
      .join('\n');
    return {
      answer: `### Skill Deficits Across ${companyName} Applicants (${insights.totalApplicants} Total)
The most common missing skills required by your open positions are:
${list}

*Recommendation: Consider sharing targeted learning resources or pairing candidates with mentors during onboarding.*`
    };
  }

  // 4. Status queries (e.g. under review, shortlisted, interview)
  if (q.includes('under review') || q.includes('shortlist') || q.includes('interview') || q.includes('offer') || q.includes('selected')) {
    let targetStatus = 'Under Review';
    if (q.includes('shortlist')) targetStatus = 'Shortlisted';
    if (q.includes('interview')) targetStatus = 'Interview';
    if (q.includes('selected')) targetStatus = 'Selected';
    if (q.includes('offer')) targetStatus = 'Offer Sent';

    const matching = applications.filter((a) => a.status.toLowerCase() === targetStatus.toLowerCase());
    if (matching.length === 0) {
      return { answer: `There are currently 0 candidates with status \`${targetStatus}\` for ${companyName}.` };
    }
    const names = matching.map((m) => `• **${m.studentName}** (${m.internshipRole}, ${m.matchScore}% Match)`).join('\n');
    return {
      answer: `### Candidates in \`${targetStatus}\` Stage (${matching.length}):
${names}

You can update candidate statuses or schedule interviews directly from the Candidate Pipeline table.`,
      relevantApplicants: matching
    };
  }

  // 5. Specific skill search (e.g. React, TypeScript, Docker)
  const skillsToSearch = ['react', 'typescript', 'javascript', 'node.js', 'mongodb', 'docker', 'sql', 'git', 'c++'];
  const mentionedSkill = skillsToSearch.find((s) => q.includes(s));
  if (mentionedSkill) {
    const withSkill = applications.filter((a) =>
      a.studentSkills.some((sk) => sk.toLowerCase().includes(mentionedSkill)) ||
      a.matchedSkills.some((sk) => sk.toLowerCase().includes(mentionedSkill))
    );
    if (withSkill.length === 0) {
      return { answer: `No candidates currently have verified skills in "${mentionedSkill}".` };
    }
    const list = withSkill
      .map((c) => `• **${c.studentName}** (${c.studentYear}) — Applied for *${c.internshipRole}* (${c.matchScore}% Match)`)
      .join('\n');
    return {
      answer: `Found ${withSkill.length} candidate(s) possessing **${mentionedSkill.toUpperCase()}**:
${list}`,
      relevantApplicants: withSkill
    };
  }

  // 6. General fallback overview
  const total = applications.length;
  const avgMatch = total > 0 ? Math.round(applications.reduce((acc, a) => acc + a.matchScore, 0) / total) : 0;
  return {
    answer: `### ${companyName} Recruitment Summary
• **Active Openings**: ${internships.length} roles
• **Total Applicants**: ${total} candidates
• **Average Qualification Match**: ${avgMatch}%
• **Pipeline Breakdown**:
  - Under Review: ${applications.filter((a) => a.status === 'Under Review').length}
  - Shortlisted: ${applications.filter((a) => a.status === 'Shortlisted').length}
  - Interview: ${applications.filter((a) => a.status === 'Interview').length}
  - Selected: ${applications.filter((a) => a.status === 'Selected').length}
  - Offer Sent: ${applications.filter((a) => a.status === 'Offer Sent' || a.status === 'Offered').length}

Ask me questions such as:
- *"Who are the top candidates for Frontend Developer Intern?"*
- *"Why is Priya Mehta a strong match?"*
- *"What skills are most commonly missing?"*
- *"Show candidates with TypeScript experience."*`
  };
}
