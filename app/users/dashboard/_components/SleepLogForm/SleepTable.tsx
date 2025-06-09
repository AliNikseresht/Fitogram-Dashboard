import { SleepLog } from "@/types/SleepTableTypes";

type Props = {
  logs: SleepLog[];
};

export const SleepTable: React.FC<Props> = ({ logs }) => {
  return (
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
        {logs.map((log, index) => (
          <tr
            key={log.id ?? index}
            className="border-b border-[#bababa] hover:bg-gray-100"
          >
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
  );
};
