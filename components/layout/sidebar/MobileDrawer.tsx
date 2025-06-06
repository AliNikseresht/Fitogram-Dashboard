"use client";

import { IoClose } from "react-icons/io5";
import clsx from "clsx";

import SidebarMenu from "./SidebarMenu";
import AppLogo from "@/components/ui/AppLogo";
import { useUserProfile } from "@/hooks/useUserProfile";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}

const MobileDrawer = ({ isOpen, onClose, pathname }: MobileDrawerProps) => {
  const { data: profile, isLoading } = useUserProfile();
  if (isLoading || !profile) return null;

  return (
    <div
      className={clsx(
        "lg:hidden fixed inset-0 z-50",
        !isOpen && "pointer-events-none"
      )}
    >
      {/* Overlay */}
      <div
        className={clsx(
          "fixed inset-0 bg-[#0000002e] transition-opacity duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className={clsx(
          "fixed top-0 left-0 w-64 h-full bg-[#fff] shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between w-full p-3.5">
          <AppLogo />
          <button onClick={onClose} className="text-2xl text-gray-700">
            <IoClose />
          </button>
        </div>
        <div className="px-4">
          <SidebarMenu
            pathname={pathname}
            onLinkClick={onClose}
            role={profile.role}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
