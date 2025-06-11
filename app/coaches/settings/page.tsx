"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import supabase from "@/libs/supabaseClient";
import InputField from "@/components/ui/Forms/InputField";
import CustomLoadingBars from "@/components/ui/loadings/CustomLoadingBars";
import Image from "next/image";

type FormValues = {
  full_name: string;
  bio: string;
  specialization: string;
};

const CoachesSettingPage = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();

      if (user?.user?.id) {
        setUserId(user.user.id);

        const { data, error } = await supabase
          .from("coaches") // 👈 جدول صحیح
          .select("*")
          .eq("id", user.user.id)
          .single();

        if (error) {
          toast.error("Error fetching coach profile.");
        } else if (data) {
          reset({
            full_name: data.full_name || "",
            bio: data.bio || "",
            specialization: data.specialization || "",
          });
          setAvatarUrl(data.avatar_url || null);
        }
      } else {
        toast.error("User not found.");
      }

      setInitialLoading(false);
      setLoading(false);
    };

    fetchProfile();
  }, [reset]);

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0 || !userId)
      return;

    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop();
    const filePath = `avatars/${userId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error("Error uploading image.");
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);
    if (publicUrlData?.publicUrl) {
      setAvatarUrl(publicUrlData.publicUrl);

      const { error: updateError } = await supabase
        .from("coaches") // 👈 جدول صحیح
        .update({
          avatar_url: publicUrlData.publicUrl,
        })
        .eq("id", userId);

      if (updateError) {
        toast.error("Error saving avatar URL.");
      } else {
        toast.success("Avatar updated successfully!");
      }
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!userId) return;

    setLoading(true);
    const { error } = await supabase
      .from("coaches") // 👈 جدول صحیح
      .update({
        full_name: values.full_name,
        bio: values.bio,
        specialization: values.specialization,
      })
      .eq("id", userId);

    if (error) {
      toast.error("Error updating profile.");
    } else {
      toast.success("Profile updated successfully!");
    }

    setLoading(false);
  };

  if (initialLoading) {
    return <CustomLoadingBars />;
  }

  return (
    <section className="w-full flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-2xl p-4 bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Coach Settings</h1>

        {avatarUrl && (
          <div className="flex justify-center mb-4">
            <Image
              src={avatarUrl}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover"
              width={96}
              height={96}
              priority
            />
          </div>
        )}

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Upload Avatar
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            label="Full Name"
            registration={register("full_name", {
              required: "Full name is required",
            })}
            error={errors.full_name}
            required
          />

          <InputField
            label="Specialization"
            registration={register("specialization")}
            error={errors.specialization}
          />

          <InputField
            label="Bio"
            registration={register("bio")}
            error={errors.bio}
            textarea
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0284c7] text-[#fff] py-2 rounded cursor-pointer disabled:opacity-50 hover:bg-[#027bc7] duration-200"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CoachesSettingPage;
