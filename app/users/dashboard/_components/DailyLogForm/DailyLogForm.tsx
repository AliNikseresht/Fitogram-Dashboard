"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FormValues, Mood } from "@/types/DailyLogFormTypes";

import WaterIntakeSelector from "./WaterIntakeSelector";
import MoodSelector from "./MoodSelector";
import NotesInput from "./NotesInput";
import CustomLoadingSpinner from "@/components/ui/loadings/CustomLoadingSpinner";
import { toast } from "react-toastify";

type Props = {
  profileId: string;
};

const DailyLogForm: React.FC<Props> = ({ profileId }) => {
  const supabase = createClientComponentClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const [waterIntake, setWaterIntake] = useState<number>(0);
  const [mood, setMood] = useState<Mood | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    if (!profileId) {
      toast.error("User not logged in");
      return;
    }

    if (!mood) {
      toast.error("Please select your mood");
      return;
    }

    setLoading(true);

    const payload = {
      profile_id: profileId,
      weight: data.weight,
      water_intake: waterIntake,
      mood: mood,
      notes: data.notes,
      created_at: new Date().toISOString(),
      log_date: new Date().toISOString().split("T")[0],
    };

    const { error } = await supabase.from("daily_logs").insert([payload]);

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Daily log saved successfully!");
      reset();
      setWaterIntake(0);
      setMood(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md bg-white p-4 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-lg font-semibold">Daily Log</h2>

      <input
        type="number"
        placeholder="Weight (kg)"
        {...register("weight", {
          required: "Please enter your weight",
          min: { value: 20, message: "Weight must be at least 20kg" },
        })}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
      {errors.weight && (
        <p className="text-red-500 text-sm">{errors.weight.message}</p>
      )}

      <WaterIntakeSelector
        waterIntake={waterIntake}
        onChange={setWaterIntake}
      />

      <MoodSelector mood={mood} onChange={setMood} />

      <NotesInput register={register} />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#0583c7] to-[#9f1daf] text-white py-2 rounded cursor-pointer disabled:opacity-50"
      >
        {loading ? <CustomLoadingSpinner /> : "Save Log"}
      </button>
    </form>
  );
};

export default DailyLogForm;
