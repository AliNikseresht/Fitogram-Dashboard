"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Request = {
  id: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name?: string;
  }[];
};

const supabase = createClientComponentClient();

export default function CoachesPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("coach_requests")
        .select(
          `
  id,
  created_at,
  user_id,
  profiles!inner(full_name)
`
        )

        .eq("coach_id", user.id)
        .eq("status", "pending");

      console.log(data);

      if (error) {
        toast.error("Failed to load requests.");
      } else {
        setRequests(data);
      }

      setLoading(false);
    };

    fetchRequests();
  }, []);

  const handleDecision = async (
    requestId: string,
    userId: string,
    accept: boolean
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const status = accept ? "accepted" : "rejected";

    const { error: updateError } = await supabase
      .from("coach_requests")
      .update({ status })
      .eq("id", requestId);

    if (updateError) {
      toast.error("Failed to update request.");
      return;
    }

    if (accept) {
      await supabase
        .from("profiles")
        .update({ coach_id: user.id })
        .eq("id", userId);
    }

    toast.success(`Request ${status}.`);
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏋️ Coach Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="My Users">List of users with click functionality</Card>
        <Card title="Requests">
          {loading ? (
            <p>Loading...</p>
          ) : requests.length === 0 ? (
            <p>No new requests.</p>
          ) : (
            <ul className="space-y-4">
              {requests.map((req) => (
                <li
                  key={req.id}
                  className="bg-gray-100 p-3 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p>{req.profiles?.[0]?.full_name ?? "Unknown User"}</p>

                    <p className="text-sm text-gray-500">
                      {new Date(req.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDecision(req.id, req.user_id, true)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecision(req.id, req.user_id, false)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
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
