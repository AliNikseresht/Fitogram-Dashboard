"use client";

import ProfileForm from "./ProfileForm";

const UserProfileForm = () => {
  return (
    <ProfileForm
      title="Complete your profile"
      redirectPath="/users/dashboard"
      table="profiles"
      staticValues={{
        coach_id: null,
        nutrition_program_id: null,
        workout_program_id: null,
        last_login: new Date().toISOString(),
      }}
      fields={[
        {
          name: "height",
          label: "Height (cm)",
          type: "number",
          required: true,
        },
        {
          name: "weight",
          label: "Weight (kg)",
          type: "number",
          required: true,
        },
        { name: "body_fat_percent", label: "Body Fat (%)", type: "number" },
        { name: "muscle_mass", label: "Muscle Mass (kg)", type: "number" },
        { name: "birth_date", label: "Birth Date", type: "date" },
        { name: "goal", label: "Goal", required: true },
      ]}
    />
  );
};

export default UserProfileForm;
