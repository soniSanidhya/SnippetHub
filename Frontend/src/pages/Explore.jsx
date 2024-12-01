import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import SnippetDetail from "../components/SnippetDetail";
import CategoryFilter from "../components/CategoryFilter";
import { api } from "../utils/axiosHelper";
import { useQuery } from "@tanstack/react-query";
import CustomSelect from "../components/CustomSelect";
import SearchAutocomplete from "../components/ui/SearchAutocomplete ";
import { useInView } from "react-intersection-observer";
import { InfinitySpin } from "react-loader-spinner";
const fetchQuerySnippets = (query) => api.get("/search", { params: query });

const fetchSnippet = () => api.get("/snippet");

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [selectedSort, setSelectedSort] = useState("voteCount");
  const [selectedOrder, setSelectedOrder] = useState();
  const [selectedSortShow, setSelectedSortShow] = useState({
    value: "mostLiked",
    label: "Most Liked",
  });
  const { ref, inView } = useInView();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["snippets"],
    queryFn: fetchSnippet,
    staleTime: 1000 * 60 * 2,
  });
  // const snippets = [];

  const {
    data: searchResults,
    isLoading: isSearchLoading,
    isError: isSearchError,
    error: searchError,
    refetch: fetchSearch,
  } = useQuery({
    queryKey: ["searchResults", searchQuery],
    queryFn: () =>
      fetchQuerySnippets({
        query: searchQuery,
        language: selectedLanguage,
        category: selectedCategory,
        sortBy: selectedSort,
        sortOrder: selectedOrder,
      }),
    enabled: false,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (inView) {
      console.log("fetching in view");

      fetchSearch();
    }
  }, [inView, fetchSearch]);

  useEffect(() => {
    fetchSearch();
    console.log("something changed");
  }, [selectedCategory, selectedLanguage, selectedSort, selectedOrder]);

  // const filteredSnippets = data?.data?.data?.filter((snippet) => {
  //   const matchesCategory =
  //     selectedCategory === "all" ||
  //     snippet.category?.some(
  //       (category) =>
  //         category?.name?.toLowerCase() == selectedCategory.toLowerCase()
  //     );
  //   const matchesLanguage =
  //     !selectedLanguage || snippet.language === selectedLanguage;
  //   const matchesSearch =
  //     snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     snippet?.description.toLowerCase().includes(searchQuery.toLowerCase());
  //   return matchesCategory && matchesLanguage && matchesSearch;
  // });

  const snippetCard = (snippet) => (
    <div
      key={snippet._id}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => setSelectedSnippet(snippet)}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            {snippet.title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Link
              to={`/user/${snippet.owner.username}`}
              className="flex items-center space-x-2 hover:text-blue-500"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-xs">
                  {snippet.owner.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span>{snippet.owner.username}</span>
            </Link>
            <span>•</span>
            <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
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
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {snippet.description}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
            {snippet.voteCount}
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            {snippet.commentCount}
          </div>
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

  if (isSearchLoading) {
    return (
      <div className="w-full h-[90vh] flex justify-center items-center">
        <div>
          <InfinitySpin
            visible={true}
            width="200"
            color="#4F46E5"
            ariaLabel="infinity-spin-loading"
          />
        </div>
      </div>
    );
  }

  if (isSearchError) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Explore Snippets
          </h1>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-full flex border   border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg ">
                {/* <input
                  type="text"
                  placeholder="Search snippets..."
                  className=" p-2 flex-1   bg-transparent  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500  text-gray-900 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                /> */}
                {/* <CustomSelect
                onChange={value => setSearchQuery(value.value)}
                // onCreateOption={}
                value={{value : searchQuery , label : searchQuery}}
                // options={}
                isSearchable={true}
              /> */}
                <SearchAutocomplete
                  className="flex-1"
                  setSearchQuery={setSearchQuery}
                  searchQuery={searchQuery}
                  fetchSearch={fetchSearch}
                />
              </div>
              {/* <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="p-2 flex-[20%] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">All Languages</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select> */}
              <div className="flex-[20%]">
                <CustomSelect
                  onChange={(value) => {
                    setSelectedLanguage(value.value);

                    console.log(value.value);
                  }}
                  value={{
                    value: selectedLanguage,
                    label: selectedLanguage || "All Languages",
                  }}
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
                    console.log(value.value);

                    switch (value.value) {
                      case "newest": {
                        setSelectedSort("createdAt");
                        setSelectedOrder("desc");
                        break;
                      }
                      case "oldest": {
                        setSelectedSort("createdAt");
                        setSelectedOrder("asc");
                        break;
                      }
                      case "mostLiked": {
                        setSelectedSort("voteCount");
                        setSelectedOrder("desc");
                        break;
                      }
                      case "leastLiked": {
                        setSelectedSort("voteCount");
                        setSelectedOrder("asc");
                        break;
                      }
                      case "mostCommented": {
                        setSelectedSort("commentCount");
                        setSelectedOrder("desc");
                        break;
                      }
                      case "leastCommented": {
                        setSelectedSort("commentCount");
                        setSelectedOrder("asc");
                        break;
                      }
                      case "mostViewed": {
                        setSelectedSort("views");
                        setSelectedOrder("desc");
                        break;
                      }
                      case "leastViewed": {
                        setSelectedSort("views");
                        setSelectedOrder("asc");
                        break;
                      }
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
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults?.data?.data?.snippets?.map(snippetCard)}
          <div ref={ref}></div>
        </div>

        {selectedSnippet && (
          <SnippetDetail
            snippet={selectedSnippet}
            onClose={() => setSelectedSnippet(null)}
          />
        )}
      </div>
    </div>
  );
}
