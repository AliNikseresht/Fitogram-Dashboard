"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const supabase = createClientComponentClient();

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
    } else {
      toast.success(
        "Registration was successful. Please check your email for confirmation and then log in."
      );
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-black px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="font-bold text-lg md:text-3xl py-3 bg-gradient-to-b from-[#2962eb] to-[#7b3aed] bg-clip-text text-transparent text-center">
          Register
        </h2>

        {message && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            disabled={loading}
          >
            <option value="user">User</option>
            <option value="coach">Coach</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-[#2962eb] to-[#7b3aed] text-[#fff] w-full rounded-full py-2"
          disabled={loading}
        >
          {loading ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  );
}
