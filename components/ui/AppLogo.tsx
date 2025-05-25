import Image from "next/image";
import React from "react";
import appLogo from "@/public/icons/app-logo.png";

const AppLogo = () => {
  return (
    <div className="w-40 lg:w-44 h-auto">
      <Image
        src={appLogo}
        alt="fitogram app logo"
        priority
        width={1500}
        height={1500}
        className="object-cover"
      />
    </div>
  );
};

export default AppLogo;
