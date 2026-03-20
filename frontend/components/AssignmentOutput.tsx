'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAssignment } from '@/hooks/useAssignment';
import { useAssignmentSocket } from '@/hooks/useAssignmentSocket';
import { ExamPaper } from './ExamPaper';

const DownloadPdfButton = dynamic(() => import('./DownloadPdfButton'), { ssr: false });

interface Props {
  assignmentId: string;
}

export function AssignmentOutput({ assignmentId }: Props) {
  const { current, loading, generating, error, fetchById, triggerGeneration } = useAssignment();

  // Listen for real-time "assignment_done" events
  useAssignmentSocket(assignmentId);

  useEffect(() => {
    fetchById(assignmentId);
  }, [assignmentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error) return <p className="text-red-600">{error}</p>;
  if (!current) return <p className="text-gray-500">Assignment not found.</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{current.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Due: {new Date(current.dueDate).toLocaleDateString()} &bull;{' '}
            {current.numQuestions} questions &bull; {current.marksPerQuestion} marks/question
          </p>
        </div>
        <div className="flex items-center gap-3">
          {current.status === 'completed' && (
            <DownloadPdfButton assignment={current} />
          )}
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              current.status === 'completed'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {current.status}
          </span>
        </div>
      </div>

      {/* Generate button */}
      {current.status === 'pending' && (
        <div>
          <button
            onClick={() => triggerGeneration(assignmentId)}
            disabled={generating}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            {generating ? '⏳ Generating…' : '✨ Generate Questions'}
          </button>
          {generating && (
            <p className="mt-2 text-sm text-gray-500 italic">
              AI is generating your paper. You'll be notified when it's ready…
            </p>
          )}
        </div>
      )}

      {/* Generated Paper */}
      {current.generatedPaper.length > 0 && (
        <div className="pt-6">
          <ExamPaper assignment={current} />
        </div>
      )}
    </div>
  );
}
