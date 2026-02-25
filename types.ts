import { LucideIcon } from 'lucide-react';

export interface Button3DProps {
  onClick?: () => void;
  color?: string;
  icon?: LucideIcon;
  label: string;
  className?: string;
  disabled?: boolean;
  title?: string;
  type?: "button" | "submit" | "reset";
}

export interface Fraction {
  n: number | null;
  d: number | null;
}

export interface QuestionChoice {
  n: number;
  d: number;
  correct: boolean;
}

export interface QuestionData {
  type: 'choice' | 'fill' | 'drag';
  mode?: 'visual_to_frac' | 'frac_to_visual';
  text: string;
  target?: Fraction; // For choice
  options?: any[];
  correctValue?: any;
  left?: Fraction; // For fill/drag
  right?: Fraction; // For fill/drag
  missing?: 'top' | 'bottom';
}

export interface HistoryItem {
  question: QuestionData;
  userAnswer: any;
  isCorrect: boolean;
}

export interface Achievement {
  id: string;
  studentName: string;
  studentClass: string;
  score: number;
  totalQuestions: number;
  difficulty: string;
  date: string;
  history?: HistoryItem[];
}

export enum TopicId {
  CONCEPT = 'concept',
  EQUIVALENT = 'equivalent',
  SIMPLIFY = 'simplify',
  PRACTICE = 'practice'
}

export enum Difficulty {
  EASY = 'Dễ',
  MEDIUM = 'Trung bình',
  HARD = 'Khó'
}

export interface Topic {
  id: TopicId;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export interface MathProblem {
  question: string;
  type: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  hint: string;
}

export interface QuizState {
  currentProblem: MathProblem | null;
  loading: boolean;
  answered: boolean;
  isCorrect: boolean;
  selectedOption: string | null;
  textInput: string;
  streak: number;
  score: number;
  totalQuestions: number;
}