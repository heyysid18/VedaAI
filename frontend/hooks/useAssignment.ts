'use client';

import { useCallback } from 'react';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { assignmentService } from '@/services/assignmentService';

export function useAssignment() {
  const store = useAssignmentStore();

  const fetchAll = useCallback(async () => {
    // Note: The new store doesn't have fetchAll built-in, but we can still 
    // provide it if the app needs it. 
    // For simplicity, returning empty or we can add fetchAll to store if used.
    console.warn('fetchAll is not natively supported in the simple store yet.');
  }, []);

  const triggerGeneration = useCallback(async (id: string) => {
    store.setGenerating(true);
    try {
      await assignmentService.triggerGeneration(id);
    } catch (err: any) {
      console.error('Failed to trigger generation:', err);
      store.setGenerating(false);
    }
  }, [store]);

  return {
    ...store,
    current: store.assignment,
    fetchById: store.fetchAssignment, // Map to store's action
    create: store.createAssignment,   // Map to store's action
    triggerGeneration,
    fetchAll,
  };
}
