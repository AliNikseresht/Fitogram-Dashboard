import { StatsCard } from "./StatsCard";

interface UserStatsProps {
  height: number | null;
  weight: number | null;
  goal: string | null;
}

export const UserStats = ({ height, weight, goal }: UserStatsProps) => (
  <div className="w-full grid grid-cols-3 gap-4 text-center mt-4 lg:mt-0">
    <StatsCard label="Height (cm)" value={height} />
    <StatsCard label="Weight (kg)" value={weight} />
    <StatsCard label="Goal" value={goal} />
  </div>
);
