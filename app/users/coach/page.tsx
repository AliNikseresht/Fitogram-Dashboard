"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

const CoachSelectionPage = () => {
  const supabase = createClientComponentClient();
  const [coaches, setCoaches] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCoaches = async () => {
      const { data, error } = await supabase
        .from("coaches")
        .select("id, full_name, specialization, avatar_url")
        .eq("is_available", true);
      if (error) console.error("Error fetching coaches:", error);
      else setCoaches(data);
    };

    fetchCoaches();
  }, [supabase]);

  const handleChooseCoach = async (coachId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ coach_id: coachId, status: "pending_coach_request" })
      .eq("id", (await supabase.auth.getUser()).data.user?.id);
    if (!error) router.push("/users/dashboard");
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Choose Your Coach</h1>
      {coaches.map((coach) => (
        <div
          key={coach.id}
          className="flex items-center justify-between bg-gray-100 rounded p-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-800"></div>
            <div>
              <p className="font-semibold">{coach.full_name}</p>
              <p className="text-sm text-gray-600">{coach.specialization}</p>
            </div>
          </div>
          <button
            onClick={() => handleChooseCoach(coach.id)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Select
          </button>
        </div>
      ))}
    </div>
  );
};

export default CoachSelectionPage;
