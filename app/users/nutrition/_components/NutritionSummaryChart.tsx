"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  water: "#3b82f6",
  sleep: "#10b981",
  moodHappy: "#facc15",
  moodSad: "#ef4444",
  moodNeutral: "#6b7280",
};

interface Props {
  water: number;
  sleep: number;
  mood: string;
}

export function WaterSleepMoodPieChart({ water, sleep, mood }: Props) {
  // Normalize values to max scale (10L for water, 10h for sleep)
  const maxWater = 10;
  const maxSleep = 10;

  const waterValue = Math.min(water, maxWater);
  const sleepValue = Math.min(sleep, maxSleep);
  const moodValue = 1; // fixed slice for mood to show color

  const data = [
    { name: "Water Intake", value: waterValue, color: COLORS.water },
    { name: "Sleep Duration", value: sleepValue, color: COLORS.sleep },
    {
      name: "Mood",
      value: moodValue,
      color:
        mood === "happy"
          ? COLORS.moodHappy
          : mood === "sad"
          ? COLORS.moodSad
          : COLORS.moodNeutral,
    },
  ];

  return (
    <div className="w-full rounded-xl bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 shadow-lg p-3 lg:p-6 flex flex-col gap-6">
      <h3 className="text-base lg:text-2xl font-bold text-indigo-700 select-none">
        Water, Sleep & Mood Summary
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={6}
            label={({ name, percent }) =>
              `${name}: ${(percent! * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="#fff"
                strokeWidth={3}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "white", borderRadius: 10 }}
            formatter={(value: number, name: string) => {
              if (name === "Mood")
                return mood.charAt(0).toUpperCase() + mood.slice(1);
              return value.toFixed(1);
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={16}
            iconType="circle"
            wrapperStyle={{ fontWeight: "600", color: "#4b5563", fontSize:"11px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
