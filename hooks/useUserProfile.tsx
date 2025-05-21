"use client";
import { useEffect, useState, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export interface UserProfile {
  id: string;
  full_name: string;
  role: string;
  height: number | null;
  weight: number | null;
  goal: string | null;
  avatar_url?: string | null;
}

export function useUserProfile() {
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User not found", userError);
      setLoading(false);
      return;
    }

    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Profile fetch error", error);
      setLoading(false);
      return;
    }

    const finalProfile = profileData ?? {
      id: user.id,
      full_name: user.user_metadata.full_name || "",
      role: user.user_metadata.role || "user",
      height: null,
      weight: null,
      goal: null,
      avatar_url: user.user_metadata.avatar_url || null,
    };

    if (!profileData) {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert(finalProfile);
      if (insertError) console.error("Error inserting profile", insertError);
    }

    setProfile(finalProfile);

    if (finalProfile.avatar_url) {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(finalProfile.avatar_url);
      setAvatarUrl(data.publicUrl);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, avatarUrl, loading };
}
