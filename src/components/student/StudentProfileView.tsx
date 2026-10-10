import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  CheckCircle2,
  Link as LinkIcon,
  Github,
  Linkedin,
  Globe,
  Save,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { Skill } from '../../types';
import { SkillAutocompleteInput } from './SkillAutocompleteInput';
import { IndustrySkill } from '../../data/industrySkills';

export const StudentProfileView: React.FC = () => {
  const {
    student,
    setStudent,
    careerGoals,
    currentCareerGoal,
    setStudentCareerGoal,
    addSkillToStudent,
    removeSkillFromStudent,
    addNotification,
    setActiveTab
  } = useApp();

  const [name, setName] = useState(student.name);
  const [email, setEmail] = useState(student.email);
  const [college, setCollege] = useState(student.college);
  const [course, setCourse] = useState(student.course);
  const [year, setYear] = useState(student.year);
  const [cgpa, setCgpa] = useState(student.cgpa);
  const [bio, setBio] = useState(student.bio);
  const [githubUrl, setGithubUrl] = useState(student.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(student.linkedinUrl || '');

  // Keep form fields synced if student profile changes
  useEffect(() => {
    setName(student.name);
    setEmail(student.email);
    setCollege(student.college);
    setCourse(student.course);
    setYear(student.year);
    setCgpa(student.cgpa);
    setBio(student.bio);
    setGithubUrl(student.githubUrl || '');
    setLinkedinUrl(student.linkedinUrl || '');
  }, [
    student.name,
    student.email,
    student.college,
    student.course,
    student.year,
    student.cgpa,
    student.bio,
    student.githubUrl,
    student.linkedinUrl
  ]);

  // Add skill form state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<Skill['category']>('Frontend');
  const [newSkillProficiency, setNewSkillProficiency] = useState<Skill['proficiency']>('Intermediate');

  const popularSkillSuggestions = [
    { name: 'React', category: 'Frontend' as const },
    { name: 'TypeScript', category: 'Frontend' as const },
    { name: 'Tailwind CSS', category: 'Frontend' as const },
    { name: 'Node.js & Express', category: 'Backend' as const },
    { name: 'Git & GitHub', category: 'DevOps' as const },
    { name: 'Python', category: 'Core CS' as const },
    { name: 'MongoDB', category: 'Database' as const },
    { name: 'SQL', category: 'Database' as const },
    { name: 'Docker', category: 'DevOps' as const },
    { name: 'Machine Learning', category: 'AI/ML' as const }
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setStudent((prev) => ({
      ...prev,
      name,
      email,
      college,
      course,
      year,
      cgpa: Number(cgpa),
      bio,
      githubUrl,
      linkedinUrl
    }));
    addNotification('Profile changes saved successfully!', 'success');
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newSkillName.trim();
    if (!cleanName) return;

    if (student.currentSkills.some((s) => s.name.toLowerCase() === cleanName.toLowerCase())) {
      addNotification(`Skill "${cleanName}" is already in your verified skills.`, 'warning');
      return;
    }

    addSkillToStudent({
      name: cleanName,
      category: newSkillCategory,
      proficiency: newSkillProficiency,
      verified: true
    });
    setNewSkillName('');
  };

  return (
    <div id="student-profile-page" className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-4">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{student.name}</h1>
              <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Verified Student
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {student.course} • {student.year} • {student.college}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('resume-upload')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Upload Resume to Auto-Fill</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Info + Skills */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Academic & Personal Info (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <User className="w-4 h-4 text-indigo-400" />
              Academic & Contact Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  College Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                College / Institute Name
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:outline-none focus:border-indigo-500 transition"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Course / Degree
                </label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Academic Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="1st Year (FY)">1st Year (FY)</option>
                  <option value="2nd Year (SY)">2nd Year (SY)</option>
                  <option value="3rd Year (TY)">3rd Year (TY)</option>
                  <option value="4th Year (Final)">4th Year (Final)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Current CGPA (out of 10)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={cgpa}
                  onChange={(e) => setCgpa(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Primary Career Goal
                </label>
                <select
                  value={student.careerGoalId}
                  onChange={(e) => setStudentCareerGoal(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:outline-none focus:border-indigo-500 transition"
                >
                  {careerGoals.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Student Bio & Ambition
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Changes</span>
            </button>
          </form>
        </div>

        {/* Right Column: Skill Management (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          {/* Current Skills Card */}
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Verified Skills ({student.currentSkills.length})
              </h2>
              <span className="text-[10px] text-slate-400 font-medium">Mapped to Industry</span>
            </div>

            {/* Skills List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {student.currentSkills.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between p-2.5 bg-slate-900/60 hover:bg-slate-900 rounded-xl border border-slate-800 text-xs transition"
                >
                  <div>
                    <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <span>{s.name}</span>
                      {s.verified && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span>{s.category}</span>
                      <span>•</span>
                      <span className="text-indigo-400 font-medium">{s.proficiency || 'Intermediate'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeSkillFromStudent(s.name)}
                    className="p-1 text-slate-400 hover:text-rose-400 rounded transition"
                    title="Remove skill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Skill Form */}
            <form onSubmit={handleAddSkill} className="pt-3 border-t border-slate-800 space-y-2.5">
              <span className="text-xs font-bold text-white block">Add New Skill</span>
              <div>
                <SkillAutocompleteInput
                  value={newSkillName}
                  onChange={(val) => setNewSkillName(val)}
                  onSelectSkill={(selected) => {
                    setNewSkillName(selected.name);
                    if (selected.category) {
                      setNewSkillCategory(selected.category);
                    }
                  }}
                  existingSkills={student.currentSkills}
                  placeholder="Enter skill name (e.g. React, Docker, JavaScript)"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  className="text-xs px-2.5 py-1.5 border border-slate-800 bg-slate-900 text-white rounded-lg focus:outline-none focus:border-indigo-500"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Core CS">Core CS</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Design">Design</option>
                </select>

                <select
                  value={newSkillProficiency}
                  onChange={(e) => setNewSkillProficiency(e.target.value as any)}
                  className="text-xs px-2.5 py-1.5 border border-slate-800 bg-slate-900 text-white rounded-lg focus:outline-none focus:border-indigo-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to My Profile</span>
              </button>
            </form>

            {/* Quick 1-Click Suggestions */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Quick Add In-Demand Skills:
              </span>
              <div className="flex flex-wrap gap-1">
                {popularSkillSuggestions
                  .filter((sug) => !student.currentSkills.some((s) => s.name.toLowerCase() === sug.name.toLowerCase()))
                  .slice(0, 5)
                  .map((sug) => (
                    <button
                      key={sug.name}
                      type="button"
                      onClick={() =>
                        addSkillToStudent({
                          name: sug.name,
                          category: sug.category,
                          proficiency: 'Intermediate',
                          verified: true
                        })
                      }
                      className="text-[10px] px-2 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
                    >
                      + {sug.name}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
