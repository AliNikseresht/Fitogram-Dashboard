import React from "react";

type Props = {
  waterIntake: number;
  onChange: (value: number) => void;
};

const WaterIntakeSelector: React.FC<Props> = ({ waterIntake, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Water Intake</label>
      <div className="flex gap-1">
        {[...Array(8)].map((_, i) => (
          <button
            key={i}
            type="button"
            className={`w-6 h-6 rounded-full border ${
              i < waterIntake ? "bg-blue-500" : "bg-gray-200"
            }`}
            onClick={() => onChange(i + 1)}
          />
        ))}
      </div>
    </div>
  );
};

export default WaterIntakeSelector;
