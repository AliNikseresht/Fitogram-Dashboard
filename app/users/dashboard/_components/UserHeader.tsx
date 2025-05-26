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
            alt="user avatar"
            width={60}
            height={60}
            className="rounded-full border-4 border-black shadow-lg"
          />
        )}
        <div className="flex flex-col justify-center">
          <h2 className="hidden lg:flex text-xl text-indigo-700">
            {profile.full_name}
          </h2>
          <p className="text-sm text-gray-600">{profile.role}</p>
        </div>
      </div>
    </div>
  );
};
