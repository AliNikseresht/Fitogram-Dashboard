import React from "react";

type WorkoutStep = {
  name: string;
  duration: number; // minutes
};

const workoutPlan: WorkoutStep[] = [
  { name: "Warm-up", duration: 5 },
  { name: "Cardio", duration: 20 },
  { name: "Stretching", duration: 10 },
];

export function TodayWorkoutPlan() {
  return (
    <section className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-6 shadow-lg text-white max-w-md mb-8">
      <h2 className="text-2xl font-bold mb-4 tracking-wide drop-shadow-lg">
        Today`s Workout Plan
      </h2>
      <ul className="space-y-3">
        {workoutPlan.map((step, i) => (
          <li
            key={i}
            className="flex justify-between items-center bg-opacity-20 rounded-md px-4 py-2 shadow-md hover:bg-opacity-40 transition duration-300 cursor-pointer"
          >
            <span className="font-semibold">{step.name}</span>
            <span className="text-sm">{step.duration} mins</span>
          </li>
        ))}
      </ul>
      <button
        className="mt-6 w-full bg-yellow-400 text-purple-900 font-extrabold py-3 rounded-lg shadow-md hover:bg-yellow-500 active:scale-95 transition-transform"
        aria-label="Start Workout"
      >
        Start Workout 🚀
      </button>
    </section>
  );
}
