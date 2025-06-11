"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Workout } from "./services/WorkoutService";

type Props = {
  workouts: Workout[];
};

export default function WorkoutChart({ workouts }: Props) {
  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const data = sortedWorkouts.map((w) => ({
    date: w.date,
    calories: w.calories_burned,
  }));

  return (
    <div className="w-full h-[300px] lg:h-[400px] bg-white rounded-xl shadow border border-[#bababa] p-4">
      <h3 className="font-semibold">Calories Burned Over Time</h3>
      <ResponsiveContainer width="100%" height="100%" className={'py-5 -ml-5'}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="calories" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
