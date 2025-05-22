"use client";

import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const hiddenPaths = ["/login", "/register", "/profile", "/verify-email"];
  if (hiddenPaths.includes(pathname)) return null;

  return (
    <div className="w-full hidden md:flex max-w-[15rem] bg-[#fff] shadow-lg">
      Sidebar
    </div>
  );
};

export default Sidebar;
