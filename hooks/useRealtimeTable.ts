import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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

  useEffect(() => {
    if (!filterValue) return;

    supabase
      .from(table)
      .select("*")
      .eq(filterColumn, filterValue)
      .order(orderBy?.column || "id", { ascending: orderBy?.ascending ?? true })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setData(data || []);
      });

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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filterColumn, filterValue, orderBy]);

  return { data, error };
}
