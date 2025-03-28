import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useState } from "react";

const SnippetCardSkeleton = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const baseColor = isDarkMode ? "#6b7280" : "#e5e7eb";
  const highlightColor = isDarkMode ? "#4b5563" : "#f3f4f6";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {/* Title */}
      <div className="mb-4">
        <Skeleton
          baseColor={baseColor}
          highlightColor={highlightColor}
          height={24}
          width="75%"
          className="mb-2"
        />
        <div className="flex items-center space-x-2">
          <Skeleton
            baseColor={baseColor}
            highlightColor={highlightColor}
            circle
            width={32}
            height={32}
          />
          <Skeleton
            baseColor={baseColor}
            highlightColor={highlightColor}
            width={96}
          />
          <Skeleton
            baseColor={baseColor}
            highlightColor={highlightColor}
            width={16}
          />
          <Skeleton
            baseColor={baseColor}
            highlightColor={highlightColor}
            width={96}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center space-x-2 mb-4">
        <Skeleton
          baseColor={baseColor}
          highlightColor={highlightColor}
          height={24}
          width={80}
          borderRadius={9999}
        />
        <Skeleton
          baseColor={baseColor}
          highlightColor={highlightColor}
          height={24}
          width={96}
          borderRadius={9999}
        />
      </div>

      {/* Description */}
      <Skeleton
        baseColor={baseColor}
        highlightColor={highlightColor}
        count={3}
        className="mb-1"
      />

      {/* Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Skeleton
              baseColor={baseColor}
              highlightColor={highlightColor}
              width={20}
              height={20}
              className="mr-1"
            />
            <Skeleton
              baseColor={baseColor}
              highlightColor={highlightColor}
              width={24}
            />
          </div>
          <div className="flex items-center">
            <Skeleton
              baseColor={baseColor}
              highlightColor={highlightColor}
              width={20}
              height={20}
              className="mr-1"
            />
            <Skeleton
              baseColor={baseColor}
              highlightColor={highlightColor}
              width={24}
            />
          </div>
        </div>
      </div>

      {/* Code Editor Placeholder */}
      <div className="mt-4">
        <Skeleton
          baseColor={baseColor}
          highlightColor={highlightColor}
          height={200}
        />
      </div>
    </div>
  );
};

export default SnippetCardSkeleton;
