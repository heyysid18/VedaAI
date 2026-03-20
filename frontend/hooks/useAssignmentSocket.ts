'use client';

import { useEffect } from 'react';
import { getSocket, joinAssignmentRoom } from '@/lib/socket';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { AssignmentDonePayload } from '@/types';

/**
 * Listens for the "assignment_done" WebSocket event for a given assignment.
 * When fired, re-fetches the assignment using the Zustand store action.
 */
export function useAssignmentSocket(assignmentId: string | null) {
  const fetchAssignment = useAssignmentStore((state) => state.fetchAssignment);
  const setGenerating = useAssignmentStore((state) => state.setGenerating);

  useEffect(() => {
    if (!assignmentId) return;

    // Connect to room
    const socket = getSocket();
    joinAssignmentRoom(assignmentId);

    // Event listener
    const handleDone = async (payload: AssignmentDonePayload) => {
      if (payload.assignmentId === assignmentId) {
        console.log('[WS] assignment_done received for:', assignmentId);
        
        // Refetch assignment data using our store action
        await fetchAssignment(assignmentId);
        setGenerating(false);
      }
    };

    socket.on('assignment_done', handleDone);

    // Cleanup to prevent memory leaks
    return () => {
      socket.off('assignment_done', handleDone);
    };
  }, [assignmentId, fetchAssignment, setGenerating]);
}
