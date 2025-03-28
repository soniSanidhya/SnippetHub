import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import CategoryFilter from "../components/CategoryFilter";
import { api } from "../utils/axiosHelper";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import CustomSelect from "../components/CustomSelect";
import SearchAutocomplete from "../components/ui/SearchAutocomplete ";
import { useInView } from "react-intersection-observer";
import { InfinitySpin } from "react-loader-spinner";
import SnippetCardSkeleton from "../components/skeletons/SnippetCardSkeleton";

const fetchQuerySnippets = ({ pageParam, query, language, category, sortBy, sortOrder }) => {
  return api.get("/search", {
    params: { page: pageParam, query, language, category, sortBy, sortOrder },
  });
};

const fetchSnippet = () => api.get("/snippet");

export default function Explore() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial values from URL parameters
  const initialSearchQuery = searchParams.get("search") || "";
  const initialLanguage = searchParams.get("language") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialSort = searchParams.get("sortBy") || "voteCount";
  const initialOrder = searchParams.get("sortOrder") || "desc";

  // Local state for filters managed via URL
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [selectedOrder, setSelectedOrder] = useState(initialOrder);
  const [selectedSortShow, setSelectedSortShow] = useState({
    value: "mostLiked",
    label: "Most Liked",
  });

  const { ref, inView } = useInView();

  // Optional: load some initial snippets if needed (this query is kept separate)
  const { data: snippetsData, isLoading: snippetsLoading } = useQuery({
    queryKey: ["snippets"],
    queryFn: fetchSnippet,
    staleTime: 1000 * 60 * 2,
  });

  // Use infinite query for search results which depend on all filter values.
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    isError: isSearchError,
    error: searchError,
    fetchNextPage,
    refetch: refetchSearch,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["searchResults", searchQuery, selectedLanguage, selectedCategory, selectedSort, selectedOrder],
    queryFn: ({ pageParam }) =>
      fetchQuerySnippets({
        query: searchQuery,
        language: selectedLanguage,
        category: selectedCategory,
        sortBy: selectedSort,
        sortOrder: selectedOrder,
        pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.length === 0) return undefined;
      return allPages.length + 1;
    },
  });

  // Whenever any filter value changes, update the URL and trigger a refetch.
  useEffect(() => {
    const params = {
      search: searchQuery,
      language: selectedLanguage,
      category: selectedCategory,
      sortBy: selectedSort,
      sortOrder: selectedOrder,
    };
    setSearchParams(params);
    refetchSearch();
  }, [searchQuery, selectedLanguage, selectedCategory, selectedSort, selectedOrder, setSearchParams, refetchSearch]);

  // Infinite scroll: if we are in view and more pages exist, fetch next page.
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handleSnippetClick = (snippet) => {
    navigate(`/snippet/details/?title=${snippet.title}&id=${snippet._id}`);
  };

  // Renders each snippet card from search results.
  const snippetCard = (snippet) => (
    <div
      key={snippet._id}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => handleSnippetClick(snippet)}
    >
      <div className="flex items-center max-w-full mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            {snippet?.title.length > 30 ? snippet.title.slice(0, 30) + "..." : snippet.title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Link
              to={`/user/${snippet.owner.username}`}
              className="flex items-center space-x-2 hover:text-blue-500"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                {snippet.owner?.avatar ? (
                  <img
                    src={snippet.owner?.avatar}
                    alt={snippet.owner?.fullName || snippet.owner?.username}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {snippet.owner?.fullName?.charAt(0) || snippet.owner?.username?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <span>{snippet.owner.username}</span>
            </Link>
            <span>•</span>
            <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm">
          {snippet.language}
        </span>
        <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-sm">
          {snippet.category[0].name}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {snippet?.description?.length > 100 ? snippet.description.slice(0, 100) + "..." : snippet.description}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-300">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          {snippet.voteCount}
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          {snippet.commentCount}
        </div>
      </div>
      <div className="mt-4">
        <CodeEditor
          value={snippet.currentVersion.updatedCode}
          language={snippet.language}
          height="200px"
          readOnly={true}
          preview={true}
        />
      </div>
    </div>
  );

  if (isSearchError) return <div>{searchError?.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Explore Snippets</h1>
          <div className="space-y-4">
            <div className="flex items-center gap-4 max-sm:flex-col max-sm:items-start">
              <div className="w-full flex border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg">
                <SearchAutocomplete
                  className="flex-1"
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-[20%]">
                  <CustomSelect
                    onChange={(value) => setSelectedLanguage(value.value)}
                    value={{ value: selectedLanguage, label: selectedLanguage || "All Languages" }}
                    options={[
                      { value: "", label: "All Languages" },
                      { value: "javascript", label: "JavaScript" },
                      { value: "typescript", label: "TypeScript" },
                      { value: "python", label: "Python" },
                      { value: "java", label: "Java" },
                      { value: "cpp", label: "C++" },
                      { value: "ruby", label: "Ruby" },
                    ]}
                  />
                </div>
                <div className="flex-[20%]">
                  <CustomSelect
                    onChange={(value) => {
                      setSelectedSortShow(value);
                      switch (value.value) {
                        case "newest":
                          setSelectedSort("createdAt");
                          setSelectedOrder("desc");
                          break;
                        case "oldest":
                          setSelectedSort("createdAt");
                          setSelectedOrder("asc");
                          break;
                        case "mostLiked":
                          setSelectedSort("voteCount");
                          setSelectedOrder("desc");
                          break;
                        case "leastLiked":
                          setSelectedSort("voteCount");
                          setSelectedOrder("asc");
                          break;
                        case "mostCommented":
                          setSelectedSort("commentCount");
                          setSelectedOrder("desc");
                          break;
                        case "leastCommented":
                          setSelectedSort("commentCount");
                          setSelectedOrder("asc");
                          break;
                        case "mostViewed":
                          setSelectedSort("views");
                          setSelectedOrder("desc");
                          break;
                        case "leastViewed":
                          setSelectedSort("views");
                          setSelectedOrder("asc");
                          break;
                        default:
                          break;
                      }
                    }}
                    value={selectedSortShow}
                    options={[
                      { value: "newest", label: "Newest First" },
                      { value: "oldest", label: "Oldest First" },
                      { value: "mostLiked", label: "Most Liked" },
                      { value: "leastLiked", label: "Least Liked" },
                      { value: "mostCommented", label: "Most Commented" },
                      { value: "leastCommented", label: "Least Commented" },
                      { value: "mostViewed", label: "Most Viewed" },
                      { value: "leastViewed", label: "Least Viewed" },
                    ]}
                  />
                </div>
              </div>
            </div>
            <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          </div>
        </div>

        {isSearchLoading ? (
          // <div className="w-full h-[90vh] flex justify-center items-center">
          //   <InfinitySpin visible={true} width="200" color="#4F46E5" ariaLabel="infinity-spin-loading" />
          // </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SnippetCardSkeleton />
          <SnippetCardSkeleton />
          <SnippetCardSkeleton />
          <SnippetCardSkeleton />
          <SnippetCardSkeleton />
          <SnippetCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults?.pages?.map((page) =>
              (page?.data?.data?.snippets ?? []).map((snippet) => snippetCard(snippet))
            )}
            <div ref={ref}></div>
          </div>
        )}
      </div>
    </div>
  );
}