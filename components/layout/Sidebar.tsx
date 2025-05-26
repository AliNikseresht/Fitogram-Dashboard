"use client";

import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";

import MobileTopbar from "./sidebar/MobileTopbar";
import DesktopSidebar from "./sidebar/DesktopSidebar";
import MobileDrawer from "./sidebar/MobileDrawer";
import CustomLoadingBars from "@/components/ui/loadings/CustomLoadingBars";

const HIDDEN_PATHS = ["/login", "/register", "/profile", "/verify-email"];

const Sidebar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const shouldRenderSidebar = useMemo(() => {
    if (!pathname) return null;
    return !HIDDEN_PATHS.includes(pathname);
  }, [pathname]);

  if (pathname === null) return <CustomLoadingBars />;
  if (!shouldRenderSidebar) return null;

  return (
    <div className="w-full lg:w-[30%] lg:max-w-[250px] min-w-[250px] shadow-lg">
      <MobileTopbar onOpen={() => setMobileOpen(true)} />
      <DesktopSidebar
        pathname={pathname}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <MobileDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
      />
    </div>
  );
};

export default Sidebar;
