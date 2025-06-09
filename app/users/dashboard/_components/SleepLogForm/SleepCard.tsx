"use client";

import React, { useState, useMemo } from "react";
import useSleepLogs from "@/hooks/useSleepLogs";
import { SleepLog } from "@/types/SleepTableTypes";
import { SleepTable } from "./SleepTable";
import SleepTableSkeleton from "@/components/ui/loadings/SleepTableSkeleton";

type Props = {
  userId: string;
};

const SleepCard: React.FC<Props> = ({ userId }) => {
  const orderBy = useMemo(
    () => ({ column: "sleep_date", ascending: false }),
    []
  );
  const [filterDays, setFilterDays] = useState(7);
  const { data: logs, error, isLoading } = useSleepLogs(userId);

  if (error)
    return (
      <p className="text-red-600 font-semibold">{(error as Error).message}</p>
    );

  if (isLoading || !logs) return <SleepTableSkeleton />;

  if (logs.length === 0) {
    return (
      <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md text-sm">
        No data has been recorded yet. Please submit your first entry to see
        progress.
      </div>
    );
  }

  const sortedLogs = [...logs].sort((a, b) => {
    if (!orderBy.ascending)
      return a[orderBy.column] < b[orderBy.column] ? 1 : -1;
    return a[orderBy.column] > b[orderBy.column] ? 1 : -1;
  });

  const filteredLogs = sortedLogs.slice(0, filterDays);

  const averageDuration =
    filteredLogs.reduce((acc, cur) => acc + cur.duration, 0) /
    (filteredLogs.length || 1);

  const bestDay = filteredLogs.reduce(
    (best, cur) => (cur.quality > best.quality ? cur : best),
    filteredLogs[0] || ({} as SleepLog)
  );

  const worstDay = filteredLogs.reduce(
    (worst, cur) => (cur.quality < worst.quality ? cur : worst),
    filteredLogs[0] || ({} as SleepLog)
  );

  return (
    <div className="w-full mx-auto space-y-6">
      <>
        <label
          htmlFor="daysFilter"
          className="mr-2 font-semibold text-sm md:text-sm"
        >
          Show last:
        </label>
        <select
          id="daysFilter"
          value={filterDays}
          onChange={(e) => setFilterDays(Number(e.target.value))}
          className="border border-[#bababa] rounded p-1 text-sm md:text-sm"
        >
          <option value={7}>7 days</option>
          <option value={14}>14 days</option>
          <option value={30}>30 days</option>
          <option value={logs.length}>All</option>
        </select>
      </>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 w-full p-4 rounded shadow text-center flex flex-col items-center justify-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Average Sleep Duration
          </p>
          <p className="text-lg sm:text-xl font-bold">
            {averageDuration.toFixed(2)} hrs
          </p>
        </div>
        <div className="bg-green-100 w-full p-4 rounded shadow text-center flex flex-col items-center justify-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Best Sleep Quality Day
          </p>
          <p className="text-base sm:text-lg font-semibold">
            {bestDay?.sleep_date || "-"}
          </p>
          <p>Quality: {bestDay?.quality || "-"}</p>
        </div>
        <div className="bg-red-100 w-full p-4 rounded shadow text-center flex flex-col items-center justify-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Worst Sleep Quality Day
          </p>
          <p className="text-base sm:text-lg font-semibold">
            {worstDay?.sleep_date || "-"}
          </p>
          <p>Quality: {worstDay?.quality || "-"}</p>
        </div>
      </div>

      <div className="overflow-x-auto border border-[#bababa] rounded shadow overflow-y-auto h-52">
        <SleepTable logs={filteredLogs} />
      </div>
    </div>
  );
};

export default SleepCard;
