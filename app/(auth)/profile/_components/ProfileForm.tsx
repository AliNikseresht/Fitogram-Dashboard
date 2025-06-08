"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import InputField from "@/components/ui/Forms/InputField";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import GradientSubmitButton from "@/components/ui/buttons/GradientSubmitButton";
import {
  ProfileFormProps,
  UserProfileFormValues,
} from "@/types/UserProfileForm";

export default function ProfileForm({
  title,
  redirectPath,
  fields,
  table,
  staticValues = {},
  showAvatarPreview = false,
}: ProfileFormProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<UserProfileFormValues>({
    defaultValues: {},
  });

  const avatarUrl = watch("avatar_url");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { cacheControl: "3600", upsert: true });

    if (uploadError) {
      toast.error("Failed to upload avatar.");
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    if (publicUrlData?.publicUrl) {
      setValue("avatar_url", publicUrlData.publicUrl, { shouldValidate: true });
      toast.success("Avatar uploaded!");
    } else {
      toast.error("Failed to get avatar URL.");
    }

    setUploading(false);
  };

  const onSubmit = async (formData: UserProfileFormValues) => {
    setLoading(true);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      toast.error("User not logged in.");
      setLoading(false);
      return;
    }

    let avatar_url = formData.avatar_url;

    if (!avatar_url && avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${user.id}.${fileExt}`;

      const { data: uploaded, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        toast.error("Failed to upload avatar.");
        setLoading(false);
        return;
      }

      avatar_url = uploaded?.path;
    }

    const payload = {
      id: user.id,
      ...formData,
      avatar_url,
      ...staticValues,
    };

    const { error } = await supabase.from(table).upsert(payload);

    if (error) {
      toast.error("Failed to save profile.");
    } else {
      toast.success("Profile updated!");
      router.push(redirectPath);
    }

    setLoading(false);
  };

  const goalOptions = [
    { value: "lose_weight", label: "Lose Weight" },
    { value: "gain_muscle", label: "Gain Muscle" },
    { value: "maintain", label: "Maintain Weight" },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-xl shadow max-w-md w-full"
    >
      <h2 className="font-bold mb-4 text-lg lg:text-2xl py-3 bg-gradient-to-b from-[#2962eb] to-[#7b3aed] bg-clip-text text-transparent text-center">
        {title}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {fields.map(({ name, label, type = "text", required, textarea }) =>
          name === "goal" ? (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="font-medium text-gray-700">
                {label}
                {required && <span className="text-red-600">*</span>}
              </label>
              <select
                id={name}
                {...register(name as keyof UserProfileFormValues, {
                  required: required ? `${label} is required` : false,
                })}
                className={`border rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors[name as keyof UserProfileFormValues]
                    ? "border-red-600"
                    : "border-gray-300"
                }`}
                defaultValue=""
              >
                <option value="" disabled>
                  Select your goal
                </option>
                {goalOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors[name as keyof UserProfileFormValues] && (
                <p className="text-red-600 text-sm mt-1">
                  {errors[name as keyof UserProfileFormValues]?.message}
                </p>
              )}
            </div>
          ) : (
            <InputField
              key={name}
              label={label}
              type={type}
              registration={register(
                name as keyof UserProfileFormValues,
                required ? { required: `${label} is required` } : {}
              )}
              error={errors[name as keyof UserProfileFormValues]}
              textarea={textarea}
              required={required}
            />
          )
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Avatar</label>

        {showAvatarPreview && avatarUrl && (
          <Image
            src={avatarUrl}
            alt="Avatar Preview"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full mb-2 object-cover border border-gray-300"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (showAvatarPreview) {
              handleFileChange(e);
            } else {
              setAvatarFile(e.target.files?.[0] || null);
            }
          }}
          disabled={uploading}
          className="block w-full text-sm"
        />
        {uploading && (
          <p className="text-sm text-gray-500 mt-1">Uploading...</p>
        )}
        {errors.avatar_url && (
          <p className="text-red-600 text-sm mt-1">
            {errors.avatar_url.message}
          </p>
        )}
      </div>

      <GradientSubmitButton isLoading={loading}>
        <div className="flex items-center justify-center gap-0.5">
          Save Profile
        </div>
      </GradientSubmitButton>
    </form>
  );
}
