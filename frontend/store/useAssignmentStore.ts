import { create } from 'zustand';
import { Assignment, CreateAssignmentDto } from '@/types';
import { assignmentService } from '@/services/assignmentService';

interface AssignmentStore {
  // Single assignment (for output/detail page)
  assignment: Assignment | null;
  // All assignments (for the list page)
  assignments: Assignment[];
  loading: boolean;
  generating: boolean;
  error: string | null;

  // Actions
  fetchAssignment: (id: string) => Promise<void>;
  fetchAssignments: () => Promise<void>;
  createAssignment: (dto: CreateAssignmentDto) => Promise<Assignment | null>;
  setAssignment: (assignment: Assignment | null) => void;
  setGenerating: (generating: boolean) => void;
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  assignment: null,
  assignments: [],
  loading: false,
  generating: false,
  error: null,

  fetchAssignment: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const data = await assignmentService.getById(id);
      set({ assignment: data });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch assignment' });
    } finally {
      set({ loading: false });
    }
  },

  fetchAssignments: async () => {
    set({ loading: true, error: null });
    try {
      const data = await assignmentService.getAll();
      set({ assignments: data });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch assignments' });
    } finally {
      set({ loading: false });
    }
  },

  createAssignment: async (dto: CreateAssignmentDto) => {
    set({ loading: true, error: null });
    try {
      const data = await assignmentService.create(dto);
      // Prepend to list so it appears at the top immediately
      set((state) => ({ assignment: data, assignments: [data, ...state.assignments] }));
      return data;
    } catch (err: any) {
      set({ error: err.message || 'Failed to create assignment' });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  setAssignment: (assignment) => set({ assignment }),
  setGenerating: (generating) => set({ generating }),
}));
