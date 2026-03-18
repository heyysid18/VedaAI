'use client';

import { useEffect, useRef } from 'react';
import { getSocket, joinAssignmentRoom } from '@/lib/socket';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { assignmentService } from '@/services/assignmentService';
import { AssignmentDonePayload } from '@/types';

/**
 * Listens for the "assignment_done" WebSocket event for a given assignment.
 * When fired, re-fetches the assignment from the API and updates the Zustand store.
 */
export function useAssignmentSocket(assignmentId: string | null) {
  const { setCurrent, setGenerating } = useAssignmentStore();
  const joinedRef = useRef(false);

  useEffect(() => {
    if (!assignmentId) return;

    const socket = getSocket();

    if (!joinedRef.current) {
      joinAssignmentRoom(assignmentId);
      joinedRef.current = true;
    }

    const handleDone = async (payload: AssignmentDonePayload) => {
      if (payload.assignmentId !== assignmentId) return;
      console.log('[WS] assignment_done received:', payload.assignmentId);

      // Re-fetch from the DB to get the complete up-to-date document
      try {
        const fresh = await assignmentService.getById(assignmentId);
        setCurrent(fresh);
      } catch (err) {
        console.error('[WS] Failed to refresh assignment:', err);
      } finally {
        setGenerating(false);
      }
    };

    socket.on('assignment_done', handleDone);
    return () => { socket.off('assignment_done', handleDone); };
  }, [assignmentId, setCurrent, setGenerating]);
}
