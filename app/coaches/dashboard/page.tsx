"use client";

export default function CoachesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏋️ Coach Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="My Users">List of users with click functionality</Card>
        <Card title="Requests">Review new requests</Card>
        <Card title="Create Plan">Form for creating diet or workout plans</Card>
        <Card title="Progress Report">User progress statistics</Card>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
}
