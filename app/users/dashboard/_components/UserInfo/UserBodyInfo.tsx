import { SupabaseProfile } from "@/types/UserProfile";
import StatCard from "./StatCard";

interface UserBodyInfoProps {
  profile: SupabaseProfile;
}

const UserBodyInfo = ({ profile }: UserBodyInfoProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
      <StatCard
        label="Weight"
        value={profile.weight ? `${profile.weight} kg` : "—"}
      />
      <StatCard
        label="Height"
        value={profile.height ? `${profile.height} cm` : "—"}
      />
      <StatCard
        label="Body Fat %"
        value={profile.body_fat_percent ? `${profile.body_fat_percent}%` : "—"}
      />
      <StatCard
        label="Muscle Mass"
        value={profile.muscle_mass ? `${profile.muscle_mass} kg` : "—"}
      />
    </div>
  );
};

export default UserBodyInfo;
