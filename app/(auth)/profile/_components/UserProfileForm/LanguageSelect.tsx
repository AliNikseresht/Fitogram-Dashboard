"use client";

import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  registration: UseFormRegisterReturn;
};

const LanguageSelect = ({ registration }: Props) => (
  <div className="mb-4 text-xs lg:text-sm">
    <label className="block mb-1 font-medium">Preferred Language</label>
    <select
      {...registration}
      className="w-full border border-[#bababa] rounded px-3 py-2"
    >
      <option value="en">English</option>
      <option value="fa">فارسی</option>
    </select>
  </div>
);

export default LanguageSelect;
