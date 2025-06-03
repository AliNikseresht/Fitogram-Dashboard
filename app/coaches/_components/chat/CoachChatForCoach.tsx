"use client";

import React, { useEffect, useRef, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { IoIosSend } from "react-icons/io";
import { toast } from "react-toastify";
import { RealtimeChannel } from "@supabase/supabase-js";
import Image from "next/image";

interface Student {
  id: string;
  full_name: string;
  avatar_url?: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

const CoachChatForCoach = () => {
  const supabase = createClientComponentClient();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchStudents = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("coach_id", user.id);

      if (error) {
        toast.error(`Failed to load students: ${error.message}`);
        return;
      }

      setStudents(data ?? []);
      if (data && data.length > 0) setSelectedStudent(data[0]);
    };

    fetchStudents();
  }, [supabase]);

  useEffect(() => {
    if (!selectedStudent) {
      setMessages([]);
      return;
    }

    let channel: RealtimeChannel;

    const fetchMessagesAndSubscribe = async () => {
      setLoadingMessages(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${selectedStudent.id}),and(sender_id.eq.${selectedStudent.id},receiver_id.eq.${user.id})`
        )
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Failed to load messages", error?.message || error);
        setMessages([]);
      } else {
        setMessages(data ?? []);
      }
      setLoadingMessages(false);

      // Subscribe to real-time updates
      channel = supabase
        .channel("coach-chat")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            const newMsg = payload.new as Message;

            const isBetweenCoachAndStudent =
              (newMsg.sender_id === user.id &&
                newMsg.receiver_id === selectedStudent.id) ||
              (newMsg.sender_id === selectedStudent.id &&
                newMsg.receiver_id === user.id);

            if (isBetweenCoachAndStudent) {
              setMessages((prev) => [...prev, newMsg]);
            }
          }
        )
        .subscribe();
    };

    fetchMessagesAndSubscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [selectedStudent, supabase]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedStudent) return;

    setSending(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: selectedStudent.id,
      content: messageText.trim(),
    });

    if (error) {
      console.error("Failed to send message", error);
    } else {
      setMessageText("");
    }

    setSending(false);
  };

  return (
    <div className="bg-[#fff] p-4 rounded-xl w-full flex flex-col h-full shadow-xl">
      <h3 className="font-bold mb-4">Coach Chat</h3>

      <div className="flex flex-1 gap-4 overflow-hidden">
        <div className="w-44 border-r border-[#bababa] overflow-y-auto pr-2">
          {students.length === 0 && <p>No students found.</p>}
          <ul>
            {students.map((student) => (
              <li
                key={student.id}
                className="py-1 cursor-pointer border-b border-[#bababa]"
                onClick={() => setSelectedStudent(student)}
              >
                <Image
                  src={
                    student.avatar_url?.startsWith("http")
                      ? student.avatar_url
                      : student.avatar_url
                      ? `/avatars/${student.avatar_url}`
                      : "/default-avatar.png"
                  }
                  alt={student.full_name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full inline-block mr-2 object-cover border-2 border-[#bababa]"
                />
                {student.full_name}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col flex-1 gap-2 h-full">
          {!selectedStudent ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a student to chat
            </div>
          ) : loadingMessages ? (
            <div className="flex items-center justify-center h-full">
              Loading messages...
            </div>
          ) : (
            <>
              <div className="overflow-y-auto w-full max-w-sm bg-white p-4 rounded-xl space-y-4 flex flex-col justify-between h-64">
                {messages.length === 0 && (
                  <p className="text-gray-400 text-sm">
                    No messages yet. Start the conversation!
                  </p>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-2 max-w-[70%] p-2 rounded ${
                      msg.sender_id === selectedStudent.id
                        ? "bg-white self-start"
                        : "bg-blue-400 text-white self-end"
                    }`}
                  >
                    {msg.content}
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachChatForCoach;
