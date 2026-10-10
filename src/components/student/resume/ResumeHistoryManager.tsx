import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  History,
  Search,
  ArrowUpDown,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Edit2,
  Eye,
  Download,
  Sparkles,
  FileText,
  AlertTriangle,
  UploadCloud,
  CheckSquare,
  Square,
  X,
  User,
  GraduationCap,
  Calendar,
  Layers
} from 'lucide-react';
import { UploadedResumeData } from '../../../types';

interface ResumeHistoryManagerProps {
  resumeHistory: UploadedResumeData[];
  activeResume: UploadedResumeData | null;
  onSetActive: (resume: UploadedResumeData) => void;
  onDelete: (resumeId: string) => void;
  onDeleteMultiple: (resumeIds: string[]) => void;
  onRename: (resumeId: string, newFileName: string) => void;
  onViewAnalysis: (resume: UploadedResumeData) => void;
  onTriggerUpload: () => void;
}

type SortOption = 'recent' | 'oldest' | 'name-asc' | 'name-desc';

export const ResumeHistoryManager: React.FC<ResumeHistoryManagerProps> = ({
  resumeHistory,
  activeResume,
  onSetActive,
  onDelete,
  onDeleteMultiple,
  onRename,
  onViewAnalysis,
  onTriggerUpload
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Dropdown menu state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Single delete modal state
  const [resumeToDelete, setResumeToDelete] = useState<UploadedResumeData | null>(null);

  // Bulk delete modal state
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // Rename modal state
  const [resumeToRename, setResumeToRename] = useState<UploadedResumeData | null>(null);
  const [renameInput, setRenameInput] = useState('');

  // Preview / Download modal state
  const [resumeToPreview, setResumeToPreview] = useState<UploadedResumeData | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter resumes
  const filteredResumes = useMemo(() => {
    let result = [...resumeHistory];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter((res) => {
        const fileMatch = res.fileName?.toLowerCase().includes(q);
        const nameMatch = (res.candidateName || res.name || '')?.toLowerCase().includes(q);
        const degreeMatch = res.degree?.toLowerCase().includes(q);
        const branchMatch = (res.branch || res.course || '')?.toLowerCase().includes(q);
        return fileMatch || nameMatch || degreeMatch || branchMatch;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'recent') {
        const timeA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
        const timeB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
        return timeB - timeA;
      }
      if (sortBy === 'oldest') {
        const timeA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
        const timeB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
        return timeA - timeB;
      }
      if (sortBy === 'name-asc') {
        const nameA = a.fileName || '';
        const nameB = b.fileName || '';
        return nameA.localeCompare(nameB);
      }
      if (sortBy === 'name-desc') {
        const nameA = a.fileName || '';
        const nameB = b.fileName || '';
        return nameB.localeCompare(nameA);
      }
      return 0;
    });

    return result;
  }, [resumeHistory, searchTerm, sortBy]);

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredResumes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredResumes.map((r) => r.id || r.resumeId));
    }
  };

  const handleConfirmSingleDelete = () => {
    if (!resumeToDelete) return;
    const id = resumeToDelete.id || resumeToDelete.resumeId;
    onDelete(id);
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    setResumeToDelete(null);
  };

  const handleConfirmBulkDelete = () => {
    onDeleteMultiple(selectedIds);
    setSelectedIds([]);
    setShowBulkDeleteModal(false);
    setIsSelectMode(false);
  };

  const handleOpenRename = (res: UploadedResumeData) => {
    setResumeToRename(res);
    setRenameInput(res.fileName || '');
    setOpenMenuId(null);
  };

  const handleConfirmRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeToRename || !renameInput.trim()) return;
    onRename(resumeToRename.id || resumeToRename.resumeId, renameInput.trim());
    setResumeToRename(null);
  };

  const handleDownloadText = (res: UploadedResumeData) => {
    const element = document.createElement('a');
    const file = new Blob([res.rawText || ''], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = res.fileName.endsWith('.txt') ? res.fileName : `${res.fileName.replace(/\.[^/.]+$/, '')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Empty state if no resumes uploaded
  if (resumeHistory.length === 0) {
    return (
      <div
        id="resume-history-empty-state"
        className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 text-center space-y-4 shadow-xl"
      >
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
          <FileText className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">No resumes uploaded yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Upload a resume to begin AI skill analysis.
          </p>
        </div>
        <button
          type="button"
          id="empty-state-upload-resume-btn"
          onClick={onTriggerUpload}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition inline-flex items-center gap-1.5"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Resume</span>
        </button>
      </div>
    );
  }

  return (
    <div id="resume-history-section" className="bg-slate-900/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
      {/* Top Header Row with dynamic count and bulk controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Uploaded Resume History ({resumeHistory.length})</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Manage saved resumes, switch active context, or perform bulk cleanup
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            id="toggle-select-mode-btn"
            onClick={() => {
              setIsSelectMode(!isSelectMode);
              if (isSelectMode) setSelectedIds([]);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
              isSelectMode
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            {isSelectMode ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
            <span>{isSelectMode ? 'Cancel Selection' : 'Select'}</span>
          </button>

          {isSelectMode && selectedIds.length > 0 && (
            <button
              type="button"
              id="bulk-delete-selected-btn"
              onClick={() => setShowBulkDeleteModal(true)}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5 animate-in fade-in"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="resume-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search resumes by filename, candidate, degree, branch..."
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

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-300">
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
            <span className="text-[11px] text-slate-500">Sort:</span>
            <select
              id="resume-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
            >
              <option value="recent" className="bg-slate-900 text-white">Recent</option>
              <option value="oldest" className="bg-slate-900 text-white">Oldest</option>
              <option value="name-asc" className="bg-slate-900 text-white">Name A-Z</option>
              <option value="name-desc" className="bg-slate-900 text-white">Name Z-A</option>
            </select>
          </div>

          {isSelectMode && filteredResumes.length > 0 && (
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-medium transition"
            >
              {selectedIds.length === filteredResumes.length ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>
      </div>

      {/* Resumes Grid */}
      {filteredResumes.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/80">
          No resumes found matching &quot;{searchTerm}&quot;
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" ref={menuRef}>
          {filteredResumes.map((res) => {
            const resId = res.id || res.resumeId;
            const isActive = (activeResume?.id || activeResume?.resumeId) === resId;
            const isSelected = selectedIds.includes(resId);
            const isMenuOpen = openMenuId === resId;

            return (
              <div
                key={resId}
                className={`relative rounded-xl border p-3.5 transition-all text-xs flex flex-col justify-between gap-3 ${
                  isActive
                    ? 'bg-slate-950 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                    : isSelected
                    ? 'bg-indigo-500/5 border-indigo-500/30'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                {/* Top Row: File Name, ACTIVE Badge, Checkbox & Three-Dot Menu */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    {isSelectMode && (
                      <button
                        type="button"
                        onClick={() => handleToggleSelect(resId)}
                        className="mt-0.5 text-slate-400 hover:text-white transition shrink-0"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-indigo-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600" />
                        )}
                      </button>
                    )}
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white truncate max-w-[200px]" title={res.fileName}>
                          {res.fileName}
                        </span>
                        {isActive && (
                          <span
                            id={`active-resume-badge-${resId}`}
                            className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/40 tracking-wider shadow-xs"
                          >
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 truncate">
                        <User className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{res.candidateName || res.name || 'Candidate'}</span>
                        {res.degree && (
                          <>
                            <span>•</span>
                            <span className="text-slate-300 truncate">{res.degree}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Three-dot Menu Button */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      id={`resume-menu-btn-${resId}`}
                      onClick={() => setOpenMenuId(isMenuOpen ? null : resId)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      aria-label="Resume options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                      <div className="absolute right-0 top-7 z-40 w-44 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 text-xs animate-in fade-in duration-150">
                        {!isActive && (
                          <button
                            type="button"
                            onClick={() => {
                              onSetActive(res);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-left text-slate-300 hover:text-white hover:bg-indigo-600/20 flex items-center gap-2 transition"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Set as Active</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            onViewAnalysis(res);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 text-left text-slate-300 hover:text-white hover:bg-indigo-600/20 flex items-center gap-2 transition"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                          <span>View Analysis</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setResumeToPreview(res);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 text-left text-slate-300 hover:text-white hover:bg-indigo-600/20 flex items-center gap-2 transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          <span>View / Download</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenRename(res)}
                          className="w-full px-3 py-1.5 text-left text-slate-300 hover:text-white hover:bg-indigo-600/20 flex items-center gap-2 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Rename</span>
                        </button>
                        <div className="h-px bg-slate-800 my-1" />
                        <button
                          type="button"
                          onClick={() => {
                            setResumeToDelete(res);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 text-left text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Metadata & Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-500/15 text-indigo-300 px-2 py-0.5 rounded font-medium border border-indigo-500/20">
                      {res.skills?.length || 0} skills
                    </span>
                    {res.branch && (
                      <span className="text-slate-400 truncate max-w-[110px] hidden sm:inline" title={res.branch}>
                        {res.branch}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!isActive ? (
                      <button
                        type="button"
                        onClick={() => onSetActive(res)}
                        className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg font-semibold transition flex items-center gap-1"
                      >
                        <span>Set Active</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onViewAnalysis(res)}
                        className="px-2.5 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-lg font-semibold transition flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Analyze</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setResumeToDelete(res)}
                      className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      title="Delete resume"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SINGLE RESUME DELETE CONFIRMATION MODAL */}
      {resumeToDelete && (
        <div
          id="single-delete-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setResumeToDelete(null)}
        >
          <div
            id="single-delete-modal"
            className="bg-slate-900 border border-rose-500/30 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete this resume?</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  This will remove the uploaded resume and its associated AI analysis.
                </p>
              </div>
            </div>

            <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-3 text-xs space-y-1">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5 truncate">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span className="truncate">{resumeToDelete.fileName}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Detected: {resumeToDelete.skills?.length || 0} skills · Candidate: {resumeToDelete.candidateName || resumeToDelete.name || 'Candidate'}
              </div>
            </div>

            <div className="text-[11px] text-slate-500">
              Note: Your registered Student Profile data will remain completely safe and untouched.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setResumeToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-delete-resume-btn"
                onClick={handleConfirmSingleDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Resume</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK DELETE CONFIRMATION MODAL */}
      {showBulkDeleteModal && (
        <div
          id="bulk-delete-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setShowBulkDeleteModal(false)}
        >
          <div
            id="bulk-delete-modal"
            className="bg-slate-900 border border-rose-500/30 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete {selectedIds.length} selected resumes?</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  This will remove the {selectedIds.length} selected resumes and their associated AI analysis.
                </p>
              </div>
            </div>

            <div className="text-[11px] text-slate-500">
              Note: This action cannot be undone. Registered Student Profile data will NOT be affected.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkDeleteModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-bulk-delete-btn"
                onClick={handleConfirmBulkDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete {selectedIds.length} Resumes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENAME MODAL */}
      {resumeToRename && (
        <div
          id="rename-resume-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setResumeToRename(null)}
        >
          <form
            id="rename-resume-form"
            onSubmit={handleConfirmRename}
            className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Edit2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Rename Resume</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update the display filename for this resume in history
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="rename-input" className="text-xs text-slate-300 font-medium">Filename</label>
              <input
                id="rename-input"
                type="text"
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                placeholder="e.g. Aarav_Sharma_Resume_Updated.pdf"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setResumeToRename(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="save-rename-btn"
                disabled={!renameInput.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW / PREVIEW MODAL */}
      {resumeToPreview && (
        <div
          id="preview-resume-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setResumeToPreview(null)}
        >
          <div
            id="preview-resume-modal"
            className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                    {resumeToPreview.fileName}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Extracted Resume Details & Raw Text Preview
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadText(resumeToPreview)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
                  title="Download raw extracted text"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResumeToPreview(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Extracted Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500">Candidate</span>
                <div className="font-semibold text-white truncate">{resumeToPreview.candidateName || resumeToPreview.name || 'N/A'}</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500">Degree & Year</span>
                <div className="font-semibold text-white truncate">{resumeToPreview.degree || 'Degree'} ({resumeToPreview.year || 'N/A'})</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500">College</span>
                <div className="font-semibold text-white truncate">{resumeToPreview.college || 'N/A'}</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500">Skills Detected</span>
                <div className="font-semibold text-indigo-300">{resumeToPreview.skills?.length || 0} skills</div>
              </div>
            </div>

            {/* Skills Pills */}
            {resumeToPreview.skills && resumeToPreview.skills.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-300">Detected Skills:</span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-950/50 rounded-xl border border-slate-800/80">
                  {resumeToPreview.skills.map((sk) => (
                    <span
                      key={sk.name}
                      className="text-[10px] bg-slate-800/80 text-slate-300 border border-slate-700/80 px-2 py-0.5 rounded-md flex items-center gap-1"
                    >
                      <span className="font-medium">{sk.name}</span>
                      <span className="text-indigo-400">({Math.round(sk.confidence * 100)}%)</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Raw Text Box */}
            <div className="flex-1 min-h-0 space-y-1">
              <span className="text-xs font-semibold text-slate-300">Raw Extracted Text:</span>
              <pre className="text-[11px] font-mono text-slate-300 bg-slate-950 p-3 rounded-xl max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
                {resumeToPreview.rawText || 'No raw text found in this record.'}
              </pre>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  onSetActive(resumeToPreview);
                  setResumeToPreview(null);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Set as Active Resume</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
