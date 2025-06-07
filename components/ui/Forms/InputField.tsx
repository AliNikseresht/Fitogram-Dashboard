"use client";

import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  error?: FieldError;
  disabled?: boolean;
  registration: UseFormRegisterReturn;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  error,
  disabled,
  registration,
}) => {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-xs lg:text-sm font-medium text-[#212121]">
        {label}
      </label>
      <input
        type={type}
        className={`w-full border text-xs lg:text-sm ${
          error ? "border-red-500" : "border-[#bababa]"
        } rounded px-3 py-2`}
        disabled={disabled}
        {...registration}
      />
      {error && (
        <p className="text-red-500 text-xs lg:text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default InputField;
