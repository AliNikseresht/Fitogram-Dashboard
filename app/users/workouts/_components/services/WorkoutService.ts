import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Workout = {
  id: string;
  user_id: string;
  title: string;
  date: string;
  duration_minutes: number;
  calories_burned: number;
  notes?: string | null;
  created_at: string;
};

export async function fetchWorkouts(userId: string): Promise<Workout[]> {
  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addWorkout(workout: Omit<Workout, "id" | "created_at">) {
  const { data, error } = await supabase.from("workouts").insert([workout]);
  if (error) throw error;
  return data?.[0];
}

export async function deleteWorkout(workoutId: string) {
  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("id", workoutId);
  if (error) throw error;
}

export async function updateWorkout(
  workoutId: string,
  workout: Partial<Omit<Workout, "id" | "user_id" | "created_at">>
) {
  const { data, error } = await supabase
    .from("workouts")
    .update(workout)
    .eq("id", workoutId);

  if (error) throw error;
  return data?.[0];
}
