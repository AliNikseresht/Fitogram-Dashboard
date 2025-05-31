export type SleepLog = {
  id: number;
  user_id: string;
  sleep_date: string;
  sleep_time: string;
  wake_time: string;
  duration: number;
  quality: number;
};

export type SleepFormValues = {
  sleepHour: string;
  sleepMinute: string;
  wakeHour: string;
  wakeMinute: string;
  quality: number;
};
