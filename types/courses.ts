export type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  explanation: string;
  keyPoints: string[];
  codeExample: string;
  expectedOutput: string;
  useCase: string;
  practiceTask: string;
}

export interface Module {
  id: string;
  title: string;
  slug: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string; // e.g. "40 hours"
  modules: Module[];
  assessment: Question[];
  finalProject: {
    title: string;
    description: string;
    requirements: string[];
  };
  become?: string;
  problemSolved?: string;
  willBuild?: string;
  forWho?: string;
}

export type QuestionType = 'mcq' | 'code_output' | 'bug' | 'fix' | 'scenario' | 'multi_select';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  text: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex?: number;
  correctOptionIndices?: number[];
  explanation: string;
}

export interface TestAttempt {
  id: string;
  userId: string;
  courseId: string;
  score: number;
  grade: Grade;
  completedAt: Date;
}

export interface Certificate {
  id: string; // GXL-COURSE-YEAR-UNIQUE
  userId: string;
  userName: string;
  courseId: string;
  courseName: string;
  grade: Grade;
  date: Date;
  verifyUrl: string;
}
