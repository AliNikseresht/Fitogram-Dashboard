"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-toastify";
import CustomLoadingSpinner from "@/components/ui/loadings/CustomLoadingSpinner";
import { useEffect, useState } from "react";
import InputField from "@/components/ui/Forms/InputField";

type UserFormValues = {
  height: string;
  weight: string;
  goal: string;
  body_fat_percent?: string;
  muscle_mass?: string;
  birth_date?: string;
  language: string;
};

type CoachFormValues = {
  specialty: string;
  experience: string;
  language: string;
};

const ProfilePage = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [role, setRole] = useState<"user" | "coach" | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues | CoachFormValues>({
    defaultValues: {
      language: "en",
    },
  });

  useEffect(() => {
    async function fetchRoleAndProfile() {
      setLoadingRole(true);
      const {
        data: { user },
        error: sessionError,
      } = await supabase.auth.getUser();

      if (sessionError || !user) {
        toast.error("User not authenticated.");
        setLoadingRole(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        toast.error("Failed to fetch profile.");
        setLoadingRole(false);
        return;
      }

      const userRole = profile.role === "coach" ? "coach" : "user";
      setRole(userRole);

      if (userRole === "coach") {
        const { data: coachProfile, error: coachError } = await supabase
          .from("coaches")
          .select("*")
          .eq("id", user.id)
          .single();

        if (coachError || !coachProfile) {
          toast.warn(
            "Coach profile not found, please complete your coach info."
          );
          reset({
            specialty: "",
            experience: "",
            language: profile.preferences?.language || "en",
          } as CoachFormValues);
        } else {
          reset({
            specialty: coachProfile.specialization || "",
            experience: coachProfile.bio || "",
            language: profile.preferences?.language || "en",
          } as CoachFormValues);
        }
      } else {
        reset({
          height: profile.height || "",
          weight: profile.weight || "",
          goal: profile.goal || "",
          body_fat_percent: profile.body_fat_percent || "",
          muscle_mass: profile.muscle_mass || "",
          birth_date: profile.birth_date || "",
          language: profile.preferences?.language || "en",
        } as UserFormValues);
      }

      setLoadingRole(false);
    }

    fetchRoleAndProfile();
  }, [reset, supabase]);

  const onSubmit = async (data: UserFormValues | CoachFormValues) => {
    if (!avatar) {
      toast.error("Please upload an avatar.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.getUser();

    if (sessionError || !user) {
      toast.error("User not authenticated.");
      setLoading(false);
      return;
    }

    const fileExt = avatar.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatar, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      toast.error("Failed to upload avatar.");
      setLoading(false);
      return;
    }

    const filePath = uploadData?.path;

    const baseProfileData: any = {
      id: user.id,
      avatar_url: filePath,
      preferences: { language: data.language },
      last_login: new Date().toISOString(),
      role: role,
    };

    if (role === "user") {
      const userData = data as UserFormValues;
      baseProfileData.height = userData.height;
      baseProfileData.weight = userData.weight;
      baseProfileData.goal = userData.goal;
      baseProfileData.body_fat_percent = userData.body_fat_percent || null;
      baseProfileData.muscle_mass = userData.muscle_mass || null;
      baseProfileData.birth_date = userData.birth_date || null;
      baseProfileData.coach_id = null;
      baseProfileData.nutrition_program_id = null;
      baseProfileData.workout_program_id = null;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(baseProfileData);

    if (profileError) {
      toast.error("Failed to save profile.");
      setLoading(false);
      return;
    }

    if (role === "coach") {
      const coachData = data as CoachFormValues;

      const coachUpsert = {
        id: user.id,
        full_name: baseProfileData.full_name || "",
        specialization: coachData.specialty,
        bio: coachData.experience,
        is_available: true,
        avatar_url: filePath,
        created_at: new Date().toISOString(),
      };

      const { error: coachError } = await supabase
        .from("coaches")
        .upsert(coachUpsert);

      if (coachError) {
        toast.error("Failed to save coach profile.");
        setLoading(false);
        return;
      }
    }

    toast.success("Profile updated!");
    setLoading(false);
    console.log("Redirecting role:", role);

    setTimeout(() => {
      router.push(role === "coach" ? "/coaches/dashboard" : "/users/dashboard");
    }, 100);
  };

  if (loadingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CustomLoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-black">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-xl font-bold mb-4 text-center text-[#2962eb]">
          {role === "coach"
            ? "Complete your Coach Profile"
            : "Complete your Profile"}
        </h2>

        {role === "coach" && (
          <>
            <InputField
              label="Specialty"
              type="text"
              registration={register("specialty", {
                required: "Specialty is required",
              })}
              error={(errors as any).specialty}
            />
            <InputField
              label="Experience (years)"
              type="number"
              registration={register("experience", {
                required: "Experience is required",
              })}
              error={(errors as any).experience}
            />
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                Preferred Language
              </label>
              <select
                {...register("language")}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="en">English</option>
                <option value="fa">فارسی</option>
              </select>
            </div>
          </>
        )}

        {role === "user" && (
          <>
            <div className="flex items-center gap-3">
              <InputField
                label="Height (cm)"
                type="number"
                registration={register("height", {
                  required: "Height is required",
                })}
                error={errors.height}
              />
              <InputField
                label="Weight (kg)"
                type="number"
                registration={register("weight", {
                  required: "Weight is required",
                })}
                error={errors.weight}
              />
            </div>

            <div className="flex items-center gap-3">
              <InputField
                label="Body Fat (%)"
                type="number"
                registration={register("body_fat_percent")}
                error={errors.body_fat_percent}
              />
              <InputField
                label="Muscle Mass (kg)"
                type="number"
                registration={register("muscle_mass")}
                error={errors.muscle_mass}
              />
            </div>

            <InputField
              label="Birth Date"
              type="date"
              registration={register("birth_date")}
              error={errors.birth_date}
            />

            <div className="mb-4">
              <label className="block mb-1 font-medium">Goal</label>
              <select
                {...register("goal", { required: "Goal is required" })}
                className={`w-full border ${
                  errors.goal ? "border-red-500" : "border-gray-300"
                } rounded px-3 py-2`}
              >
                <option value="">Select your goal</option>
                <option value="lose_weight">Lose Weight</option>
                <option value="gain_muscle">Gain Muscle</option>
                <option value="maintain">Maintain</option>
              </select>
              {errors.goal && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.goal.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">
                Preferred Language
              </label>
              <select
                {...register("language")}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="en">English</option>
                <option value="fa">فارسی</option>
              </select>
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block mb-1 font-medium">Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#2962eb] to-[#7b3aed] text-white py-2 rounded-full"
        >
          {loading ? <CustomLoadingSpinner /> : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
