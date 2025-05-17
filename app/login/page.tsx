"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    const user = loginData.user;

    if (!user) {
      setError("User not found");
      setLoading(false);
      return;
    }

    const userId = user.id;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      const role = user.user_metadata?.role || "user";
      const fullName = user.user_metadata?.full_name || "Unnamed";

      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id: userId,
          full_name: fullName,
          role: role,
        },
      ]);

      if (insertError) {
        setError("Failed to insert profile");
        setLoading(false);
        return;
      }

      setLoading(false);

      toast.success("Logged in successfully!");

      setTimeout(() => {
        router.push(
          role === "coach" ? "/dashboard/coaches" : "/dashboard/users"
        );
      }, 1500);
    } else {
      setLoading(false);

      toast.success("Logged in successfully!");

      setTimeout(() => {
        router.push(
          profile.role === "coach" ? "/dashboard/coaches" : "/dashboard/users"
        );
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-black px-4">
      <form
        onSubmit={handleLogin}
        className="bg-[#fff] p-5 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="font-bold text-lg md:text-3xl py-3 bg-gradient-to-b from-[#2962eb] to-[#7b3aed] bg-clip-text text-transparent text-center">
          Login
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-1 text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-[#2962eb] to-[#7b3aed] text-[#fff] w-full rounded-full py-2"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>
        <div className="flex items-center gap-2 mt-3 w-full justify-between">
          <p className="text-xs">If you don`t have an account, please register.</p>
          <Link href="/register" className="text-xs border px-4 py-1 rounded-full border-[#bababa]">Sign Up</Link>
        </div>
      </form>
    </div>
  );
}
