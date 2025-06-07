"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserHeader } from "./UserHeader";
import { UserGoalProgress } from "./UserGoalProgress";
import { UserSummaryCards } from "./UserSummaryCards";
import CustomLoadingBars from "@/components/ui/loadings/CustomLoadingBars";
import SleepCard from "./SleepLogForm/SleepCard";
import fetchSleepLogs from "@/services/fetchSleepLogs";
import formatDuration from "@/functions/formatDuration";

const DailyLogForm = dynamic(() => import("./DailyLogForm/DailyLogForm"), {
  ssr: false,
});
const SleepLogForm = dynamic(() => import("./SleepLogForm/SleepLogForm"), {
  ssr: false,
});

const WeightChart = dynamic(() => import("./charts/WeightChart"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[200px] bg-gray-100 animate-pulse rounded" />
  ),
});
const WaterIntakeChart = dynamic(() => import("./charts/WaterIntakeChart"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[200px] bg-gray-100 animate-pulse rounded" />
  ),
});
const MoodChart = dynamic(() => import("./charts/MoodChart"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[200px] bg-gray-100 animate-pulse rounded" />
  ),
});
const CoachChatForUsers = dynamic(() => import("./chat/CoachChatForUsers"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[150px] bg-gray-100 animate-pulse rounded" />
  ),
});

export default function DashboardPage() {
  const { data: profile, isLoading, error } = useUserProfile();
  const [sleepDuration, setSleepDuration] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.id) return;
    const fetchSleep = async () => {
      try {
        const logs = await fetchSleepLogs(profile.id);
        if (logs.length > 0) {
          const last = logs[logs.length - 1];
          setSleepDuration(formatDuration(last.duration));
        }
      } catch (err) {
        console.error("Error fetching sleep logs:", err);
      }
    };
    fetchSleep();
  }, [profile?.id]);

  if (isLoading) return <CustomLoadingBars />;
  if (error)
    return (
      <div role="alert" className="text-red-500">
        Error: {(error as Error).message}
      </div>
    );
  if (!profile)
    return (
      <div role="alert" className="text-red-500">
        No profile data found.
      </div>
    );

  return (
    <div className="flex flex-col p-3 lg:p-5 gap-6 w-full">
      {/* Header & Goals */}
      <div className="flex flex-col bg-white rounded-xl shadow">
        <UserHeader profile={profile} avatarUrl={profile.avatar_url} />
        <UserGoalProgress progressPercent={70} />
        <UserSummaryCards sleep={sleepDuration} />
      </div>

      {/* Forms */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <DailyLogForm profileId={profile.id} />
        <SleepLogForm userId={profile.id} />
        <CoachChatForUsers />
      </div>

      {/* Progress Charts */}
      <div className="w-full bg-white shadow rounded-xl p-4 min-h-[200]">
        <h2 className="text-lg font-semibold mb-3">Progress Tracker</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-3">
          <WeightChart profileId={profile.id} />
          <WaterIntakeChart profileId={profile.id} />
          <MoodChart profileId={profile.id} />
        </div>
        <SleepCard userId={profile.id} />
      </div>
    </div>
  );
}
