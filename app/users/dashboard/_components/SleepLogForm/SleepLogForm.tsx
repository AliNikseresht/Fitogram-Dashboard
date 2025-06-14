"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { SleepFormValues } from "@/types/SleepTableTypes";
import CustomLoadingSpinner from "@/components/ui/loadings/CustomLoadingSpinner";
import useAddSleepLog from "@/hooks/useAddSleepLog";

type Props = {
  userId: string;
};

const SleepLogForm: React.FC<Props> = ({ userId }) => {
  const { mutate, isPending } = useAddSleepLog();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<SleepFormValues>({
    defaultValues: {
      quality: 3,
      sleepHour: "23",
      sleepMinute: "00",
      wakeHour: "07",
      wakeMinute: "00",
    },
  });

  const qualityValue = watch("quality");

  const onSubmit = (data: SleepFormValues) => {
    mutate(
      { userId, data },
      {
        onSuccess: () => {
          toast.success("Sleep log saved successfully!");
          reset();
        },
        onError: (error: Error) => {
          toast.error("Error: " + error.message);
        },
      }
    );
  };

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm bg-white p-4 rounded-xl shadow-md space-y-4 flex flex-col justify-between"
    >
      <h2 className="font-bold mb-4">Sleep Log</h2>

      <div className="space-y-2">
        <label className="block mb-1 text-sm">Sleep Time</label>
        <div className="flex space-x-2">
          <Controller
            name="sleepHour"
            control={control}
            rules={{ required: "Sleep hour required" }}
            render={({ field }) => (
              <select
                {...field}
                className="border border-[#bababa] rounded p-2 w-20"
              >
                <option value="">HH</option>
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            )}
          />
          <Controller
            name="sleepMinute"
            control={control}
            rules={{ required: "Sleep minute required" }}
            render={({ field }) => (
              <select
                {...field}
                className="border border-[#bababa] rounded p-2 w-20"
              >
                <option value="">MM</option>
                {minutes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
        {(errors.sleepHour || errors.sleepMinute) && (
          <p className="text-red-500 text-sm mt-1">
            {errors.sleepHour?.message || errors.sleepMinute?.message}
          </p>
        )}

        <label className="block mb-1 text-sm">Wake Time</label>
        <div className="flex space-x-2">
          <Controller
            name="wakeHour"
            control={control}
            rules={{ required: "Wake hour required" }}
            render={({ field }) => (
              <select
                {...field}
                className="border border-[#bababa] rounded p-2 w-20"
              >
                <option value="">HH</option>
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            )}
          />
          <Controller
            name="wakeMinute"
            control={control}
            rules={{ required: "Wake minute required" }}
            render={({ field }) => (
              <select
                {...field}
                className="border border-[#bababa] rounded p-2 w-20"
              >
                <option value="">MM</option>
                {minutes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
        {(errors.wakeHour || errors.wakeMinute) && (
          <p className="text-red-500 text-sm mt-1">
            {errors.wakeHour?.message || errors.wakeMinute?.message}
          </p>
        )}
      </div>

      <div>
        <div className="w-full flex justify-between items-center">
          <label className="block mb-1">Sleep Quality</label>
          <p>Quality: {qualityValue}/5</p>
        </div>
        <Controller
          name="quality"
          control={control}
          render={({ field }) => (
            <input
              type="range"
              min={1}
              max={5}
              {...field}
              className="range range-xs in-range:bg-[#e7e8eb] in-range:text-[#0ea5e9]"
            />
          )}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#0284c7] text-white py-2 rounded cursor-pointer disabled:opacity-50 hover:bg-[#027bc7] duration-200"
      >
        {isPending ? <CustomLoadingSpinner /> : "Submit"}
      </button>
    </form>
  );
};

export default SleepLogForm;
