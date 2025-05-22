"use client";

import { usePathname } from "next/navigation";
import CustomLoadingBars from "@/components/ui/CustomLoadingBars";

const Sidebar = () => {
  const pathname = usePathname();

  if (!pathname) return <CustomLoadingBars />;

  const hiddenPaths = ["/login", "/register", "/profile", "/verify-email"];
  if (hiddenPaths.includes(pathname)) return null;

  return (
    <div className="w-full hidden lg:flex max-w-[15rem] bg-[#fff] shadow-lg">
      Sidebar
    </div>
  );
};

export default Sidebar;
