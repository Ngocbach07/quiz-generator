export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswerIds: string[];
  explanation: string;
  type: "single" | "multi";
  difficulty: "easy" | "medium" | "hard";
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  sourceText: string;
  model: string;
  createdAt: string;
}

export interface LLMSettings {
  apiKey: string;
  baseUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface SourceDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  text: string;
}

export interface GenerateRequest {
  text: string;
  settings: LLMSettings;
  questionCount: number;
  questionTypes: ("single" | "multi")[];
  difficulty: "easy" | "medium" | "hard" | "mixed";
  language: "vi" | "en";
}
