import { useEffect, useRef, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { RealtimeChannel } from "@supabase/supabase-js";

const supabase = createClientComponentClient();

type SubscribeParams = {
  table: string;
  filterColumn: string;
  filterValue: string | number;
  orderBy?: { column: string; ascending: boolean };
};

type HasIdAndDate = {
  id: string | number;
  [key: string]: any;
};

export function useRealtimeTable<T extends HasIdAndDate>({
  table,
  filterColumn,
  filterValue,
  orderBy,
}: SubscribeParams) {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!filterValue) return;

    let isSubscribed = true;

    supabase
      .from(table)
      .select("*")
      .eq(filterColumn, filterValue)
      .order(orderBy?.column || "id", { ascending: orderBy?.ascending ?? true })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else if (isSubscribed) setData(data || []);
      });

    if (channelRef.current) {
      channelRef.current.unsubscribe();
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase.channel(`public:${table}`);

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          filter: `${filterColumn}=eq.${filterValue}`,
        },
        (payload) => {
          const newItem = payload.new as T;
          setData((prev) => {
            const updated = prev.filter((item) => item.id !== newItem.id);
            return [...updated, newItem].sort(
              (a, b) =>
                new Date(a[orderBy?.column || "id"]).getTime() -
                new Date(b[orderBy?.column || "id"]).getTime()
            );
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      isSubscribed = false;
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, filterColumn, filterValue, orderBy?.column, orderBy?.ascending]);

  return { data, error };
}
