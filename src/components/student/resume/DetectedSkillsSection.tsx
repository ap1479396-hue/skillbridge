import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Search,
  Filter,
  Trash2,
  Plus,
  X,
  Sparkles,
  ShieldCheck,
  Tag,
  CheckSquare,
  Square,
  AlertCircle,
  ArrowRight,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Skill } from '../../../types';

export interface ExtractedSkillItem {
  name: string;
  category: Skill['category'];
  confidence: number;
  evidence?: string | string[];
  sources?: string[];
  sourceSection?: string;
}

interface DetectedSkillsSectionProps {
  extractedSkills: ExtractedSkillItem[];
  studentProfileSkills: Skill[];
  onApplyExtractedSkills: (skills: ExtractedSkillItem[]) => void;
  onToggleSkillInProfile: (skillName: string, category: Skill['category']) => void;
  onRemoveSkill: (skillName: string) => void;
  onRemoveMultipleSkills: (skillNames: string[]) => void;
  onAddCustomSkill: (skill: ExtractedSkillItem) => void;
  onViewSkillMatrix: () => void;
  fileName?: string;
}

export const DetectedSkillsSection: React.FC<DetectedSkillsSectionProps> = ({
  extractedSkills,
  studentProfileSkills,
  onApplyExtractedSkills,
  onToggleSkillInProfile,
  onRemoveSkill,
  onRemoveMultipleSkills,
  onAddCustomSkill,
  onViewSkillMatrix,
  fileName
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [syncFilter, setSyncFilter] = useState<'ALL' | 'UNSYNCED' | 'SYNCED'>('ALL');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Add custom skill state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<Skill['category']>('Frontend');

  // Set of skills in student profile (case-insensitive)
  const profileSkillNames = useMemo(() => {
    return new Set(studentProfileSkills.map((s) => s.name.toLowerCase().trim()));
  }, [studentProfileSkills]);

  // Check for duplicate skills in extracted list
  const { uniqueSkills, duplicateCount } = useMemo(() => {
    const seen = new Set<string>();
    let dupes = 0;
    const unique: ExtractedSkillItem[] = [];

    for (const sk of extractedSkills) {
      const lower = sk.name.toLowerCase().trim();
      if (seen.has(lower)) {
        dupes++;
      } else {
        seen.add(lower);
        unique.push(sk);
      }
    }
    return { uniqueSkills: unique, duplicateCount: dupes };
  }, [extractedSkills]);

  // Category counts and compact summary
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    uniqueSkills.forEach((sk) => {
      const cat = sk.category || 'Technical';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [uniqueSkills]);

  // Categories list for filter dropdown
  const allCategories = useMemo(() => {
    return Object.keys(categoryCounts).sort();
  }, [categoryCounts]);

  // Dynamic AI Skill Summary generation from actual extracted data
  const aiSkillSummary = useMemo(() => {
    if (uniqueSkills.length === 0) return null;

    // Sort categories by frequency
    const sortedCats = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

    const domainNameMap: Record<string, string> = {
      Mechanical: 'Mechanical Design',
      Manufacturing: 'Manufacturing',
      Automation: 'Automation',
      Frontend: 'Frontend Engineering',
      Backend: 'Backend Architecture',
      Database: 'Database Systems',
      'Core CS': 'Core Computer Science',
      DevOps: 'DevOps & Tooling',
      'AI/ML': 'Artificial Intelligence & Machine Learning',
      Mobile: 'Mobile Engineering',
      Design: 'UI/UX Design',
      Security: 'Cybersecurity'
    };

    const topDomainNames = sortedCats.slice(0, 3).map(([cat]) => domainNameMap[cat] || cat);

    let areasString = '';
    if (topDomainNames.length === 1) {
      areasString = topDomainNames[0];
    } else if (topDomainNames.length === 2) {
      areasString = `${topDomainNames[0]} and ${topDomainNames[1]}`;
    } else {
      areasString = `${topDomainNames.slice(0, -1).join(', ')} and ${topDomainNames[topDomainNames.length - 1]}`;
    }

    const highestConfidenceSkills = [...uniqueSkills]
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 4)
      .map((s) => s.name)
      .join(', ');

    return {
      headline: `Strongest skill areas detected from this resume: ${areasString}.`,
      topDomains: topDomainNames,
      highestConfidenceSkills,
      topCategory: sortedCats[0] ? sortedCats[0][0] : 'Technical'
    };
  }, [uniqueSkills, categoryCounts]);

  // Filtered skills list
  const filteredSkills = useMemo(() => {
    return uniqueSkills.filter((sk) => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchesName = sk.name.toLowerCase().includes(q);
        const matchesCat = sk.category?.toLowerCase().includes(q);
        const matchesSource = sk.sourceSection?.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesSource) return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL' && sk.category !== selectedCategory) {
        return false;
      }

      // Sync filter
      const isSynced = profileSkillNames.has(sk.name.toLowerCase().trim());
      if (syncFilter === 'SYNCED' && !isSynced) return false;
      if (syncFilter === 'UNSYNCED' && isSynced) return false;

      return true;
    });
  }, [uniqueSkills, searchTerm, selectedCategory, syncFilter, profileSkillNames]);

  // Synced stats
  const syncedCount = useMemo(() => {
    return uniqueSkills.filter((sk) => profileSkillNames.has(sk.name.toLowerCase().trim())).length;
  }, [uniqueSkills, profileSkillNames]);

  const unsyncedCount = uniqueSkills.length - syncedCount;

  // Toggle selection
  const handleToggleSelect = (skillName: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillName) ? prev.filter((name) => name !== skillName) : [...prev, skillName]
    );
  };

  const handleSelectAll = () => {
    if (selectedSkills.length === filteredSkills.length) {
      setSelectedSkills([]);
    } else {
      setSelectedSkills(filteredSkills.map((s) => s.name));
    }
  };

  // Add selected to profile
  const handleAddSelectedToProfile = () => {
    const toAdd = uniqueSkills.filter((s) => selectedSkills.includes(s.name));
    onApplyExtractedSkills(toAdd);
    setSelectedSkills([]);
  };

  // Remove selected skills
  const handleRemoveSelectedSkills = () => {
    onRemoveMultipleSkills(selectedSkills);
    setSelectedSkills([]);
  };

  // Manual skill add
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const trimmed = newSkillName.trim();
    onAddCustomSkill({
      name: trimmed,
      category: newSkillCategory,
      confidence: 1.0,
      sourceSection: 'Manual Entry',
      sources: ['Manual Entry']
    });

    setNewSkillName('');
  };

  return (
    <div id="detected-skills-section" className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-5">
      {/* Top Header & Sync All Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Detected Skills</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  {uniqueSkills.length} VERIFIED
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                AI extraction strictly identifies skills verified from your uploaded resume content.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="sync-all-extracted-skills-btn"
            onClick={() => onApplyExtractedSkills(uniqueSkills)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md transition flex items-center gap-1.5"
            title="Sync all currently extracted skills from this resume to your student profile"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sync All to Student Profile</span>
          </button>
        </div>
      </div>

      {/* Compact Skill Category Summary */}
      <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-3.5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap font-bold text-white">
            <span className="text-indigo-300">{uniqueSkills.length} Skills Detected</span>
            <span className="text-slate-600">•</span>
            {/* Category breakdown pills */}
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <span
                key={cat}
                className="bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-md text-[11px] font-medium"
              >
                <strong className="text-white">{count}</strong> {cat}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-emerald-400 font-medium">
              {syncedCount} Synced to Profile
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-medium">
              {unsyncedCount} Not Synced
            </span>
            {duplicateCount > 0 && (
              <>
                <span className="text-slate-600">•</span>
                <span className="text-amber-400 font-medium">
                  {duplicateCount} duplicate{duplicateCount > 1 ? 's' : ''} filtered
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search, Category Filter, and Synced Filter Toolbar */}
      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="skill-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search detected skills or category..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-300">
              <Filter className="w-3 h-3 text-slate-400" />
              <span className="text-[11px] text-slate-500">Category:</span>
              <select
                id="skill-category-filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-white">All Categories ({uniqueSkills.length})</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">
                    {cat} ({categoryCounts[cat]})
                  </option>
                ))}
              </select>
            </div>

            {/* Sync status filter */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setSyncFilter('ALL')}
                className={`px-2 py-0.5 rounded-lg transition ${
                  syncFilter === 'ALL' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSyncFilter('UNSYNCED')}
                className={`px-2 py-0.5 rounded-lg transition ${
                  syncFilter === 'UNSYNCED' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Not Synced ({unsyncedCount})
              </button>
              <button
                type="button"
                onClick={() => setSyncFilter('SYNCED')}
                className={`px-2 py-0.5 rounded-lg transition ${
                  syncFilter === 'SYNCED' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Synced ({syncedCount})
              </button>
            </div>
          </div>
        </div>

        {/* Selection & Bulk Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs py-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="select-all-skills-btn"
              onClick={handleSelectAll}
              className="text-slate-300 hover:text-white flex items-center gap-1.5 transition font-medium"
            >
              {selectedSkills.length === filteredSkills.length && filteredSkills.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-indigo-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-500" />
              )}
              <span>Select All ({filteredSkills.length})</span>
            </button>

            {selectedSkills.length > 0 && (
              <span className="text-indigo-400 font-semibold text-[11px]">
                {selectedSkills.length} selected
              </span>
            )}
          </div>

          {selectedSkills.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in">
              <button
                type="button"
                id="add-selected-skills-btn"
                onClick={handleAddSelectedToProfile}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Selected to Profile</span>
              </button>
              <button
                type="button"
                id="remove-selected-skills-btn"
                onClick={handleRemoveSelectedSkills}
                className="px-3 py-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Selected</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Professional Detected Skill Cards */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/80">
          No detected skills matching current filters
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredSkills.map((sk) => {
            const isAlreadyInProfile = profileSkillNames.has(sk.name.toLowerCase().trim());
            const isSelected = selectedSkills.includes(sk.name);
            const confPercent = Math.round(sk.confidence * 100);
            const sourceText = sk.sourceSection || (sk.sources && sk.sources.length > 0 ? sk.sources[0] : 'Technical Skills');

            return (
              <div
                key={sk.name}
                id={`detected-skill-card-${sk.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between gap-3 transition-all ${
                  isAlreadyInProfile
                    ? 'bg-slate-950 border-emerald-500/30'
                    : isSelected
                    ? 'bg-indigo-500/5 border-indigo-500/40'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header: Checkbox + Name + Category */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => handleToggleSelect(sk.name)}
                      className="mt-0.5 text-slate-500 hover:text-white transition shrink-0"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-600" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white text-sm truncate flex items-center gap-1.5" title={sk.name}>
                        <span>{sk.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <span className="font-medium text-slate-300">{sk.category}</span>
                        <span>·</span>
                        <span className="text-indigo-300 font-semibold">{confPercent}% confidence</span>
                      </div>
                    </div>
                  </div>

                  {/* Remove skill from detected list button */}
                  <button
                    type="button"
                    onClick={() => onRemoveSkill(sk.name)}
                    title="Remove from detected skills"
                    className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition shrink-0"
                    aria-label={`Remove ${sk.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Visual Confidence Bar */}
                <div className="space-y-1">
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        confPercent >= 90
                          ? 'bg-emerald-400'
                          : confPercent >= 80
                          ? 'bg-indigo-400'
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${confPercent}%` }}
                    />
                  </div>
                </div>

                {/* Verified Indicator & Source Section */}
                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>✓ Verified from resume</span>
                  </div>
                  <div className="text-slate-400 truncate">
                    <span className="text-slate-500">Source:</span> {sourceText}
                  </div>
                </div>

                {/* Bottom Action: Add to Student Profile */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-500">
                    {isAlreadyInProfile ? 'In Student Profile' : 'Not yet in Profile'}
                  </span>

                  <button
                    type="button"
                    id={`toggle-skill-profile-${sk.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => onToggleSkillInProfile(sk.name, sk.category)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition flex items-center gap-1 ${
                      isAlreadyInProfile
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30'
                        : 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-600 hover:text-white'
                    }`}
                    title={isAlreadyInProfile ? 'Click to remove from student profile' : 'Add to student profile'}
                  >
                    {isAlreadyInProfile ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Skill Summary Card below the skills */}
      {aiSkillSummary && (
        <div
          id="ai-skill-summary-card"
          className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 shadow-xl space-y-2.5 relative overflow-hidden"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">AI Skill Summary</h4>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded border border-indigo-500/30">
                  REAL-TIME INTELLIGENCE
                </span>
              </div>
              <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                &ldquo;{aiSkillSummary.headline}&rdquo;
              </p>
              <p className="text-xs text-slate-400 leading-relaxed pt-0.5">
                Highest confidence skills: <span className="text-indigo-300 font-medium">{aiSkillSummary.highestConfidenceSkills}</span>.
                {' '}{syncedCount} of {uniqueSkills.length} detected skills are already linked to your active profile.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Skill Manually Form */}
      <form onSubmit={handleFormSubmit} className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80">
        <span className="text-xs text-slate-400 font-medium">Add another skill:</span>
        <input
          type="text"
          id="manual-skill-name-input"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          placeholder="e.g. AutoCAD, Docker, PostgreSQL..."
          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-w-[180px]"
        />
        <select
          id="manual-skill-category-select"
          value={newSkillCategory}
          onChange={(e) => setNewSkillCategory(e.target.value as Skill['category'])}
          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Database">Database</option>
          <option value="DevOps">DevOps</option>
          <option value="Core CS">Core CS</option>
          <option value="AI/ML">AI/ML</option>
          <option value="Mobile">Mobile</option>
          <option value="Design">Design</option>
          <option value="Security">Security</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Automation">Automation</option>
          <option value="Manufacturing">Manufacturing</option>
        </select>
        <button
          type="submit"
          id="submit-manual-skill-btn"
          disabled={!newSkillName.trim()}
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-xs"
        >
          <Plus className="w-3 h-3" />
          <span>Add</span>
        </button>
      </form>

      {/* Next Step Navigation CTA */}
      <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-indigo-200">
          <span className="font-bold">Next: </span>
          Evaluate your extracted skills against hiring requirements in the Skill-Gap Matrix.
        </div>
        <button
          type="button"
          onClick={onViewSkillMatrix}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1 shrink-0"
        >
          <span>View Skill-Gap Matrix</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
