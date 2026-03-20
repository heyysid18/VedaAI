'use client';

import { useState, FormEvent } from 'react';
import { useAssignment } from '@/hooks/useAssignment';
import { useRouter } from 'next/navigation';
import { QuestionType, CreateAssignmentDto } from '@/types';

const QUESTION_TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: 'mcq', label: 'Multiple Choice (MCQ)' },
  { value: 'short_answer', label: 'Short Answer' },
  { value: 'long_answer', label: 'Long Answer' },
  { value: 'true_false', label: 'True / False' },
  { value: 'fill_in_the_blank', label: 'Fill in the Blank' },
];

export function AssignmentForm() {
  const router = useRouter();
  const { create, loading, error } = useAssignment();

  const [form, setForm] = useState<CreateAssignmentDto>({
    title: '',
    dueDate: '',
    questionTypes: [],
    numQuestions: 10,
    marksPerQuestion: 5,
    instructions: '',
  });

  const toggleType = (type: QuestionType) => {
    setForm((prev) => ({
      ...prev,
      questionTypes: prev.questionTypes.includes(type)
        ? prev.questionTypes.filter((t) => t !== type)
        : [...prev.questionTypes, type],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const assignment = await create(form);
    if (assignment) {
      router.push('/assignments'); // Go to list page after creation
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assignment Title
        </label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g. Biology Chapter 5 Quiz"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <input
          type="date"
          required
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Question Types */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Types
        </label>
        <div className="flex flex-wrap gap-2">
          {QUESTION_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleType(opt.value)}
              className={`rounded-full px-3 py-1 text-sm border transition-colors ${
                form.questionTypes.includes(opt.value)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Num Questions & Marks */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Questions
          </label>
          <input
            type="number"
            min={1}
            max={500}
            required
            value={form.numQuestions}
            onChange={(e) => setForm({ ...form, numQuestions: Number(e.target.value) })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marks per Question
          </label>
          <input
            type="number"
            min={1}
            required
            value={form.marksPerQuestion}
            onChange={(e) => setForm({ ...form, marksPerQuestion: Number(e.target.value) })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Total: {form.numQuestions * form.marksPerQuestion} marks
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instructions <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          rows={3}
          value={form.instructions}
          onChange={(e) => setForm({ ...form, instructions: e.target.value })}
          placeholder="Any specific requirements for the AI..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || form.questionTypes.length === 0}
        className="w-full rounded-lg bg-blue-600 px-6 py-2.5 text-white font-medium text-sm disabled:opacity-50 hover:bg-blue-700 transition-colors"
      >
        {loading ? 'Creating…' : 'Create Assignment →'}
      </button>
    </form>
  );
}
