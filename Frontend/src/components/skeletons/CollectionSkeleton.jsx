import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CollectionSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-2">
                {/* Simulate the collection name */}
                <Skeleton height={28} width={180} />
                {/* Simulate the delete icon as a circle */}
                <Skeleton circle={true} height={24} width={24} />
            </div>
            {/* Simulate the description */}
            <Skeleton count={2} height={16} />
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-4">
                {/* Simulate snippet count */}
                <Skeleton height={16} width={80} />
                {/* Simulate update date */}
                <Skeleton height={16} width={120} />
            </div>
        </div>
    );
};

export default CollectionSkeleton;