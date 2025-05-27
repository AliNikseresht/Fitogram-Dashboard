import { Mood } from "@/types/DailyLogFormTypes";
import React from "react";

type Props = {
  mood: Mood | null;
  onChange: (value: Mood) => void;
};

const MoodSelector: React.FC<Props> = ({ mood, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        How are you feeling today?
      </label>
      <div className="flex gap-4 text-xl">
        {(["happy", "neutral", "sad"] as Mood[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onChange(m)}
            className={mood === m ? "scale-110" : ""}
          >
            {m === "happy" ? "😊" : m === "neutral" ? "😐" : "😞"}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
