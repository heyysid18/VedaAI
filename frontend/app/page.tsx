import Link from 'next/link';

function TopBar() {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center gap-3 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-700 transition-colors">
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
          <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold text-xs">S</div>
          <span>Siddhant Jain</span>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      <TopBar />
      <main className="flex-1 flex flex-col items-center justify-center">
        {/* Empty state */}
        <div className="flex flex-col items-center text-center py-16">
          {/* Illustration */}
          <div className="mb-6">
            <div className="w-44 h-44 rounded-full bg-gray-100 flex items-center justify-center">
              <svg width="130" height="110" fill="none" viewBox="0 0 130 110">
                {/* Document */}
                <rect x="22" y="8" width="58" height="76" rx="5" fill="#E5E7EB" />
                <rect x="32" y="20" width="38" height="5" rx="2" fill="#1a1a1a" />
                <rect x="32" y="30" width="30" height="3.5" rx="1.5" fill="#9CA3AF" />
                <rect x="32" y="38" width="24" height="3.5" rx="1.5" fill="#9CA3AF" />
                <rect x="32" y="46" width="28" height="3.5" rx="1.5" fill="#9CA3AF" />
                {/* Pencil/squiggle */}
                <path d="M76 14 Q84 9 82 20" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                {/* Magnifying glass */}
                <circle cx="82" cy="72" r="24" fill="white" stroke="#D1D5DB" strokeWidth="2.5"/>
                <circle cx="82" cy="72" r="17" fill="#F3F4F6" />
                {/* X inside magnifier */}
                <path d="M74 64L90 80M90 64L74 80" stroke="#EF4444" strokeWidth="4.5" strokeLinecap="round" />
                {/* Handle */}
                <path d="M100 90L114 104" stroke="#9CA3AF" strokeWidth="5" strokeLinecap="round" />
                {/* Decorators */}
                <path d="M16 88 L21 82 L18 90" stroke="#60A5FA" strokeWidth="2" strokeLinejoin="round" fill="none" />
                <circle cx="114" cy="60" r="4" fill="#BFDBFE" />
              </svg>
            </div>
          </div>
          <h2 className="text-base font-bold text-gray-800">No assignments yet</h2>
          <p className="text-sm text-gray-400 mt-2 max-w-xs leading-relaxed">
            Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
          </p>
          <Link
            href="/assignment/new"
            className="mt-6 flex items-center gap-2 rounded-full bg-[#1a1a1a] px-6 py-3 text-sm font-medium text-white hover:bg-black transition-colors"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Your First Assignment
          </Link>
        </div>
      </main>
    </div>
  );
}
