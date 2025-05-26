"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import Link from "next/link";
import LoadingSkeleton from "@/components/ui/loadings/CustomLoadingSkeleton";
import { UserHeader } from "./UserHeader";
import { UserGoalProgress } from "./UserGoalProgress";
import { UserReminders } from "./UserReminders";
import { UserSummaryCards } from "./UserSummaryCards";
import Image from "next/image";

interface QuickLink {
  label: string;
  href: string;
  bgColor: string;
  textColor: string;
}

export default function DashboardPage() {
  const { profile, loading, error, avatarUrl } = useUserProfile();

  if (loading) return <LoadingSkeleton />;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!profile)
    return <div className="text-red-500">No profile data found.</div>;

  const role = profile?.role ?? "user";

  const birthDate = profile.birth_date ? new Date(profile.birth_date) : null;
  const age = birthDate
    ? Math.floor(
        (Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      )
    : null;

  const quickLinks: QuickLink[] = [
    {
      label: "Workouts",
      href: `/${role}s/workouts`,
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
    },
    {
      label: "Nutrition",
      href: `/${role}s/nutrition`,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
    },
    {
      label: "Progress",
      href: `/${role}s/progress`,
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
    },
    {
      label: "AI Assistant",
      href: `/${role}s/ai-assistant`,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
  ];

  return (
    <div className="flex flex-col p-3 lg:p-6 gap-6 w-full">
      {/* User Info */}
      <UserHeader />

      {/* Physical Stats */}

      <div className="flex justify-between items-center gap-2 bg-gradient-to-b from-[#2962eb] to-[#7b3aed] rounded-t-xl w-full p-3 lg:p-5">
        <div className="flex items-center gap-3">
          {avatarUrl && (
            <Image
              src={avatarUrl}
              alt="user avatar"
              width={60}
              height={60}
              className="rounded-full border-4 border-[#fff] shadow-lg"
            />
          )}
          <div className="flex flex-col justify-center">
            <h2 className="hidden lg:flex text-2xl text-[#fff]">
              {profile.full_name}
            </h2>

            <p className="text-sm text-[#fff]">Age: {age ?? "Not specified"}</p>
            <p className="text-sm text-[#fff]">
              Goal: {profile.goal ?? "Not specified"}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between w-full max-w-xl gap-3">
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
      </div>

      <UserGoalProgress progressPercent={70} />
      <UserSummaryCards />

      {/* Program Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <UserReminders />
        <ProgramCard
          label="Workout Program"
          id={profile.workout_program_id}
          fallbackText={profile.coach ? "Personalized (with coach)" : "General"}
          href={`/programs/workout/${profile.workout_program_id ?? ""}`}
        />
        <ProgramCard
          label="Nutrition Program"
          id={profile.nutrition_program_id}
          fallbackText="Not assigned"
          href={`/programs/nutrition/${profile.nutrition_program_id ?? ""}`}
        />
      </div>

      {/* Status & Last Login */}
      <div className="bg-white p-4 rounded-xl border flex justify-between w-full">
        <div className="bg-white p-4 rounded-xl w-full max-w-lg">
          <p className="text-gray-600 mb-1">Coach:</p>
          <p className="font-medium">
            {profile.coach
              ? profile.coach.full_name
              : profile.status === "pending_coach_request"
              ? "Coach request is pending"
              : "No coach assigned"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <p className="text-gray-600">Status:</p>
            <p className="font-medium capitalize">
              {profile.status ?? "unknown"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Last Login:</p>
            <p className="font-medium">
              {profile.last_login
                ? new Date(profile.last_login).toLocaleString()
                : "Never logged in"}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickLinks.map(({ label, href, bgColor, textColor }) => (
          <Link
            key={label}
            href={href}
            className={`${bgColor} ${textColor} rounded-xl p-4 text-center`}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-100 rounded-xl p-4 text-center w-44">
      <p className="text-gray-600">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function ProgramCard({
  label,
  id,
  fallbackText,
  href,
}: {
  label: string;
  id: string | null | undefined;
  fallbackText: string;
  href: string;
}) {
  if (!id) {
    return (
      <div className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 rounded-xl p-4 text-center">
        <p className="text-[#fff]">{label}</p>
        <p className="text-lg font-bold text-[#fff]">{fallbackText}</p>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="bg-blue-50 hover:bg-blue-100 rounded-xl p-4 block text-center text-blue-700 font-semibold"
    >
      <p>{label}</p>
      <p className="text-lg font-bold underline">View Program</p>
    </Link>
  );
}
