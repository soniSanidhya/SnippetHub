import React, { useEffect, useRef } from "react";
import { api } from "../utils/axiosHelper";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import CategorySkeleton from "./skeletons/CategorySkeleton";

const fetchCategories = ({ pageParam }) => {
  return api
    .get("/category", { params: { page: pageParam } })
    .then((res) => res.data);
};

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const { ref, inView } = useInView();
  const containerRef = useRef(null);
  
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["categories"],
      queryFn: fetchCategories,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.data.length === 0) return undefined;
        return allPages.length + 1;
      },
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handleDragScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    
    let startX, scrollLeft, isDown = false;

    const onStart = (e) => {
      isDown = true;
      container.classList.add("active");
      startX = (e.pageX || e.touches?.[0].pageX) - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const onMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = (e.pageX || e.touches?.[0].pageX) - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    const onEnd = () => {
      isDown = false;
      container.classList.remove("active");
    };

    // Mouse events
    container.addEventListener("mousedown", onStart);
    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseup", onEnd);
    container.addEventListener("mouseleave", onEnd);
    
    // Touch events
    container.addEventListener("touchstart", onStart);
    container.addEventListener("touchmove", onMove);
    container.addEventListener("touchend", onEnd);

    return () => {
      // Cleanup
      container.removeEventListener("mousedown", onStart);
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseup", onEnd);
      container.removeEventListener("mouseleave", onEnd);
      container.removeEventListener("touchstart", onStart);
      container.removeEventListener("touchmove", onMove);
      container.removeEventListener("touchend", onEnd);
    };
  };

  useEffect(() => {
    const cleanup = handleDragScroll();
    return cleanup;
  }, []);

  if (isLoading) {return (
    <div className="flex gap-4">
      <CategorySkeleton/>
      <CategorySkeleton/>
      <CategorySkeleton/>
      <CategorySkeleton/>
      <CategorySkeleton/>
    </div>
  )}
  if (isError) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div 
      ref={containerRef}
      className="flex p-2 overflow-x-auto gap-2 scrollbar-hide -webkit-overflow-scrolling-touch"
      style={{ scrollBehavior: "smooth" }}
    >
      <button
        onClick={() => onCategoryChange("")}
        className={`px-4 py-2 min-w-fit whitespace-nowrap rounded-full text-sm font-medium transition-colors ${
          selectedCategory === ""
            ? "bg-blue-500 text-white dark:bg-blue-600"
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        All Categories
      </button>
      
      {data?.pages.map((page, pageIndex) =>
        page.data.map((category) => (
          <button
            key={category._id}
            onClick={() => onCategoryChange(category.name)}
            className={`px-4 py-2 min-w-fit whitespace-nowrap rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.name
                ? "bg-blue-500 text-white dark:bg-blue-600"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {category.name.length < 15 ? category.name : category.name.slice(0, 12) + "..."}
          </button>
        ))
      )}

      <div ref={ref} className="min-w-4 h-4"></div>
    </div>
  );
}
