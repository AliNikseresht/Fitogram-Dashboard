"use client";
import React from "react";

type WorkoutModalProps = {
  onDelete: () => void;
};

const WorkoutModal = ({ onDelete }: WorkoutModalProps) => {
  return (
    <dialog
      id="delete_modal"
      className="modal bg-[#21212139] bg-opacity-10 backdrop-blur-sm"
    >
      <div className="modal-box bg-white text-black rounded-2xl shadow-lg">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg text-center mb-4">Delete Workout</h3>
        <p className="text-center mb-6">
          Are you sure you want to delete this workout? This action cannot be
          undone.
        </p>
        <div className="flex justify-center gap-4">
          <form method="dialog">
            <button className="btn btn-error" onClick={onDelete}>
              Yes, Delete
            </button>
          </form>
          <form method="dialog">
            <button className="btn btn-outline">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default WorkoutModal;
