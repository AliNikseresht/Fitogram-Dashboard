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

type MoodType = "happy" | "neutral" | "sad";

type TooltipPayloadItem = {
  value: number;
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

const MoodChart = ({ profileId }: { profileId: string }) => {
  const [data, setData] = useState<
    { moodNum: number; log_date: string; mood: MoodType }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const logs = await fetchDailyLogs(profileId);
        const moodData = logs
          .filter((log) => log.mood)
          .map(({ mood, log_date }) => ({
            moodNum: moodMapping[mood as MoodType],
            mood: mood as MoodType,
            log_date,
          }));
        setData(moodData);
      } catch {
        setError("Failed to load mood logs");
      }
    }
    loadData();
  }, [profileId]);

  if (error) return <p className="text-red-600 font-semibold">{error}</p>;
  if (data.length === 0) return <CustomLoadingBars />;

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: TooltipPayloadItem[];
  }) => {
    if (active && payload && payload.length) {
      const moodNum = payload[0].value;
      const moodText = moodReverseMapping[moodNum];
      return (
        <div className="bg-white border border-gray-300 p-3 rounded-lg shadow-md text-sm">
          <p>
            Mood:{" "}
            <strong>
              {moodText.charAt(0).toUpperCase() + moodText.slice(1)}
            </strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
      >
        <CartesianGrid stroke="#ddd" strokeDasharray="4 4" />
        <XAxis
          dataKey="log_date"
          tick={{ fontSize: 12, fill: "#666" }}
          tickLine={false}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis
          domain={[1, 3]}
          ticks={[1, 2, 3]}
          tickFormatter={(value) =>
            moodReverseMapping[value].charAt(0).toUpperCase() +
            moodReverseMapping[value].slice(1)
          }
          tick={{ fontSize: 12, fill: "#666" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
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
  );
};

export default MoodChart;
