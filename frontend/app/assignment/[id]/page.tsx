import { AssignmentOutput } from '@/components/AssignmentOutput';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AssignmentPage({ params }: Props) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <AssignmentOutput assignmentId={id} />
      </div>
    </main>
  );
}
