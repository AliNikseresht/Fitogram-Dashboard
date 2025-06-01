"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputField from "@/components/ui/Forms/InputField";
import CustomLoadingSpinner from "@/components/ui/loadings/CustomLoadingSpinner";
import Image from "next/image";

type FormValues = {
  full_name: string;
  bio: string;
  specialization: string;
  avatar_url: string;
};

const CoachProfileForm = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<FormValues>();

  const avatarUrl = watch("avatar_url");

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("User not logged in.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.from("coaches").upsert({
        id: user.id,
        full_name: data.full_name,
        bio: data.bio,
        specialization: data.specialization,
        avatar_url: data.avatar_url,
      });

      if (error) {
        toast.error("Failed to save coach profile.");
      } else {
        toast.success("Profile updated!");
        router.push("/users/dashboard");
        setLoading(false);
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
    setLoading(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded shadow max-w-md w-full"
    >
      <h2 className="text-xl font-bold mb-4 text-center text-[#2962eb]">
        Coach Profile
      </h2>

      <InputField
        label="Full Name"
        registration={register("full_name", {
          required: "Full name is required",
        })}
        error={errors.full_name}
      />

      <InputField
        label="Specialization"
        registration={register("specialization", {
          required: "Specialization is required",
        })}
        error={errors.specialization}
      />

      <InputField
        label="Bio"
        registration={register("bio")}
        error={errors.bio}
      />

      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Avatar</label>
        {avatarUrl && (
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
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
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

      <button
        type="submit"
        disabled={loading || uploading}
        className="w-full bg-gradient-to-r from-[#2962eb] to-[#7b3aed] text-white py-2 rounded-full mt-4"
      >
        {loading ? <CustomLoadingSpinner /> : "Save Profile"}
      </button>
    </form>
  );
};

export default CoachProfileForm;
