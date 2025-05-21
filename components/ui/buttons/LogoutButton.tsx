"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CustomLoadingSpinner from "../CustomLoadingSpinner";

export default function LogoutButton() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Logout failed: " + error.message);
      setLoading(false);
      return;
    }

    toast.success("You have logged out successfully!");

    setTimeout(() => {
      router.push("/login");
    }, 800);
  };

  return (
    <>
      <button
        onClick={handleLogout}
        className={`bg-red-500 text-[#fff] hover:underline w-32 rounded-md cursor-pointer py-1.5 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? <CustomLoadingSpinner /> : "Logout"}
      </button>
    </>
  );
}
