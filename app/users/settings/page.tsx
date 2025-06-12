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
  height: number;
  weight: number;
  goal: string;
  birth_date: string;
};

const SettingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();

      if (user?.user?.id) {
        setUserId(user.user.id);

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.user.id)
          .single();

        if (error) {
          toast.error("Error fetching profile.");
        } else if (data) {
          reset({
            full_name: data.full_name || "",
            height: data.height || 0,
            weight: data.weight || 0,
            goal: data.goal || "",
            birth_date: data.birth_date || "",
          });
          setAvatarUrl(data.avatar_url || "");
        }
      } else {
        toast.error("User not found.");
      }

      setInitialLoading(false);
      setLoading(false);
    };

    fetchProfile();
  }, [reset]);

  const uploadAvatar = async () => {
    if (!avatarFile || !userId) return null;

    const fileExt = avatarFile.name.split(".").pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, { upsert: true });

    if (error) {
      toast.error("Error uploading avatar.");
      return null;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    return data?.publicUrl || null;
  };

  const onSubmit = async (values: FormValues) => {
    if (!userId) return;

    setLoading(true);

    let avatarPublicUrl = avatarUrl;
    if (avatarFile) {
      const uploadedUrl = await uploadAvatar();
      if (uploadedUrl) {
        avatarPublicUrl = uploadedUrl;
        setAvatarUrl(uploadedUrl);
      }
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: values.full_name,
        height: values.height,
        weight: values.weight,
        goal: values.goal,
        birth_date: values.birth_date,
        avatar_url: avatarPublicUrl,
        updated_at: new Date().toISOString(),
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
        {avatarUrl && (
          <div className="flex justify-center mb-4">
            <Image
              src={avatarUrl}
              alt="Avatar"
              width={55}
              height={55}
              priority
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            label="Full Name"
            registration={register("full_name", {
              required: "Full name is required",
            })}
            error={errors.full_name}
            required
          />

          <div className="mb-4">
            <label className="block mb-1 text-xs lg:text-sm font-medium text-gray-700">
              Avatar Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setAvatarFile(e.target.files[0]);
                  const fileUrl = URL.createObjectURL(e.target.files[0]);
                  setAvatarUrl(fileUrl);
                }
              }}
            />
          </div>

          <InputField
            label="Height (cm)"
            type="number"
            registration={register("height", {
              required: "Height is required",
              valueAsNumber: true,
            })}
            error={errors.height}
            required
          />

          <InputField
            label="Weight (kg)"
            type="number"
            registration={register("weight", {
              required: "Weight is required",
              valueAsNumber: true,
            })}
            error={errors.weight}
            required
          />

          <InputField
            label="Goal"
            registration={register("goal")}
            error={errors.goal}
          />

          <InputField
            label="Birth Date"
            type="date"
            registration={register("birth_date")}
            error={errors.birth_date}
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

export default SettingsPage;
