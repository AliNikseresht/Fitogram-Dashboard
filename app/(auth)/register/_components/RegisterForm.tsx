"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import InputField from "@/components/ui/Forms/InputField";
import { inputFields } from "@/data/RegisterFormItemsData";
import { FormData, schema } from "@/schemas/registerSchema";
import Link from "next/link";
import GradientSubmitButton from "@/components/ui/buttons/GradientSubmitButton";
import AuthFormWrapper from "../../_components/AuthFormWrapper";

const RegisterForm = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  const onSubmit = handleSubmit(async (data: FormData) => {
    const { email, password, fullName, role } = data;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Registration successful! Check your email.");
      router.push("/verify-email");
    }
  });

  return (
    <AuthFormWrapper title="Sign Up to Fitogram Dashboard" onSubmit={onSubmit}>
      {inputFields.map((field) => (
        <InputField
          key={field.name}
          label={field.label}
          type={field.type}
          registration={register(field.name)}
          error={errors[field.name]}
          disabled={isSubmitting}
        />
      ))}

      {/* Role selection */}
      <div className="mb-6">
        <label className="block mb-1 text-xs lg:text-sm font-medium">
          Role
        </label>
        <select
          {...register("role")}
          className={`w-full border text-xs lg:text-sm ${
            errors.role ? "border-red-500" : "border-gray-300"
          } rounded px-3 py-2`}
          disabled={isSubmitting}
        >
          <option value="user" className="text-xs lg:text-sm">
            User
          </option>
          <option value="coach" className="text-xs lg:text-sm">
            Coach
          </option>
        </select>
        {errors.role && (
          <p className="text-red-500 text-xs lg:text-sm mt-1">
            {errors.role.message}
          </p>
        )}
      </div>

      <GradientSubmitButton isLoading={isSubmitting}>
        Register
      </GradientSubmitButton>

      <div className="flex items-center mt-3 w-full justify-center">
        <p className="text-xs lg:text-sm text-[#6b6b6b]">
          If you have an account, please login.
        </p>
        <Link
          href="/login"
          className="text-xs lg:text-base p-2 font-bold bg-gradient-to-b from-[#2962eb] to-[#7b3aed] bg-clip-text text-transparent text-center"
        >
          Log In
        </Link>
      </div>
    </AuthFormWrapper>
  );
};

export default RegisterForm;
