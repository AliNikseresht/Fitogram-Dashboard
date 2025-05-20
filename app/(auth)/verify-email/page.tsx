import Link from "next/link";
import React from "react";

const VerifyEmailPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-black">
      <div className="bg-[#fff] p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-[#2962eb]">
          Check your email
        </h2>
        <p className="text-gray-700">
          We&apos;ve sent a confirmation link to your email address.
          <br />
          Please click the link in your email to verify your account and
          continue.
        </p>
        <div className="mt-6">
          <Link
            href="/login"
            className="text-[#2962eb] underline hover:text-[#1d4ed8] text-sm"
          >
            Already confirmed? Log in here.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
