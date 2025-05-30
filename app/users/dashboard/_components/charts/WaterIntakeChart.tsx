import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomLoadingBars from "@/components/ui/loadings/CustomLoadingBars";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";

type WaterLog = {
  id: string | number;
  water_intake: number;
  log_date: string;
};

const WaterIntakeChart = ({ profileId }: { profileId: string }) => {
  const { data, error } = useRealtimeTable<WaterLog>({
    table: "daily_logs",
    filterColumn: "profile_id",
    filterValue: profileId,
    orderBy: { column: "log_date", ascending: true },
  });

  if (error) return <p className="text-red-600 font-semibold">{error}</p>;
  if (data.length === 0) return <CustomLoadingBars />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
        <CartesianGrid stroke="#e0e0e0" strokeDasharray="4 4" />
        <XAxis dataKey="log_date" tick={{ fontSize: 12, fill: "#555" }} />
        <YAxis
          tick={{ fontSize: 12, fill: "#555" }}
          domain={[0, "dataMax + 2"]}
        />
        <Tooltip />
        <Bar
          dataKey="water_intake"
          fill="url(#colorWater)"
          radius={[8, 8, 0, 0]}
        />
        <defs>
          <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1E90FF" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#1E90FF" stopOpacity={0.2} />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WaterIntakeChart;
