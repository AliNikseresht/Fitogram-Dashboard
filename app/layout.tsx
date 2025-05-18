import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fitogram Dashboard | Fitness Journeys App",
  description:
    "Achieve your fitness goals with Fitogram. Personalized plans, expert guidance, and motivation to stay on track.",
  keywords: [
    "Fitogram",
    "Fitness",
    "Workout Plans",
    "Personal Training",
    "Health",
    "Nutrition",
    "Wellness",
    "Gym",
  ],
  authors: [
    { name: "Ali Nikseresht", url: "https://fitogram-dashboard.vercel.app/" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
        <ToastContainer />
      </body>
    </html>
  );
}
