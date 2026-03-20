export default function LibraryPage() {
  return (
    <div className="flex flex-col min-h-full">
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-900">My Library</h1>
      </header>
      <main className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="text-center">
          <svg className="mx-auto mb-4 text-gray-300" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Library is Empty</h2>
          <p className="text-sm text-gray-400">Your saved papers and resources will appear here.</p>
        </div>
      </main>
    </div>
  );
}
