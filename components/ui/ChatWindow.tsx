import { useChat } from "@/hooks/useChat";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { IoIosSend } from "react-icons/io";

interface ChatWindowProps {
  userId: string;
  otherUserId: string;
  otherUserAvatar: string;
  otherUserName: string;
  myId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  userId,
  otherUserId,
  otherUserAvatar,
  otherUserName,
  myId,
}) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const { messages, loadingMessages, sendMessage } = useChat({
    userId,
    otherUserId,
  });

  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!messageText.trim()) return;
    setSending(true);
    const success = await sendMessage(messageText);
    if (success) setMessageText("");
    setSending(false);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-sm bg-[#fff] p-4 rounded-xl shadow-md">
      <h2 className="text-xl mb-3 font-bold flex items-center gap-2">
        Coach Chat
      </h2>
      <div className="flex items-center gap-2 mb-4 border-b py-2.5 border-[#bababa]">
        <Image
          src={otherUserAvatar}
          alt={otherUserName}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
          width={48}
          height={48}
          priority
        />
        <p className="font-semibold">{otherUserName}</p>
      </div>
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto mb-4 space-y-2"
        style={{ maxHeight: "16rem" }}
      >
        {loadingMessages && <p>Loading messages...</p>}
        {!loadingMessages && messages.length === 0 && (
          <p className="text-gray-500">No messages yet.</p>
        )}
        {messages.map((msg) => {
          const isMyMessage = msg.sender_id === myId;

          return (
            <div
              key={msg.id}
              className={`chat ${isMyMessage ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <Image
                    src={isMyMessage ? otherUserAvatar : otherUserAvatar}
                    alt={isMyMessage ? "You" : otherUserName}
                    className="border-2 border-[#212121]"
                    width={48}
                    height={48}
                    priority
                  />
                </div>
              </div>
              <div className="chat-header">
                {isMyMessage ? "You" : otherUserName}
                <time className="text-xs opacity-50 ml-2">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </time>
              </div>
              <div
                className={`chat-bubble rounded-xl ${
                  isMyMessage
                    ? "bg-[#e1f1fe] text-[#212121]"
                    : "text-[#e1f1fe] bg-[#0369a1]"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={sending}
          placeholder="Type your message..."
          className="flex-grow rounded-l-md border border-gray-300 px-3 py-2 focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={sending}
          className="bg-[#0284c7] p-2 rounded-r-md disabled:opacity-50 flex items-center justify-center"
        >
          <IoIosSend size={20} color="white" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
