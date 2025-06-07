export type FieldConfig = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
};

export type ProfileFormProps = {
  title: string;
  redirectPath: string;
  fields: FieldConfig[];
  table: string;
  staticValues?: Record<string, string | number | boolean | null>;
  showAvatarPreview?: boolean;
};

export type UserProfileFormValues = {
  full_name: string;
  bio: string;
  specialization: string;
  avatar_url: string;
  height: string;
  weight: string;
  goal: string;
  body_fat_percent: string;
  muscle_mass: string;
  birth_date: string;
};