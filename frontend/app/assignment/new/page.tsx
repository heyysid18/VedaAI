import { AssignmentForm } from '@/components/AssignmentForm';

export const metadata = {
  title: 'New Assignment — VedaAI',
  description: 'Create a new AI-generated assignment',
};

export default function NewAssignmentPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">New Assignment</h1>
        <p className="text-sm text-gray-500 mb-8">
          Fill in the details below and let AI generate the questions for you.
        </p>
        <AssignmentForm />
      </div>
    </main>
  );
}
