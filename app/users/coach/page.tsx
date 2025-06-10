import supabase from "@/libs/supabaseClient";
import CoachSelectionClient from "./_components/CoachSelectionClient";

export const dynamic = "force-dynamic";

async function getCoaches() {
  const { data, error } = await supabase
    .from("coaches")
    .select("id, full_name, bio, specialization, avatar_url")
    .eq("is_available", true);

  if (error) throw new Error(error.message);

  return data;
}

export default async function CoachSelectionPage() {
  const coaches = await getCoaches();

  return <CoachSelectionClient initialCoaches={coaches} />;
}
