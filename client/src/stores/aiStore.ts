import { create } from 'zustand';

interface AIMessage {
  id?: string;
  role: 'user' | 'model';
  content: string;
}

interface AIState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleOpen: () => void;
  messages: AIMessage[];
  setMessages: (messages: AIMessage[]) => void;
  addMessage: (message: AIMessage) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  context: any;
  setContext: (context: any) => void;
}

export const useAIStore = create<AIState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  context: {},
  setContext: (context) => set({ context }),
}));
