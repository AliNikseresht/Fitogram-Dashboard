import { SupabaseProfile } from "@/types/UserProfile";
import Image from "next/image";

interface UserAccountInfoProps {
  profile: SupabaseProfile;
  avatarUrl?: string | null;
}

const UserAccountInfo = ({ profile, avatarUrl }: UserAccountInfoProps) => {
  const birthDate = profile.birth_date ? new Date(profile.birth_date) : null;
  const age = birthDate
    ? Math.floor(
        (Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      )
    : null;

  return (
    <div className="flex flex-col lg:flex-row gap-3">
      {avatarUrl && (
        <Image
          src={avatarUrl}
          alt="user avatar"
          width={100}
          height={100}
          className="rounded-xl border-4 border-white shadow-lg"
        />
      )}
      <div className="flex justify-between flex-col">
        <h2 className="lg:text-2xl text-white font-semibold">
          hey {profile.full_name}!
        </h2>
        <p className="text-sm text-white">Age: {age ?? "Not specified"}</p>
        <p className="text-sm text-white">
          Goal: {profile.goal ?? "Not specified"}
        </p>
        <div className="flex items-center gap-1 text-white">
          <p className="text-sm">Status:</p>
          <p className="text-xs">{profile.status ?? "unknown"}</p>
        </div>
        <div className="flex items-center gap-1 text-white">
          <p className="text-sm">Last Login:</p>
          <p className="text-xs">
            {profile.last_login
              ? new Date(profile.last_login).toLocaleString()
              : "Never logged in"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserAccountInfo;
