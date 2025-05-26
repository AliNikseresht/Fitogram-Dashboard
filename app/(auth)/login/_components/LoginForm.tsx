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
import CustomLoadingSpinner from "@/components/ui/loadings/CustomLoadingSpinner";

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

  const onSubmit = handleSubmit(async (formData: LoginFormData) => {
    if (loading) return;

    setLoading(true);

    try {
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (loginError || !loginData.user) {
        toast.error(loginError?.message || "Login failed.");
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
          return;
        }

        toast.success("Logged in successfully!");
        router.push(
          role === "coach" ? "/dashboard/coaches" : "/dashboard/users"
        );
      } else {
        // update last_login
        await supabase
          .from("profiles")
          .update({ last_login: new Date().toISOString() })
          .eq("id", userId);

        toast.success("Logged in successfully!");
        router.push(
          profile.role === "coach" ? "/dashboard/coaches" : "/dashboard/users"
        );
      }
    } catch {
      toast.error("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center text-black px-3 w-full">
      <form
        onSubmit={onSubmit}
        className="bg-[#fff] p-3 lg:p-5 rounded-lg shadow-lg w-full max-w-md"
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
          className="bg-gradient-to-r from-[#2962eb] to-[#7b3aed] text-[#fff] w-full rounded-full py-2 cursor-pointer"
          disabled={loading}
        >
          {loading ? <CustomLoadingSpinner /> : "Login"}
        </button>

        <div className="flex items-center mt-3 w-full justify-between">
          <p className="text-[10px] lg:text-xs">
            If you don`t have an account, please register.
          </p>
          <Link
            href="/register"
            className="text-[10px] lg:text-sm border px-3 py-1 rounded-full border-[#bababa]"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
