import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Question {
  _id: string;
  questionText: string;
  options: string[];
  points: number;
}

export interface Quiz {
  _id: string;
  title: string;
  course: string;
  moduleIndex: number;
  timeLimit: number;
  passingScore: number;
  questions: Question[];
  totalPoints: number;
}

interface QuizState {
  activeQuizId: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<number, number>; // questionIndex -> selectedOption
  timeRemaining: number; // seconds
  startedAt: number | null;
  timeLimit: number; // seconds
  
  startQuiz: (quiz: Quiz) => void;
  setAnswer: (questionIndex: number, selectedOption: number) => void;
  goToQuestion: (index: number) => void;
  tickTimer: () => void;
  resetQuiz: () => void;
  getProgress: () => { answered: number; total: number; percentage: number };
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      activeQuizId: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: {},
      timeRemaining: 0,
      startedAt: null,
      timeLimit: 0,
      
      startQuiz: (quiz) => {
        // Only reset if starting a different quiz
        if (get().activeQuizId !== quiz._id) {
          const timeLimitSeconds = quiz.timeLimit * 60;
          set({
            activeQuizId: quiz._id,
            questions: quiz.questions || [],
            currentQuestionIndex: 0,
            answers: {},
            timeRemaining: timeLimitSeconds,
            timeLimit: timeLimitSeconds,
            startedAt: Date.now(),
          });
        }
      },
      
      setAnswer: (questionIndex, selectedOption) => set((state) => ({
        answers: {
          ...state.answers,
          [questionIndex]: selectedOption
        }
      })),
      
      goToQuestion: (index) => set({
        currentQuestionIndex: index
      }),
      
      tickTimer: () => set((state) => ({
        timeRemaining: Math.max(0, state.timeRemaining - 1)
      })),
      
      resetQuiz: () => set({
        activeQuizId: null,
        questions: [],
        currentQuestionIndex: 0,
        answers: {},
        timeRemaining: 0,
        startedAt: null,
        timeLimit: 0,
      }),
      
      getProgress: () => {
        const state = get();
        const total = state.questions.length;
        const answered = Object.keys(state.answers).length;
        return {
          answered,
          total,
          percentage: total > 0 ? Math.round((answered / total) * 100) : 0,
        };
      }
    }),
    {
      name: 'codeloom-quiz-storage',
    }
  )
);
