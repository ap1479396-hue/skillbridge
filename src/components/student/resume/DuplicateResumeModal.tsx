import React from 'react';
import { AlertCircle, FileText, CheckCircle2, UploadCloud, X } from 'lucide-react';
import { UploadedResumeData } from '../../../types';

interface DuplicateResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  duplicateResume: UploadedResumeData;
  newFileName: string;
  onUseExisting: () => void;
  onUploadAnyway: () => void;
}

export const DuplicateResumeModal: React.FC<DuplicateResumeModalProps> = ({
  isOpen,
  onClose,
  duplicateResume,
  newFileName,
  onUseExisting,
  onUploadAnyway
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="duplicate-resume-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="duplicate-resume-modal"
        className="bg-slate-900 border border-amber-500/30 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Duplicate resume detected.</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              This resume is already in your Resume History.
            </p>
          </div>
        </div>

        {/* Existing Resume Info Card */}
        <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-semibold text-white flex items-center gap-1.5 truncate">
              <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate">{duplicateResume.fileName}</span>
            </span>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-medium">
              In History
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-slate-400 border-t border-slate-800/80">
            <div>
              <span className="text-slate-500">Candidate:</span>{' '}
              <span className="text-slate-200 font-medium">{duplicateResume.candidateName || duplicateResume.name || 'Student'}</span>
            </div>
            <div>
              <span className="text-slate-500">Skills Detected:</span>{' '}
              <span className="text-indigo-300 font-medium">{duplicateResume.skills?.length || 0} skills</span>
            </div>
            <div>
              <span className="text-slate-500">Uploaded:</span>{' '}
              <span className="text-slate-300">
                {duplicateResume.uploadedAt ? new Date(duplicateResume.uploadedAt).toLocaleDateString() : 'Previously'}
              </span>
            </div>
            {duplicateResume.degree && (
              <div>
                <span className="text-slate-500">Degree:</span>{' '}
                <span className="text-slate-300">{duplicateResume.degree}</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Would you like to activate the existing parsed analysis or upload this file anyway as a new history record?
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            id="use-existing-resume-btn"
            onClick={onUseExisting}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Use Existing</span>
          </button>
          <button
            type="button"
            id="upload-resume-anyway-btn"
            onClick={onUploadAnyway}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Anyway</span>
          </button>
        </div>
      </div>
    </div>
  );
};
