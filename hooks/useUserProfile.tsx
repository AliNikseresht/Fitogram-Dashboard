"use client";
import { useEffect, useState, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SupabaseProfile } from "@/types/UserProfile";

export function useUserProfile() {
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<SupabaseProfile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Get current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      setError("Session not found");
      setLoading(false);
      return;
    }

    const user = session.user;

    // Fetch profile with coach relation and new fields
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select(
        `
    id,
    full_name,
    role,
    height,
    weight,
    goal,
    avatar_url,
    body_fat_percent,
    muscle_mass,
    birth_date,
    created_at,
    updated_at,
    workout_program_id,
    nutrition_program_id,
    status,
    last_login,
    preferences,
    coach:coach_id (
      id,
      full_name,
      avatar_url
    )
  `
      )
      .eq("id", user.id)
      .maybeSingle<SupabaseProfile>();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    console.log("Coach data from Supabase:", profileData?.coach);

    const mappedProfile: SupabaseProfile | null = profileData
      ? {
          ...profileData,
          coach: profileData.coach ?? null,
        }
      : null;

    const finalProfile: SupabaseProfile = mappedProfile ?? {
      id: user.id,
      full_name: (user.user_metadata.full_name as string) || "",
      role: (user.user_metadata.role as "user" | "coach") || "user",
      height: null,
      weight: null,
      goal: null,
      avatar_url: (user.user_metadata.avatar_url as string) || null,
      coach: null,
      body_fat_percent: null,
      muscle_mass: null,
      birth_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      workout_program_id: null,
      nutrition_program_id: null,
      status: "online",
      last_login: null,
      preferences: null,
    };

    // If profile doesn't exist, insert new one
    if (!profileData) {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert(finalProfile);
      if (insertError) {
        setError(insertError.message);
      }
    }

    setProfile(finalProfile);

    // Set public avatar URL if exists
    if (finalProfile.avatar_url) {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(finalProfile.avatar_url);
      setAvatarUrl(data.publicUrl);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;
    fetchProfile().then(() => {
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [fetchProfile]);

  return { profile, avatarUrl, loading, error };
}
