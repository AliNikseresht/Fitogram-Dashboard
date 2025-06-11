"use client";

import Link from "next/link";
import clsx from "clsx";
import { userMenuItems, coachMenuItems } from "@/data/SidebarMenuItemsData";

interface SidebarMenuProps {
  pathname: string;
  onLinkClick: () => void;
  role: string;
}

const SidebarMenu = ({ pathname, onLinkClick, role }: SidebarMenuProps) => {
  const menuItems = role === "coach" ? coachMenuItems : userMenuItems;

  return (
    <div className="flex flex-col justify-between gap-5 h-full items-start w-full">
      <div className="flex flex-col mt-3 gap-1 w-full">
        {menuItems.map((item) => {
          const suffix = role === "coach" ? "es" : "s";
          const fullHref = `/${role}${suffix}${item.href}`;
          const isActive =
            pathname === fullHref || pathname.startsWith(fullHref);

          return (
            <Link
              key={item.label}
              href={fullHref}
              className={clsx(
                "flex items-center gap-3 p-2 rounded-lg text-sm transition hover:bg-gradient-to-br from-[#f9e8ffb5] to-[#e1f1feb5]",
                isActive
                  ? "bg-gradient-to-br from-[#f9e8ff] to-[#e1f1fe] text-[#0369a1] shadow"
                  : "text-[#4b5563]"
              )}
              onClick={onLinkClick}
            >
              <span
                className={clsx(
                  "text-lg text-[#4b5563] transition",
                  isActive ? "text-[#0369a1] font-semibold" : "text-[#4b5563]"
                )}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarMenu;
