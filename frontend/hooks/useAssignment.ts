'use client';

import { useCallback } from 'react';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { assignmentService } from '@/services/assignmentService';
import { CreateAssignmentDto } from '@/types';

export function useAssignment() {
  const store = useAssignmentStore();

  const fetchAll = useCallback(async () => {
    store.setLoading(true);
    store.setError(null);
    try {
      const data = await assignmentService.getAll();
      store.setAssignments(data);
    } catch (err: any) {
      store.setError(err.message);
    } finally {
      store.setLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (id: string) => {
    store.setLoading(true);
    store.setError(null);
    try {
      const data = await assignmentService.getById(id);
      store.setCurrent(data);
    } catch (err: any) {
      store.setError(err.message);
    } finally {
      store.setLoading(false);
    }
  }, []);

  const create = useCallback(async (dto: CreateAssignmentDto) => {
    store.setLoading(true);
    store.setError(null);
    try {
      const data = await assignmentService.create(dto);
      store.setCurrent(data);
      return data;
    } catch (err: any) {
      store.setError(err.message);
      return null;
    } finally {
      store.setLoading(false);
    }
  }, []);

  const triggerGeneration = useCallback(async (id: string) => {
    store.setGenerating(true);
    store.setError(null);
    try {
      await assignmentService.triggerGeneration(id);
    } catch (err: any) {
      store.setError(err.message);
      store.setGenerating(false);
    }
  }, []);

  return {
    ...store,
    fetchAll,
    fetchById,
    create,
    triggerGeneration,
  };
}
