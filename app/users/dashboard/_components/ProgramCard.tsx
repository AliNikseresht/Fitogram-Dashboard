"use client";

import Link from "next/link";

function ProgramCard({
  label,
  id,
  fallbackText,
  href,
}: {
  label: string;
  id: string | null | undefined;
  fallbackText: string;
  href: string;
}) {
  if (!id) {
    return (
      <div className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 rounded-xl p-4 text-center">
        <p className="text-white">{label}</p>
        <p className="text-lg font-bold text-white">{fallbackText}</p>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="bg-blue-50 hover:bg-blue-100 rounded-xl p-4 block text-center text-blue-700 font-semibold"
    >
      <p>{label}</p>
      <p className="text-lg font-bold underline">View Program</p>
    </Link>
  );
}

export default ProgramCard;
