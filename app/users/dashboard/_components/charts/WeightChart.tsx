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
import CustomLoadingBars from "@/components/ui/loadings/CustomLoadingBars";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { WeightLog } from "@/types/ChartsType";

const WeightChart = ({ profileId }: { profileId: string }) => {
  const { data, error } = useRealtimeTable<WeightLog>({
    table: "daily_logs",
    filterColumn: "profile_id",
    filterValue: profileId,
    orderBy: { column: "log_date", ascending: true },
  });

  if (error) return <p className="text-red-600 font-semibold">{error}</p>;
  if (!data) return <CustomLoadingBars />;
  if (data.length === 0) {
    return (
      <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md text-sm">
        No data has been recorded yet. Please submit your first entry to see
        progress.
      </div>
    );
  }

  return (
    <div className="bg-[#f9fafb] rounded-lg p-2">
      <h3 className="text-sm mb-2">Weight Progress</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} className="lg:my-2 -ml-6 lg:-ml-5">
          <CartesianGrid stroke="#ddd" strokeDasharray="4 4" />
          <XAxis
            dataKey="log_date"
            tick={{ fontSize: 11, fill: "#666" }}
            tickLine={false}
            padding={{ left: 28, right: 0 }}
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 12, fill: "#666" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f9f9f9",
              borderRadius: 6,
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
            cursor={{ stroke: "#8884d8", strokeWidth: 2, opacity: 0.2 }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#8884d8"
            strokeWidth={3}
            dot={{ r: 5, strokeWidth: 2, fill: "#fff", stroke: "#8884d8" }}
            activeDot={{ r: 7 }}
            animationDuration={900}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightChart;
