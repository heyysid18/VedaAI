'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useAssignment } from '@/hooks/useAssignment';
import { useRouter } from 'next/navigation';
import { QuestionType } from '@/types';

// ── Types ─────────────────────────────────────────────────────────────────────

interface QuestionRow {
  id: number;
  type: QuestionType | '';
  numQuestions: number;
  marks: number;
}

const QUESTION_TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: 'mcq', label: 'Multiple-choice Questions' },
  { value: 'short_answer', label: 'Short Questions' },
  { value: 'long_answer', label: 'Long Answer Questions' },
  { value: 'true_false', label: 'True / False' },
  { value: 'fill_in_the_blank', label: 'Fill in the Blank' },
];

let rowCounter = 2;

// ── Component ─────────────────────────────────────────────────────────────────

export default function CreateAssignmentPage() {
  const router = useRouter();
  const { create, loading, error } = useAssignment();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [instructions, setInstructions] = useState('');
  const [rows, setRows] = useState<QuestionRow[]>([
    { id: 1, type: '', numQuestions: 0, marks: 0 },
  ]);

  // ── File Handlers ─────────────────────────────────────────────────────────

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setFileName(file.name);
  };

  // ── Row Handlers ──────────────────────────────────────────────────────────

  const updateRow = (id: number, field: keyof QuestionRow, value: string | number) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: rowCounter++, type: '', numQuestions: 0, marks: 0 },
    ]);
  };

  const removeRow = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  // ── Derived totals ─────────────────────────────────────────────────────────

  const totalQuestions = rows.reduce((s, r) => s + (r.numQuestions || 0), 0);
  const totalMarks = rows.reduce((s, r) => s + (r.marks || 0), 0);

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    const validRows = rows.filter((r) => r.type && r.numQuestions > 0);
    if (!dueDate || validRows.length === 0) return;

    const assignment = await create({
      title: fileName ?? 'Untitled Assignment',
      dueDate,
      questionTypes: [...new Set(validRows.map((r) => r.type as QuestionType))],
      numQuestions: totalQuestions || 1,
      marks: totalMarks || 1,
      instructions,
    });

    if (assignment) {
      router.push(`/assignment/${assignment._id}`);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Page Header ───────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-900">Create Assignment</h1>
        <div className="flex items-center gap-3">
          {/* Bell */}
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </button>
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold">
            U
          </div>
        </div>
      </header>

      {/* ── Main ──────────────────────────────────────────────────────────────── */}
      <main className="flex-1 px-8 py-7">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-8 py-7 space-y-8">

            {/* ── Section 1: Upload File ─────────────────────────────────────── */}
            <section>
              <h2 className="text-sm font-semibold text-gray-800 mb-3">Upload File</h2>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-10 cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                }`}
              >
                {/* Cloud icon */}
                <svg width="36" height="36" fill="none" stroke="#9CA3AF" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
                {fileName ? (
                  <p className="text-sm font-medium text-gray-700">{fileName}</p>
                ) : (
                  <>
                    <p className="text-sm text-gray-500">
                      Choose a file or drag &amp; drop here
                    </p>
                    <span className="text-xs text-blue-600 font-medium underline-offset-2 underline">
                      Browse files
                    </span>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </section>

            {/* ── Section 2: Due Date ───────────────────────────────────────── */}
            <section>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 appearance-none pr-10"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </span>
              </div>
            </section>

            {/* ── Section 3: Question Types Table ──────────────────────────── */}
            <section>
              <h2 className="text-sm font-semibold text-gray-800 mb-3">
                Question Types &amp; Marks
              </h2>

              {/* Table Header */}
              <div className="grid grid-cols-[1fr_120px_120px_36px] gap-2 mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Question Type</span>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide text-center">No. of Questions</span>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide text-center">Marks</span>
                <span />
              </div>

              <div className="space-y-2">
                {rows.map((row) => (
                  <div key={row.id} className="grid grid-cols-[1fr_120px_120px_36px] gap-2 items-center">
                    {/* Type select */}
                    <div className="relative">
                      <select
                        value={row.type}
                        onChange={(e) => updateRow(row.id, 'type', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-gray-900 pr-8 bg-white"
                      >
                        <option value="">Select type…</option>
                        {QUESTION_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </span>
                    </div>

                    {/* Num Questions */}
                    <input
                      type="number"
                      min={0}
                      value={row.numQuestions || ''}
                      onChange={(e) => updateRow(row.id, 'numQuestions', Number(e.target.value))}
                      placeholder="0"
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 w-full"
                    />

                    {/* Marks */}
                    <input
                      type="number"
                      min={0}
                      value={row.marks || ''}
                      onChange={(e) => updateRow(row.id, 'marks', Number(e.target.value))}
                      placeholder="0"
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 w-full"
                    />

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length === 1}
                      className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30"
                    >
                      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Add row */}
              <button
                type="button"
                onClick={addRow}
                className="mt-3 flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Question Type
              </button>

              {/* Totals */}
              {(totalQuestions > 0 || totalMarks > 0) && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-end gap-8 text-sm">
                  <span className="text-gray-600">
                    Total Questions: <strong className="text-gray-900">{totalQuestions}</strong>
                  </span>
                  <span className="text-gray-600">
                    Total Marks: <strong className="text-gray-900">{totalMarks}</strong>
                  </span>
                </div>
              )}
            </section>

            {/* ── Section 4: Additional Information ─────────────────────────── */}
            <section>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Additional information{' '}
                <span className="text-gray-400 font-normal">(For better output)</span>
              </label>
              <textarea
                rows={4}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Instruction or information about the question paper..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
              />
            </section>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
            )}
          </div>

          {/* ── Footer action bar ──────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-8 py-5 border-t border-gray-100 bg-gray-50/60">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-lg bg-[#18181B] px-6 py-2.5 text-sm font-medium text-white hover:bg-black/80 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating…' : 'Next →'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
