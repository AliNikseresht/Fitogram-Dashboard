"use client";

import { useState, useRef, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa6";
import { CiMicrophoneOn } from "react-icons/ci";

type Message = {
  from: "user" | "ai";
  text: string;
};

export default function AiAssistantChat({ userId }: { userId: string }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messagesEndRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;
    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      { from: "user", text: userMessage },
      { from: "ai", text: "..." },
    ]);
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: userMessage }),
      });
      const data = await res.json();

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { from: "ai", text: data.answer };
        return updated;
      });
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          from: "ai",
          text: "An error occurred. Please try again.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white p-0 lg:p-4">
      <h2 className="text-xl mb-3 font-bold hidden lg:flex items-center gap-2">
        🤖 AI Assistant Chat
      </h2>

      <div
        ref={messagesEndRef}
        className="flex flex-col gap-4 flex-grow overflow-y-auto lg:mb-4 px-2 py-4 lg:border border-gray-300 rounded-2xl"
      >
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">Start the conversation!</p>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-md
                max-w-[80%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[50%]
                ${
                  msg.from === "user"
                    ? "bg-gradient-to-br from-[#0369a1] to-[#0284c7] text-white rounded-br-none"
                    : "bg-gray-100 text-gray-900 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="w-full bg-gradient-to-br from-[#f9e8ff] to-[#e1f1fe] lg:rounded-2xl flex flex-col shadow-md p-1">
        <textarea
          rows={2}
          placeholder="Ask anything"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={loading}
          className="resize-none w-full p-3 focus:outline-none rounded-3xl text-sm sm:text-base"
        />

        <div className="flex items-center gap-1.5 justify-end w-full">
          <CiMicrophoneOn size={26} />
          <button
            onClick={handleSend}
            disabled={loading || !message.trim()}
            className={`p-2 flex justify-center items-center rounded-full cursor-pointer disabled:opacity-50 duration-200
            ${
              loading || !message.trim()
                ? "bg-white cursor-not-allowed"
                : "bg-[#0284c7] hover:bg-[#027bc7] active:bg-[#0268c7] text-white"
            }`}
            aria-label="Send message"
          >
            {loading ? (
              <>
                Thinking...
                <svg
                  className="animate-spin h-5 w-5 ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              </>
            ) : (
              <FaArrowUp size={22} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
