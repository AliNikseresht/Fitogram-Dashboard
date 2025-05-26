"use client";
import { useEffect, useState, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { UserProfile } from "@/types/UserProfile";

export function useUserProfile() {
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<UserProfile | null>(null);
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
        coach:profiles!coach_id (
          id,
          full_name
        )
      `
      )
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Fix coach field: convert from array to single object or null
    const mappedProfile: UserProfile | null = profileData
      ? {
          ...profileData,
          coach:
            Array.isArray(profileData.coach) && profileData.coach.length > 0
              ? profileData.coach[0]
              : null,
        }
      : null;

    const finalProfile: UserProfile = mappedProfile ?? {
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
      status: "active",
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
