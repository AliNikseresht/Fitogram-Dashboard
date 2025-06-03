"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import CustomLoadingBars from "@/components/ui/loadings/CustomLoadingBars";
import { useUserProfile } from "@/hooks/useUserProfile";
import { IoIosSend } from "react-icons/io";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-toastify";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

const CoachChatForUsers = () => {
  const supabase = createClientComponentClient();
  const { profile, loading, error } = useUserProfile();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!profile || !profile.coach) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setLoadingMessages(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${
            profile.coach!.id
          }),and(sender_id.eq.${profile.coach!.id},receiver_id.eq.${user.id})`
        )
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Failed to load messages", error?.message || error);
        setMessages([]);
      } else {
        setMessages(data ?? []);
      }
      setLoadingMessages(false);
    };

    fetchMessages();

    // ثبت subscription برای دریافت پیام‌های جدید realtime
    supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `or(and(sender_id.eq.${
            profile.coach!.id
          },receiver_id.eq.${supabase.auth
            .getUser()
            .then(
              ({ data: { user } }) => user?.id
            )}),and(sender_id.eq.${supabase.auth
            .getUser()
            .then(({ data: { user } }) => user?.id)},receiver_id.eq.${
            profile.coach!.id
          }))`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeAllChannels();
    };
  }, [profile, supabase]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !profile?.coach) return;

    setSending(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: profile.coach.id,
      content: messageText.trim(),
    });

    if (error) {
      console.error("Failed to send message", error);
      toast.error("Failed to send message");
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender_id: user.id,
          receiver_id: profile.coach?.id ?? "",
          content: messageText.trim(),
          created_at: new Date().toISOString(),
        },
      ]);
      setMessageText("");
    }

    setSending(false);
  };

  if (loading) return <CustomLoadingBars />;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!profile)
    return <div className="text-red-500">No profile data found.</div>;

  return (
    <div className="bg-[#fff] p-4 rounded-xl w-full max-w-sm flex flex-col h-full">
      <p className="mb-4 font-bold">Coach Chat</p>
      {profile.coach ? (
        <div className="space-y-3 flex flex-col h-full">
          <div className="flex gap-2 items-center">
            <img
              src={profile.coach.avatar_url || "/default-avatar.png"}
              alt={profile.coach.full_name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#bababa]"
            />
            <div className="flex flex-col">
              <p className="font-medium text-sm">{profile.coach.full_name}</p>
              <p className="font-medium text-xs text-[#5dd589]">
                {profile.status}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto rounded p-2 bg-[#f9fbfb] mb-2">
            {loadingMessages ? (
              <p>Loading messages...</p>
            ) : messages.length === 0 ? (
              <p className="text-gray-500 text-sm">No messages yet.</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-2 max-w-[70%] p-2 rounded ${
                    msg.sender_id === profile.coach!.id
                      ? "bg-white self-start"
                      : "bg-blue-400 text-white self-end"
                  }`}
                >
                  {msg.content}
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full bg-[#f3f4f6] rounded-s-lg px-3 py-2 text-sm focus:outline-none"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              disabled={sending}
            />
            <button
              onClick={handleSendMessage}
              className="bg-[#0284c7] p-[0.4em] rounded-r-lg cursor-pointer disabled:opacity-50 flex items-center justify-center"
              disabled={sending}
            >
              <IoIosSend color="#fff" size={23} />
            </button>
          </div>
        </div>
      ) : profile.status === "pending_coach_request" ? (
        <p className="font-medium text-yellow-600">Coach request is pending</p>
      ) : (
        <div className="space-y-2">
          <p className="font-medium text-red-600 text-sm">
            You haven`t selected a coach yet. Click below to choose one.
          </p>
          <Link
            href="/users/coach"
            className="inline-block bg-[#0284c7] text-white px-4 py-1.5 text-sm rounded hover:bg-[#027bc7] duration-200"
          >
            Choose a Coach
          </Link>
        </div>
      )}
    </div>
  );
};

export default CoachChatForUsers;
