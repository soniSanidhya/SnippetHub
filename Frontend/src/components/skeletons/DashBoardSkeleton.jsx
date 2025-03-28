import React from 'react';

const DashBoardCardSkeleton = () => {
    return (
        <div className="space-y-8">
            {/* Snippet Card Skeleton */}
            {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-6 border border-gray-200 rounded-lg shadow animate-pulse">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        {/* Title skeleton */}
                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2" />
                        {/* Description skeleton */}
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded max-w-full mb-2" />
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded max-w-full mb-2" />
                        {/* Meta info skeleton */}
                        <div className="flex items-center space-x-4">
                            <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
                            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
                            <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
                            <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
                        </div>
                    </div>
                    {/* Button skeletons */}
                    <div className="flex space-x-2">
                        <div className="h-8 w-12 bg-gray-300 dark:bg-gray-700 rounded" />
                        <div className="h-8 w-12 bg-gray-300 dark:bg-gray-700 rounded" />
                    </div>
                </div>
                {/* Code editor skeleton */}
                <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
            ))
        }
        </div>
    );
};

const DashBoardStatsSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
            </div>
        ))}
    </div>
    )
}

export default { DashBoardCardSkeleton, DashBoardStatsSkeleton };