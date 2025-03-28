import React from "react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const CategorySkeleton = () => {
    // The dimensions are set to roughly match the "All Categories" button.
    // Adjust the width, height, and borderRadius as needed.
    return (
        <Skeleton 
            height={36} 
            width={120} 
            borderRadius={999} 
            baseColor="#f3f3f3" 
            highlightColor="#ecebeb" 
        />
    );
};

export default CategorySkeleton;