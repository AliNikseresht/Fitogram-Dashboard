import supabase from "@/libs/supabaseClient";
import { useEffect, useState } from "react";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

interface UseChatParams {
  userId: string;
  otherUserId: string;
}

export const useChat = ({ userId, otherUserId }: UseChatParams) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (!userId || !otherUserId) {
      setMessages([]);
      return;
    }

    let channel = supabase.channel("chat-channel");

    const fetchMessagesAndSubscribe = async () => {
      setLoadingMessages(true);

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`
        )
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Failed to load messages", error);
        setMessages([]);
      } else {
        setMessages(data ?? []);
      }
      setLoadingMessages(false);

      channel = supabase
        .channel("chat-channel")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            const newMsg = payload.new as Message;
            const isRelevant =
              (newMsg.sender_id === userId &&
                newMsg.receiver_id === otherUserId) ||
              (newMsg.sender_id === otherUserId &&
                newMsg.receiver_id === userId);

            if (isRelevant) {
              setMessages((prev) => [...prev, newMsg]);
            }
          }
        )
        .subscribe();
    };

    fetchMessagesAndSubscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, otherUserId, supabase]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return false;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;

    const { error } = await supabase.from("messages").insert({
      sender_id: userData.user.id,
      receiver_id: otherUserId,
      content: content.trim(),
    });

    if (error) {
      console.error("Failed to send message", error);
      return false;
    }
    return true;
  };

  return { messages, loadingMessages, sendMessage };
};
