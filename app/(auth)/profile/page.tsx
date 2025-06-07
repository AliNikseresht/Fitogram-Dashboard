import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CoachProfileForm from "./_components/CoachProfileForm";
import UserProfileForm from "./_components/UserProfileForm";

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "user";

  return (
    <div className="min-h-screen flex items-center justify-center px-3 w-full h-full">
      {role === "coach" ? <CoachProfileForm /> : <UserProfileForm />}
    </div>
  );
}
