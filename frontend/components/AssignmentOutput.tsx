'use client';

import { useEffect } from 'react';
import { useAssignment } from '@/hooks/useAssignment';
import { useAssignmentSocket } from '@/hooks/useAssignmentSocket';
import { GeneratedSection } from '@/types';

interface Props {
  assignmentId: string;
}

export function AssignmentOutput({ assignmentId }: Props) {
  const { current, loading, generating, error, fetchById, triggerGeneration } =
    useAssignment();

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
            {current.numQuestions} questions &bull; {current.marks} marks
          </p>
        </div>
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
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">Generated Paper</h2>
          {current.generatedPaper.map((section: GeneratedSection, sIdx: number) => (
            <div
              key={sIdx}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">
                {section.sectionTitle}
              </h3>
              <ol className="space-y-3 list-decimal list-inside">
                {section.questions.map((q, qIdx) => (
                  <li key={qIdx} className="text-sm text-gray-700 leading-relaxed">
                    <span>{q.questionText}</span>
                    <span className="ml-2 text-xs text-gray-400">
                      ({q.marks} mark{q.marks !== 1 ? 's' : ''})
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
