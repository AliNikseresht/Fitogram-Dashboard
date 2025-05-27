import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

async function fetchDailyLogs(profileId: string) {
  const { data, error } = await supabase
    .from("daily_logs")
    .select("weight, water_intake, mood, log_date")
    .eq("profile_id", profileId)
    .order("log_date", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

export default fetchDailyLogs;
