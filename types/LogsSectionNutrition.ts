interface DailyLog {
  log_date: string;
  weight: number;
  water_intake: number;
  mood: string;
}

interface SleepLog {
  sleep_date: string;
  duration: number;
  sleep_time: string;
  wake_time: string;
}

export interface LogsSectionProps {
  dailyLogs: DailyLog[];
  sleepLogs: SleepLog[];
}
