'use client';

import { useAssignmentStore } from '@/store/useAssignmentStore';
import { assignmentService } from '@/services/assignmentService';
import { useCallback } from 'react';

export function useAssignment() {
  const store = useAssignmentStore();

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
    fetchById: store.fetchAssignment,
    create: store.createAssignment,
    fetchAll: store.fetchAssignments,
    triggerGeneration,
  };
}
