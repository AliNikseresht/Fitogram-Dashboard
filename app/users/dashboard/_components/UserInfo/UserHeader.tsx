"use client";

import UserAccountInfo from "./UserAccountInfo";
import { SupabaseProfile } from "@/types/UserProfile";
import UserBodyInfo from "./UserBodyInfo";

interface UserHeaderProps {
  profile: SupabaseProfile;
  avatarUrl?: string | null;
}

export const UserHeader = ({ profile, avatarUrl }: UserHeaderProps) => {
  if (!profile)
    return <div className="text-red-500">No profile data found.</div>;

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gradient-to-b from-[#2962eb] to-[#7b3aed] rounded-t-xl w-full p-4">
      <UserAccountInfo profile={profile} avatarUrl={avatarUrl} />
      <UserBodyInfo profile={profile} />
    </div>
  );
};
