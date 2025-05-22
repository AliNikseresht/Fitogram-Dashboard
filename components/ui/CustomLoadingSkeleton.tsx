const LoadingSkeleton = () => {
  return (
    <div className="p-6 max-w-xl mx-auto animate-pulse">
      {/* Avatar */}
      <div className="rounded-full bg-gray-300 w-20 h-20 mb-4 mx-auto"></div>

      {/* Title */}
      <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-3"></div>

      {/* Subtitle */}
      <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-6"></div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="h-16 bg-gray-300 rounded"></div>
        <div className="h-16 bg-gray-300 rounded"></div>
        <div className="h-16 bg-gray-300 rounded"></div>
      </div>

      {/* Progress bar */}
      <div className="mt-6 bg-gray-300 rounded-full h-4 overflow-hidden">
        <div className="bg-gray-400 h-4 w-3/4 rounded-full"></div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-300 rounded"></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
