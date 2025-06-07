import Link from "next/link";
import React from "react";

const VerifyEmailPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center text-black px-3 w-full">
      <div className="bg-white p-3 lg:p-5 rounded-3xl shadow-lg w-full max-w-md flex justify-center flex-col items-center">
        <h2 className="font-bold text-3xl mb-3 bg-gradient-to-b from-[#2962eb] to-[#7b3aed] bg-clip-text text-transparent text-center">
          Check your email
        </h2>
        <p className="text-[#212121] text-sm lg:text-base text-center">
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
