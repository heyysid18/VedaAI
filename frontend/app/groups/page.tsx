export default function GroupsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-900">My Groups</h1>
      </header>
      <main className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="text-center">
          <svg className="mx-auto mb-4 text-gray-300" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.75a3 3 0 00-3-3H9a3 3 0 00-3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 12a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">No Groups Yet</h2>
          <p className="text-sm text-gray-400">Group management is coming soon.</p>
        </div>
      </main>
    </div>
  );
}
