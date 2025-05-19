"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginInputFields } from "@/data/LoginFormItemsData";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { LoginFormData, loginSchema } from "@/schemas/loginSchema";

const LoginForm = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData: LoginFormData) => {
    setLoading(true);

    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

    if (loginError || !loginData.user) {
      toast.error(loginError?.message || "Login failed.");
      setLoading(false);
      return;
    }

    const user = loginData.user;
    const userId = user.id;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (!profile || profileError) {
      const role = user.user_metadata?.role || "user";
      const fullName = user.user_metadata?.full_name || "Unnamed";

      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id: userId,
          full_name: fullName,
          role: role,
          height: null,
          weight: null,
          goal: null,
        },
      ]);

      if (insertError) {
        toast.error("Failed to insert profile");
        setLoading(false);
        return;
      }

      toast.success("Logged in successfully!");
      setLoading(false);

      setTimeout(() => {
        router.push(
          role === "coach" ? "/dashboard/coaches" : "/dashboard/users"
        );
      }, 1500);
    } else {
      toast.success("Logged in successfully!");
      setLoading(false);

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
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="font-bold text-3xl py-3 bg-gradient-to-b from-[#2962eb] to-[#7b3aed] bg-clip-text text-transparent text-center">
          Login
        </h2>

        {loginInputFields.map((input) => (
          <div className="mb-4" key={input.name}>
            <label
              htmlFor={input.name}
              className="block mb-1 text-sm font-medium"
            >
              {input.label}
            </label>
            <input
              id={input.name}
              type={input.type}
              {...register(input.name)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={loading}
            />
            {errors[input.name] && (
              <p className="text-sm text-red-600 mt-1">
                {errors[input.name]?.message as string}
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="bg-gradient-to-r from-[#2962eb] to-[#7b3aed] text-white w-full rounded-full py-2"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <div className="flex items-center gap-2 mt-3 w-full justify-between">
          <p className="text-xs">
            If you don`t have an account, please register.
          </p>
          <Link
            href="/register"
            className="text-xs border px-4 py-1 rounded-full border-[#bababa]"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
