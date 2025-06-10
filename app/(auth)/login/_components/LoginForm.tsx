"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginInputFields } from "@/data/LoginFormItemsData";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { LoginFormData, loginSchema } from "@/schemas/loginSchema";
import { FaCaretRight } from "react-icons/fa6";
import GradientSubmitButton from "@/components/ui/buttons/GradientSubmitButton";
import InputField from "@/components/ui/Forms/InputField";
import AuthFormWrapper from "../../_components/AuthFormWrapper";
import supabase from "@/libs/supabaseClient";

const LoginForm = () => {
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
          role === "coach" ? "/coaches/dashboard" : "/users/dashboard"
        );
      } else {
        // update last_login
        await supabase
          .from("profiles")
          .update({ last_login: new Date().toISOString() })
          .eq("id", userId);

        toast.success("Logged in successfully!");
        router.push(
          profile.role === "coach" ? "/coaches/dashboard" : "/users/dashboard"
        );
      }
    } catch {
      toast.error("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  });

  return (
    <AuthFormWrapper
      title="Log in to Fitogram Dashboard"
      description="Welcome back! Please Log in to continue"
      onSubmit={onSubmit}
    >
      {loginInputFields.map((input) => (
        <InputField
          key={input.name}
          label={input.label}
          type={input.type}
          registration={register(input.name)}
          error={errors[input.name]}
          disabled={loading}
        />
      ))}

      <GradientSubmitButton isLoading={loading}>
        <div className="flex items-center justify-center gap-0.5">
          Continue <FaCaretRight />
        </div>
      </GradientSubmitButton>

      <div className="flex items-center mt-3 w-full justify-center">
        <p className="text-xs lg:text-sm text-[#6b6b6b]">
          Don’t have an account?
        </p>
        <Link
          href="/register"
          className="text-xs lg:text-base p-2 font-bold bg-gradient-to-b from-[#2962eb] to-[#7b3aed] bg-clip-text text-transparent text-center"
        >
          Sign Up
        </Link>
      </div>
    </AuthFormWrapper>
  );
};

export default LoginForm;
