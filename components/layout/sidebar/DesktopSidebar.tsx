"use client";

import AppLogo from "@/components/ui/AppLogo";
import SidebarMenu from "./SidebarMenu";

interface DesktopSidebarProps {
  pathname: string;
  onCloseMobile: () => void;
}

const DesktopSidebar = ({ pathname, onCloseMobile }: DesktopSidebarProps) => (
  <div className="hidden lg:flex flex-col h-full items-start p-5 bg-[#fff] shadow-inner w-full">
    <AppLogo />
    <aside className="w-full">
      <SidebarMenu pathname={pathname} onLinkClick={onCloseMobile} />
    </aside>
  </div>
);

export default DesktopSidebar;
