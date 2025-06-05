"use client";

import { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function AiAssistantChat({ userId }: { userId: string }) {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const responseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [response]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, message }),
      });
      const data = await res.json();
      setResponse(data.answer);
    } catch (err) {
      console.error("AI Chat Error:", err);
      setResponse("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setMessage("");
      textareaRef.current?.focus();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) handleSend();
    }
  };

  return (
    <div className="w-full p-4 bg-[#fff] rounded-2xl shadow-md flex flex-col justify-between h-full">
      <h2 className="text-xl mb-3 font-bold flex items-center gap-2">
        🤖 AI Assistant Chat
      </h2>

      <AnimatePresence>
        {(loading || response) && (
          <motion.div
            ref={responseRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-3 p-3 rounded-lg border border-indigo-300 shadow-inner whitespace-pre-wrap text-gray-900 max-h-48 overflow-y-auto"
          >
            <strong className="block mb-2 text-[#0ea5e9] text-lg">
              Fito AI:
            </strong>
            {loading ? "Thinking..." : response}
          </motion.div>
        )}
      </AnimatePresence>

      <textarea
        ref={textareaRef}
        rows={4}
        placeholder="Type your question or message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={loading}
        className="resize-none w-full rounded-lg border border-gray-300 bg-white text-gray-900 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#027bc7] transition"
      />

      <button
        onClick={handleSend}
        disabled={loading || !message.trim()}
        className={`w-full bg-[#0284c7] text-[#fff] py-2 mt-3 flex justify-center items-center rounded cursor-pointer disabled:opacity-50 duration-200 ${
          loading || !message.trim()
            ? "bg-indigo-300 cursor-not-allowed"
            : "bg-[#0284c7] hover:bg-[#027bc7] active:bg-[#0268c7]"
        }`}
        aria-label="Send message"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
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
            Thinking...
          </>
        ) : (
          <>
            <FiSend size={20} />
            Send
          </>
        )}
      </button>
    </div>
  );
}
