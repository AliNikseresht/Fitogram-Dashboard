"use client";

import AppLogo from "@/components/ui/AppLogo";
import { HiOutlineMenu } from "react-icons/hi";

interface MobileTopbarProps {
  onOpen: () => void;
}

const MobileTopbar = ({ onOpen }: MobileTopbarProps) => (
  <div className="flex lg:hidden items-center justify-between px-4 py-3 border-b border-[#bababa] bg-[#fff] shadow-sm">
    <AppLogo />
    <button onClick={onOpen} className="text-2xl text-gray-700">
      <HiOutlineMenu />
    </button>
  </div>
);

export default MobileTopbar;
