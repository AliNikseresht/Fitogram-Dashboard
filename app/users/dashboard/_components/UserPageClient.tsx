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
import CoachChatForUsers from "./chat/CoachChatForUsers";
import SleepLogForm from "./SleepLogForm/SleepLogForm";
import SleepCard from "./SleepLogForm/SleepCard";
import fetchSleepLogs from "@/services/fetchSleepLogs";
import formatDurationHoursMinutes from "@/functions/formatDuration";
import { QuickLink } from "@/types/QuickLinksTypes";
import ProgramCard from "./ProgramCard";

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
      <div className="flex flex-col bg-[#fff] rounded-xl shadow">
        <UserHeader />
        <UserGoalProgress progressPercent={70} />
        <UserSummaryCards sleep={sleepDuration} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-2">
        <DailyLogForm profileId={profile.id} />
        <SleepLogForm userId={profile.id} />
        {/* <AiAssistantChat userId={profile.id} /> */}
        <CoachChatForUsers />
      </div>
      <div className="w-full bg-[#fff] shadow rounded-xl p-4">
        <h3 className="text-base font-semibold mb-3">Progress Tracker</h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 w-full mb-3">
          <WeightChart profileId={profile.id} />
          <WaterIntakeChart profileId={profile.id} />
          <MoodChart profileId={profile.id} />
        </div>
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
