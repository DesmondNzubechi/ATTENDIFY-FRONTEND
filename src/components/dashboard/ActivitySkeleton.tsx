export const ActivitySkeleton = () => {
    return (
      <div className="flex gap-3 animate-pulse">
        <div className="rounded-full bg-gray-300 h-10 w-10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/3" />
          <div className="h-3 bg-gray-300 rounded w-1/4" />
          <div className="h-4 bg-gray-300 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  };
  