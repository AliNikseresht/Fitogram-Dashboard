import { useUserProfile } from "@/hooks/useUserProfile";
import React from "react";
import StatCard from "./StatCard";
import CustomLoadingSpinner from "@/components/ui/loadings/CustomLoadingSpinner";

const UserBodyInfo = () => {
  const { profile, error, loading } = useUserProfile();

  if (loading) return <CustomLoadingSpinner />;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!profile)
    return <div className="text-red-500">No profile data found.</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
      <StatCard
        label="Weight"
        value={profile.weight ? `${profile.weight} kg` : "N/A"}
      />
      <StatCard
        label="Height"
        value={profile.height ? `${profile.height} cm` : "N/A"}
      />
      <StatCard
        label="Body Fat %"
        value={
          profile.body_fat_percent ? `${profile.body_fat_percent}%` : "N/A"
        }
      />
      <StatCard
        label="Muscle Mass"
        value={profile.muscle_mass ? `${profile.muscle_mass} kg` : "N/A"}
      />
    </div>
  );
};

export default UserBodyInfo;
