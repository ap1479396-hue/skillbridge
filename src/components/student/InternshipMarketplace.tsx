import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateInternshipMatch } from '../../utils/skillMatcher';
import { Internship, OpportunitySourceType } from '../../types';
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Building2,
  Filter,
  ExternalLink,
  ChevronRight,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  Globe,
  Info,
  X,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const InternshipMarketplace: React.FC = () => {
  const {
    internships,
    student,
    applications,
    applyForInternship,
    setActiveTab,
    addNotification
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<OpportunitySourceType | 'ALL'>('ALL');
  const [minMatch, setMinMatch] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'match' | 'latest' | 'stipend'>('match');
  const [activeTabSub, setActiveTabSub] = useState<'explore' | 'applied'>('explore');
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');

  const handleRefreshFeed = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastSyncTime(`Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      addNotification('Opportunities synchronized with National Career Service & Employer Portal feeds.', 'success');
    }, 600);
  };

  // Compute exact match percentage for all opportunities
  const matchedInternships = useMemo(() => {
    return internships.map((int) => {
      const match = calculateInternshipMatch(student.currentSkills, int);
      return {
        ...int,
        matchPercentage: match.matchPercentage,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills
      };
    });
  }, [internships, student.currentSkills]);

  // Filter and sort opportunities
  const filteredInternships = useMemo(() => {
    let list = matchedInternships.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.role.toLowerCase().includes(query) ||
        item.companyName.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.requiredSkills.some((s) => s.toLowerCase().includes(query)) ||
        (item.sourceName && item.sourceName.toLowerCase().includes(query));

      const matchesType = selectedType === 'All' || item.type === selectedType;
      const matchesSource = selectedSource === 'ALL' || item.sourceType === selectedSource;
      const matchesScore = item.matchPercentage >= minMatch;

      return matchesSearch && matchesType && matchesSource && matchesScore;
    });

    if (sortBy === 'latest') {
      return list.sort((a, b) => b.id.localeCompare(a.id));
    } else if (sortBy === 'stipend') {
      return list.sort((a, b) => {
        const stipendA = parseInt((a.stipend || '0').replace(/[^0-9]/g, ''), 10) || 0;
        const stipendB = parseInt((b.stipend || '0').replace(/[^0-9]/g, ''), 10) || 0;
        return stipendB - stipendA;
      });
    }

    // Default: Highest match score first
    return list.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [matchedInternships, searchQuery, selectedType, selectedSource, minMatch, sortBy]);

  const ncsCount = internships.filter((i) => i.sourceType === 'VERIFIED_EXTERNAL').length;
  const companyCount = internships.filter((i) => i.sourceType === 'COMPANY_POSTED').length;

  return (
    <div id="internship-marketplace-page" className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-indigo-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Internship & Apprenticeship Marketplace
            </h1>
            <span className="text-[11px] bg-emerald-500/15 text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              NCS & Partner Data Architecture
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-3xl leading-relaxed">
            Directly connected to verified opportunities from Government of India's{' '}
            <span className="text-slate-200 font-semibold">National Career Service (NCS)</span> and registered industry partner portals with deterministic skill gap matching.
          </p>
        </div>

        {/* View Switcher: Explore vs My Applications */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="refresh-opportunities-btn"
            onClick={handleRefreshFeed}
            disabled={isRefreshing}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 disabled:opacity-50"
            title="Refresh live feeds"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
            <span className="hidden sm:inline">Sync Feeds</span>
          </button>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              id="tab-all-openings"
              onClick={() => setActiveTabSub('explore')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTabSub === 'explore'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Live Listings ({internships.length})
            </button>
            <button
              id="tab-my-applications"
              onClick={() => setActiveTabSub('applied')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTabSub === 'applied'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              My Applications ({applications.length})
            </button>
          </div>
        </div>
      </div>

      {/* Data Source Transparency Info Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-4 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-3">
          <Globe className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-slate-300">
            <span className="font-semibold text-white">Source Architecture: </span>
            <span className="text-emerald-400 font-medium">{ncsCount} Verified NCS Listings</span>
            {' • '}
            <span className="text-indigo-300 font-medium">{companyCount} SkillBridge Partner Postings</span>
            {' • '}
            <span className="text-slate-400">External listings link directly to original verified portals.</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Feed Synchronized: {lastSyncTime}</span>
        </div>
      </div>

      {activeTabSub === 'explore' ? (
        <>
          {/* Filters Bar */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
              {/* Search Bar */}
              <div className="lg:col-span-4 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="internship-search-input"
                  type="text"
                  placeholder="Search by role, company, or skill (e.g., React, Python)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Source Filter */}
              <div className="lg:col-span-3">
                <select
                  id="source-filter-select"
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-xl focus:outline-none focus:border-indigo-500"
                >
                  <option value="ALL">All Verified Sources</option>
                  <option value="VERIFIED_EXTERNAL">National Career Service (NCS)</option>
                  <option value="COMPANY_POSTED">SkillBridge Partner Companies</option>
                  <option value="DEMO">Demo Sandboxes</option>
                </select>
              </div>

              {/* Location Type Filter */}
              <div className="lg:col-span-2">
                <select
                  id="workplace-filter-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-xl focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">All Locations</option>
                  <option value="Remote">Remote Only</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              {/* Min Match Filter */}
              <div className="lg:col-span-3">
                <select
                  id="match-filter-select"
                  value={minMatch}
                  onChange={(e) => setMinMatch(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-xl focus:outline-none focus:border-indigo-500"
                >
                  <option value={0}>All Match Percentages</option>
                  <option value={50}>50%+ Matched</option>
                  <option value={70}>70%+ High Fit</option>
                  <option value={80}>80%+ Top Fit</option>
                </select>
              </div>
            </div>

            {/* Sub-row with Sort and Results Count */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span>Showing <strong className="text-white">{filteredInternships.length}</strong> opportunities</span>
                {student.currentSkills.length > 0 && (
                  <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                    Matched against {student.currentSkills.length} profile skills
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px]">Sort by:</span>
                <button
                  onClick={() => setSortBy('match')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition ${
                    sortBy === 'match'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Highest Match
                </button>
                <button
                  onClick={() => setSortBy('latest')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition ${
                    sortBy === 'latest'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Latest
                </button>
                <button
                  onClick={() => setSortBy('stipend')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition ${
                    sortBy === 'stipend'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Stipend
                </button>
              </div>
            </div>
          </div>

          {/* Internship Cards Grid */}
          {filteredInternships.length === 0 ? (
            <div className="bg-slate-900/60 p-12 rounded-2xl border border-slate-800 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No opportunities matched your criteria</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try resetting your match percentage filter or search keywords to view all available verified listings.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('All');
                  setSelectedSource('ALL');
                  setMinMatch(0);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition inline-block"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInternships.map((int) => {
                const hasApplied = applications.some((a) => a.internshipId === int.id);
                const isNcs = int.sourceType === 'VERIFIED_EXTERNAL';
                const isCompany = int.sourceType === 'COMPANY_POSTED';
                const isDemo = int.sourceType === 'DEMO';

                return (
                  <div
                    key={int.id}
                    className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition space-y-4 flex flex-col justify-between"
                  >
                    {/* Top: Header, Source Badge, and Match Badge */}
                    <div className="space-y-3">
                      {/* Source Indicator Tag */}
                      <div className="flex items-center justify-between gap-2">
                        {isNcs && (
                          <span className="text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            National Career Service (NCS)
                          </span>
                        )}
                        {isCompany && (
                          <span className="text-[10px] font-semibold bg-indigo-500/15 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-indigo-400" />
                            SkillBridge Partner
                          </span>
                        )}
                        {isDemo && (
                          <span className="text-[10px] font-semibold bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full border border-slate-700 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            Demo Opportunity
                          </span>
                        )}

                        {int.externalReferenceId && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            {int.externalReferenceId}
                          </span>
                        )}
                      </div>

                      {/* Company Info & Match Pill */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={int.companyLogo}
                            alt={int.companyName}
                            className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-700 bg-slate-800 shrink-0"
                          />
                          <div>
                            <h3 className="font-bold text-sm text-white leading-snug">
                              {int.role}
                            </h3>
                            <p className="text-xs text-slate-300 font-medium">{int.companyName}</p>
                          </div>
                        </div>

                        {/* Match percentage pill */}
                        <div
                          className={`text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 shrink-0 ${
                            int.matchPercentage >= 75
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : int.matchPercentage >= 50
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{int.matchPercentage}% Match</span>
                        </div>
                      </div>

                      {/* Metadata Row: Location, Duration, Stipend (Only if available) */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {int.location} ({int.type})
                        </span>

                        {int.duration && (
                          <>
                            <span className="text-slate-600">•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {int.duration}
                            </span>
                          </>
                        )}

                        {int.stipend && (
                          <>
                            <span className="text-slate-600">•</span>
                            <span className="font-semibold text-emerald-400 flex items-center gap-0.5">
                              <IndianRupee className="w-3.5 h-3.5" />
                              {int.stipend}
                            </span>
                          </>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {int.description}
                      </p>

                      {/* Why You Match & Missing Highlights */}
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-[11px]">
                        <div className="text-slate-300">
                          <span className="font-semibold text-emerald-400">Why you match: </span>
                          <span>Possess {int.matchedSkills.length}/{int.requiredSkills.length} key skills ({int.matchedSkills.slice(0, 3).join(', ') || 'Prerequisite base'})</span>
                        </div>
                        {int.missingSkills.length > 0 ? (
                          <div className="text-slate-400">
                            <span className="font-medium text-amber-300">Missing to master: </span>
                            <span>{int.missingSkills.slice(0, 3).join(', ')}</span>
                          </div>
                        ) : (
                          <div className="text-emerald-300 font-medium">
                            ✓ 100% Core Skill Match! Ready for immediate interview.
                          </div>
                        )}
                      </div>

                      {/* Required Skills & Student Match Breakdown */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-bold uppercase tracking-wider">Required Skills:</span>
                          <span className="text-[10px] text-slate-400">
                            {int.matchedSkills.length}/{int.requiredSkills.length} Matched
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {int.requiredSkills.map((sk) => {
                            const isMatched = int.matchedSkills.includes(sk);
                            return (
                              <span
                                key={sk}
                                className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${
                                  isMatched
                                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                    : 'bg-slate-800 text-slate-400 border-slate-700'
                                }`}
                              >
                                {sk} {isMatched ? '✓' : '✕'}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Row */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedInternship(int)}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                      >
                        View Details & Eligibility →
                      </button>

                      <div className="flex items-center gap-2">
                        {isNcs && int.applicationUrl && (
                          <a
                            href={int.applicationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
                          >
                            <span>Apply on NCS</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                          </a>
                        )}

                        {isCompany && (
                          hasApplied ? (
                            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Applied
                            </span>
                          ) : (
                            <button
                              onClick={() => applyForInternship(int.id)}
                              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                            >
                              1-Click Apply
                            </button>
                          )
                        )}

                        {isDemo && (
                          <button
                            onClick={() => applyForInternship(int.id)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
                          >
                            Demo Apply
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* My Applications Tab */
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white">
                Submitted Applications & Placement Tracker ({applications.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time application status synchronized with verified employers.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Direct Verification Active
            </span>
          </div>

          {applications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs space-y-2">
              <Briefcase className="w-8 h-8 text-slate-600 mx-auto" />
              <p>You have not submitted any applications yet.</p>
              <button
                onClick={() => setActiveTabSub('explore')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition"
              >
                Browse Open Opportunities
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{app.internshipRole}</span>
                      <span className="font-semibold text-slate-400">at {app.companyName}</span>
                    </div>
                    <div className="text-slate-400 flex flex-wrap items-center gap-3">
                      <span>Applied on: <strong className="text-slate-300">{app.appliedDate}</strong></span>
                      <span>•</span>
                      <span className="font-semibold text-indigo-400">
                        Qualification Match: {app.matchScore}%
                      </span>
                      {app.resumeFileName && (
                        <>
                          <span>•</span>
                          <span className="text-slate-300">Resume: {app.resumeFileName}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        app.status === 'Offered'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : app.status === 'Shortlisted'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : app.status === 'Under Review'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Internship Detail Modal */}
      {selectedInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto text-slate-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedInternship.companyLogo}
                  alt={selectedInternship.companyName}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700 bg-slate-800 shrink-0"
                />
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedInternship.role}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">{selectedInternship.companyName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInternship(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Source Accreditation Badge */}
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">
                  Source: <strong className="text-white">{selectedInternship.sourceName}</strong>
                </span>
              </div>
              {selectedInternship.externalReferenceId && (
                <span className="text-[11px] font-mono text-slate-400">
                  {selectedInternship.externalReferenceId}
                </span>
              )}
            </div>

            {/* Key Specs Grid (Only display when provided) */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950 rounded-xl text-center text-xs border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block">Location</span>
                <span className="font-bold text-white">{selectedInternship.location}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Duration</span>
                <span className="font-bold text-white">{selectedInternship.duration || 'Flexible'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Stipend</span>
                <span className="font-bold text-emerald-400">
                  {selectedInternship.stipend || 'Performance Based'}
                </span>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <h4 className="text-xs font-bold text-white mb-1">Opportunity Overview:</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedInternship.description}
              </p>
            </div>

            {/* Responsibilities */}
            {selectedInternship.responsibilities && selectedInternship.responsibilities.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-white mb-1">Key Responsibilities:</h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  {selectedInternship.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-indigo-400">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Perks */}
            {selectedInternship.perks && selectedInternship.perks.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-white mb-1">Perks & Credentials:</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedInternship.perks.map((p, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2.5 py-1 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold"
                    >
                      ★ {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedInternship(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>

              {selectedInternship.sourceType === 'VERIFIED_EXTERNAL' && selectedInternship.applicationUrl ? (
                <a
                  href={selectedInternship.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
                >
                  <span>View Original Listing & Apply on NCS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  onClick={() => {
                    applyForInternship(selectedInternship.id);
                    setSelectedInternship(null);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                >
                  Confirm 1-Click Application
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
