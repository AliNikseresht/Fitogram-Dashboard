"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import supabase from "@/libs/supabaseClient";

type Coach = {
  id: string;
  full_name: string;
  bio: string;
  specialization: string;
  avatar_url: string;
};

interface Props {
  initialCoaches: Coach[];
}

export default function CoachSelectionClient({ initialCoaches }: Props) {
  const router = useRouter();
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);

  const { mutate: handleChooseCoach, isPending } = useMutation({
    mutationFn: async (coachId: string) => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase.from("coach_requests").insert([
        {
          coach_id: coachId,
          user_id: user.id,
          status: "pending",
        },
      ]);

      if (error) {
        throw new Error("Failed to send request.");
      }
    },
    onSuccess: () => {
      toast.success("Your request has been sent successfully.");
      router.push("/users/dashboard");
    },
    onError: () => {
      toast.error("Failed to send request.");
      setSelectedCoachId(null); // اگر خطا داشت انتخاب رو ریست کن
    },
  });

  const handleSelect = (coachId: string) => {
    if (selectedCoachId) return; // اگه یکی قبلا انتخاب شده بود، هیچ کاری نکن
    setSelectedCoachId(coachId);
    handleChooseCoach(coachId);
  };

  return (
    <div className="p-4 space-y-4 w-full">
      <h2 className="text-xl font-bold">Choose Your Coach</h2>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2.5">
        {initialCoaches.map((coach) => (
          <div
            key={coach.id}
            className={`flex flex-col bg-white rounded-xl shadow p-4 gap-5 justify-between items-center ${
              selectedCoachId === coach.id ? "border-2 border-blue-500" : ""
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <Image
                src={
                  coach.avatar_url && coach.avatar_url.trim() !== ""
                    ? coach.avatar_url.startsWith("http")
                      ? coach.avatar_url
                      : `/avatars/${coach.avatar_url}`
                    : "/default-avatar.png"
                }
                alt={coach.full_name || "Coach Avatar"}
                width={64}
                height={64}
                className="border-2 border-[#bababa] rounded-full w-32 h-auto"
              />
              <h3 className="font-semibold text-lg">{coach.full_name}</h3>
              <p className="text-sm text-gray-600">{coach.specialization}</p>
              <p className="text-xs text-gray-600">{coach.bio}</p>
            </div>
            <button
              onClick={() => handleSelect(coach.id)}
              className="bg-blue-500 text-white px-4 py-1 rounded cursor-pointer disabled:bg-gray-400"
              disabled={!!selectedCoachId} // وقتی یکی انتخاب شده، همه دکمه‌ها disable بشن
            >
              {selectedCoachId === coach.id
                ? isPending
                  ? "Processing..."
                  : "Selected"
                : "Select"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
