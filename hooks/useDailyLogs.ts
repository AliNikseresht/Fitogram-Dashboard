"use client";
import { useQuery } from "@tanstack/react-query";
import supabase from "@/libs/supabaseClient";

export default function useDailyLogs(profileId: string) {
  return useQuery({
    queryKey: ["daily-logs", profileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_logs")
        .select("*")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: true });

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!profileId,
  });
}
