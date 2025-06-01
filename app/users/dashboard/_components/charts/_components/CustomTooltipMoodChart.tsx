import { MoodType } from "@/types/ChartsType";
import React from "react";


const moodReverseMapping: Record<number, MoodType> = {
  3: "happy",
  2: "neutral",
  1: "sad",
};

const CustomTooltipMoodChart = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number }[];
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

export default CustomTooltipMoodChart;
