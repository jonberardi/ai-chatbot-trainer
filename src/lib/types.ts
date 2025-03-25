import { D1Database } from '@cloudflare/workers-types';

export interface Persona {
  id: number;
  name: string;
  background: string;
  expertise: string;
  personality: string;
  avatar_url?: string;
  conversation_style: string;
  knowledge_domains: string;
  difficulty_level: string;
  created_at: string;
  updated_at: string;
}

export interface EvaluationCriterion {
  id: number;
  name: string;
  description: string;
  weight: number;
  persona_id: number;
  created_at: string;
}

export interface Student {
  id: number;
  name: string;
  email?: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  title: string;
  persona_id: number;
  student_id: number;
  status: 'active' | 'completed';
  started_at: string;
  ended_at?: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_type: 'student' | 'persona';
  content: string;
  timestamp: string;
}

export interface Evaluation {
  id: number;
  conversation_id: number;
  message_id: number;
  criteria_id: number;
  score: number;
  feedback: string;
  created_at: string;
}

export interface StudentPerformance {
  id: number;
  student_id: number;
  conversation_id: number;
  overall_score: number;
  strengths: string;
  areas_for_improvement: string;
  created_at: string;
}

export interface PerformanceSummary {
  overall_score: number;
  strengths: string;
  areas_for_improvement: string;
  recommendations?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
