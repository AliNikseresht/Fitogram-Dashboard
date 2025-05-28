import React from "react";
import { FaBottleWater } from "react-icons/fa6";

type Props = {
  waterIntake: number;
  onChange: (value: number) => void;
};

const WaterIntakeSelector: React.FC<Props> = ({ waterIntake, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex justify-between items-center w-full text-sm font-medium mb-2">
        <p>Water Intake</p>
        <span className="text-sm text-gray-500">{waterIntake}/8 glasses</span>
      </label>
      <div className="flex">
        {[...Array(8)].map((_, i) => (
          <FaBottleWater
            key={i}
            size={25}
            onClick={() => onChange(i + 1)}
            className={`${
              i < waterIntake ? "text-[#0ea5e9]" : "text-[#9ca3af]"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default WaterIntakeSelector;
