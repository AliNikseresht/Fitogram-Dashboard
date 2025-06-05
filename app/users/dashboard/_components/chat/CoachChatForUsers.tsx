"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import CustomLoadingBars from "@/components/ui/loadings/CustomLoadingBars";
import { useUserProfile } from "@/hooks/useUserProfile";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ChatWindow from "@/components/ui/ChatWindow";

const CoachChatForUsers = () => {
  const { profile, loading, error } = useUserProfile();
  const supabase = createClientComponentClient();
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

  if (loading) return <CustomLoadingBars />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile)
    return <div className="text-red-500">No profile data found.</div>;

  if (!profile.coach)
    return (
      <div>
        <p className="text-red-500 mb-2">You haven`t selected a coach yet.</p>
        <Link href="/users/coach" className="btn-primary">
          Choose a Coach
        </Link>
      </div>
    );

  if (!userId) return <p>Loading user...</p>;

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
