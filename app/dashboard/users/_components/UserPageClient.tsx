"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { Avatar } from "@/components/ui/Avatar";
import LogoutButton from "@/components/ui/buttons/LogoutButton";
import { StatsCard } from "./StatsCard";
import CustomLoadingBars from "@/components/ui/CustomLoadingBars";

const UsersPageClient = () => {
  const { profile, avatarUrl, loading } = useUserProfile();

  if (loading) return <CustomLoadingBars />;

  if (!profile)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error loading profile.
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col p-6 gap-6 w-full">
      <div className="flex justify-between">
        <div>
          <h3 className="text-2xl font-bold">Dashboard</h3>
          <p className="text-gray-600">Monday, May 22, 2025</p>
        </div>
        <div className="flex items-center gap-2">
          <Avatar
            fullName={profile.full_name}
            avatarUrl={avatarUrl}
            size={45}
            borderWidth={2}
          />
          <div className="flex flex-col justify-center">
            <h2 className="text-xl text-indigo-700">{profile.full_name}</h2>
            <p className="text-xs text-gray-600">Premium Member</p>
          </div>
        </div>
      </div>
      <div className="bg-[#fff] shadow-lg rounded-xl w-full p-5 flex flex-col md:flex-row md:justify-between items-center gap-6">
        <div className="w-full flex items-center gap-4">
          <Avatar
            fullName={profile.full_name}
            avatarUrl={avatarUrl}
            size={80}
          />

          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-indigo-700">
              {profile.full_name}
            </h1>
            <p className="text-indigo-500 font-semibold uppercase tracking-wider">
              Role: {profile.role}
            </p>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mt-4 md:mt-0">
          <StatsCard label="Height (cm)" value={profile.height} />
          <StatsCard label="Weight (kg)" value={profile.weight} />
          <StatsCard label="Goal" value={profile.goal} />
        </div>
      </div>

      <LogoutButton />
    </div>
  );
};

export default UsersPageClient;
