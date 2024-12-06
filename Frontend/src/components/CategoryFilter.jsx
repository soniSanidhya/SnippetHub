import React, { useEffect } from "react";
import { api } from "../utils/axiosHelper";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

const fetchCategories = ({ pageParam }) => {
  console.log("fetching page", pageParam);
  return api
    .get("/category", { params: { page: pageParam } })
    .then((res) => res.data);
};

const categories = [
  { id: "", name: "All Categories" },
  { id: "frontend", name: "Frontend" },
  { id: "backend", name: "Backend" },
  { id: "database", name: "Database" },
  { id: "devops", name: "DevOps" },
  { id: "algorithms", name: "Algorithms" },
  { id: "utils", name: "Utilities" },
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const { ref, inView } = useInView();
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
      // console.log(data);

      console.log("fetching next page", hasNextPage);

      fetchNextPage();
    }
  }, [data, inView]);

  const handleDragScroll = (e) => {
    const container = e.currentTarget;
    let startX, scrollLeft;

    const onMouseDown = (e) => {
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.classList.add("active");
      container.addEventListener("mousemove", onMouseMove);
      container.addEventListener("mouseup", onMouseUp);
      container.addEventListener("mouseleave", onMouseUp);
    };

    const onMouseMove = (e) => {
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2; //scroll-fast
      container.scrollLeft = scrollLeft - walk;
    };

    const onMouseUp = () => {
      container.classList.remove("active");
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("mouseleave", onMouseUp);
    };

    container.addEventListener("mousedown", onMouseDown);
  };

  useEffect(() => {
    const container = document.querySelector(".flex");
    handleDragScroll({ currentTarget: container });
  }, []);

  if (isLoading) return <div></div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div
      onMouseDown={handleDragScroll}
      className="flex p-2 overflow-hidden gap-2"
    >
      <button
        onClick={() => onCategoryChange("")}
        className={`px-4 py-2 min-w-fit rounded-full text-sm font-medium transition-colors ${
          selectedCategory === ""
            ? "bg-blue-500 text-white dark:bg-blue-600"
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        All Categories
      </button>
      {
        data?.pages.map((pages) =>
          pages.data.map((category) => (
            <button
              key={category._id}
              onClick={() => onCategoryChange(category.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.name
                  ? "bg-blue-500 text-white dark:bg-blue-600"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {category.name}
            </button>
          ))
        )
        // console.log(category);
      }

      <div ref={ref}></div>
    </div>
  );
}
