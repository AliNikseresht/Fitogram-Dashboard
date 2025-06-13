"use client";

import { LogsCardProps } from "@/types/LogsSectionNutrition";

export default function LogsCard<T>({
  title,
  logs,
  bgColor = "bg-white",
  hoverColor = "",
  renderItem,
}: LogsCardProps<T>) {
  return (
    <div
      className={`${bgColor} p-4 rounded-xl shadow hover:${hoverColor} transition`}
    >
      <h3 className="text-lg font-semibold inline mr-1 text-[#0369a1]">
        {title}
      </h3>
      <div className="space-y-3 max-h-[300px] overflow-auto">
        {logs.length === 0 ? (
          <div className="text-gray-400">No logs available</div>
        ) : (
          logs.map((log, idx) => (
            <div
              key={idx}
              className="border-b border-gray-200 pb-2 last:border-none"
            >
              {renderItem(log)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
