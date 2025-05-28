"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-toastify";

type SleepFormValues = {
  sleepHour: string;
  sleepMinute: string;
  wakeHour: string;
  wakeMinute: string;
  quality: number;
};

type Props = {
  userId: string;
};

const SleepLogForm: React.FC<Props> = ({ userId }) => {
  const supabase = createClientComponentClient();

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

  const [loading, setLoading] = React.useState(false);

  const qualityValue = watch("quality");

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

  const onSubmit = async (data: SleepFormValues) => {
    setLoading(true);
    try {
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

      if (error) {
        toast.error("Error saving sleep log: " + error.message);
      } else {
        toast.success("Sleep log saved successfully!");
        reset();
      }
    } catch {
      toast.error("Unexpected error");
    } finally {
      setLoading(false);
    }
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
      className="w-full max-w-sm bg-white p-4 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-lg font-bold mb-4">🛌 Sleep Log</h2>

      <div>
        <label className="block mb-1 font-semibold">Sleep Time</label>
        <div className="flex space-x-2">
          <Controller
            name="sleepHour"
            control={control}
            rules={{ required: "Sleep hour required" }}
            render={({ field }) => (
              <select {...field} className="border rounded p-2 w-20">
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
              <select {...field} className="border rounded p-2 w-20">
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
      </div>

      <div>
        <label className="block mb-1 font-semibold">Wake Time</label>
        <div className="flex space-x-2">
          <Controller
            name="wakeHour"
            control={control}
            rules={{ required: "Wake hour required" }}
            render={({ field }) => (
              <select {...field} className="border rounded p-2 w-20">
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
              <select {...field} className="border rounded p-2 w-20">
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
        <label className="block mb-1 font-semibold">Sleep Quality</label>
        <Controller
          name="quality"
          control={control}
          render={({ field }) => (
            <input type="range" min={1} max={5} {...field} className="w-full" />
          )}
        />
        <p>Quality: {qualityValue}/5</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Submit"}
      </button>
    </form>
  );
};

export default SleepLogForm;
