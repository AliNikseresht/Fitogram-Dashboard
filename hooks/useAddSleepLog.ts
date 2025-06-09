"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "@/libs/supabaseClient";
import { SleepFormValues } from "@/types/SleepTableTypes";

export default function useAddSleepLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { userId: string; data: SleepFormValues }) => {
      const { userId, data } = payload;

      const duration = calculateDuration(
        Number(data.sleepHour),
        Number(data.sleepMinute),
        Number(data.wakeHour),
        Number(data.wakeMinute)
      );
      const sleep_date = new Date().toISOString().slice(0, 10);

      const sleep_time = `${data.sleepHour.padStart(
        2,
        "0"
      )}:${data.sleepMinute.padStart(2, "0")}:00`;
      const wake_time = `${data.wakeHour.padStart(
        2,
        "0"
      )}:${data.wakeMinute.padStart(2, "0")}:00`;

      const { error } = await supabase.from("sleep_logs").insert({
        user_id: userId,
        sleep_date,
        sleep_time,
        wake_time,
        duration,
        quality: data.quality,
      });

      if (error) throw new Error(error.message);

      return {
        user_id: userId,
        sleep_date,
        sleep_time,
        wake_time,
        duration,
        quality: data.quality,
        created_at: new Date().toISOString(),
      };
    },
    onSuccess: (newLog, variables) => {
      queryClient.setQueryData(
        ["sleep-logs", variables.userId],
        (oldData: any) => {
          if (!oldData) return [newLog];
          return [...oldData, newLog];
        }
      );
    },
  });
}

function calculateDuration(
  sleepH: number,
  sleepM: number,
  wakeH: number,
  wakeM: number
) {
  const sleepMinutes = sleepH * 60 + sleepM;
  let wakeMinutes = wakeH * 60 + wakeM;
  if (wakeMinutes <= sleepMinutes) wakeMinutes += 24 * 60;
  return (wakeMinutes - sleepMinutes) / 60;
}
