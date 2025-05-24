"use client";

import React, { createContext, useContext, useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

const SupabaseContext = createContext<SupabaseClient | null>(null);

export function useSupabase() {
  const client = useContext(SupabaseContext);
  if (!client)
    throw new Error("useSupabase must be used within SupabaseProvider");
  return client;
}

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseClient = useMemo(() => createClientComponentClient(), []);

  return (
    <SupabaseContext.Provider value={supabaseClient}>
      {children}
    </SupabaseContext.Provider>
  );
}
