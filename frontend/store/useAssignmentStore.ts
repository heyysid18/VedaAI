import { create } from 'zustand';
import { Assignment } from '@/types';

interface AssignmentState {
  // ── Data ────────────────────────────────────────────────────────────────────
  assignments: Assignment[];
  current: Assignment | null;

  // ── UI state ─────────────────────────────────────────────────────────────────
  loading: boolean;
  generating: boolean;
  error: string | null;

  // ── Setters ──────────────────────────────────────────────────────────────────
  setAssignments: (assignments: Assignment[]) => void;
  setCurrent: (assignment: Assignment | null) => void;
  updateCurrent: (update: Partial<Assignment>) => void;
  setLoading: (loading: boolean) => void;
  setGenerating: (generating: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  assignments: [],
  current: null,
  loading: false,
  generating: false,
  error: null,
};

export const useAssignmentStore = create<AssignmentState>((set) => ({
  ...INITIAL_STATE,

  setAssignments: (assignments) => set({ assignments }),
  setCurrent: (current) => set({ current }),
  updateCurrent: (update) =>
    set((state) =>
      state.current ? { current: { ...state.current, ...update } } : {}
    ),
  setLoading: (loading) => set({ loading }),
  setGenerating: (generating) => set({ generating }),
  setError: (error) => set({ error }),
  reset: () => set(INITIAL_STATE),
}));
