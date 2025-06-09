"use client";

import { useEffect, useState, useMemo } from "react";
import CustomLoadingBars from "@/components/ui/loadings/CustomLoadingBars";
import supabase from "@/libs/supabaseClient";
import useDailyLogs from "@/hooks/useDailyLogs";
import useSleepLogs from "@/hooks/useSleepLogs";
import NutritionChart from "./_components/NutritionChart";
import { generateRecommendations } from "@/functions/generateRecommendations";
import Recommendations from "./_components/RecommendationsSection";
import LogsSection from "./_components/LogsSection";

export default function NutritionPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
    });
  }, []);

  const {
    data: dailyLogs = [],
    isLoading: dailyLoading,
    error: dailyError,
  } = useDailyLogs(userId ?? "");
  const {
    data: sleepLogs = [],
    isLoading: sleepLoading,
    error: sleepError,
  } = useSleepLogs(userId ?? "");

  const loading = dailyLoading || sleepLoading;
  const error = dailyError || sleepError;

  const lastThreeDailyLogs = useMemo(() => dailyLogs.slice(-3), [dailyLogs]);
  const lastThreeSleepLogs = useMemo(() => sleepLogs.slice(-3), [sleepLogs]);

  const recommendations = useMemo(
    () => generateRecommendations(lastThreeDailyLogs, lastThreeSleepLogs),
    [lastThreeDailyLogs, lastThreeSleepLogs]
  );

  if (loading) return <CustomLoadingBars />;

  if (error)
    return (
      <div className="p-4 text-red-600 font-semibold">
        Error loading data: {error.message}
      </div>
    );

  return (
    <div className="p-4 space-y-6 w-full">
      <h2 className="text-xl font-bold">Personalized Nutrition</h2>

      <LogsSection
        dailyLogs={lastThreeDailyLogs}
        sleepLogs={lastThreeSleepLogs}
      />

      <NutritionChart dailyLogs={dailyLogs} sleepLogs={sleepLogs} />

      <Recommendations recommendations={recommendations} />
    </div>
  );
}
