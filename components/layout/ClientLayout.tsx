"use client";

import Sidebar from "./Sidebar";
import SupabaseProvider from "./SupabaseProvider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SupabaseProvider>
      <main className="flex flex-col lg:flex-row w-full h-screen">
        <Sidebar />
        <div className="w-full overflow-auto">{children}</div>
      </main>
    </SupabaseProvider>
  );
}
