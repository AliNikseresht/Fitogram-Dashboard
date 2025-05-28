"use client";

import fetchSleepLogs from "@/services/fetchSleepLogs";
import React, { useEffect, useState } from "react";

type SleepLog = {
  sleep_date: string;
  sleep_time: string;
  wake_time: string;
  duration: number;
  quality: number;
};

type Props = {
  userId: string;
};

const SleepCard: React.FC<Props> = ({ userId }) => {
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<SleepLog[]>([]);
  const [filterDays, setFilterDays] = useState(7);

  useEffect(() => {
    fetchSleepLogs(userId).then((data) => {
      setLogs(data);
      setFilteredLogs(data.slice(-filterDays));
    });
  }, [userId, filterDays]);

  const averageDuration =
    filteredLogs.reduce((acc, cur) => acc + cur.duration, 0) /
    (filteredLogs.length || 1);

  const bestDay = filteredLogs.reduce(
    (best, cur) => (cur.quality > best.quality ? cur : best),
    filteredLogs[0] || null
  );

  const worstDay = filteredLogs.reduce(
    (worst, cur) => (cur.quality < worst.quality ? cur : worst),
    filteredLogs[0] || null
  );

  return (
    <div className="p-2 w-full lg:max-w-4xl mx-auto space-y-6">
      <div>
        <label
          htmlFor="daysFilter"
          className="mr-2 font-semibold text-sm md:text-base"
        >
          Show last
        </label>
        <select
          id="daysFilter"
          value={filterDays}
          onChange={(e) => setFilterDays(Number(e.target.value))}
          className="border rounded p-1 text-sm md:text-base"
        >
          <option value={7}>7 days</option>
          <option value={14}>14 days</option>
          <option value={30}>30 days</option>
          <option value={logs.length}>All</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Average Sleep Duration
          </p>
          <p className="text-lg sm:text-xl font-bold">
            {averageDuration.toFixed(2)} hrs
          </p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Best Sleep Quality Day
          </p>
          <p className="text-base sm:text-lg font-semibold">
            {bestDay?.sleep_date || "-"}
          </p>
          <p>Quality: {bestDay?.quality || "-"}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Worst Sleep Quality Day
          </p>
          <p className="text-base sm:text-lg font-semibold">
            {worstDay?.sleep_date || "-"}
          </p>
          <p>Quality: {worstDay?.quality || "-"}</p>
        </div>
      </div>

      <div className="overflow-x-auto border rounded shadow">
        <table className="w-full text-left min-w-[500px]">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-xs sm:text-sm">Date</th>
              <th className="p-2 text-xs sm:text-sm">Sleep Time</th>
              <th className="p-2 text-xs sm:text-sm">Wake Time</th>
              <th className="p-2 text-xs sm:text-sm">Duration (hrs)</th>
              <th className="p-2 text-xs sm:text-sm">Quality</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.sleep_date} className="border-b hover:bg-gray-100">
                <td className="p-2 text-xs sm:text-sm">
                  {new Date(log.sleep_date).toLocaleDateString()}
                </td>
                <td className="p-2 text-xs sm:text-sm">{log.sleep_time}</td>
                <td className="p-2 text-xs sm:text-sm">{log.wake_time}</td>
                <td className="p-2 text-xs sm:text-sm">
                  {log.duration.toFixed(2)}
                </td>
                <td className="p-2 text-xs sm:text-sm">{log.quality}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SleepCard;
