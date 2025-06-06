"use client";

import AppLogo from "@/components/ui/AppLogo";
import SidebarMenu from "./SidebarMenu";
import { useUserProfile } from "@/hooks/useUserProfile";

interface DesktopSidebarProps {
  pathname: string;
  onCloseMobile: () => void;
}

const DesktopSidebar = ({ pathname, onCloseMobile }: DesktopSidebarProps) => {
  const { data: profile, isLoading } = useUserProfile();

  if (isLoading || !profile) return null;

  return (
    <div className="hidden lg:flex flex-col h-full items-start p-5 bg-[#fff] shadow-inner w-full">
      <AppLogo />
      <aside className="w-full">
        <SidebarMenu
          pathname={pathname}
          role={profile.role}
          onLinkClick={onCloseMobile}
        />
      </aside>
    </div>
  );
};

export default DesktopSidebar;
