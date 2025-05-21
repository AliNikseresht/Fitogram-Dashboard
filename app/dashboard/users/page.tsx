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
  avatar_url?: string | null;
}

const UsersPage = () => {
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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
          avatar_url: user.user_metadata.avatar_url || null,
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
          avatar_url: null,
        });
      } else {
        setProfile(profileData);

        if (profileData.avatar_url) {
          const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(profileData.avatar_url);
          setAvatarUrl(data.publicUrl);
        }
      }
    }

    fetchProfile();
  }, [supabase]);

  if (!profile)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-tr from-indigo-100 via-white to-purple-100 p-6">
      <div className="bg-white shadow-lg rounded-xl max-w-md w-full p-8 flex flex-col items-center gap-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500 shadow-md">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${profile.full_name} avatar`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex justify-center items-center w-full h-full bg-indigo-200 text-indigo-600 font-bold text-4xl">
              {profile.full_name
                ? profile.full_name.charAt(0).toUpperCase()
                : "U"}
            </div>
          )}
        </div>

        <h1 className="text-3xl font-extrabold text-indigo-700">
          {profile.full_name}
        </h1>
        <p className="text-indigo-500 font-semibold uppercase tracking-wider">
          Role: {profile.role}
        </p>

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-indigo-50 p-4 rounded-lg shadow-sm">
            <p className="text-indigo-700 font-bold text-lg">
              {profile.height ?? "Not set"}
            </p>
            <p className="text-indigo-400 text-sm mt-1">Height (cm)</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg shadow-sm">
            <p className="text-indigo-700 font-bold text-lg">
              {profile.weight ?? "Not set"}
            </p>
            <p className="text-indigo-400 text-sm mt-1">Weight (kg)</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg shadow-sm">
            <p className="text-indigo-700 font-bold text-lg">
              {profile.goal ?? "Not set"}
            </p>
            <p className="text-indigo-400 text-sm mt-1">Goal</p>
          </div>
        </div>

        <LogoutButton />
      </div>
    </div>
  );
};

export default UsersPage;
