"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserHeader } from "./UserHeader";
import { UserGoalProgress } from "./UserGoalProgress";
import { UserSummaryCards } from "./UserSummaryCards";
import CustomLoadingBars from "@/components/ui/loadings/CustomLoadingBars";

const DailyLogForm = dynamic(() => import("./DailyLogForm/DailyLogForm"), {
  ssr: false,
});
const WeightChart = dynamic(() => import("./charts/WeightChart"), {
  ssr: false,
});
const WaterIntakeChart = dynamic(() => import("./charts/WaterIntakeChart"), {
  ssr: false,
});
const MoodChart = dynamic(() => import("./charts/MoodChart"), { ssr: false });
const CoachChatForUsers = dynamic(() => import("./chat/CoachChatForUsers"), {
  ssr: false,
});
const SleepLogForm = dynamic(() => import("./SleepLogForm/SleepLogForm"), {
  ssr: false,
});
import SleepCard from "./SleepLogForm/SleepCard";
import fetchSleepLogs from "@/services/fetchSleepLogs";
import formatDurationHoursMinutes from "@/functions/formatDuration";

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
            setSleepDuration(formatDurationHoursMinutes(lastLog.duration));
          }
        } catch (err) {
          console.error("Error fetching sleep logs:", err);
        }
      };
      fetchSleep();
    }
  }, [profile?.id]);

  if (loading) return <CustomLoadingBars />;
  if (error)
    return (
      <div role="alert" className="text-red-500">
        Error: {error}
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
      <div className="flex flex-col bg-[#fff] rounded-xl shadow">
        <UserHeader profile={profile} avatarUrl={profile.avatar_url} />
        <UserGoalProgress progressPercent={70} />
        <UserSummaryCards sleep={sleepDuration} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-2">
        <DailyLogForm profileId={profile.id} />
        <SleepLogForm userId={profile.id} />
        <CoachChatForUsers />
      </div>
      <div className="w-full bg-[#fff] shadow rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-3">Progress Tracker</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 w-full mb-3">
          <WeightChart profileId={profile.id} />
          <WaterIntakeChart profileId={profile.id} />
          <MoodChart profileId={profile.id} />
        </div>
        <SleepCard userId={profile.id} />
      </div>
    </div>
  );
}
