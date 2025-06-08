"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { WaterSleepMoodPieChart } from "./_components/NutritionSummaryChart";
import CustomLoadingBars from "@/components/ui/loadings/CustomLoadingBars";
import fetchDailyLogs from "@/services/fetchDailyLogs";
import fetchSleepLogs from "@/services/fetchSleepLogs";
import supabase from "@/libs/supabaseClient";

type DailyLog = {
  weight?: number;
  water_intake?: number;
  mood?: string;
  notes?: string;
  log_date: string;
};

type SleepLog = {
  id: string | number;
  sleep_date: string;
  sleep_time: string;
  wake_time: string;
  duration: number;
  quality?: string;
  notes?: string;
  user_id: string | null;
};

export default function NutritionPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    }
    fetchUser();
  }, []);

  const {
    data: dailyLogs,
    isLoading: dailyLoading,
    error: dailyError,
  } = useQuery<DailyLog[], Error>({
    queryKey: ["dailyLogs", userId],
    queryFn: () => fetchDailyLogs(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
  });

  const {
    data: sleepLogs,
    isLoading: sleepLoading,
    error: sleepError,
  } = useQuery<SleepLog[], Error>({
    queryKey: ["sleepLogs", userId],
    queryFn: () => fetchSleepLogs(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  const loading = dailyLoading || sleepLoading;
  const error = dailyError || sleepError;

  if (loading) return <CustomLoadingBars />;

  if (error)
    return (
      <div className="p-4 text-red-600 font-semibold">
        Error loading data: {error.message}
      </div>
    );

  const latestDailyLog =
    Array.isArray(dailyLogs) && dailyLogs.length > 0
      ? dailyLogs.find((log) => log.log_date === today) ?? dailyLogs[0]
      : undefined;

  const latestSleepLog =
    Array.isArray(sleepLogs) && sleepLogs.length > 0
      ? sleepLogs.find((log) => log.sleep_date === today) ?? sleepLogs[0]
      : undefined;

  const suggestions: string[] = [];
  if (latestSleepLog?.duration && latestSleepLog.duration < 6) {
    suggestions.push(
      "Recommendation: Consume complex carbs to compensate for low sleep."
    );
  }
  if (latestDailyLog?.mood === "sad") {
    suggestions.push(
      "Suggestion: Try light and mood-lifting foods like bananas or dark chocolate."
    );
  }
  if (latestDailyLog?.water_intake && latestDailyLog.water_intake < 3) {
    suggestions.push(
      "Reminder: You haven't drunk enough water today, stay hydrated!"
    );
  }

  return (
    <div className="p-4 space-y-4 w-full">
      <h2 className="text-xl font-bold">Personalized Nutrition</h2>

      {suggestions.length > 0 && (
        <section className="bg-yellow-50 border border-yellow-300 rounded-lg p-5">
          <h2 className="text-xl font-semibold text-yellow-800 mb-3">
            Your Suggestions
          </h2>
          <ul className="list-disc list-inside space-y-1 text-yellow-900">
            {suggestions.map((text, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="inline-block w-6 h-6 bg-yellow-400 rounded-full flex-shrink-0 text-center text-white font-bold">
                  ✓
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
        <div className="space-y-3 p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <h3 className="text-sm lg:text-xl font-semibold text-gray-700">
            Latest Daily Log
          </h3>
          <p>
            <strong className="text-sm lg:text-base">Weight:</strong>{" "}
            {latestDailyLog?.weight ?? "No data"}
          </p>
          <p>
            <strong className="text-sm lg:text-base">Water Intake (L):</strong>{" "}
            {latestDailyLog?.water_intake ?? "No data"}
          </p>
          <p>
            <strong className="text-sm lg:text-base">Mood:</strong>{" "}
            {latestDailyLog?.mood ?? "No data"}
          </p>
          <p>
            <strong className="text-sm lg:text-base">Notes:</strong>{" "}
            {latestDailyLog?.notes ?? "None"}
          </p>
        </div>

        <div className="space-y-3 p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <h3 className="text-sm lg:text-xl font-semibold text-gray-700">
            Latest Sleep Log
          </h3>
          <p>
            <strong className="text-sm lg:text-base">Duration (hours):</strong>{" "}
            {latestSleepLog?.duration ?? "No data"}
          </p>
          <p>
            <strong className="text-sm lg:text-base">Quality:</strong>{" "}
            {latestSleepLog?.quality ?? "No data"}
          </p>
          <p>
            <strong className="text-sm lg:text-base">Notes:</strong>{" "}
            {latestSleepLog?.notes ?? "None"}
          </p>
        </div>
      </section>

      <WaterSleepMoodPieChart
        water={latestDailyLog?.water_intake ?? 0}
        sleep={latestSleepLog?.duration ?? 0}
        mood={latestDailyLog?.mood ?? "neutral"}
      />
    </div>
  );
}
