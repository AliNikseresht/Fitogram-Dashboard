import ProfileForm from "./ProfileForm";

const CoachProfileForm = () => {
  return (
    <ProfileForm
      title="Coach Profile"
      redirectPath="/users/dashboard"
      table="coaches"
      showAvatarPreview={true}
      fields={[
        { name: "full_name", label: "Full Name", required: true },
        { name: "specialization", label: "Specialization", required: true },
        { name: "bio", label: "Bio", textarea: true },
      ]}
    />
  );
};

export default CoachProfileForm;
