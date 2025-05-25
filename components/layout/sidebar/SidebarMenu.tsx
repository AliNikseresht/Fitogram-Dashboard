"use client";

import Link from "next/link";
import clsx from "clsx";
import { menuItems } from "@/data/SidebarMenuItemsData";
import LogoutButton from "@/components/ui/buttons/LogoutButton";

interface SidebarMenuProps {
  pathname: string;
  onLinkClick: () => void;
}

const SidebarMenu = ({ pathname, onLinkClick }: SidebarMenuProps) => (
  <div className="flex flex-col justify-between gap-5 h-full items-start w-full">
    <div className="flex flex-col mt-3 gap-1 w-full">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={clsx(
              "flex items-center gap-3 p-2 rounded-lg text-sm transition hover:bg-blue-100",
              isActive
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700"
            )}
            onClick={onLinkClick}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </div>

    <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-4 rounded-md mt-4 text-sm w-full">
      <p className="font-medium text-gray-800 mb-1">Need help?</p>
      <p className="text-gray-600">Contact your personal coach anytime</p>
      <button className="mt-3 w-full px-4 py-2 bg-white text-sm font-medium text-blue-600 rounded-md border border-blue-300 hover:bg-blue-50">
        Contact Support
      </button>
    </div>

    <LogoutButton />
  </div>
);

export default SidebarMenu;
