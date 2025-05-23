"use client";

import SupabaseProvider from "./SupabaseProvider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SupabaseProvider>{children}</SupabaseProvider>;
}
