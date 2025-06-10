"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUserProfile } from "@/hooks/useUserProfile";
import ChatWindow from "@/components/ui/ChatWindow";
import ChatWindowSkeleton from "@/components/ui/loadings/ChatWindowSkeleton";
import supabase from "@/libs/supabaseClient";

const CoachChatForUsers = () => {
  const { data: profile, isLoading, error } = useUserProfile();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    }
    fetchUser();
  }, [supabase]);

  if (isLoading) return <ChatWindowSkeleton />;

  if (error)
    return (
      <div role="alert" className="text-red-500">
        Error: {(error as Error).message}
      </div>
    );
  if (!profile)
    return <div className="text-red-500">No profile data found.</div>;

  if (!profile.coach)
    return (
      <div className="h-full w-full max-w-sm bg-[#fff] p-4 rounded-xl shadow-md">
        <p className="text-red-500 mb-4 font-semibold">You haven`t selected a coach yet.</p>
        <Link
          href="/users/coach"
          className="text-xs lg:text-base p-2.5 rounded-md font-bold bg-gradient-to-br from-[#f9e8ff] to-[#e1f1fe] text-[#0369a1] shadow"
        >
          Choose a Coach
        </Link>
      </div>
    );

  if (!userId)
    return (
      <div className="w-full max-w-sm p-4 rounded bg-gray-100 animate-pulse">
        <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
      </div>
    );

  return (
    <ChatWindow
      userId={userId}
      otherUserId={profile.coach.id}
      otherUserAvatar={profile.coach.avatar_url || "/default-avatar.png"}
      otherUserName={profile.coach.full_name}
      myId={userId}
    />
  );
};

export default CoachChatForUsers;
