interface StatsCardProps {
  label: string;
  value: string | number | null;
  unit?: string;
}

export const StatsCard = ({ label, value, unit }: StatsCardProps) => (
  <div className="bg-indigo-50 p-4 rounded-lg shadow-sm">
    <p className="text-indigo-700 font-bold text-2xl">
      {value ?? "Not set"} {unit && <span className="text-lg">{unit}</span>}
    </p>
    <p className="text-indigo-400 text-sm mt-1">{label}</p>
  </div>
);
