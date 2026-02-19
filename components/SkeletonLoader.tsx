import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
  type?: 'card' | 'featured' | 'carousel' | 'detail';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  count = 6, 
  type = 'card' 
}) => {
  if (type === 'featured') {
    return (
      <div className="animate-pulse">
        <div className="w-full h-96 bg-gray-300 rounded-2xl mb-6" />
        <div className="space-y-3">
          <div className="h-8 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-300 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (type === 'carousel') {
    return (
      <div>
        <div className="h-6 bg-gray-300 rounded w-32 mb-4 animate-pulse" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-40 h-56 bg-gray-300 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="animate-pulse space-y-6">
        <div className="flex gap-6">
          <div className="w-48 h-72 bg-gray-300 rounded-lg" />
          <div className="flex-1 space-y-3">
            <div className="h-8 bg-gray-300 rounded w-3/4" />
            <div className="h-4 bg-gray-300 rounded w-1/2" />
            <div className="space-y-2 pt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded w-5/6" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default card skeleton
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="w-full aspect-[2/3] bg-gray-300 rounded-lg mb-2" />
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-300 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
};
