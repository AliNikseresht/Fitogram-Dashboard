export default function SleepTableSkeleton() {
  return (
    <div className="overflow-x-auto border border-[#bababa] rounded shadow h-52">
      <table className="w-full min-w-[500px] animate-pulse">
        <thead className="bg-gray-200">
          <tr>
            {[
              "Date",
              "Sleep Time",
              "Wake Time",
              "Duration (hrs)",
              "Quality",
            ].map((title) => (
              <th key={title} className="p-2 text-xs sm:text-sm">
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-[#bababa]">
              {Array.from({ length: 5 }).map((_, j) => (
                <td key={j} className="p-2">
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
