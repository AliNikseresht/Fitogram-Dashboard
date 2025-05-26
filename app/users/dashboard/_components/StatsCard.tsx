interface StatsCardProps {
  label: string;
  value: string | number | null;
}

export const StatsCard = ({ label, value }: StatsCardProps) => (
  <div className="text-center">
    <p className="text-xs lg:text-base text-gray-300">{label}</p>
    <p className="text-sm lg:text-base text-[#fff] font-bold">{value ?? "-"}</p>
  </div>
);
