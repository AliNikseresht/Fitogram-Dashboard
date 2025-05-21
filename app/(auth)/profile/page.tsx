"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-toastify";
import CustomLoadingSpinner from "@/components/ui/CustomLoadingSpinner";

const ProfilePage = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [form, setForm] = useState({
    height: "",
    weight: "",
    goal: "",
    avatar: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, avatar: file }));
  };

  const handleSubmit = async () => {
    if (!form.avatar) {
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
      return;
    }

    const fileExt = form.avatar.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, form.avatar, {
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

      height: form.height,
      weight: form.weight,
      goal: form.goal,
      avatar_url: filePath,
    });

    if (profileError) {
      toast.error("Failed to save profile.");
      setLoading(false);
      return;
    }

    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage.from("avatars").createSignedUrl(filePath, 60 * 60);

    if (signedUrlError) {
      toast.error("Failed to create signed URL.");
      setLoading(false);
      return;
    }

    console.log("Signed URL:", signedUrlData?.signedUrl);

    toast.success("Profile updated!");

    const { data: profileData } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profileData?.role || "user";

    if (role === "coach") {
      router.push("/dashboard/coaches");
    } else {
      router.push("/dashboard/users");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-black">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-center text-[#2962eb]">
          Complete your profile
        </h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Height (cm)</label>
          <input
            type="number"
            name="height"
            value={form.height}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Goal</label>
          <select
            name="goal"
            value={form.goal}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select your goal</option>
            <option value="lose_weight">Lose Weight</option>
            <option value="gain_muscle">Gain Muscle</option>
            <option value="maintain">Maintain</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#2962eb] to-[#7b3aed] text-white py-2 rounded-full"
        >
          {loading ? <CustomLoadingSpinner /> : "Save Profile"}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
