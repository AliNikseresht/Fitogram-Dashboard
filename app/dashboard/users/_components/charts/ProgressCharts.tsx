import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", weight: 70, calories: 2300, steps: 7500 },
  { day: "Tue", weight: 69.8, calories: 2200, steps: 9000 },
  { day: "Wed", weight: 69.7, calories: 2100, steps: 8000 },
  { day: "Thu", weight: 69.5, calories: 2000, steps: 8500 },
  { day: "Fri", weight: 69.3, calories: 1950, steps: 9200 },
  { day: "Sat", weight: 69.0, calories: 1800, steps: 10000 },
  { day: "Sun", weight: 68.8, calories: 1750, steps: 11000 },
];

export function ProgressCharts() {
  return (
    <section className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl shadow-xl p-3 md:p-6 w-full mx-auto my-8">
      <h2 className="text-[#fff] font-extrabold md:text-3xl mb-5 drop-shadow-lg">
        Weekly Progress Tracker 📈
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
          <XAxis dataKey="day" stroke="white" />
          <YAxis stroke="white" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              borderRadius: 8,
              border: "none",
            }}
            labelStyle={{ color: "white" }}
            itemStyle={{ color: "white" }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#FFD700"
            strokeWidth={3}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="calories"
            stroke="#FF6347"
            strokeWidth={3}
          />
          <Line
            type="monotone"
            dataKey="steps"
            stroke="#00FA9A"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-[#fff] text-xs mt-4 font-semibold lg:text-right drop-shadow-md">
        Track your weight, calories burned, and steps walked over the past week!
      </p>
    </section>
  );
}
