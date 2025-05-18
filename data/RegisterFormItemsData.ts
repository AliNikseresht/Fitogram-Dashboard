import { InputFieldConfig } from "@/types/RegisterFormItemsDataTypes";

export const inputFields: readonly InputFieldConfig[] = [
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
  },
] as const;
