import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { generateRecommendations } from "@/functions/generateRecommendations";
import NutritionChart from "./_components/NutritionChart";
import Recommendations from "./_components/RecommendationsSection";
import LogsSection from "./_components/LogsSection";

export default async function NutritionPage() {
  const supabase = createServerComponentClient({ cookies });

  // Get user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return (
      <div className="p-4 text-red-600 font-semibold">
        User not authenticated
      </div>
    );
  }

  // Get daily logs
  const { data: dailyLogs, error: dailyError } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("profile_id", user.id);

  // Get sleep logs
  const { data: sleepLogs, error: sleepError } = await supabase
    .from("sleep_logs")
    .select("*")
    .eq("user_id", user.id);

  if (dailyError || sleepError) {
    return (
      <div className="p-4 text-red-600 font-semibold">
        Error loading data:{" "}
        {dailyError?.message || sleepError?.message || "Unknown error"}
      </div>
    );
  }

  const lastThreeDailyLogs = dailyLogs?.slice(-3) || [];
  const lastThreeSleepLogs = sleepLogs?.slice(-3) || [];

  const recommendations = generateRecommendations(
    lastThreeDailyLogs,
    lastThreeSleepLogs
  );

  return (
    <div className="p-4 space-y-6 w-full">
      <h2 className="text-xl font-bold">Personalized Nutrition</h2>

      <LogsSection
        dailyLogs={lastThreeDailyLogs}
        sleepLogs={lastThreeSleepLogs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Recommendations recommendations={recommendations} />

        <NutritionChart
          dailyLogs={dailyLogs || []}
          sleepLogs={sleepLogs || []}
        />
      </div>
    </div>
  );
}
