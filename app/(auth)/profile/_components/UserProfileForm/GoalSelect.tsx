"use client";

import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type Props = {
  registration: UseFormRegisterReturn;
  error?: FieldError;
};

const GoalSelect = ({ registration, error }: Props) => (
  <div className="mb-4 text-xs lg:text-sm">
    <label className="block mb-1 font-medium">Goal</label>
    <select
      {...registration}
      className={`w-full border ${
        error ? "border-red-500" : "border-[#bababa]"
      } rounded px-3 py-2`}
    >
      <option value="">Select your goal</option>
      <option value="lose_weight">Lose Weight</option>
      <option value="gain_muscle">Gain Muscle</option>
      <option value="maintain">Maintain</option>
    </select>
    {error && <p className="text-red-500 mt-1">{error.message}</p>}
  </div>
);

export default GoalSelect;
