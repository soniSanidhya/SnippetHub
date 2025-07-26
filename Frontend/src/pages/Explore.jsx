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
      className="glass-card p-6 cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
      onClick={() => handleSnippetClick(snippet)}
    >
      <div className="flex items-center max-w-full mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-white drop-shadow-md group-hover:text-blue-300 transition-colors">
            {snippet?.title.length > 30 ? snippet.title.slice(0, 30) + "..." : snippet.title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Link
              to={`/user/${snippet.owner.username}`}
              className="flex items-center space-x-2 hover:text-blue-300 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-6 h-6 glass-card rounded-full flex items-center justify-center">
                {snippet.owner?.avatar ? (
                  <img
                    src={snippet.owner?.avatar}
                    alt={snippet.owner?.fullName || snippet.owner?.username}
                    className="w-8 h-8 rounded-full ring-2 ring-white/20"
                  />
                ) : (
                  <div className="w-8 h-8 glass-card rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {snippet.owner?.fullName?.charAt(0) || snippet.owner?.username?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-white">{snippet.owner.username}</span>
            </Link>
            <span className="text-gray-400">•</span>
            <span className="text-gray-300">{new Date(snippet.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <span className="glass-card bg-blue-500/30 text-blue-200 px-3 py-1 rounded-full text-sm border border-blue-400/30">
          {snippet.language}
        </span>
        <span className="glass-card bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-sm border border-purple-400/30">
          {snippet.category[0].name}
        </span>
      </div>
      <p className="text-gray-200 mb-4 drop-shadow-sm">
        {snippet?.description?.length > 100 ? snippet.description.slice(0, 100) + "..." : snippet.description}
      </p>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-gray-300">
          <div className="flex items-center space-x-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <span>{snippet.voteCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <span>{snippet.commentCount}</span>
          </div>
        </div>
      </div>
      <div className="glass-card rounded-lg overflow-hidden border border-white/20">
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
    <div className="min-h-screen py-8 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="glass-card p-6 mb-6 text-center">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">Explore Snippets</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mt-2"></div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 max-sm:flex-col max-sm:items-start">
              <div className="w-full glass-card rounded-lg border border-white/20">
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