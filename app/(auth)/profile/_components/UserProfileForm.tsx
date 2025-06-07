"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import InputField from "@/components/ui/Forms/InputField";
import useSubmitUserProfile from "@/hooks/useSubmitUserProfile";
import GoalSelect from "./UserProfileForm/GoalSelect";
import LanguageSelect from "./UserProfileForm/LanguageSelect";
import AvatarUpload from "./UserProfileForm/AvatarUpload";
import { UserProfileFormValues } from "@/types/UserProfileForm";
import GradientSubmitButton from "@/components/ui/buttons/GradientSubmitButton";

const UserProfileForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const submitProfile = useSubmitUserProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileFormValues>({ defaultValues: { language: "en" } });

  const onSubmit = async (data: UserProfileFormValues) => {
    if (!avatar) {
      toast.error("Please upload an avatar.");
      return;
    }

    setLoading(true);

    const result = await submitProfile({ formData: data, avatar });

    setLoading(false);

    if (result.success) {
      toast.success("Profile updated!");
      router.push("/users/dashboard");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-3 lg:p-5 rounded-lg shadow-lg w-full max-w-md"
    >
      <h2 className="font-bold mb-4 text-lg lg:text-2xl py-3 bg-gradient-to-b from-[#2962eb] to-[#7b3aed] bg-clip-text text-transparent text-center">
        Complete your profile
      </h2>

      {/* Height and Weight */}
      <div className="flex items-center gap-3">
        <InputField
          label="Height (cm)"
          type="number"
          registration={register("height", { required: "Height is required" })}
          error={errors.height}
        />
        <InputField
          label="Weight (kg)"
          type="number"
          registration={register("weight", { required: "Weight is required" })}
          error={errors.weight}
        />
      </div>

      {/* Body Fat & Muscle Mass */}
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

      {/* Birth Date */}
      <InputField
        label="Birth Date"
        type="date"
        registration={register("birth_date")}
        error={errors.birth_date}
      />

      {/* Goal */}
      <GoalSelect
        registration={register("goal", { required: "Goal is required" })}
        error={errors.goal}
      />

      {/* Language */}
      <LanguageSelect registration={register("language")} />

      {/* Avatar Upload */}
      <AvatarUpload onChange={(file) => setAvatar(file)} />

      {/* Submit */}
      <GradientSubmitButton isLoading={loading}>
        Save Profile
      </GradientSubmitButton>
    </form>
  );
};

export default UserProfileForm;
