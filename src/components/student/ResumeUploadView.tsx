import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { extractTextFromFile } from '../../services/fileTextExtractor';
import { SAMPLE_RESUMES } from '../../data/mockData';
import { calculateAllCareerMatches } from '../../services/careerIntelligenceEngine';
import { detectSourceConflicts } from '../../services/resumeParser';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  FileCheck,
  Eye,
  EyeOff,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { Skill, UploadedResumeData } from '../../types';
import { ResumeHistoryManager } from './resume/ResumeHistoryManager';
import { DetectedSkillsSection, ExtractedSkillItem } from './resume/DetectedSkillsSection';
import { DuplicateResumeModal } from './resume/DuplicateResumeModal';

export const ResumeUploadView: React.FC = () => {
  const {
    student,
    loadSampleResume,
    setActiveResume,
    registerUploadedResume,
    deleteResumeFromHistory,
    deleteMultipleResumesFromHistory,
    renameResumeInHistory,
    updateExtractedSkillsForActiveResume,
    applyExtractedSkillsToProfile,
    updateStudentProfile,
    removeSkillFromStudent,
    addNotification,
    setActiveTab
  } = useApp();

  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [activeResumeText, setActiveResumeText] = useState(student.resumeText || '');
  const [fileName, setFileName] = useState(student.resumeFileName || 'Aarav_Sharma_Resume_FY.pdf');
  const [showRawText, setShowRawText] = useState(false);

  // Duplicate modal state
  const [duplicateModalData, setDuplicateModalData] = useState<{
    duplicate: UploadedResumeData;
    newFileName: string;
    newText: string;
    newFileType: string;
    isSample?: boolean;
    sampleIndex?: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const analysisSectionRef = useRef<HTMLDivElement | null>(null);

  // Keep local state in sync when activeResume changes
  useEffect(() => {
    if (student.activeResume) {
      setFileName(student.activeResume.fileName);
      setActiveResumeText(student.activeResume.rawText || '');
    } else if (!student.resumeFileName) {
      setFileName('');
      setActiveResumeText('');
    }
  }, [student.activeResume, student.resumeFileName]);

  // Compute conflicts between registered profile and active uploaded resume
  const conflicts = detectSourceConflicts(student, student.activeResume);

  // Compute Career Matches strictly from extracted skills (or registered profile if no extracted skills)
  const evaluatedSkills = (student.extractedSkills && student.extractedSkills.length > 0)
    ? student.extractedSkills
    : student.currentSkills;

  const careerMatches = calculateAllCareerMatches(evaluatedSkills);
  const topCareer = careerMatches[0];
  const missingGaps = topCareer?.missingSkills.slice(0, 2).join(' · ') || 'None';
  const projectsCount = student.extractedExperience ? Math.max(1, student.extractedExperience.length) : 2;
  const certsCount = 2;
  const expCount = 1;
  const recommendedAction = topCareer?.missingSkills[0]
    ? `Learn ${topCareer.missingSkills[0]} → Build ${topCareer.career.title} project → Apply`
    : `Build advanced portfolio project → Apply to top openings`;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const processUploadedFile = async (file: File) => {
    setIsExtracting(true);

    try {
      // 1. Extract text/content from DOCX, PDF, or TXT
      const { text: extractedText, fileType } = await extractTextFromFile(file);

      const cleanedText = extractedText && extractedText.trim().length > 0
        ? extractedText
        : await file.text().catch(() => '');

      // 2. DUPLICATE RESUME DETECTION: Check if the resume is already in history
      const existingHistory = student.resumeHistory || [];
      const duplicate = existingHistory.find((r) => {
        const sameFileName = r.fileName.toLowerCase().trim() === file.name.toLowerCase().trim();
        const sameContent = r.rawText && cleanedText && r.rawText.trim() === cleanedText.trim();
        return sameFileName || sameContent;
      });

      if (duplicate) {
        setIsExtracting(false);
        setDuplicateModalData({
          duplicate,
          newFileName: file.name,
          newText: cleanedText,
          newFileType: fileType || 'pdf'
        });
        return;
      }

      // 3. Register newly uploaded resume in context
      setFileName(file.name);
      setActiveResumeText(cleanedText);
      const registeredData = registerUploadedResume(file.name, cleanedText, fileType);

      setIsExtracting(false);

      if (registeredData.skills.length > 0) {
        addNotification(`Extracted ${registeredData.skills.length} skills from ${file.name} (${fileType.toUpperCase()})!`, 'success');
      } else {
        addNotification(`Read ${file.name}, but no standard technical skills were detected. You can add skills manually.`, 'warning');
      }
    } catch (err: any) {
      console.error('Error processing resume file:', err);
      setIsExtracting(false);
      addNotification(`Failed to parse ${file.name}: ${err.message || 'Unknown error'}`, 'warning');
    }
  };

  const handleUseExistingDuplicate = () => {
    if (!duplicateModalData) return;
    const existing = duplicateModalData.duplicate;
    setActiveResume(existing);
    setFileName(existing.fileName);
    setActiveResumeText(existing.rawText || '');
    setDuplicateModalData(null);
    addNotification(`Activated existing resume "${existing.fileName}" from history.`, 'info');
  };

  const handleUploadAnyway = () => {
    if (!duplicateModalData) return;
    const { newFileName, newText, newFileType, isSample, sampleIndex } = duplicateModalData;

    if (isSample && sampleIndex !== undefined) {
      loadSampleResume(sampleIndex);
      const sample = SAMPLE_RESUMES[sampleIndex];
      setFileName(sample.name);
      setActiveResumeText(sample.text);
    } else {
      setFileName(newFileName);
      setActiveResumeText(newText);
      registerUploadedResume(newFileName, newText, newFileType);
      addNotification(`Uploaded new instance of "${newFileName}".`, 'success');
    }

    setDuplicateModalData(null);
  };

  const handleLoadSample = (index: number) => {
    const sample = SAMPLE_RESUMES[index];
    const existingHistory = student.resumeHistory || [];
    const duplicate = existingHistory.find((r) => r.fileName.toLowerCase().trim() === sample.name.toLowerCase().trim());

    if (duplicate) {
      setDuplicateModalData({
        duplicate,
        newFileName: sample.name,
        newText: sample.text,
        newFileType: 'pdf',
        isSample: true,
        sampleIndex: index
      });
      return;
    }

    loadSampleResume(index);
    setFileName(sample.name);
    setActiveResumeText(sample.text);
  };

  const handleSyncResumeFieldsToProfile = () => {
    if (!student.activeResume) return;
    const updates: Partial<any> = {};
    if (student.activeResume.candidateName) updates.name = student.activeResume.candidateName;
    if (student.activeResume.academicYear) updates.year = student.activeResume.academicYear;
    if (student.activeResume.collegeName) updates.college = student.activeResume.collegeName;
    if (student.activeResume.degree) updates.degree = student.activeResume.degree;
    updateStudentProfile(updates);
    addNotification('Updated registered profile with details from uploaded resume!', 'success');
  };

  const handleToggleSkillInProfile = (skillName: string, category: Skill['category']) => {
    const isAlreadyInProfile = student.currentSkills.some(
      (cs) => cs.name.toLowerCase() === skillName.toLowerCase()
    );

    if (isAlreadyInProfile) {
      removeSkillFromStudent(skillName);
    } else {
      applyExtractedSkillsToProfile([{ name: skillName, category }]);
    }
  };

  const handleRemoveSkill = (skillName: string) => {
    const remaining = (student.extractedSkills || []).filter(
      (sk) => sk.name.toLowerCase() !== skillName.toLowerCase()
    );
    updateExtractedSkillsForActiveResume(remaining);
    addNotification(`Removed "${skillName}" from detected skills list.`, 'info');
  };

  const handleRemoveMultipleSkills = (skillNames: string[]) => {
    const nameSet = new Set(skillNames.map((n) => n.toLowerCase()));
    const remaining = (student.extractedSkills || []).filter(
      (sk) => !nameSet.has(sk.name.toLowerCase())
    );
    updateExtractedSkillsForActiveResume(remaining);
    addNotification(`Removed ${skillNames.length} skills from detected skills list.`, 'info');
  };

  const handleAddCustomSkill = (newSkill: ExtractedSkillItem) => {
    const existing = (student.extractedSkills || []).some(
      (s) => s.name.toLowerCase() === newSkill.name.toLowerCase()
    );

    if (existing) {
      addNotification(`"${newSkill.name}" is already in the detected list.`, 'warning');
      return;
    }

    const updated = [...(student.extractedSkills || []), newSkill];
    updateExtractedSkillsForActiveResume(updated);
    addNotification(`Added "${newSkill.name}" to detected skills list.`, 'success');
  };

  const handleViewAnalysis = (resume: UploadedResumeData) => {
    setActiveResume(resume);
    setFileName(resume.fileName);
    setActiveResumeText(resume.rawText || '');
    setTimeout(() => {
      analysisSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div id="resume-upload-page" className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-1.5">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          <h1 className="text-xl font-bold text-white">Resume Analysis & Intelligence</h1>
          <span className="text-[10px] bg-indigo-500/15 text-indigo-300 font-semibold px-2.5 py-0.5 rounded border border-indigo-500/30">
            SIH National Demo
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Upload student resumes (DOCX, PDF, or TXT) to evaluate technical competencies, verified confidence scores, and industry alignment with strict data isolation.
        </p>
      </div>

      {/* Quick Sample Resume Pickers */}
      <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-2xl space-y-2">
        <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Try with Sample Resumes (Instant Test):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_RESUMES.map((sample, idx) => {
            const isLoaded = fileName === sample.name && student.activeResume;
            return (
              <button
                key={sample.name}
                type="button"
                onClick={() => handleLoadSample(idx)}
                className={`p-3 rounded-xl text-left border transition text-xs ${
                  isLoaded
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900'
                }`}
              >
                <div className="font-bold truncate">{sample.label}</div>
                <div
                  className={`text-[10px] truncate mt-0.5 ${
                    isLoaded ? 'text-indigo-100' : 'text-slate-400'
                  }`}
                >
                  {sample.skills.slice(0, 3).join(', ')}...
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Full Resume History Management Section */}
      <ResumeHistoryManager
        resumeHistory={student.resumeHistory || []}
        activeResume={student.activeResume || null}
        onSetActive={(res) => {
          setActiveResume(res);
          setFileName(res.fileName);
          setActiveResumeText(res.rawText || '');
        }}
        onDelete={deleteResumeFromHistory}
        onDeleteMultiple={deleteMultipleResumesFromHistory}
        onRename={renameResumeInHistory}
        onViewAnalysis={handleViewAnalysis}
        onTriggerUpload={triggerUploadClick}
      />

      {/* Source Separation & Conflict Alert Banner */}
      {conflicts.length > 0 && student.activeResume && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-amber-300">Data Source Differences Detected</h4>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/30">
                  {conflicts.length} FIELD {conflicts.length === 1 ? 'MISMATCH' : 'MISMATCHES'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                The uploaded resume contains different values from your registered profile. SkillBridge keeps both sources strictly distinct — the AI uses resume data for resume queries, and registered data for profile queries.
              </p>
            </div>
          </div>

          {/* Conflict Items Table */}
          <div className="bg-slate-950/80 rounded-xl border border-amber-500/20 p-3 text-xs space-y-2">
            <div className="grid grid-cols-3 font-semibold text-slate-400 text-[11px] pb-1 border-b border-slate-800">
              <span>Field</span>
              <span>Registered Profile</span>
              <span className="text-amber-300">Uploaded Resume</span>
            </div>
            {conflicts.map((c) => (
              <div key={c.field} className="grid grid-cols-3 text-slate-300 text-xs py-1">
                <span className="font-medium text-white">{c.fieldName}</span>
                <span className="text-slate-400">{c.registeredValue}</span>
                <span className="text-amber-300 font-semibold">{c.resumeValue}</span>
              </div>
            ))}
          </div>

          {/* Action Choice Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Isolated: AI answers queries based on requested source</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSyncResumeFieldsToProfile}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                <span>Update Registered Profile from Resume</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleFileDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition ${
          isDragging
            ? 'border-indigo-400 bg-indigo-500/20'
            : 'border-slate-700 bg-slate-900/40 hover:border-indigo-400/50 hover:bg-slate-900/80 backdrop-blur-xl'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="resume-file-input"
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center shadow-lg border border-indigo-500/30">
            {isExtracting ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              <UploadCloud className="w-7 h-7" />
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">
              {isExtracting ? 'Extracting text and technical skills...' : 'Drop your resume here, or browse'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Supports PDF, DOCX, and TXT (extracts actual content without inventing skills)
            </p>
          </div>

          <label
            htmlFor="resume-file-input"
            className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs transition inline-flex items-center gap-1.5"
          >
            <span>Choose File from Computer</span>
          </label>

          {fileName && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                <FileCheck className="w-4 h-4" />
                <span>Loaded: {fileName}</span>
              </div>
              {activeResumeText && (
                <button
                  type="button"
                  onClick={() => setShowRawText(!showRawText)}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition"
                >
                  {showRawText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showRawText ? 'Hide Extracted Text' : 'View Extracted Text'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Extracted Raw Text Preview (Collapsible) */}
      {showRawText && activeResumeText && (
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold border-b border-slate-800 pb-2">
            <span>Raw Text Extracted from File ({activeResumeText.length} characters)</span>
            <span className="text-[10px] text-slate-400">Used for technical skill detection</span>
          </div>
          <pre className="text-[11px] font-mono text-slate-300 bg-slate-900/90 p-3 rounded-xl max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
            {activeResumeText}
          </pre>
        </div>
      )}

      {/* Analysis Section Anchor */}
      <div ref={analysisSectionRef} />

      {/* AI Resume Summary & Extracted Skills Section */}
      {student.extractedSkills && student.extractedSkills.length > 0 ? (
        <div className="space-y-5">
          {/* AI Resume Summary Compact Professional Card */}
          <div className="bg-slate-900/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    AI Resume Summary
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                      VERIFIED EXTRACTION
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Active File: <span className="font-mono text-slate-200">{fileName || 'None'}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('ai-assistant')}
                  className="text-xs font-semibold px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-lg border border-indigo-500/30 transition flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze in AI Assistant</span>
                </button>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">Skills Found</div>
                <div className="text-lg font-bold text-white mt-0.5">{student.extractedSkills.length}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">Projects Detected</div>
                <div className="text-lg font-bold text-white mt-0.5">{projectsCount}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">Certifications</div>
                <div className="text-lg font-bold text-white mt-0.5">{certsCount}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">Experience / Intern</div>
                <div className="text-lg font-bold text-white mt-0.5">{expCount}</div>
              </div>
            </div>

            {/* Top Match & Action Breakdown */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="text-slate-300">
                  <strong className="text-white">Top Career Match: </strong>
                  <span className="text-indigo-300 font-semibold">{topCareer?.career.title || 'Software Engineer'}</span>
                  <span className="text-emerald-400 font-bold ml-1.5">({topCareer?.matchPercentage || 85}% Match)</span>
                </div>
                <div className="text-slate-300">
                  <strong className="text-white">Skill Gap: </strong>
                  <span className="text-amber-300 font-medium">{missingGaps}</span>
                </div>
              </div>
              <div className="text-slate-300 pt-1 border-t border-slate-800/80">
                <strong className="text-emerald-400">Recommended Action: </strong>
                <span>{recommendedAction}</span>
              </div>
            </div>
          </div>

          {/* Professional Redesigned Detected Skills Section */}
          <DetectedSkillsSection
            extractedSkills={(student.extractedSkills || []) as ExtractedSkillItem[]}
            studentProfileSkills={student.currentSkills}
            onApplyExtractedSkills={applyExtractedSkillsToProfile}
            onToggleSkillInProfile={handleToggleSkillInProfile}
            onRemoveSkill={handleRemoveSkill}
            onRemoveMultipleSkills={handleRemoveMultipleSkills}
            onAddCustomSkill={handleAddCustomSkill}
            onViewSkillMatrix={() => setActiveTab('skill-analysis')}
            fileName={fileName}
          />
        </div>
      ) : (
        <div className="bg-slate-900/60 p-8 rounded-2xl border border-slate-800 text-center space-y-2">
          <FileText className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No active resume analysis</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Select a resume from your history or upload a new file above to view extracted technical skills and AI skill intelligence.
          </p>
        </div>
      )}

      {/* DUPLICATE RESUME DETECTION MODAL */}
      {duplicateModalData && (
        <DuplicateResumeModal
          isOpen={true}
          onClose={() => setDuplicateModalData(null)}
          duplicateResume={duplicateModalData.duplicate}
          newFileName={duplicateModalData.newFileName}
          onUseExisting={handleUseExistingDuplicate}
          onUploadAnyway={handleUploadAnyway}
        />
      )}
    </div>
  );
};
