"use client";
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
import CustomTooltipMoodChart from "./_components/CustomTooltipMoodChart";
import { MoodType } from "@/types/ChartsType";

type DailyLog = {
  mood?: MoodType;
  log_date: string;
};

type MoodChartProps = {
  data: DailyLog[];
};

const moodMapping: Record<MoodType, number> = {
  happy: 3,
  neutral: 2,
  sad: 1,
};

const moodReverseMapping: Record<number, MoodType> = {
  3: "happy",
  2: "neutral",
  1: "sad",
};

const MoodChart = ({ data }: MoodChartProps) => {
  const parsedMoodData =
    data
      ?.filter((log) => log.mood)
      .map((log) => ({
        moodNum: moodMapping[log.mood as MoodType],
        mood: log.mood,
        log_date: log.log_date,
      })) || [];

  if (parsedMoodData.length === 0) {
    return (
      <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md text-sm">
        No data has been recorded yet. Please submit your first entry to see
        progress.
      </div>
    );
  }

  return (
    <div className="bg-[#f9fafb] rounded-lg p-2">
      <h3 className="text-sm mb-2">Mood Progress</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={parsedMoodData} className="lg:my-2 -ml-4 lg:-ml-4">
          <CartesianGrid stroke="#ddd" strokeDasharray="4 4" />
          <XAxis
            dataKey="log_date"
            tick={{ fontSize: 11, fill: "#666" }}
            tickLine={false}
            padding={{ left: 30, right: 0 }}
          />
          <YAxis
            domain={[1, 3]}
            ticks={[1, 2, 3]}
            tickFormatter={(value) =>
              moodReverseMapping[value as number].charAt(0).toUpperCase() +
              moodReverseMapping[value as number].slice(1)
            }
            tick={{ fontSize: 11, fill: "#666" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltipMoodChart />} />
          <Line
            type="monotone"
            dataKey="moodNum"
            stroke="#FFA500"
            strokeWidth={3}
            dot={{ r: 6 }}
            activeDot={{ r: 8 }}
            animationDuration={900}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodChart;
