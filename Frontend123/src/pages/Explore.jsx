import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import SnippetDetail from "../components/SnippetDetail";
import CategoryFilter from "../components/CategoryFilter";
import api from "../utils/axiosHelper";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSnippets = async () => axios.get("http://localhost:8000/api/snippet");

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("");


  const { data : snippets , isError , isLoading , error  } = useQuery({
    queryKey: ["snippets"],
    queryFn: fetchSnippets,
    staleTime: 1000 * 60 * 5,
  })

  // console.log(data);
  
  // useEffect(() => {
  //   if (data) {
  //     // console.log(data.data.data);
  //     setSnippets(prev => [data.data.data]);
  //   }
  //   console.log(snippetss);
  // } , [data])
  
//   const snippets = [
//     {
//       id: 1,
//       title: "React Custom Hook for API Calls",
//       description: "A reusable custom hook for handling API calls",
//       language: "javascript",
//       category: "frontend",
//       author: "johndoe",
//       name: "John Doe",
//       createdAt: "2024-02-20",
//       likes: 42,
//       comments: 5,
//       code: `const useApi = (url) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(url);
//         const json = await response.json();
//         setData(json);
//         setLoading(false);
//       } catch (err) {
//         setError(err);
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [url]);

//   return { data, loading, error };
// };`,
//     },
//     {
//       id: 1,
//       name: "Sanidhya Soni",
//       title: "React Custom Hook for API Calls",
//       description:
//         "A reusable custom hook for handling API calls in React applications",
//       language: "javascript",
//       category: "frontend",
//       author: "johndoe",
//       likes: 42,
//       comments: 5,
//       isOwner: true,
//       documentation: `
// # useApi Hook

// A custom React hook for handling API calls with built-in loading and error states.

// ## Usage

// \`\`\`javascript
// const { data, loading, error } = useApi('https://api.example.com/data');
// \`\`\`

// ## Features

// - Automatic loading state
// - Error handling
// - Type-safe response
// - Automatic cleanup on unmount
// `,
//       code: `const useApi = (url) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(url);
//         const json = await response.json();
//         setData(json);
//         setLoading(false);
//       } catch (err) {
//         setError(err);
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [url]);

//   return { data, loading, error };
// };`,
//     },
//     {
//       id: 2,
//       name: "Sanidhya Soni",
//       title: "Python Data Processing Script",
//       description:
//         "Efficient script for processing large CSV files using pandas",
//       language: "python",
//       category: "backend",
//       author: "janedoe",
//       likes: 38,
//       comments: 3,
//       documentation: `
// # CSV Data Processor

// A Python script that efficiently processes large CSV files using pandas.

// ## Features

// - Automatic data cleaning
// - Duplicate removal
// - Group-by operations
// - Statistical analysis

// ## Example Usage

// \`\`\`python
// result = process_csv('data.csv')
// print(result)
// \`\`\`
// `,
//       code: `import pandas as pd

// def process_csv(filename):
//     # Read the CSV file
//     df = pd.read_csv(filename)
    
//     # Perform data cleaning
//     df = df.dropna()
//     df = df.drop_duplicates()
    
//     # Process the data
//     result = df.groupby('category').agg({
//         'value': ['mean', 'sum', 'count']
//     })
    
//     return result`,
//     },
//   ];




  const filteredSnippets = snippets?.data?.data.filter((snippet) => {
    const matchesCategory =
      selectedCategory === "all" || snippet.category.name === selectedCategory;
    const matchesLanguage =
      !selectedLanguage || snippet.language === selectedLanguage;
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.documentation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLanguage && matchesSearch;
  });

  const snippetCard = (snippet) => (
    <div
      key={snippet._id}
      className="bg-white flex flex-col justify-between dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => setSelectedSnippet(snippet)}
    >
    
        <div className="flex items-start   flex-col justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              {snippet.title}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm">
              {snippet.language}
            </span>
            {snippet.category && snippet?.category.map(category => (
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-sm">
              {category.name}
            </span>
            ))}
          </div>

          <p className="text-gray-600 dark:text-gray-300 my-2">
            {snippet?.description}
          </p>
        </div>
        <div className="">
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
              {snippet?.upVoteCount || 0}
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
              {snippet?.commentCount || 0}
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
        <div className="h-10 flex items-end">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Link
              to={`/user/${snippet?.owner?.username}`}
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
      </div>
      
    </div>
  );

  if(isLoading) return <div>Loading...</div>
  if(isError) return <div>Error: {error.message}</div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Explore Snippets
          </h1>
          <div className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search snippets..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">All Languages</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSnippets.map(snippetCard)}
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
