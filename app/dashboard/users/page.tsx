"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import LogoutButton from "@/components/ui/buttons/LogoutButton";

interface UserProfile {
  id: string;
  full_name: string;
  role: string;
  height: number | null;
  weight: number | null;
  goal: string | null;
}

const UsersPage = () => {
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User not found", userError);
        return;
      }

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Profile fetch error", error);
        return;
      }

      if (!profileData) {
        const { error: insertError } = await supabase.from("profiles").insert({
          id: user.id,
          full_name: user.user_metadata.full_name || "",
          role: user.user_metadata.role || "user",
          height: null,
          weight: null,
          goal: null,
        });

        if (insertError) {
          console.error("Error inserting profile", insertError);
          return;
        }

        setProfile({
          id: user.id,
          full_name: user.user_metadata.full_name || "",
          role: user.user_metadata.role || "user",
          height: null,
          weight: null,
          goal: null,
        });
      } else {
        setProfile(profileData);
      }
    }

    fetchProfile();
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="p-16">
      <h1 className="text-2xl font-bold mb-4">{profile.full_name}</h1>
      <p>Role: {profile.role}</p>
      <p>Height: {profile.height ?? "Not set"}</p>
      <p>Weight: {profile.weight ?? "Not set"}</p>
      <p>Goal: {profile.goal ?? "Not set"}</p>
      <LogoutButton />
    </div>
  );
};

export default UsersPage;
