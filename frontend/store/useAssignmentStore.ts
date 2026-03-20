import { create } from 'zustand';
import { Assignment, CreateAssignmentDto } from '@/types';
import { assignmentService } from '@/services/assignmentService';

interface AssignmentStore {
  assignment: Assignment | null;
  loading: boolean;
  generating: boolean;
  error: string | null;
  
  // Actions
  fetchAssignment: (id: string) => Promise<void>;
  createAssignment: (dto: CreateAssignmentDto) => Promise<Assignment | null>;
  setAssignment: (assignment: Assignment | null) => void;
  setGenerating: (generating: boolean) => void;
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  assignment: null,
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

  createAssignment: async (dto: CreateAssignmentDto) => {
    set({ loading: true, error: null });
    try {
      const data = await assignmentService.create(dto);
      set({ assignment: data });
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
