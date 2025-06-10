"use client";

import AppLogo from "@/components/ui/AppLogo";
import SidebarMenu from "./SidebarMenu";
import { useUserProfile } from "@/hooks/useUserProfile";
import Link from "next/link";
import LogoutButton from "@/components/ui/buttons/LogoutButton";

interface DesktopSidebarProps {
  pathname: string;
  onCloseMobile: () => void;
}

const DesktopSidebar = ({ pathname, onCloseMobile }: DesktopSidebarProps) => {
  const { data: profile, isLoading } = useUserProfile();

  if (isLoading || !profile) return null;

  return (
    <div className="hidden lg:flex flex-col h-full items-start p-5 bg-[#fff] shadow-inner w-full justify-between">
      <div className="w-full">
        <AppLogo />
        <aside className="w-full">
          <SidebarMenu
            pathname={pathname}
            role={profile.role}
            onLinkClick={onCloseMobile}
          />
        </aside>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <div className="bg-gradient-to-br from-[#f9e8ff] to-[#e1f1fe] p-4 rounded-md shadow-md mt-4 text-sm w-full">
          <p className="font-medium text-gray-800 mb-1">Need help?</p>
          <p className="text-gray-600">Contact our support team anytime</p>
          <Link
            href="/support"
            className="mt-3 cursor-pointer w-full block text-center px-4 py-2 bg-white hover:shadow text-sm font-medium text-blue-600 rounded-md border border-blue-300 hover:bg-blue-50 duration-200"
          >
            Contact Support
          </Link>
        </div>

        <LogoutButton />
      </div>
    </div>
  );
};

export default DesktopSidebar;
