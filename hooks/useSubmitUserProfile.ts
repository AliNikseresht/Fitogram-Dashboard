import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type SubmitProfileProps = {
  formData: {
    height: string;
    weight: string;
    goal: string;
    body_fat_percent: string;
    muscle_mass: string;
    birth_date: string;
    language: string;
  };
  avatar: File;
};

export default function useSubmitUserProfile() {
  const supabase = createClientComponentClient();

  return async function submitProfile({
    formData,
    avatar,
  }: SubmitProfileProps): Promise<{ success: boolean; message: string }> {
    try {
      const {
        data: { user },
        error: sessionError,
      } = await supabase.auth.getUser();

      if (sessionError || !user) {
        return { success: false, message: "User not authenticated." };
      }

      const fileExt = avatar.name.split(".").pop();
      const fileName = `${user.id}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatar, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError || !uploadData?.path) {
        return { success: false, message: "Failed to upload avatar." };
      }

      const filePath = uploadData.path;

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        height: formData.height,
        weight: formData.weight,
        goal: formData.goal,
        avatar_url: filePath,
        body_fat_percent: formData.body_fat_percent || null,
        muscle_mass: formData.muscle_mass || null,
        birth_date: formData.birth_date || null,
        preferences: { language: formData.language },
        coach_id: null,
        nutrition_program_id: null,
        workout_program_id: null,
        last_login: new Date().toISOString(),
      });

      if (profileError) {
        return { success: false, message: "Failed to save profile." };
      }

      return { success: true, message: "Profile updated!" };
    } catch (error) {
      return { success: false, message: "Unexpected error occurred." };
    }
  };
}
