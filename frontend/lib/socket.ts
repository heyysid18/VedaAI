import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3000';

let socket: Socket | null = null;

/**
 * Returns the singleton Socket.io instance.
 * Safe to call multiple times — only one connection is created.
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1_000,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () =>
      console.log('[Socket] connected:', socket?.id)
    );
    socket.on('disconnect', (reason) =>
      console.log('[Socket] disconnected:', reason)
    );
    socket.on('connect_error', (err) =>
      console.error('[Socket] error:', err.message)
    );
  }
  return socket;
}

/** Subscribe to a specific assignment's update room. */
export function joinAssignmentRoom(assignmentId: string): void {
  getSocket().emit('join:room', assignmentId);
}
