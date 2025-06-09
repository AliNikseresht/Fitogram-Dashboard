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
          <>
            <FaTint className="inline mr-1 text-blue-600" /> Daily Logs (Last 3)
          </>
        }
        logs={dailyLogs}
        bgColor="bg-blue-50"
        hoverColor="bg-blue-100"
        renderItem={(log) => (
          <>
            <div>
              <span className="font-semibold text-gray-700">Date:</span>{" "}
              {log.log_date}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Weight:</span>{" "}
              {log.weight} kg
            </div>
            <div>
              <span className="font-semibold text-gray-700">Water Intake:</span>{" "}
              {log.water_intake} glasses
            </div>
            <div>
              <span className="font-semibold text-gray-700">Mood:</span>{" "}
              {log.mood}
            </div>
          </>
        )}
      />

      <LogsCard
        title={
          <>
            <FaBed className="inline mr-1 text-purple-600" /> Sleep Logs (Last
            3)
          </>
        }
        logs={sleepLogs}
        bgColor="bg-purple-50"
        hoverColor="bg-purple-100"
        renderItem={(log) => (
          <>
            <div>
              <span className="font-semibold text-gray-700">Date:</span>{" "}
              {log.sleep_date}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Duration:</span>{" "}
              {log.duration} hours
            </div>
            <div>
              <span className="font-semibold text-gray-700">Sleep Time:</span>{" "}
              {log.sleep_time}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Wake Time:</span>{" "}
              {log.wake_time}
            </div>
          </>
        )}
      />
    </section>
  );
}
