"use client";

import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { FormValues, Mood } from "@/types/DailyLogFormTypes";
import WaterIntakeSelector from "./WaterIntakeSelector";
import MoodSelector from "./MoodSelector";
import NotesInput from "./NotesInput";
import CustomLoadingSpinner from "@/components/ui/loadings/CustomLoadingSpinner";
import { toast } from "react-toastify";
import useAddDailyLog from "@/hooks/useAddDailyLog";

type Props = {
  profileId: string;
};

const DailyLogForm: React.FC<Props> = ({ profileId }) => {
  const [waterIntake, setWaterIntake] = React.useState<number>(0);
  const [mood, setMood] = React.useState<Mood | null>(null);
  const { mutate, isPending } = useAddDailyLog();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormValues>({
    defaultValues: {
      weight: 60,
      notes: "",
    },
  });
  const weightValue = useWatch({ control, name: "weight", defaultValue: 60 });

  const onSubmit = (data: FormValues) => {
    if (!profileId) {
      toast.error("User not logged in");
      return;
    }

    if (!mood) {
      toast.error("Please select your mood");
      return;
    }

    mutate(
      { profileId, data, waterIntake, mood },
      {
        onSuccess: () => {
          toast.success("Daily log saved successfully!");
          reset();
          setWaterIntake(0);
          setMood(null);
        },
        onError: (error: Error) => {
          toast.error("Error: " + error.message);
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm bg-[#fff] p-4 rounded-xl shadow-md flex flex-col justify-between"
    >
      <h2 className="font-semibold">Daily Log</h2>

      <div>
        <label className="flex justify-between items-center">
          <p>Weight</p>
          <p className="text-[#777d8a]">{weightValue} kg</p>
        </label>

        <input
          type="range"
          min={20}
          max={200}
          step={1}
          {...register("weight", {
            required: "Please enter your weight",
            min: { value: 20, message: "Weight must be at least 20kg" },
          })}
          className="range range-xs in-range:bg-[#e7e8eb] in-range:text-[#0ea5e9]"
        />
        {errors.weight && (
          <p className="text-red-500 text-sm">{errors.weight.message}</p>
        )}
      </div>

      <WaterIntakeSelector
        waterIntake={waterIntake}
        onChange={setWaterIntake}
      />

      <MoodSelector mood={mood} onChange={setMood} />

      <NotesInput register={register} />

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#0284c7] text-[#fff] py-2 rounded cursor-pointer disabled:opacity-50 hover:bg-[#027bc7] duration-200"
      >
        {isPending ? <CustomLoadingSpinner /> : "Save Log"}
      </button>
    </form>
  );
};

export default DailyLogForm;
