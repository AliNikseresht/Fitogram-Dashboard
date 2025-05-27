export type Mood = "happy" | "neutral" | "sad";

export interface DailyLog {
  id?: number;
  profile_id: number;
  weight: number;
  water_intake: number;
  mood: string;
  notes?: string;
  created_at: string;
  log_date: string;
}

export interface FormValues {
  weight: number;
  notes?: string;
}
