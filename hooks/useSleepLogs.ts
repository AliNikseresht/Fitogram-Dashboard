"use client";
import { useQuery } from "@tanstack/react-query";
import supabase from "@/libs/supabaseClient";

export default function useSleepLogs(userId: string) {
  return useQuery({
    queryKey: ["sleep-logs", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sleep_logs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!userId,
  });
}
