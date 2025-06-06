const ChatMessagesSkeleton = () => {
  return (
    <div className="space-y-3 px-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-3/4 h-10 rounded-xl bg-gray-300 animate-pulse ${
            i % 2 === 0 ? "ml-auto" : "mr-auto"
          }`}
        ></div>
      ))}
    </div>
  );
};

export default ChatMessagesSkeleton;
