import { CareerGoal, Internship, StudentProfile } from '../types';
import { extractSkillsFromText, extractExperienceFromText } from './skillExtractor';
import {
  generateCareerIntelligenceResponse,
  classifyIntent,
  IntelligenceResponse
} from './careerIntelligenceEngine';

export interface ChatResponse {
  reply: string;
  source: 'gemini' | 'intelligence_engine';
  suggestedPrompts?: string[];
  actionLinks?: { label: string; tab: string }[];
  intent?: string;
  isExternalLookup?: boolean;
}

export interface AttachedDocument {
  fileName: string;
  text: string;
  fileType?: string;
  fileSize?: number;
  pageCount?: number;
  isPartial?: boolean;
  isUnreadable?: boolean;
  error?: string;
  warning?: string;
}

/**
 * Sends a message to the AI Career Assistant following the fast intent-first pipeline:
 * 1. Intent Detection on client
 * 2. If intent matches known profile/application queries (greeting, internships, companies, skill gaps, package, roadmap, etc.):
 *    Generate answer immediately from local registered data (< 5ms).
 * 3. Only if the query is an open-ended conversational inquiry, dispatch to server Gemini endpoint with a safe timeout.
 */
export async function sendCareerAssistantMessage(params: {
  message: string;
  studentProfile: StudentProfile;
  careerGoal?: CareerGoal;
  currentSkills: string[];
  missingSkills: string[];
  internships?: Internship[];
  uploadedDocument?: AttachedDocument;
  activeResume?: AttachedDocument;
  history?: { role: 'user' | 'model'; content: string }[];
}): Promise<ChatResponse> {
  const intent = classifyIntent(params.message, params.history);

  // Intent-First Fast Path:
  // For standard intents and context follow-ups, reply IMMEDIATELY using local verified application data
  const isLocalIntent =
    intent === 'greeting' ||
    intent === 'internships' ||
    intent === 'companies' ||
    intent === 'skill_gaps' ||
    intent === 'expected_package' ||
    intent === 'learning_path' ||
    intent === 'career_recommendation' ||
    intent === 'resume_analysis' ||
    intent === 'profile_summary' ||
    intent === 'context_follow_up';

  if (isLocalIntent) {
    const intelligence = generateCareerIntelligenceResponse({
      message: params.message,
      student: params.studentProfile,
      careerGoal: params.careerGoal,
      internships: params.internships,
      uploadedDoc: params.uploadedDocument || params.activeResume,
      history: params.history
    });

    return {
      reply: intelligence.reply,
      source: 'intelligence_engine',
      suggestedPrompts: intelligence.suggestedPrompts,
      actionLinks: intelligence.actionLinks,
      intent
    };
  }

  // Fallback for open-ended queries requiring external AI reasoning
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s fast timeout to prevent UI freezes

    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify(params)
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.reply && data.reply.trim().length > 10) {
        return {
          reply: data.reply,
          source: 'gemini',
          suggestedPrompts: data.suggestedPrompts,
          actionLinks: data.actionLinks,
          intent: 'general',
          isExternalLookup: true
        };
      }
    }
  } catch (error: any) {
    // If external API fails, log warning and gracefully return local intelligence
    if (error?.name !== 'AbortError') {
      console.warn('External AI service unavailable, using local intelligence engine:', error?.message);
    }
  }

  // Graceful deterministic fallback
  const fallback = generateCareerIntelligenceResponse({
    message: params.message,
    student: params.studentProfile,
    careerGoal: params.careerGoal,
    internships: params.internships,
    uploadedDoc: params.uploadedDocument || params.activeResume,
    history: params.history
  });

  return {
    reply: fallback.reply,
    source: 'intelligence_engine',
    suggestedPrompts: fallback.suggestedPrompts,
    actionLinks: fallback.actionLinks,
    intent
  };
}

export async function extractSkillsFromResume(resumeText: string): Promise<any> {
  try {
    const response = await fetch('/api/gemini/extract-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resumeText })
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    if (data.data && Array.isArray(data.data.skills) && data.data.skills.length > 0) {
      return data.data;
    }
    // If backend returned empty skills, run client-side extraction on the actual text
    const clientSkills = extractSkillsFromText(resumeText);
    return {
      skills: clientSkills,
      experience: extractExperienceFromText(resumeText),
      education: 'B.Tech / Degree'
    };
  } catch (error) {
    console.warn('Backend resume extraction failed, running client-side extractor:', error);
    const clientSkills = extractSkillsFromText(resumeText);
    return {
      skills: clientSkills,
      experience: extractExperienceFromText(resumeText),
      education: 'B.Tech / Degree'
    };
  }
}
