type BaseLog = {
  id: string | number;
  log_date: string;
};

export type MoodType = "happy" | "neutral" | "sad";

export type MoodLog = BaseLog & {
  mood: MoodType;
};

export type WaterLog = BaseLog & {
  water_intake: number;
};

export type WeightLog = BaseLog & {
  weight: number;
};
