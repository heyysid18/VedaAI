import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">VedaAI</h1>
          <p className="mt-2 text-gray-600 text-lg">AI-powered assignment generation</p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link
            href="/assignment/new"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Create Assignment
          </Link>
        </div>
      </div>
    </main>
  );
}
