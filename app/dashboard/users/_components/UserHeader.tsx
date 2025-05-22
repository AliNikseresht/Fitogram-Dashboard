import { Avatar } from "@/components/ui/Avatar";

interface UserHeaderProps {
  fullName: string;
  role: string;
  avatarUrl: string | null;
}

export const UserHeader = ({ fullName, role, avatarUrl }: UserHeaderProps) => (
  <div className="flex justify-between items-center">
    <div>
      <h3 className="lg:text-2xl font-bold">Dashboard</h3>
      <p className="text-xs lg:text-base text-gray-600">Monday, May 22, 2025</p>
    </div>
    <div className="flex items-center gap-2">
      <Avatar
        fullName={fullName}
        avatarUrl={avatarUrl}
        size={45}
        borderWidth={2}
      />
      <div className="flex flex-col justify-center">
        <h2 className="hidden lg:flex text-xl text-indigo-700">{fullName}</h2>
        <p className="hidden lg:flex text-xs text-gray-600">{role}</p>
      </div>
    </div>
  </div>
);
