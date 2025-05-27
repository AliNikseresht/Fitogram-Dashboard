import { FormValues } from "@/types/DailyLogFormTypes";
import React from "react";
import { UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<FormValues>;
};

const NotesInput: React.FC<Props> = ({ register }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Notes</label>
      <textarea
        {...register("notes")}
        placeholder="Add notes about your day..."
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>
  );
};

export default NotesInput;
