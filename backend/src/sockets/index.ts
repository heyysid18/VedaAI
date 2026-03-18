import { Server as HTTPServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { env } from '../config/env';

let io: SocketServer;

// ── Initialise Socket.io ──────────────────────────────────────────────────────

export function initSocket(httpServer: HTTPServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: {
      origin: env.ALLOWED_ORIGINS,
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60_000,
    pingInterval: 25_000,
  });

  io.on('connection', (socket: Socket) => {
    const clientId = socket.id;
    console.log(`🔌  Socket connected   [${clientId}]`);

    // ── Example: join a room ─────────────────────────────────────────────────
    socket.on('join:room', (roomId: string) => {
      socket.join(roomId);
      console.log(`    [${clientId}] joined room: ${roomId}`);
      socket.emit('room:joined', { roomId });
    });

    // ── Example: broadcast a custom event ────────────────────────────────────
    socket.on('message:send', (payload: { roomId: string; text: string }) => {
      io.to(payload.roomId).emit('message:receive', {
        from: clientId,
        text: payload.text,
        at: new Date().toISOString(),
      });
    });

    socket.on('disconnect', (reason) => {
      console.log(`🔌  Socket disconnected [${clientId}] — ${reason}`);
    });

    socket.on('error', (err) => {
      console.error(`❌  Socket error [${clientId}]:`, err);
    });
  });

  console.log('🟢  Socket.io initialised');
  return io;
}

// ── Emitter Helpers (use anywhere in the app) ─────────────────────────────────

/**
 * Broadcast an event to ALL connected clients.
 */
export function broadcast(event: string, data: unknown): void {
  if (!io) throw new Error('Socket.io not initialised');
  io.emit(event, data);
}

/**
 * Emit an event to a specific room.
 */
export function emitToRoom(room: string, event: string, data: unknown): void {
  if (!io) throw new Error('Socket.io not initialised');
  io.to(room).emit(event, data);
}

/**
 * Get the Socket.io server instance.
 */
export function getIO(): SocketServer {
  if (!io) throw new Error('Socket.io not initialised');
  return io;
}
