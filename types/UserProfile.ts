export interface UserProfile {
  id: string;
  full_name: string;
  role: "user" | "coach";
  height: number | null;
  weight: number | null;
  goal: string | null;
  avatar_url?: string | null;
  coach?: { id: string; full_name: string } | null;
  body_fat_percent?: number | null;
  muscle_mass?: number | null;
  birth_date?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  workout_program_id?: string | null;
  nutrition_program_id?: string | null;
  status?: string | null;
  last_login?: string | null;
  preferences?: Record<string, any> | null;
}
