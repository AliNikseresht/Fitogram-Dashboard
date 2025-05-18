import { LoginFormData } from "@/schemas/loginSchema";


export type LoginInputFieldConfig = {
  name: Extract<keyof LoginFormData, "email" | "password">;
  label: string;
  type: "email" | "password";
};
