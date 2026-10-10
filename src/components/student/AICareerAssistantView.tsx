import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { sendCareerAssistantMessage, AttachedDocument } from '../../services/api';
import { calculateSkillGap } from '../../utils/skillMatcher';
import { extractTextFromFile } from '../../services/fileTextExtractor';
import { detectSourceConflicts } from '../../services/resumeParser';
import {
  Sparkles,
  Send,
  User,
  RefreshCw,
  Target,
  GraduationCap,
  Mic,
  MicOff,
  Paperclip,
  FileText,
  X,
  Loader2,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Compass,
  DollarSign,
  Layers,
  Code,
  AlertTriangle,
  ShieldCheck,
  History
} from 'lucide-react';
import Markdown from 'react-markdown';
import { StructuredAIResponse } from '../ai/StructuredAIResponse';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  attachedDocName?: string;
  suggestedPrompts?: string[];
  actionLinks?: {
    label: string;
    tab: string;
  }[];
  isStreaming?: boolean;
}

let msgSeqCounter = 0;
const getUniqueMsgId = (prefix: string = 'msg') => {
  msgSeqCounter += 1;
  return `${prefix}-${Date.now()}-${msgSeqCounter}-${Math.random().toString(36).slice(2, 7)}`;
};

export const AICareerAssistantView: React.FC = () => {
  const {
    student,
    currentCareerGoal,
    internships,
    setActiveTab,
    registerUploadedResume,
    setActiveResume,
    clearActiveResume
  } = useApp();

  const skillGap = calculateSkillGap(student.currentSkills, currentCareerGoal);
  const conflicts = detectSourceConflicts(student, student.activeResume);

  const firstName = (student?.name || '').trim().split(' ')[0] || 'there';

  const initialMessages: Message[] = [
    {
      id: 'msg-0',
      sender: 'assistant',
      text: `Hi ${firstName}! 👋 I'm your **SkillBridge AI Career Assistant**.\n\nWhat would you like help with — career choice, resume, skill gaps, internships, companies, or expected package?\n\n*You can select a quick action below or attach your resume (PDF/DOCX/TXT) using the paperclip button.*`,
      timestamp: 'Just now',
      suggestedPrompts: [
        'Best career for me',
        'My skill gaps',
        'Find internships',
        'Companies I should apply to',
        'Expected package',
        'What should I learn next?'
      ]
    }
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Analyzing your profile...');
  const [streamingText, setStreamingText] = useState<string | null>(null);

  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Document Upload State
  const [attachedDoc, setAttachedDoc] = useState<AttachedDocument | null>(null);
  const [isExtractingDoc, setIsExtractingDoc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamIntervalRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, isLoading, attachedDoc, isListening]);

  // Clean up speech and intervals on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  // Voice Input Toggle Handler (Microphone -> Text in input field, not auto-sent)
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      alert('Speech recognition is not supported in this browser. Please type your message or try Chrome/Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setInputText((prev) => {
            const cleanPrev = prev.trim();
            return cleanPrev ? `${cleanPrev} ${transcript.trim()}` : transcript.trim();
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Could not start voice recognition:', err);
      setIsListening(false);
    }
  };

  // Document Upload Handler (PDF, DOCX, TXT)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtractingDoc(true);
    try {
      const result = await extractTextFromFile(file);
      setAttachedDoc({
        fileName: file.name,
        text: result.text,
        fileType: result.fileType,
        fileSize: file.size,
        pageCount: result.pageCount,
        isPartial: result.isPartial,
        isUnreadable: result.isUnreadable,
        error: result.error,
        warning: result.warning
      });

      // Also register in active session resume history
      registerUploadedResume(file.name, result.text, result.fileType);

      // Suggest query if input is empty
      if (!inputText.trim()) {
        setInputText('What skills are in my resume?');
      }
    } catch (err) {
      console.error('Failed to parse document:', err);
      alert('Could not extract text from the file. Please ensure it is a valid PDF, DOCX, or TXT document.');
    } finally {
      setIsExtractingDoc(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeAttachedDoc = () => {
    setAttachedDoc(null);
  };

  // Fast typing/streaming simulator for smooth user experience
  const streamResponse = (fullText: string, onComplete: () => void) => {
    let charIndex = 0;
    const stepSize = Math.max(4, Math.floor(fullText.length / 40)); // dynamic step for instant feel
    const interval = 18; // 18ms interval

    setStreamingText('');

    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
    }

    streamIntervalRef.current = setInterval(() => {
      charIndex += stepSize;
      if (charIndex >= fullText.length) {
        clearInterval(streamIntervalRef.current);
        setStreamingText(null);
        onComplete();
      } else {
        setStreamingText(fullText.slice(0, charIndex));
      }
    }, interval);
  };

  const handleSendMessage = async (promptToSend?: string) => {
    const text = (promptToSend || inputText).trim();
    if (!text || isLoading || isExtractingDoc) return;

    // Stop voice if listening
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }

    const docToSend = attachedDoc;

    const userMessage: Message = {
      id: getUniqueMsgId('user-msg'),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachedDocName: docToSend?.fileName
    };

    // Contextual loading indicator per Requirement 1 & 15
    const lowerText = text.toLowerCase();
    if (lowerText.includes('internship') || lowerText.includes('opening') || lowerText.includes('job')) {
      setLoadingText('Finding matching opportunities...');
    } else {
      setLoadingText('Analyzing your profile...');
    }

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setAttachedDoc(null);
    setIsLoading(true);

    try {
      const historyToSend = messages.slice(-10).map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        content: m.text
      }));

      const activeResumeDoc = student.activeResume
        ? {
            fileName: student.activeResume.fileName,
            text: student.activeResume.rawText,
            fileType: 'pdf'
          }
        : undefined;

      const response = await sendCareerAssistantMessage({
        message: text,
        studentProfile: student,
        careerGoal: currentCareerGoal,
        currentSkills: student.currentSkills.map((s) => s.name),
        missingSkills: skillGap.items.filter((i) => i.status === 'missing').map((i) => i.name),
        internships,
        uploadedDocument: docToSend || undefined,
        activeResume: activeResumeDoc,
        history: historyToSend
      });

      setIsLoading(false);

      const assistantMessage: Message = {
        id: getUniqueMsgId('asst-msg'),
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: response.suggestedPrompts,
        actionLinks: response.actionLinks
      };

      // Fast response: if resolved locally, display immediately without artificial delay
      if (response.source === 'intelligence_engine') {
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Smooth streaming for external AI generation
        streamResponse(response.reply, () => {
          setMessages((prev) => [...prev, assistantMessage]);
        });
      }
    } catch (error) {
      console.error('Career Assistant error:', error);
      setIsLoading(false);
    }
  };

  // Dynamic quick prompt chips based on whether a document is attached
  const quickPrompts = attachedDoc
    ? [
        'What skills are in my resume?',
        'Best career for me',
        'My skill gaps',
        'Find internships',
        'Expected package',
        'What should I learn next?'
      ]
    : [
        'Best career for me',
        'My skill gaps',
        'Find internships',
        'Companies I should apply to',
        'Expected package',
        'What should I learn next?'
      ];

  return (
    <div id="ai-career-assistant-page" className="max-w-5xl mx-auto space-y-4">
      {/* Header Context Banner */}
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-white shadow-inner shrink-0">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">AI Career & Skill Assistant</h1>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-300 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Career Intelligence Live
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalized for {student.name} • {student.year} • Target: <strong className="text-slate-200">{currentCareerGoal.title}</strong>
            </p>
          </div>
        </div>

        {/* Live Student Context Pill */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs">
          <Target className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <div className="font-semibold text-white">
              {skillGap.readinessPercentage}% Readiness Score
            </div>
            <div className="text-[10px] text-slate-400">
              {skillGap.matchedCount} possessed • {skillGap.missingCount} gaps
            </div>
          </div>
        </div>
      </div>

      {/* Source-Aware Data Context Status Bar */}
      <div className="bg-slate-900/90 backdrop-blur-xl p-3.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">Registered:</span>
            <span className="font-medium text-white">{student.name} ({student.year})</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Active Resume:</span>
            {student.activeResume ? (
              <span className="font-medium text-emerald-300 flex items-center gap-1">
                {student.activeResume.fileName}
                {student.activeResume.academicYear && (
                  <span className="text-[10px] text-slate-400">({student.activeResume.academicYear})</span>
                )}
              </span>
            ) : (
              <span className="text-slate-400 italic">None (using profile)</span>
            )}
          </div>

          {conflicts.length > 0 && student.activeResume && (
            <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-[11px]">{conflicts.length} Data Difference{conflicts.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {student.activeResume && (
            <button
              onClick={clearActiveResume}
              className="text-[11px] text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-800 transition"
              title="Switch back to evaluating registered profile only"
            >
              Clear Active Resume
            </button>
          )}
          <button
            onClick={() => setActiveTab('resume-upload')}
            className="text-[11px] text-indigo-300 hover:text-white bg-indigo-600/20 hover:bg-indigo-600/30 px-2.5 py-1 rounded-lg border border-indigo-500/30 transition flex items-center gap-1"
          >
            <FileText className="w-3 h-3" />
            <span>Manage Resumes</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips Bar */}
      <div className="bg-slate-900/90 backdrop-blur-xl p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-xs font-bold text-slate-300 whitespace-nowrap flex items-center gap-1.5 shrink-0 pl-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Quick Prompts:
          </span>
          {quickPrompts.map((q) => (
            <button
              key={q}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading || isExtractingDoc}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 hover:border-indigo-500/40 whitespace-nowrap transition shrink-0 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Box */}
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-950 text-indigo-400 border border-slate-800'
                }`}
              >
                {msg.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </div>

              <div
                className={`rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-xs max-w-xl'
                    : 'bg-slate-950/90 text-slate-200 border border-slate-800 rounded-tl-none shadow-xs w-full max-w-3xl'
                }`}
              >
                {/* Attached Document indicator on user messages */}
                {msg.attachedDocName && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-700/80 text-indigo-100 text-[11px] font-medium border border-indigo-400/30 mb-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>📎 Attached: {msg.attachedDocName}</span>
                  </div>
                )}

                {msg.sender === 'user' ? (
                  <>
                    <div className="markdown-body text-slate-100 leading-relaxed">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                    <div className="text-[10px] pt-1 text-indigo-200 text-right">
                      {msg.timestamp}
                    </div>
                  </>
                ) : (
                  <>
                    <StructuredAIResponse
                      text={msg.text}
                      actionLinks={msg.actionLinks}
                      suggestedPrompts={msg.suggestedPrompts}
                      onNavigateTab={(tab) => setActiveTab(tab as any)}
                      onSelectPrompt={(prompt) => handleSendMessage(prompt)}
                    />
                    <div className="text-[10px] pt-1 text-slate-500 flex items-center justify-between border-t border-slate-900">
                      <span>{msg.timestamp}</span>
                      <span className="text-[9px] text-indigo-400/70 font-mono">SkillBridge Intelligence</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Active Live Streaming Response */}
          {streamingText && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 text-indigo-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-slate-950/90 text-slate-200 p-4 rounded-2xl rounded-tl-none border border-slate-800 text-xs w-full max-w-3xl leading-relaxed space-y-2">
                <div className="markdown-body text-slate-100">
                  <Markdown>{streamingText}</Markdown>
                </div>
                <span className="inline-block w-2 h-3.5 bg-indigo-400 animate-pulse ml-0.5 align-middle"></span>
              </div>
            </div>
          )}

          {/* Loading Analyzing Indicator */}
          {isLoading && !streamingText && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 text-indigo-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-slate-950/90 text-slate-300 p-3.5 rounded-2xl rounded-tl-none border border-slate-800 flex items-center gap-2 text-xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>{loadingText}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar & Controls */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 rounded-b-2xl space-y-2">
          {/* Active Recording State Banner */}
          {isListening && (
            <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-pulse">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
                <span className="font-medium">Listening... voice will convert to editable text</span>
              </div>
              <button
                type="button"
                onClick={toggleVoiceInput}
                className="text-[11px] font-semibold text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-500/40 px-2 py-0.5 rounded-md transition"
              >
                Stop Recording
              </button>
            </div>
          )}

          {/* Extracting Document Progress */}
          {isExtractingDoc && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>Extracting verified text from document...</span>
            </div>
          )}

          {/* Attached Document Preview Badge */}
          {attachedDoc && !isExtractingDoc && (
            <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-indigo-500/40 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="font-semibold text-white truncate block">
                    📎 {attachedDoc.fileName}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Document attached • Ask about skills, career fit, or job description match
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={removeAttachedDoc}
                title="Remove attachment"
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Hidden File Input for PDF, DOCX, TXT */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Document Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isExtractingDoc}
              title="Attach Resume, Job Description, or Syllabus (PDF, DOCX, TXT)"
              className={`p-2.5 rounded-xl border transition flex items-center justify-center shrink-0 ${
                attachedDoc
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              disabled={isLoading}
              title={isListening ? 'Click to stop voice recording' : 'Click to speak question via microphone'}
              className={`p-2.5 rounded-xl border transition flex items-center justify-center shrink-0 ${
                isListening
                  ? 'bg-rose-600 border-rose-500 text-white ring-4 ring-rose-500/20 animate-pulse'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Input Text Field */}
            <input
              type="text"
              placeholder={
                isListening
                  ? 'Listening... speak clearly into your mic...'
                  : attachedDoc
                  ? `Ask about ${attachedDoc.fileName} (e.g., "What skills are in my resume?")...`
                  : `Ask about careers, skill gaps, packages, or roadmaps...`
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 text-xs px-4 py-2.5 bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:border-indigo-500 transition"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={(!inputText.trim() && !attachedDoc) || isLoading || isExtractingDoc}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5 shrink-0"
            >
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
