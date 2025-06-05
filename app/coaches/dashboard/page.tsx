"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import CoachChatForCoach from "../_components/chat/CoachChatForCoach";

interface Profile {
  full_name: string;
}

interface CoachRequest {
  id: string;
  created_at: string;
  user_id: string;
  profiles: Profile | null;
}

interface RawCoachRequest {
  id: string;
  created_at: string;
  user_id: string;
  profiles: Profile | Profile[] | null;
}

export default function CoachesPage() {
  const supabase = createClientComponentClient();
  const [requests, setRequests] = useState<CoachRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Profile[]>([]);

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
  const fetchStudents = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: studentData, error: studentError } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("coach_id", user.id);

    if (studentError) {
      toast.error("Failed to load students.");
      return;
    }

    setStudents(studentData ?? []);
  }, [supabase]);

  useEffect(() => {
    const fetchRequests = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("coach_requests")
        .select(
          `
        id,
        created_at,
        user_id,
        profiles(full_name)
      `
        )
        .eq("coach_id", user.id)
        .eq("status", "pending");

      if (data) {
        const fixedData = data.map((item: RawCoachRequest) => ({
          ...item,
          profiles: Array.isArray(item.profiles)
            ? item.profiles[0]
            : item.profiles,
        }));
        setRequests(fixedData);
      }

      setLoading(false);
    };

    fetchStudents();
    fetchRequests();
  }, [supabase, fetchStudents]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🏋️ Coach Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="My Users">
          {students.length === 0 ? (
            <p>No students yet.</p>
          ) : (
            <ul className="space-y-2">
              {students.map((student, index) => (
                <li key={index} className="bg-gray-100 p-2 rounded">
                  {student.full_name}
                </li>
              ))}
            </ul>
          )}
        </Card>
        <CoachChatForCoach />

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
                    <p>{req.profiles?.full_name ?? "Unknown User"}</p>

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
    <div className="bg-[#fff] p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
}
