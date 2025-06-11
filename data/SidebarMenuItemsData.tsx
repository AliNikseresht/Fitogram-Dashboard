import { MenuItem } from "@/types/SidebarMenuItemsDataType";
import {
  FaDumbbell,
  FaUtensils,
  FaComments,
  FaCog,
  FaRobot,
  FaUsers,
} from "react-icons/fa";
import { HiOutlineHome } from "react-icons/hi";

export const userMenuItems: MenuItem[] = [
  { label: "Dashboard", icon: <HiOutlineHome />, href: "/dashboard" },
  { label: "Workouts", icon: <FaDumbbell />, href: "/workouts" },
  { label: "Nutrition", icon: <FaUtensils />, href: "/nutrition" },
  { label: "Coach", icon: <FaComments />, href: "/coach" },
  { label: "AI Assistant", icon: <FaRobot />, href: "/ai-assistant" },
  { label: "Settings", icon: <FaCog />, href: "/settings" },
];

export const coachMenuItems: MenuItem[] = [
  { label: "Dashboard", icon: <HiOutlineHome />, href: "/dashboard" },
  { label: "Clients", icon: <FaUsers />, href: "/clients" },
  { label: "Workout Plans", icon: <FaDumbbell />, href: "/workout-plans" },
  { label: "Nutrition Plans", icon: <FaUtensils />, href: "/nutrition-plans" },
  { label: "AI Assistant", icon: <FaRobot />, href: "/ai-assistant" },
  { label: "Settings", icon: <FaCog />, href: "/settings" },
];
