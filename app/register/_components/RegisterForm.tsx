"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import InputField from "@/components/ui/Forms/InputField";
import { inputFields } from "@/data/RegisterFormItemsData";
import { FormData, schema } from "@/schemas/registerSchema";

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

  const onSubmit = async (data: FormData) => {
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
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-black">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="font-bold text-3xl py-3 bg-gradient-to-b from-[#2962eb] to-[#7b3aed] bg-clip-text text-transparent text-center">
          Register
        </h2>

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

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium">Role</label>
          <select
            {...register("role")}
            className={`w-full border ${
              errors.role ? "border-red-500" : "border-gray-300"
            } rounded px-3 py-2`}
            disabled={isSubmitting}
          >
            <option value="user">User</option>
            <option value="coach">Coach</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-[#2962eb] to-[#7b3aed] text-white w-full rounded-full py-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>

        <div className="flex items-center gap-2 mt-3 justify-between text-sm">
          <p>If you have an account, please login.</p>
          <a
            href="/login"
            className="border px-4 py-1 rounded-full border-[#bababa]"
          >
            Log In
          </a>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
