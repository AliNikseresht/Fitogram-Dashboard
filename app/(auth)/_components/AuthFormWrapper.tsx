import React from "react";

type AuthFormWrapperProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
};

const AuthFormWrapper = ({
  title,
  description,
  children,
  onSubmit,
}: AuthFormWrapperProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center text-black px-3 w-full">
      <form
        onSubmit={onSubmit}
        className="bg-white p-3 lg:p-5 rounded-3xl shadow-lg w-full max-w-md"
      >
        <div className="flex flex-col items-center w-full gap-1.5 mb-7">
          <h2 className="font-bold text-lg lg:text-2xl bg-gradient-to-b from-[#2962eb] to-[#7b3aed] bg-clip-text text-transparent text-center">
            {title}
          </h2>
          {description && (
            <p className="text-center text-xs lg:text-sm text-[#6b6b6b]">
              {description}
            </p>
          )}
        </div>
        {children}
      </form>
    </div>
  );
};

export default AuthFormWrapper;
