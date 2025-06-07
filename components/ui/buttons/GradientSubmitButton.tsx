"use client";

import { ReactNode } from "react";
import CustomLoadingSpinner from "../loadings/CustomLoadingSpinner";

type Props = {
  isLoading: boolean;
  children: ReactNode;
  className?: string;
  type?: "submit" | "button";
};

const GradientSubmitButton = ({
  isLoading,
  children,
  className = "",
  type = "submit",
}: Props) => {
  return (
    <button
      type={type}
      disabled={isLoading}
      className={`bg-gradient-to-r from-[#2962eb] to-[#7b3aed] text-white w-full rounded-lg py-2 cursor-pointer mt-4 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? <CustomLoadingSpinner /> : children}
    </button>
  );
};

export default GradientSubmitButton;
