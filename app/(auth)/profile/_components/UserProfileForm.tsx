"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-toastify";
import { useState } from "react";
import InputField from "@/components/ui/Forms/InputField";
import CustomLoadingSpinner from "@/components/ui/loadings/CustomLoadingSpinner";

type FormValues = {
  height: string;
  weight: string;
  goal: string;
  body_fat_percent: string;
  muscle_mass: string;
  birth_date: string;
  language: string;
};

const UserProfileForm = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      language: "en",
    },
  });

  const onSubmit = async (data: FormValues) => {
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

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      height: data.height,
      weight: data.weight,
      goal: data.goal,
      avatar_url: filePath,
      body_fat_percent: data.body_fat_percent || null,
      muscle_mass: data.muscle_mass || null,
      birth_date: data.birth_date || null,
      preferences: {
        language: data.language,
      },
      coach_id: null,
      nutrition_program_id: null,
      workout_program_id: null,
      last_login: new Date().toISOString(),
    });

    if (profileError) {
      toast.error("Failed to save profile.");
      setLoading(false);
      return;
    }

    toast.success("Profile updated!");
    router.push("/users/dashboard");
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
    >
      <h2 className="text-xl font-bold mb-4 text-center text-[#2962eb]">
        Complete your profile
      </h2>

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
          <p className="text-red-500 text-xs mt-1">{errors.goal.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Preferred Language</label>
        <select
          {...register("language")}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="en">English</option>
          <option value="fa">فارسی</option>
        </select>
      </div>

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
  );
};

export default UserProfileForm;
