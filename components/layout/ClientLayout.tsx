"use client";

import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import SupabaseProvider from "./SupabaseProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider>
        <main className="flex flex-col lg:flex-row w-full h-screen">
          <Sidebar />
          <div className="w-full overflow-auto">{children}</div>
        </main>
      </SupabaseProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
