"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
    }, 1200);
  };

  return (
    <>
      <button
        onClick={handleLogout}
        className={`text-red-500 hover:underline ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Logging out..." : "Logout"}
      </button>
    </>
  );
}
