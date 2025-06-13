"use client";

import { NutritionChartProps } from "@/types/NutritionChart";
import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d"];

export default function NutritionChart({
  dailyLogs,
  sleepLogs,
}: NutritionChartProps) {
  const lastThreeDailyLogs = useMemo(() => dailyLogs.slice(-3), [dailyLogs]);
  const lastThreeSleepLogs = useMemo(() => sleepLogs.slice(-3), [sleepLogs]);

  const totalWater = useMemo(
    () => lastThreeDailyLogs.reduce((sum, log) => sum + log.water_intake, 0),
    [lastThreeDailyLogs]
  );
  const totalSleep = useMemo(
    () => lastThreeSleepLogs.reduce((sum, log) => sum + log.duration, 0),
    [lastThreeSleepLogs]
  );

  const pieData = useMemo(
    () => [
      { name: "Water Intake", value: totalWater },
      { name: "Sleep Duration", value: totalSleep },
    ],
    [totalWater, totalSleep]
  );

  return (
    <div className="w-full h-[300px] lg:h-full bg-white rounded-xl shadow-md pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            label
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
