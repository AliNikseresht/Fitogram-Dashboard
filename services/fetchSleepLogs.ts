import calculateDuration from "@/functions/calculateDuration";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

async function fetchSleepLogs(userId: string) {
  const { data, error } = await supabase
    .from("sleep_logs")
    .select("sleep_time, wake_time, quality, sleep_date")
    .eq("user_id", userId)
    .order("sleep_date", { ascending: true });

  if (error) throw error;

  return (data || []).map((item) => ({
    ...item,
    duration: calculateDuration(item.sleep_time, item.wake_time),
  }));
}

export default fetchSleepLogs;
