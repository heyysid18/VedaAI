'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useAssignment } from '@/hooks/useAssignment';
import { useRouter } from 'next/navigation';
import { QuestionType } from '@/types';
import Link from 'next/link';

// ── Types ─────────────────────────────────────────────────────────────────────

interface QuestionRow {
  id: number;
  type: QuestionType | '';
  numQuestions: number;
  marks: number;
}

const QUESTION_TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: 'mcq', label: 'Multiple Choice Questions' },
  { value: 'short_answer', label: 'Short Questions' },
  { value: 'long_answer', label: 'Long Answer Questions' },
  { value: 'true_false', label: 'True / False' },
  { value: 'fill_in_the_blank', label: 'Fill in the Blank' },
];

let rowCounter = 2;

// ── Stepper ────────────────────────────────────────────────────────────────────

function Stepper({
  value,
  onChange,
  min = 0,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-sm"
      >
        −
      </button>
      <span className="w-6 text-center text-sm font-semibold text-gray-800 select-none">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-sm"
      >
        +
      </button>
    </div>
  );
}

// ── TopBar ─────────────────────────────────────────────────────────────────────

function TopBar() {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center gap-3 text-sm text-gray-400">
        <Link href="/assignments" className="hover:text-gray-700 transition-colors">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div className="w-4 h-4 text-gray-300">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="1" width="5" height="5" rx="0.5"/><rect x="10" y="1" width="5" height="5" rx="0.5"/>
            <rect x="1" y="10" width="5" height="5" rx="0.5"/><rect x="10" y="10" width="5" height="5" rx="0.5"/>
          </svg>
        </div>
        <span className="text-gray-400">Assignment</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
        </button>
        <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
          <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold text-xs">J</div>
          <span>John Doe</span>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>
    </header>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function CreateAssignmentPage() {
  const router = useRouter();
  const { create, loading, error } = useAssignment();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [instructions, setInstructions] = useState('');
  const [rows, setRows] = useState<QuestionRow[]>([
    { id: 1, type: '', numQuestions: 0, marks: 0 },
  ]);

  // ── File Handlers ──────────────────────────────────────────────────────────

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

  // ── Row Handlers ───────────────────────────────────────────────────────────

  const updateRow = (id: number, field: keyof QuestionRow, value: string | number) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const addRow = () => {
    setRows((prev) => [...prev, { id: rowCounter++, type: '', numQuestions: 0, marks: 0 }]);
  };

  const removeRow = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  // ── Derived ────────────────────────────────────────────────────────────────

  const totalQuestions = rows.reduce((s, r) => s + (r.numQuestions || 0), 0);
  const totalMarks = rows.reduce((s, r) => s + (r.numQuestions || 0) * (r.marks || 0), 0);

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    const validRows = rows.filter((r) => r.type && r.numQuestions > 0);
    if (!dueDate || validRows.length === 0) return;

    const avgMPQ = totalQuestions > 0 ? Math.round(totalMarks / totalQuestions) || 1 : 1;

    const assignment = await create({
      title: title.trim() || fileName || 'Untitled Assignment',
      dueDate,
      questionTypes: [...new Set(validRows.map((r) => r.type as QuestionType))],
      numQuestions: totalQuestions || 1,
      marksPerQuestion: avgMPQ,
      instructions,
    });

    if (assignment) {
      router.push('/assignments');
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col min-h-full">
      <TopBar />

      <main className="flex-1 px-6 py-5 pb-8">
        {/* Page title */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
            <h1 className="text-lg font-bold text-gray-900">Create Assignment</h1>
          </div>
          <p className="text-sm text-gray-400 ml-[18px]">Set up a new assignment for your students</p>
        </div>

        {/* Progress bar */}
        <div className="mb-5 h-1.5 rounded-full bg-gray-200 overflow-hidden max-w-3xl mx-auto">
          <div className="h-full w-1/2 rounded-full bg-[#1a1a1a]" />
        </div>

        {/* Card */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-8 py-7 space-y-6">

            {/* Card header */}
            <div>
              <h2 className="text-base font-semibold text-gray-900">Assignment Details</h2>
              <p className="text-sm text-gray-400 mt-0.5">Basic information about your assignment</p>
            </div>

            {/* Upload */}
            <section>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-8 cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-orange-400 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <svg width="28" height="28" fill="none" stroke="#9CA3AF" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
                {fileName ? (
                  <p className="text-sm font-medium text-gray-700">{fileName}</p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 font-medium">Choose a file or drag &amp; drop it here</p>
                    <p className="text-xs text-gray-400">JPEG, PNG, upto 10MB</p>
                    <button type="button" className="mt-1 rounded-full border border-gray-300 bg-white px-5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                      Browse Files
                    </button>
                  </>
                )}
              </div>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
              <p className="text-xs text-gray-400 text-center mt-2">Upload images of your preferred document/image</p>
            </section>

            {/* Due Date */}
            <section>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={dueDate}
                  onClick={() => {
                    const inp = document.getElementById('due-date-hidden');
                    if (inp) inp.click();
                  }}
                  placeholder="Choose a chapter"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 appearance-none pr-10 cursor-pointer transition"
                />
                <input
                  id="due-date-hidden"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
                    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
            </section>

            {/* Question Type Table */}
            <section>
              {/* Header */}
              <div className="grid grid-cols-[1fr_auto_auto_28px] gap-3 mb-2 px-1 items-center">
                <span className="text-sm font-semibold text-gray-700">Question Type</span>
                <span className="text-sm font-semibold text-gray-700 text-center w-28">No. of Questions</span>
                <span className="text-sm font-semibold text-gray-700 text-center w-24">Marks</span>
                <span />
              </div>

              <div className="space-y-3">
                {rows.map((row) => (
                  <div key={row.id} className="grid grid-cols-[1fr_auto_auto_28px] gap-3 items-center">
                    {/* Type dropdown */}
                    <div className="relative flex items-center gap-2">
                      <div className="relative flex-1">
                        <select
                          value={row.type}
                          onChange={(e) => updateRow(row.id, 'type', e.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-gray-900 pr-8 bg-white transition"
                        >
                          <option value="">Select type…</option>
                          {QUESTION_TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </span>
                      </div>
                      {/* Remove × */}
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        disabled={rows.length === 1}
                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-20 text-base leading-none px-1"
                      >
                        ×
                      </button>
                    </div>

                    {/* Num Questions stepper */}
                    <div className="flex justify-center w-28">
                      <Stepper
                        value={row.numQuestions}
                        onChange={(v) => updateRow(row.id, 'numQuestions', v)}
                        min={0}
                      />
                    </div>

                    {/* Marks stepper */}
                    <div className="flex justify-center w-24">
                      <Stepper
                        value={row.marks}
                        onChange={(v) => updateRow(row.id, 'marks', v)}
                        min={0}
                      />
                    </div>

                    {/* Empty spacer to keep grid aligned */}
                    <span />
                  </div>
                ))}
              </div>

              {/* Add row */}
              <button
                type="button"
                onClick={addRow}
                className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-black transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white text-base leading-none">+</span>
                Add Question Type
              </button>

              {/* Totals */}
              <div className="mt-4 pt-3 text-right space-y-0.5 text-sm text-gray-600">
                <p>Total Questions : <strong className="text-gray-900">{totalQuestions}</strong></p>
                <p>Total Marks : <strong className="text-gray-900">{totalMarks}</strong></p>
              </div>
            </section>

            {/* Additional Information */}
            <section>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Information{' '}
                <span className="font-normal text-gray-400">(For better output)</span>
              </label>
              <div className="relative">
                <textarea
                  rows={4}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g Generate a question paper for 3 hour exam duration..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none pr-10 transition"
                />
                {/* mic icon */}
                <button type="button" className="absolute right-3 bottom-3 text-gray-300 hover:text-gray-500">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                </button>
              </div>
            </section>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-8 py-5 border-t border-gray-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Previous
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 rounded-full bg-[#1a1a1a] px-6 py-2.5 text-sm font-medium text-white hover:bg-black disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating…' : 'Next'}
              {!loading && (
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
