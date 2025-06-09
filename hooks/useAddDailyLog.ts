"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "@/libs/supabaseClient";
import { FormValues, Mood } from "@/types/DailyLogFormTypes";

export default function useAddDailyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      profileId: string;
      data: FormValues;
      waterIntake: number;
      mood: Mood;
    }) => {
      const { profileId, data, waterIntake, mood } = payload;

      const insertPayload = {
        profile_id: profileId,
        weight: data.weight,
        water_intake: waterIntake,
        mood: mood,
        notes: data.notes,
        created_at: new Date().toISOString(),
        log_date: new Date().toISOString().split("T")[0],
      };

      const { error } = await supabase
        .from("daily_logs")
        .insert([insertPayload]);

      if (error) throw new Error(error.message);

      return insertPayload;
    },
    onSuccess: (newLog, variables) => {
      queryClient.setQueryData(
        ["daily-logs", variables.profileId],
        (oldData: any) => {
          if (!oldData) return [newLog];
          return [...oldData, newLog];
        }
      );
    },
  });
}
