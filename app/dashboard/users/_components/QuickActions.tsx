import Link from "next/link";
import React from "react";
import {
  FaUserEdit,
  FaChalkboardTeacher,
  FaBug,
  FaHistory,
} from "react-icons/fa";

const actions = [
  {
    label: "Edit Profile",
    icon: <FaUserEdit size={24} />,
    href: "/profile/edit",
  },
  {
    label: "Contact Coach",
    icon: <FaChalkboardTeacher size={24} />,
    href: "/coach/contact",
  },
  { label: "Report Issue", icon: <FaBug size={24} />, href: "/support/report" },
  {
    label: "Workout History",
    icon: <FaHistory size={24} />,
    href: "/workouts/history",
  },
];

export function QuickActions() {
  return (
    <section className="max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6 items-center mt-4 lg:mt-0">
      {actions.map(({ label, icon, href }, idx) => (
        <Link
          key={idx}
          href={href}
          className="flex flex-col items-center bg-gradient-to-tr from-indigo-500 to-purple-700 text-white rounded-xl p-5 shadow-xl transform hover:scale-105 hover:shadow-2xl transition"
          aria-label={label}
        >
          <div className="mb-2">{icon}</div>
          <span className="font-semibold text-xs lg:text-lg">{label}</span>
        </Link>
      ))}
    </section>
  );
}
