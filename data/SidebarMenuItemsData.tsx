import { MenuItem } from "@/types/SidebarMenuItemsDataType";
import {
  FaDumbbell,
  FaUtensils,
  FaChartLine,
  FaRegCalendarCheck,
  FaComments,
  FaBook,
  FaCog,
  FaRobot,
} from "react-icons/fa";
import { HiOutlineHome } from "react-icons/hi";

export const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: <HiOutlineHome />, href: "/dashboard" },
  { label: "Workouts", icon: <FaDumbbell />, href: "/workouts" },
  { label: "Nutrition", icon: <FaUtensils />, href: "/nutrition" },
  { label: "Progress", icon: <FaChartLine />, href: "/progress" },
  { label: "Plans", icon: <FaRegCalendarCheck />, href: "/plans" },
  { label: "Coach", icon: <FaComments />, href: "/coach" },
  { label: "AI Assistant", icon: <FaRobot />, href: "/ai-assistant" },
  { label: "Library", icon: <FaBook />, href: "/library" },
  { label: "Settings", icon: <FaCog />, href: "/settings" },
];
