"use client";

import { useState } from "react";

export default function AiAssistantChat({ userId }: { userId: string }) {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          message,
        }),
      });

      const data = await res.json();
      setResponse(data.answer);
    } catch (err) {
      console.error("AI Chat Error:", err);
      setResponse("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full">
      <h2 className="text-lg font-semibold mb-3">🤖 Ask AI Assistant</h2>
      <textarea
        rows={3}
        className="w-full border border-gray-300 rounded-lg p-2 mb-2"
        placeholder="For example: I feel tired, what should I eat?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={handleSend}
        disabled={loading}
        className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Sending..." : "Send"}
      </button>
      {response && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <strong>Response:</strong>
          <p className="mt-2 whitespace-pre-line">{response}</p>
        </div>
      )}
    </div>
  );
}
