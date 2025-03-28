import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const RecommendedSnippetSkeleton = () => {
    return (
        <div className="bg-gray-800 p-4 border border-gray-700 rounded-md m-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <Skeleton circle width={48} height={48} baseColor="#374151" highlightColor="#4B5563" />
                    <div className="ml-4">
                        <h1 className="text-lg font-semibold">
                            <Skeleton width={150} baseColor="#374151" highlightColor="#4B5563" />
                        </h1>
                        <p className="text-sm text-gray-400">
                            <Skeleton width={80} baseColor="#374151" highlightColor="#4B5563" />
                        </p>
                    </div>
                </div>
                <div className="flex items-center">
                    <Skeleton width={60} height={30} baseColor="#374151" highlightColor="#4B5563" className="rounded-md" />
                </div>
            </div>
            <div className="mt-4">
                <h1 className="text-xl font-semibold">
                    <Skeleton width={220} baseColor="#374151" highlightColor="#4B5563" />
                </h1>
                <p className="text-gray-400 mt-2">
                    <Skeleton count={2} baseColor="#374151" highlightColor="#4B5563" />
                </p>
            </div>
        </div>
    );
};

export default RecommendedSnippetSkeleton;