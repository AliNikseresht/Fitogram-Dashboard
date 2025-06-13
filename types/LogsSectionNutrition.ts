import { ReactNode } from "react";

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

export interface LogsCardProps<T> {
  title: ReactNode;
  logs: T[];
  bgColor?: string;
  hoverColor?: string;
  renderItem: (log: T) => ReactNode;
}
