const ChatWindowSkeleton = () => (
  <div className="flex flex-col h-full w-full max-w-sm bg-gray-100 p-4 rounded-xl shadow-md animate-pulse">
    <div className="h-8 bg-gray-300 rounded mb-3 w-1/3"></div>
    <div className="flex items-center gap-2 mb-4">
      <div className="w-12 h-12 rounded-full bg-gray-300"></div>
      <div className="h-6 bg-gray-300 rounded w-1/2"></div>
    </div>
    <div className="flex-1 space-y-3 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-3/4 h-10 rounded-xl bg-gray-300 ${
            i % 2 === 0 ? "ml-auto" : "mr-auto"
          }`}
        ></div>
      ))}
    </div>
    <div className="flex gap-2">
      <div className="flex-grow h-10 bg-gray-300 rounded-l-md"></div>{" "}
      <div className="w-10 h-10 bg-gray-300 rounded-r-md"></div>{" "}
    </div>
  </div>
);

export default ChatWindowSkeleton;
