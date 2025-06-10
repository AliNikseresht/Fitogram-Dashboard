import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import WorkoutList from "./_components/WorkoutList";
import WorkoutForm from "./_components/WorkoutForm";
import WorkoutChart from "./_components/WorkoutChart";

export default async function WorkoutsPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-4 text-red-600">User not authenticated</div>;
  }

  const { data: workouts, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading workouts: {error.message}
      </div>
    );
  }

  return (
    <section className="p-4 w-full space-y-6">
      <h2 className="text-2xl font-bold mb-4">Your Workouts</h2>
      <p className="text-sm text-gray-600">
        Track your fitness activities by adding workouts below. You can add,
        edit, or delete workouts and see your progress on the chart.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <WorkoutForm userId={user.id} />
        <WorkoutList workouts={workouts || []} />
      </div>

      <WorkoutChart workouts={workouts || []} />
    </section>
  );
}
