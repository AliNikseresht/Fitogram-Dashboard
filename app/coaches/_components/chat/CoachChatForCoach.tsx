"use client";

import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { IoIosSend } from "react-icons/io";
import { toast } from "react-toastify";

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

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

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
    };

    fetchMessages();
  }, [selectedStudent, supabase]);

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
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender_id: user.id,
          receiver_id: selectedStudent.id,
          content: messageText.trim(),
          created_at: new Date().toISOString(),
        },
      ]);
      setMessageText("");
    }

    setSending(false);
  };

  return (
    <div className="bg-white rounded-xl p-4 w-full max-w-lg flex flex-col h-[400px]">
      <h3 className="font-bold mb-4">Coach Chat</h3>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* لیست شاگردها */}
        <div className="w-40 border-r border-gray-300 overflow-y-auto">
          {students.length === 0 && <p>No students found.</p>}
          <ul>
            {students.map((student) => (
              <li
                key={student.id}
                className={`p-2 cursor-pointer rounded ${
                  selectedStudent?.id === student.id
                    ? "bg-blue-100 font-semibold"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedStudent(student)}
              >
                <img
                  src={student.avatar_url || "/default-avatar.png"}
                  alt={student.full_name}
                  className="w-8 h-8 rounded-full inline-block mr-2 object-cover"
                />
                {student.full_name}
              </li>
            ))}
          </ul>
        </div>

        {/* بخش پیام‌ها */}
        <div className="flex flex-col flex-1 h-full">
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
              <div className="flex-1 overflow-y-auto p-2 border rounded bg-gray-50">
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
              </div>

              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  className="flex-1 border rounded px-3 py-2 text-sm"
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  disabled={sending}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 p-2 rounded text-white flex items-center justify-center disabled:opacity-50"
                  disabled={sending}
                >
                  <IoIosSend size={20} />
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
