"use client";

import { useForm } from "react-hook-form";
import { addWorkout } from "./services/WorkoutService";
import InputField from "@/components/ui/Forms/InputField";
import { toast } from "react-toastify";

type FormData = {
  title: string;
  date: string;
  duration_minutes: number;
  calories_burned: number;
  notes?: string;
};

type Props = {
  userId: string;
  onAdded?: () => void;
};

export default function WorkoutForm({ userId, onAdded }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await addWorkout({
        user_id: userId,
        ...data,
      });
      reset();
      toast.success("Workout added successfully!");
      onAdded?.();
    } catch (e) {
      if (e && typeof e === "object" && "message" in e) {
        alert("Error updating workout: " + (e as Error).message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 border border-[#bababa] bg-white shadow p-4 rounded-xl"
      noValidate
    >
      <h2 className="font-semibold text-lg">Add New Workout</h2>

      <p className="text-gray-600 text-sm mb-4">
        Please fill out the form below to log your workout. Fields marked with *
        are required.
      </p>

      <div>
        <InputField
          label="Title*"
          registration={register("title", { required: "Title is required" })}
          error={errors.title}
          required
          placeholder="e.g. Morning Run, Yoga Session"
        />
        <p className="text-xs text-gray-500">
          Give a short name for your workout.
        </p>
      </div>

      <div>
        <InputField
          label="Date*"
          type="date"
          registration={register("date", { required: "Date is required" })}
          error={errors.date}
          required
          placeholder="Select the date when you did this workout."
        />
        <p className="text-xs text-gray-500">
          Select the date when you did this workout.
        </p>
      </div>

      <div>
        <InputField
          label="Duration (minutes)*"
          type="number"
          registration={register("duration_minutes", {
            required: "Duration is required",
            min: { value: 1, message: "Duration must be at least 1 minute" },
          })}
          error={errors.duration_minutes}
          required
          placeholder="e.g. 30"
        />
        <p className="text-xs text-gray-500">
          Enter the total time spent exercising, in minutes.
        </p>
      </div>

      <div>
        <InputField
          label="Calories burned*"
          type="number"
          registration={register("calories_burned", {
            required: "Calories burned is required",
            min: { value: 0, message: "Calories must be positive" },
          })}
          error={errors.calories_burned}
          required
          placeholder="e.g. 250"
        />
        <p className="text-xs text-gray-500">
          Approximate number of calories you burned during the workout.
        </p>
      </div>

      <div>
        <InputField
          label="Notes"
          registration={register("notes")}
          error={errors.notes}
          textarea
          placeholder="Optional notes about your workout"
        />
        <p className="text-xs text-gray-500">
          Any additional comments or details about this workout (optional).
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isSubmitting ? "Adding..." : "Add Workout"}
      </button>
    </form>
  );
}
