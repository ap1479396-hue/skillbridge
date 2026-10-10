import React, { useState } from 'react';
import { Application, Internship } from '../../types';
import { answerRecruiterQuery } from '../../services/recruiterIntelligenceService';
import {
  Bot,
  Send,
  Sparkles,
  Users,
  AlertCircle,
  HelpCircle,
  FileSearch,
  CheckCircle2,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface AIRecruiterAssistantProps {
  applications: Application[];
  internships: Internship[];
  companyName: string;
  onSelectCandidate: (app: Application) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  relevantApplicants?: Application[];
  timestamp: string;
}

export const AIRecruiterAssistant: React.FC<AIRecruiterAssistantProps> = ({
  applications,
  internships,
  companyName,
  onSelectCandidate
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Hello! I am the **SkillBridge AI Recruiter Assistant** for **${companyName}**.

I provide real-time, data-backed intelligence on your active candidate pool (${applications.length} applicants across ${internships.length} openings).

Try asking:
• *"Who are the top candidates for Frontend Developer Intern?"*
• *"Why is Priya Mehta a strong match?"*
• *"What skills are most commonly missing?"*
• *"Show candidates with TypeScript experience."*

All recommendations are calculated deterministically from verified candidate profiles and resume data. [DEMO DATA]`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'Top candidate matches',
    'Why is Priya Mehta a strong match?',
    'What skills are most commonly missing?',
    'Candidates with TypeScript',
    'Show candidates in Interview stage'
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const result = answerRecruiterQuery(query, applications, internships, companyName);
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: result.answer,
        relevantApplicants: result.relevantApplicants,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <div className="bg-[#0f172a] rounded-2xl border border-slate-800 flex flex-col h-[650px] shadow-xl overflow-hidden text-slate-200">
      {/* Assistant Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm">AI Recruiter Assistant</h3>
              <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                Context-Aware
              </span>
              <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                [DEMO DATA]
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Grounded in {applications.length} candidate applications for {companyName}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 space-y-2.5 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed space-y-1">
                {msg.text.split('\n').map((line, i) => {
                  if (line.startsWith('### ')) {
                    return (
                      <h4 key={i} className="text-sm font-bold text-white pt-1">
                        {line.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (line.startsWith('• ') || line.startsWith('- ')) {
                    return (
                      <div key={i} className="flex items-start gap-1.5 pl-1 py-0.5">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{line.replace(/^[•-]\s*/, '')}</span>
                      </div>
                    );
                  }
                  return <p key={i}>{line}</p>;
                })}
              </div>

              {/* Interactive Candidate Cards if relevant */}
              {msg.relevantApplicants && msg.relevantApplicants.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Relevant Candidate Profiles:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.relevantApplicants.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => onSelectCandidate(app)}
                        className="p-2.5 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 hover:border-indigo-500/40 transition cursor-pointer flex items-center justify-between group"
                      >
                        <div className="space-y-0.5 truncate">
                          <strong className="text-white text-xs block truncate group-hover:text-indigo-300">
                            {app.studentName}
                          </strong>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {app.internshipRole} • {app.studentYear}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 pl-2">
                          <span className="text-[11px] font-bold text-indigo-400">{app.matchScore}%</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <span className={`text-[9px] block text-right ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 p-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-75"></div>
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-150"></div>
            <span>Evaluating candidate data...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-slate-900/80 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        <span className="text-slate-400 shrink-0 font-medium">Quick Queries:</span>
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 border border-slate-700 transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder={`Ask about applicants, skills, rankings for ${companyName}...`}
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-500"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim()}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
