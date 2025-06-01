"use client";

import Link from "next/link";
import clsx from "clsx";
import { menuItems } from "@/data/SidebarMenuItemsData";
import LogoutButton from "@/components/ui/buttons/LogoutButton";

interface SidebarMenuProps {
  pathname: string;
  onLinkClick: () => void;
  role: string;
}

const SidebarMenu = ({ pathname, onLinkClick, role }: SidebarMenuProps) => (
  <div className="flex flex-col justify-between gap-5 h-full items-start w-full">
    <div className="flex flex-col mt-3 gap-1 w-full">
      {menuItems.map((item) => {
        const suffix = role === "coach" ? "es" : "s";
        const fullHref = `/${role}${suffix}${item.href}`;
        const isActive = pathname === fullHref || pathname.startsWith(fullHref);

        return (
          <Link
            key={item.label}
            href={fullHref}
            className={clsx(
              "flex items-center gap-3 p-2 rounded-lg text-sm transition hover:bg-[#e1f1fe]",
              isActive
                ? "bg-blue-100 text-[#0369a1] font-semibold"
                : "text-[#4b5563]"
            )}
            onClick={onLinkClick}
          >
            <span
              className={clsx(
                "text-lg text-[#4b5563] transition",
                isActive
                  ? "bg-blue-100 text-[#0369a1] font-semibold"
                  : "text-[#4b5563]"
              )}
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </div>

    <div className="bg-gradient-to-br from-[#f9e8ff] to-[#e1f1fe] p-4 rounded-md mt-4 text-sm w-full">
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
