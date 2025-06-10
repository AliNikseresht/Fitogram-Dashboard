"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CustomLoadingSpinner from "../loadings/CustomLoadingSpinner";
import supabase from "@/libs/supabaseClient";

export default function LogoutButton() {
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
        className={`bg-red-500 text-[#fff] hover:underline w-full rounded-md cursor-pointer py-1.5 duration-200 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? <CustomLoadingSpinner /> : "Logout"}
      </button>
    </>
  );
}
