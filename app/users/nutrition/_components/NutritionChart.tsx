"use client";

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

interface NutritionChartProps {
  dailyLogs: {
    water_intake: number;
    id: string | number;
  }[];
  sleepLogs: {
    duration: number;
    id: string | number;
  }[];
}

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
    <div className="h-72">
      <ResponsiveContainer>
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
