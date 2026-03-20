'use client';

import { Assignment } from '@/types';
import { useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface StudentInfo {
  name: string;
  rollNo: string;
  section: string;
}

interface Props {
  assignment: Assignment;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const SECTION_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const DIFFICULTY_BADGE: Record<string, string> = {
  easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  hard: 'bg-red-50 text-red-700 border-red-200',
};

function inferDifficulty(qIdx: number, total: number): 'easy' | 'medium' | 'hard' {
  const pct = qIdx / Math.max(total - 1, 1);
  if (pct < 0.34) return 'easy';
  if (pct < 0.67) return 'medium';
  return 'hard';
}

// ── Main Component ────────────────────────────────────────────────────────────

export function ExamPaper({ assignment }: Props) {
  const [student, setStudent] = useState<StudentInfo>({
    name: '',
    rollNo: '',
    section: '',
  });

  const totalMarks = assignment.generatedPaper.reduce(
    (acc, s) => acc + s.questions.reduce((a, q) => a + q.marks, 0),
    0
  );

  return (
    <div className="bg-white px-12 py-16 shadow-lg border border-gray-200 min-h-[1056px] w-full max-w-[850px] mx-auto font-serif text-gray-900 print:shadow-none print:border-none print:p-0">
      
      {/* ── Formal Exam Header ─────────────────────────────────────────────── */}
      <div className="text-center border-b-2 border-black pb-8 mb-8 space-y-3">
        <h1 className="text-3xl font-bold tracking-wide uppercase">
          VedaAI Public School
        </h1>
        <h2 className="text-xl font-semibold">
          Final Examination (2025-26)
        </h2>
        <h3 className="text-lg font-medium underline underline-offset-4">
          {assignment.title}
        </h3>
        
        <div className="flex justify-between items-end mt-6 text-sm font-medium">
          <div className="text-left space-y-1">
            <p>Time Allowed: 3 Hours</p>
            <p>
              Date: {new Date(assignment.dueDate).toLocaleDateString('en-IN')}
            </p>
          </div>
          <div className="text-right space-y-1">
            <p>Maximum Marks: {totalMarks}</p>
          </div>
        </div>
      </div>

      {/* ── Student Information Table ───────────────────────────────────────── */}
      <div className="mb-10 w-full border border-black">
        <div className="grid grid-cols-2 divide-x divide-black border-b border-black">
          <div className="px-4 py-3 flex items-center">
            <span className="font-semibold w-32 shrink-0">Student's Name:</span>
            <input 
              type="text" 
              value={student.name}
              onChange={(e) => setStudent({...student, name: e.target.value})}
              className="w-full bg-transparent focus:outline-none placeholder-gray-300 italic font-sans text-sm" 
              placeholder="Enter full name" 
            />
          </div>
          <div className="px-4 py-3 flex items-center">
            <span className="font-semibold w-24 shrink-0">Roll No.:</span>
            <input 
              type="text" 
              value={student.rollNo}
              onChange={(e) => setStudent({...student, rollNo: e.target.value})}
              className="w-full bg-transparent focus:outline-none placeholder-gray-300 italic font-sans text-sm" 
              placeholder="Enter roll number" 
            />
          </div>
        </div>
        <div className="grid grid-cols-2 divide-x divide-black">
          <div className="px-4 py-3 flex items-center">
            <span className="font-semibold w-32 shrink-0">Class & Section:</span>
            <input 
              type="text" 
              value={student.section}
              onChange={(e) => setStudent({...student, section: e.target.value})}
              className="w-full bg-transparent focus:outline-none placeholder-gray-300 italic font-sans text-sm" 
              placeholder="e.g. 10th A" 
            />
          </div>
          <div className="px-4 py-3 flex items-center">
            <span className="font-semibold w-24 shrink-0">Signature:</span>
            <div className="w-full border-b border-dotted border-gray-400 mt-4"></div>
          </div>
        </div>
      </div>

      {/* ── General Instructions ────────────────────────────────────────────── */}
      <div className="mb-10">
        <h4 className="font-bold underline mb-3">General Instructions:</h4>
        <ol className="list-decimal list-inside space-y-1.5 text-sm">
          <li>This question paper contains {assignment.generatedPaper.length} sections.</li>
          <li>All questions are compulsory.</li>
          {assignment.instructions && (
            <li>{assignment.instructions}</li>
          )}
          <li>Write neatly and legibly.</li>
        </ol>
      </div>

      {/* ── Sections & Questions ───────────────────────────────────────────── */}
      <div className="space-y-12">
        {assignment.generatedPaper.length === 0 ? (
          <p className="text-center italic text-gray-500 py-10 font-sans">
            [ No questions have been generated yet ]
          </p>
        ) : (
          assignment.generatedPaper.map((section, sIdx) => (
            <section key={sIdx} className="break-inside-avoid">
              
              {/* Section Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold uppercase underline underline-offset-4">
                  Section - {SECTION_LABELS[sIdx] ?? sIdx + 1}
                </h2>
                <p className="font-semibold mt-2">({section.sectionTitle})</p>
              </div>

              {/* Questions */}
              <div className="space-y-6 pl-2">
                {section.questions.map((question, qIdx) => {
                  const difficulty = inferDifficulty(qIdx, section.questions.length);
                  return (
                    <div key={qIdx} className="flex items-start justify-between gap-6 group break-inside-avoid">
                      
                      {/* Q Number & Text */}
                      <div className="flex gap-4">
                        <span className="font-bold shrink-0 mt-0.5">
                          Q{qIdx + 1}.
                        </span>
                        <div className="flex-1">
                          <p className="text-[15px] leading-relaxed text-gray-900">
                            {question.questionText}
                          </p>
                          
                          {/* Badges for UI only (hidden in print) */}
                          <div className="flex items-center gap-2 mt-2 print:hidden select-none">
                            <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider font-sans ${DIFFICULTY_BADGE[difficulty]}`}>
                              {difficulty}
                            </span>
                            <span className="inline-flex items-center rounded border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-700 capitalize tracking-wider font-sans">
                              {question.questionType.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Marks */}
                      <div className="shrink-0 font-bold whitespace-nowrap mt-0.5">
                        [{question.marks}]
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      {assignment.generatedPaper.length > 0 && (
        <div className="mt-20 text-center font-bold tracking-widest uppercase pb-10">
          *** End of Paper ***
        </div>
      )}
    </div>
  );
}
