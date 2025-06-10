"use client";

import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  error?: FieldError;
  disabled?: boolean;
  registration: UseFormRegisterReturn;
  textarea?: boolean;
  required?: boolean;
  placeholder?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  error,
  disabled,
  registration,
  textarea,
  required,
  placeholder,
}) => {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-xs lg:text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      {textarea ? (
        <textarea
          className={`w-full border text-xs lg:text-sm ${
            error ? "border-red-500" : "border-[#bababa]"
          } rounded px-3 py-2`}
          disabled={disabled}
          {...registration}
        />
      ) : (
        <input
          type={type}
          className={`w-full border text-xs lg:text-sm ${
            error ? "border-red-500" : "border-[#bababa]"
          } rounded px-3 py-2`}
          disabled={disabled}
          {...registration}
          placeholder={placeholder}
        />
      )}
      {error && (
        <p className="text-red-500 text-xs lg:text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default InputField;
