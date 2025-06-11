import { MenuItem } from "@/types/SidebarMenuItemsDataType";
import {
  FaDumbbell,
  FaUtensils,
  FaComments,
  FaCog,
  FaRobot,
} from "react-icons/fa";
import { HiOutlineHome } from "react-icons/hi";

export const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: <HiOutlineHome />, href: "/dashboard" },
  { label: "Workouts", icon: <FaDumbbell />, href: "/workouts" },
  { label: "Nutrition", icon: <FaUtensils />, href: "/nutrition" },
  { label: "Coach", icon: <FaComments />, href: "/coach" },
  { label: "AI Assistant", icon: <FaRobot />, href: "/ai-assistant" },
  { label: "Settings", icon: <FaCog />, href: "/settings" },
];
