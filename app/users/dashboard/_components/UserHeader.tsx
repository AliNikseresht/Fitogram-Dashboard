"use client";

import LoadingSkeleton from "@/components/ui/loadings/CustomLoadingSkeleton";
import { useUserProfile } from "@/hooks/useUserProfile";
import Image from "next/image";

export const UserHeader = () => {
  const { profile, avatarUrl, loading, error } = useUserProfile();

  if (loading) return <LoadingSkeleton />;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!profile)
    return <div className="text-red-500">No profile data found.</div>;

  const birthDate = profile.birth_date ? new Date(profile.birth_date) : null;
  const age = birthDate
    ? Math.floor(
        (Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      )
    : null;

  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="lg:text-2xl font-bold">Dashboard</h3>
        <p className="text-xs lg:text-base text-gray-600">
          Monday, May 22, 2025
        </p>
      </div>
      <div className="flex items-center gap-2">
        {avatarUrl && (
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={80}
            height={80}
            className="rounded-full"
          />
        )}
        <div className="flex flex-col justify-center">
          <h2 className="hidden lg:flex text-xl text-indigo-700">
            {profile.full_name}
          </h2>
          <p className="text-sm text-gray-600">Age: {age ?? "Not specified"}</p>
          <p className="text-sm text-gray-600">
            Goal: {profile.goal ?? "Not specified"}
          </p>
        </div>
      </div>
    </div>
  );
};
