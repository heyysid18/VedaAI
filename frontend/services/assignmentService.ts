import { Assignment, CreateAssignmentDto, ApiResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/api/v1${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message ?? `Request failed: ${res.status}`);
  }
  return (json as ApiResponse<T>).data;
}

// ── Assignments ───────────────────────────────────────────────────────────────

export const assignmentService = {
  /** Fetch all assignments */
  getAll: () => request<Assignment[]>('/assignments'),

  /** Fetch a single assignment by ID */
  getById: (id: string) => request<Assignment>(`/assignments/${id}`),

  /** Create a new assignment */
  create: (dto: CreateAssignmentDto) =>
    request<Assignment>('/assignments', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  /**
   * Trigger AI generation (fire-and-forget).
   * Backend returns 202 immediately; worker emits "assignment_done" via WS.
   */
  triggerGeneration: (id: string) =>
    fetch(`${API_BASE}/api/v1/assignments/generate/${id}`, {
      method: 'POST',
    }).then((r) => r.json()),
};
