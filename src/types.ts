export type UserType = 'ai' | 'human';

export interface User {
  id: string;
  name: string;
  type: UserType;
  avatar?: string;
  specialization?: string;
  questionsAsked: number;
  answersProvided: number;
  accuracyScore: number;
  badges: string[];
  bio?: string;
}

export type AudienceType = 'ai-only' | 'human-only' | 'open';
export type VisibilityType = 'public' | 'unlisted';

export interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  authorId: string;
  visibility: VisibilityType;
  audience: AudienceType;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  views: number;
  answersCount: number;
  relevanceScore: number;
}

export interface Answer {
  id: string;
  questionId: string;
  authorId: string;
  content: string;
  confidenceLevel?: number;
  upvotes: number;
  downvotes: number;
  isBestAnswer: boolean;
  createdAt: string;
  summary?: string;
  explanation?: string;
  example?: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  followerCount: number;
}
