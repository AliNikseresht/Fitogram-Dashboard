"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Workout,
  deleteWorkout,
  updateWorkout,
} from "@/app/users/workouts/_components/services/WorkoutService";
import InputField from "@/components/ui/Forms/InputField";
import WorkoutModal from "./WorkoutModal";

type Props = {
  workouts: Workout[];
  onChange?: () => void;
};

type EditFormData = {
  title: string;
};

export default function WorkoutList({ workouts, onChange }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditFormData>();

  const startEditing = (w: Workout) => {
    setEditingId(w.id);
    reset({ title: w.title });
  };

  const cancelEditing = () => {
    setEditingId(null);
    reset();
  };

  const onSubmit = async (data: EditFormData) => {
    if (!editingId) return;
    try {
      await updateWorkout(editingId, { title: data.title });
      setEditingId(null);
      reset();
      onChange?.();
    } catch (e) {
      if (e && typeof e === "object" && "message" in e) {
        alert("Error updating workout: " + (e as Error).message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    const modal = document.getElementById("delete_modal") as HTMLDialogElement;
    modal.showModal();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteWorkout(deleteId);
      onChange?.();
      const modal = document.getElementById(
        "delete_modal"
      ) as HTMLDialogElement;
      modal.close();
    } catch (e) {
      if (e && typeof e === "object" && "message" in e) {
        alert("Error updating workout: " + (e as Error).message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  if (workouts.length === 0)
    return <p className="text-gray-500">No workouts recorded yet.</p>;

  return (
    <div className="space-y-3 lg:h-[315px] overflow-y-auto border border-[#bababa] rounded-xl shadow p-3 bg-white">
      {workouts.map((w) => (
        <div
          key={w.id}
          className="border border-[#bababa] rounded-xl shadow p-2 flex justify-between items-center"
        >
          <div className="flex-1">
            {editingId === w.id ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <InputField
                  label="Title"
                  registration={register("title", {
                    required: "Title is required",
                  })}
                  error={errors.title}
                  required
                />
                <div className="mt-1 space-x-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 text-white px-2 py-1 rounded"
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-400 text-black px-2 py-1 rounded"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h3 className="font-semibold">{w.title}</h3>
                <p className="text-sm text-gray-600">{w.date}</p>
                <p className="text-sm text-gray-600">
                  Duration: {w.duration_minutes} min
                </p>
                <p className="text-sm text-gray-600">
                  Calories burned: {w.calories_burned}
                </p>
              </>
            )}
          </div>
          {editingId !== w.id && (
            <div className="space-x-2 flex flex-col gap-2">
              <button
                className="bg-yellow-300 px-3 py-1 rounded-md w-full"
                onClick={() => startEditing(w)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded-md w-full"
                onClick={() => openDeleteModal(w.id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Modal */}
      <WorkoutModal onDelete={handleDelete} />
    </div>
  );
}
