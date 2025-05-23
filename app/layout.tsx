import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "@/components/layout/Sidebar";

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
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Fitogram Dashboard | Fitness Journeys App",
    description:
      "Achieve your fitness goals with Fitogram. Personalized plans, expert guidance, and motivation to stay on track.",
    url: "https://fitogram-dashboard.vercel.app/",
    siteName: "Fitogram Dashboard",
    images: [
      {
        url: "https://fitogram-dashboard.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fitogram Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fitogram Dashboard | Fitness Journeys App",
    description:
      "Achieve your fitness goals with Fitogram. Personalized plans, expert guidance, and motivation to stay on track.",
    images: ["https://fitogram-dashboard.vercel.app/og-image.png"],
    creator: "@AliNikseresht",
  },
  metadataBase: new URL("https://fitogram-dashboard.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#317EFB" />
        <link rel="icon" href="/icons/app-logo.png" />
        <link rel="apple-touch-icon" href="/icons/app-logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>
          <main className="flex w-full justify-center">
            <Sidebar />
            {children}
          </main>
        </ClientLayout>
        <ToastContainer />
      </body>
    </html>
  );
}
