"use client";

import dynamic from "next/dynamic";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserHeader } from "./UserHeader";
import CustomLoadingBars from "@/components/ui/loadings/CustomLoadingBars";
import SleepCard from "./SleepLogForm/SleepCard";
import useDailyLogs from "@/hooks/useDailyLogs";

const DailyLogForm = dynamic(() => import("./DailyLogForm/DailyLogForm"), {
  ssr: false,
});
const SleepLogForm = dynamic(() => import("./SleepLogForm/SleepLogForm"), {
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

export default function DashboardPage() {
  const { data: profile, isLoading, error } = useUserProfile();
  const {
    data: dailyLogs,
    error: logsError,
    isLoading: logsLoading,
  } = useDailyLogs(profile?.id || "");

  if (isLoading || logsLoading) return <CustomLoadingBars />;
  if (error || logsError)
    return (
      <div role="alert" className="text-red-500">
        Error: {(error as Error)?.message || (logsError as Error)?.message}
      </div>
    );
  if (!profile || !dailyLogs)
    return (
      <div role="alert" className="text-red-500">
        No profile data found.
      </div>
    );

  return (
    <div className="flex flex-col p-3 lg:p-5 gap-6 w-full">
      {/* Header*/}
      <UserHeader profile={profile} avatarUrl={profile.avatar_url} />

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
          <WeightChart weightData={dailyLogs} />
          <WaterIntakeChart waterData={dailyLogs} />
          <MoodChart data={dailyLogs} />
        </div>
        <SleepCard userId={profile.id} />
      </div>
    </div>
  );
}
