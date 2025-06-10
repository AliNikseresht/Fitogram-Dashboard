"use client";

import { FaTint, FaBed } from "react-icons/fa";
import LogsCard from "./LogsCard";

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

interface LogsSectionProps {
  dailyLogs: DailyLog[];
  sleepLogs: SleepLog[];
}

export default function LogsSection({
  dailyLogs,
  sleepLogs,
}: LogsSectionProps) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <LogsCard
        title={
          <div className="h-2">
            <FaTint className="inline mr-1 text-blue-600" /> Daily Logs (Last 3)
          </div>
        }
        logs={dailyLogs}
        bgColor="bg-white"
        hoverColor=""
        renderItem={(log) => (
          <>
            <div>
              <span className="font-semibold text-gray-700 text-xs lg:text-sm">Date:</span>{" "}
              {log.log_date}
            </div>
            <div>
              <span className="font-semibold text-gray-700 text-xs lg:text-sm">Weight:</span>{" "}
              {log.weight} kg
            </div>
            <div>
              <span className="font-semibold text-gray-700 text-xs lg:text-sm">Water Intake:</span>{" "}
              {log.water_intake} glasses
            </div>
            <div>
              <span className="font-semibold text-gray-700 text-xs lg:text-sm">Mood:</span>{" "}
              {log.mood}
            </div>
          </>
        )}
      />

      <LogsCard
        title={
          <div className="h-2">
            <FaBed className="inline mr-1 text-purple-600" /> Sleep Logs (Last
            3)
          </div>
        }
        logs={sleepLogs}
        bgColor="bg-white"
        hoverColor=""
        renderItem={(log) => (
          <>
            <div>
              <span className="font-semibold text-gray-700 text-xs lg:text-sm">Date:</span>{" "}
              {log.sleep_date}
            </div>
            <div>
              <span className="font-semibold text-gray-700 text-xs lg:text-sm">Duration:</span>{" "}
              {log.duration} hours
            </div>
            <div>
              <span className="font-semibold text-gray-700 text-xs lg:text-sm">Sleep Time:</span>{" "}
              {log.sleep_time}
            </div>
            <div>
              <span className="font-semibold text-gray-700 text-xs lg:text-sm">Wake Time:</span>{" "}
              {log.wake_time}
            </div>
          </>
        )}
      />
    </section>
  );
}
