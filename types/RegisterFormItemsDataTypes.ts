import { FormData } from "@/schemas/registerSchema";

export type InputFieldConfig = {
  name: Extract<keyof FormData, "fullName" | "email" | "password">;
  label: string;
  type: "text" | "email" | "password";
};
