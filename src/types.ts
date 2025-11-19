
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export type ViewType = 'dashboard' | 'summarizer' | 'quiz' | 'outliner' | 'tutor' | 'profile';

export interface StudyContextData {
  chapter: string;
  author?: string;
  className: string;
  board: string;
  language: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  questionType?: '1M' | '2M' | '3M' | '4M';
}

export interface SummaryHistoryItem {
  context: Partial<StudyContextData>;
  summary: string;
}

export interface QuizHistoryItem {
  context: Partial<StudyContextData>;
  questions: QuizQuestion[];
}

export interface OutlineHistoryItem {
  context: Partial<StudyContextData>;
  outline: string;
}

export interface UserProfile {
  displayName: string;
  photoURL: string;
  phoneNumber: string;
  className: string;
  board: string;
  schoolName: string;
}