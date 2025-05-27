import UserAccountInfo from "./UserAccountInfo";
import UserBodyInfo from "./UserBodyInfo";

export const UserHeader = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gradient-to-b from-[#2962eb] to-[#7b3aed] rounded-t-xl w-full p-4">
      <UserAccountInfo />
      <UserBodyInfo />
    </div>
  );
};
