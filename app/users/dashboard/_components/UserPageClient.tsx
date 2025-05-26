"use client";

import CustomLoadingBars from "@/components/ui/loadings/CustomLoadingBars";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserHeader } from "./UserHeader";
import { Avatar } from "@/components/ui/Avatar";
import { UserStats } from "./UserStats";
import { UserSummaryCards } from "./UserSummaryCards";
import { UserGoalProgress } from "./UserGoalProgress";
import { TodayWorkoutPlan } from "./TodayWorkoutPlan";
import { TodayDietPlan } from "./TodayDietPlan";
import { ProgressCharts } from "./charts/ProgressCharts";
import { UserAchievements } from "./UserAchievements";
import { QuickActions } from "./QuickActions";
import { UserReminders } from "./UserReminders";

const UsersPageClient = () => {
  const { profile, avatarUrl, loading } = useUserProfile();

  if (loading) return <CustomLoadingBars />;

  if (!profile)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error loading profile.
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col p-3 lg:p-6 gap-6 w-full">
      <UserHeader
        fullName={profile.full_name}
        role={profile.role}
        avatarUrl={avatarUrl}
      />

      <div className="flex flex-col rounded-xl shadow-xl overflow-y-auto">
        <div className="bg-gradient-to-r rounded-t-2xl from-[#0583c7] to-[#9f1daf] w-full p-2.5 lg:p-5 flex flex-col lg:flex-row lg:justify-between items-center gap-6">
          <div className="w-full flex lg:items-center gap-4">
            <Avatar
              fullName={profile.full_name}
              avatarUrl={avatarUrl}
              size={80}
            />
            <div className="flex flex-col justify-center">
              <h1 className="lg:text-3xl font-bold text-white text-start">
                hey, {profile.full_name}
              </h1>
              <p className="text-xs lg:text-base text-white">
                Weight Loss Program • Week 6
              </p>
            </div>
          </div>

          <UserStats
            height={profile.height}
            weight={profile.weight}
            goal={profile.goal}
          />
        </div>

        <UserGoalProgress progressPercent={75} />

        <UserSummaryCards />
      </div>
      <div className="flex w-full justify-between flex-col lg:flex-row">
        <TodayWorkoutPlan />
        <TodayDietPlan />
        <UserAchievements />
      </div>
      <div className="flex w-full justify-between flex-col lg:flex-row">
        <UserReminders />
        <QuickActions />
      </div>
      <ProgressCharts />
    </div>
  );
};

export default UsersPageClient;
