import CustomLoadingBars from "@/components/ui/loadings/CustomLoadingBars";
import fetchDailyLogs from "@/services/fetchDailyLogs";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type WeightLog = {
  weight: number;
  log_date: string;
};

const WeightChart = ({ profileId }: { profileId: string }) => {
  const [data, setData] = useState<WeightLog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const logs = await fetchDailyLogs(profileId);
        setData(logs);
      } catch {
        setError("Failed to load weight logs");
      }
    }
    loadData();
  }, [profileId]);

  if (error) return <p className="text-red-600 font-semibold">{error}</p>;
  if (data.length === 0) return <CustomLoadingBars />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
      >
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis
          dataKey="log_date"
          tick={{ fontSize: 12, fill: "#444" }}
          tickLine={false}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis
          domain={["auto", "auto"]}
          tick={{ fontSize: 12, fill: "#444" }}
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
  );
};

export default WeightChart;
