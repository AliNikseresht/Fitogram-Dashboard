"use client";

import { useQuery } from "@tanstack/react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SupabaseProfile } from "@/types/UserProfile";

const supabase = createClientComponentClient();

async function fetchUserProfile(): Promise<SupabaseProfile> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    throw new Error("Session not found");
  }

  const user = session.user;

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

  if (error) throw new Error(error.message);

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

  // If profile doesn't exist, insert it
  if (!profileData) {
    const { error: insertError } = await supabase
      .from("profiles")
      .insert(finalProfile);
    if (insertError) throw new Error(insertError.message);
  }

  return finalProfile;
}

export function useUserProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}
