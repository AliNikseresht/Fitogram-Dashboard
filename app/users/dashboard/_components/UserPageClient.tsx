"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserHeader } from "./UserHeader";
import { UserGoalProgress } from "./UserGoalProgress";
import { UserReminders } from "./UserReminders";
import { UserSummaryCards } from "./UserSummaryCards";
import CustomLoadingBars from "@/components/ui/loadings/CustomLoadingBars";
import DailyLogForm from "./DailyLogForm/DailyLogForm";
import WeightChart from "./charts/WeightChart";
import WaterIntakeChart from "./charts/WaterIntakeChart";
import MoodChart from "./charts/MoodChart";
import CoachChat from "./chat/CoachChat";
import SleepLogForm from "./SleepLogForm/SleepLogForm";
import SleepCard from "./SleepLogForm/SleepCard";
import fetchSleepLogs from "@/services/fetchSleepLogs";
import formatDurationHoursMinutes from "@/functions/formatDuration";

interface QuickLink {
  label: string;
  href: string;
  bgColor: string;
  textColor: string;
}

export default function DashboardPage() {
  const { profile, loading, error } = useUserProfile();
  const [sleepDuration, setSleepDuration] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.id) {
      const fetchSleep = async () => {
        try {
          const logs = await fetchSleepLogs(profile.id);
          if (logs.length > 0) {
            const lastLog = logs[logs.length - 1];
            const formattedDuration = formatDurationHoursMinutes(
              lastLog.duration
            );
            setSleepDuration(formattedDuration);
          }
        } catch (err) {
          console.error("Error fetching sleep logs:", err);
        }
      };
      fetchSleep();
    }
  }, [profile?.id]);

  if (loading) return <CustomLoadingBars />;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!profile)
    return <div className="text-red-500">No profile data found.</div>;

  const role = profile?.role ?? "user";

  const quickLinks: QuickLink[] = [
    {
      label: "Workouts",
      href: `/${role}s/workouts`,
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
    },
    {
      label: "Nutrition",
      href: `/${role}s/nutrition`,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
    },
    {
      label: "Progress",
      href: `/${role}s/progress`,
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
    },
    {
      label: "AI Assistant",
      href: `/${role}s/ai-assistant`,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
  ];

  return (
    <div className="flex flex-col p-3 lg:p-5 gap-6 w-full">
      <div className="flex flex-col bg-[#fff] p-0 rounded-xl shadow">
        <UserHeader />
        <UserGoalProgress progressPercent={70} />
        <UserSummaryCards sleep={sleepDuration} />
      </div>
      <div className="flex justify-between w-full flex-col lg:flex-row">
        <DailyLogForm profileId={profile.id} />
        <SleepLogForm userId={profile.id} />
        <CoachChat />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 w-full">
        <WeightChart profileId={profile.id} />
        <WaterIntakeChart profileId={profile.id} />
        <MoodChart profileId={profile.id} />
        <SleepCard userId={profile.id} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <UserReminders />
        <ProgramCard
          label="Workout Program"
          id={profile.workout_program_id}
          fallbackText={profile.coach ? "Personalized (with coach)" : "General"}
          href={
            profile.workout_program_id
              ? `/programs/workout/${profile.workout_program_id}`
              : ""
          }
        />
        <ProgramCard
          label="Nutrition Program"
          id={profile.nutrition_program_id}
          fallbackText="Not assigned"
          href={
            profile.nutrition_program_id
              ? `/programs/nutrition/${profile.nutrition_program_id}`
              : ""
          }
        />
      </div>

      {/* Quick Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickLinks.map(({ label, href, bgColor, textColor }) => (
          <Link
            key={label}
            href={href}
            className={`${bgColor} ${textColor} rounded-xl p-4 text-center font-semibold`}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProgramCard({
  label,
  id,
  fallbackText,
  href,
}: {
  label: string;
  id: string | null | undefined;
  fallbackText: string;
  href: string;
}) {
  if (!id) {
    return (
      <div className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 rounded-xl p-4 text-center">
        <p className="text-white">{label}</p>
        <p className="text-lg font-bold text-white">{fallbackText}</p>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="bg-blue-50 hover:bg-blue-100 rounded-xl p-4 block text-center text-blue-700 font-semibold"
    >
      <p>{label}</p>
      <p className="text-lg font-bold underline">View Program</p>
    </Link>
  );
}
