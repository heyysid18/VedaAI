'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAssignment } from '@/hooks/useAssignment';
import { Assignment } from '@/types';

function TopBar({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-100">
      <div className="flex items-center gap-3 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-700 transition-colors">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div className="w-4 h-4 opacity-40">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="1" width="5" height="5" rx="0.5"/><rect x="10" y="1" width="5" height="5" rx="0.5"/>
            <rect x="1" y="10" width="5" height="5" rx="0.5"/><rect x="10" y="10" width="5" height="5" rx="0.5"/>
          </svg>
        </div>
        <span>{title}</span>
      </div>
      <div className="flex items-center gap-3">
        {/* Bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
        </button>
        {/* Avatar */}
        <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
            J
          </div>
          <span>John Doe</span>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>
    </header>
  );
}

function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const formatted = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '-');

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => router.push(`/assignment/${assignment._id}`)}>
      {/* Title row */}
      <div className="flex items-start justify-between mb-6">
        <h3 className="font-semibold text-gray-900 text-base pr-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {assignment.title}
        </h3>
        {/* 3-dot menu */}
        <div className="relative shrink-0" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-9 z-20 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 text-sm">
              <button
                onClick={() => router.push(`/assignment/${assignment._id}`)}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View Assignment
              </button>
              <button className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 transition-colors">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          <span className="font-medium text-gray-500">Assigned on :</span>{' '}
          {formatted(assignment.createdAt)}
        </span>
        <span>
          <span className="font-medium text-gray-500">Due :</span>{' '}
          {formatted(assignment.dueDate)}
        </span>
      </div>
    </div>
  );
}

export default function AssignmentsPage() {
  const { assignments, loading, error, fetchAll } = useAssignment();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Assignment" />

      <main className="flex-1 px-6 py-5 pb-28">
        {/* Page title */}
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
            <h1 className="text-lg font-bold text-gray-900">Assignments</h1>
          </div>
          <p className="text-sm text-gray-400 ml-4">Manage and create assignments for your classes.</p>
        </div>

        {/* Filter + Search bar */}
        <div className="flex items-center gap-3 mb-5">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 hover:bg-gray-50 transition-colors">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
            </svg>
            Filter By
          </button>
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Assignment"
              className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            {/* Illustration */}
            <div className="mb-6 relative">
              <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center">
                <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
                  <rect x="12" y="8" width="36" height="44" rx="4" fill="#E5E7EB" />
                  <rect x="18" y="16" width="24" height="3" rx="1.5" fill="#9CA3AF" />
                  <rect x="18" y="23" width="20" height="3" rx="1.5" fill="#9CA3AF" />
                  <rect x="18" y="30" width="16" height="3" rx="1.5" fill="#9CA3AF" />
                  <circle cx="42" cy="42" r="12" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
                  <path d="M38 42L40.5 44.5L46 39" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-bold text-gray-800">No assignments yet</h2>
            <p className="text-sm text-gray-400 mt-1.5 max-w-xs">
              {search ? 'No assignments match your search.' : 'Create your first assignment to start collecting and grading student submissions.'}
            </p>
            {!search && (
              <Link
                href="/assignment/new"
                className="mt-5 flex items-center gap-2 rounded-full bg-[#1a1a1a] px-5 py-2.5 text-sm font-medium text-white hover:bg-black transition-colors"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Your First Assignment
              </Link>
            )}
          </div>
        )}

        {/* 2-column card grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {filtered.map((a) => (
              <AssignmentCard key={a._id} assignment={a} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Create Assignment button */}
      {!loading && assignments.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 print:hidden">
          <Link
            href="/assignment/new"
            className="flex items-center gap-2 rounded-full bg-[#1a1a1a] px-6 py-3 text-sm font-medium text-white shadow-xl hover:bg-black transition-colors"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Assignment
          </Link>
        </div>
      )}
    </div>
  );
}
