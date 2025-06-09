import { WaterLog } from "@/types/ChartsType";
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

type WaterIntakeChartProps = {
  waterData: WaterLog[];
};

const WaterIntakeChart = ({ waterData }: WaterIntakeChartProps) => {
  if (!waterData || waterData.length === 0) {
    return (
      <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md text-sm">
        No data has been recorded yet. Please submit your first entry to see
        progress.
      </div>
    );
  }

  return (
    <div className="bg-[#f9fafb] rounded-lg p-2">
      <h3 className="text-sm mb-2">Water Intake</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={waterData} className="lg:my-2 -ml-6 lg:-ml-6">
          <CartesianGrid stroke="#ddd" strokeDasharray="4 4" />
          <XAxis dataKey="log_date" tick={{ fontSize: 11, fill: "#555" }} />
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
    </div>
  );
};

export default WaterIntakeChart;
