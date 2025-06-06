import { FaFire } from "react-icons/fa6";
import { IoFootstepsSharp } from "react-icons/io5";
import { FaHeartPulse } from "react-icons/fa6";
import { GiNightSleep } from "react-icons/gi";

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconColor: string;
}

const SummaryCard = ({ icon, label, value, iconColor }: SummaryCardProps) => (
  <div
    aria-label={`${label}: ${value}`}
    className="bg-[#f3f8fd] p-4 rounded-lg shadow-sm flex flex-col items-center justify-center"
  >
    <p style={{ color: iconColor }}>{icon}</p>
    <p className="text-gray-600 text-xs lg:text-sm mt-1">{label}</p>
    <p className="text-[#212121]  font-bold lg:text-2xl">{value}</p>
  </div>
);

export const UserSummaryCards = ({ sleep }: { sleep: string | null }) => {
  return (
    <div className="rounded-b-2xl w-full p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 ">
      <SummaryCard
        icon={<FaFire size={22} />}
        iconColor="#f97316"
        label="Calories Burned"
        value="1,842"
      />
      <SummaryCard
        icon={<IoFootstepsSharp size={22} />}
        iconColor="#3b82f6"
        label="Steps"
        value="8,946"
      />
      <SummaryCard
        icon={<FaHeartPulse size={22} />}
        iconColor="#ef4444"
        label="Avg, Heart Rate"
        value="72bpm"
      />
      <SummaryCard
        icon={<GiNightSleep size={22} />}
        iconColor="#6366f1"
        label="Sleep"
        value={sleep ?? "N/A"}
      />
    </div>
  );
};
