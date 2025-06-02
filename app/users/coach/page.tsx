"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";

type Coach = {
  id: string;
  full_name: string;
  bio: string;
  specialization: string;
  avatar_url: string;
};

const CoachSelectionPage = () => {
  const supabase = createClientComponentClient();
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCoaches = async () => {
      const { data, error } = await supabase
        .from("coaches")
        .select("id, full_name, bio, specialization, avatar_url")
        .eq("is_available", true);
      if (error) console.error("Error fetching coaches:", error);
      else setCoaches(data);
    };

    fetchCoaches();
  }, [supabase]);

  const handleChooseCoach = async (coachId: string) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("User not authenticated");
      return;
    }
console.log("User ID:", user.id);
console.log("User from auth:", user);
console.log("User ID to insert:", user.id);

    const { error } = await supabase.from("coach_requests").insert([
      {
        coach_id: coachId,
        user_id: user.id,
        status: "pending",
      },
    ]);

    if (error) {
      toast.error("Failed to send request.");
    } else {
      toast.success(
        "Your request has been sent successfully. After coach approval, it will show in your dashboard."
      );
      router.push("/users/dashboard");
    }
  };

  return (
    <div className="p-4 space-y-4 w-full">
      <h2 className="text-xl font-bold">Choose Your Coach</h2>
      <div className="grid grid-cols-1 lg:grid-cols-4">
        {coaches.map((coach) => (
          <div
            key={coach.id}
            className="flex flex-col bg-[#fff] rounded-xl shadow p-4 gap-5 justify-between items-center"
          >
            <div className="flex flex-col items-center gap-3">
              <Image
                src={coach.avatar_url}
                alt={coach.full_name}
                priority
                width={64}
                height={64}
                className="border-2 border-[#bababa] rounded-full w-32 h-auto"
              />

              <h3 className="font-semibold text-lg">{coach.full_name}</h3>
              <p className="text-sm text-gray-600">{coach.specialization}</p>
              <p className="text-xs text-gray-600">{coach.bio}</p>
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
    </div>
  );
};

export default CoachSelectionPage;
