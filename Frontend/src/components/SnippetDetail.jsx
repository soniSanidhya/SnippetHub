import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import CodeEditor from "./CodeEditor";
import SnippetActions from "./snippet/SnippetActions";
import SnippetOwner from "./snippet/SnippetOwner";
import SnippetMetadata from "./snippet/SnippetMetadata";
import SnippetVersionControl from "./snippet/SnippetVersionControl";
import SnippetComments from "./snippet/SnippetComments";
import SnippetReadme from "./snippet/SnippetReadme";
import SnippetCodeExecution from "./snippet/SnippetCodeExecution";
import useAuthStore from "../store/authStore";
import { showSuccess, showError } from "../utils/toast";
import { useEffect, useState } from "react";
import SnippetCollection from "./snippet/SnippetCollection";
import { api } from "../utils/axiosHelper.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import RecommendedSnippets from "./snippet/RecommendedSnippets.jsx";
import { AlignLeftIcon, ArrowLeftIcon, MoveLeftIcon } from "lucide-react";

const fetchSnippetDetails = (id) => api.get(`snippet/snippet-details/${id}`);

const postSnippetView = (snippetId) => api.post(`/snippet/view/${snippetId}`);

export default function SnippetDetail({ onClose = () => {} }) {
  const { isAuthenticated, user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [snippet, setSnippet] = useState();
  const [isOwner , setIsOwner] = useState(false);
  const {
    data: snippetData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sippetDetails", searchParams.get("id")],
    queryFn: () => fetchSnippetDetails(searchParams.get("id")),
  });

  useEffect(() => {
    console.log(snippet);
    if (snippetData) {
      setSnippet(snippetData?.data.data);
    }
  }, [snippetData]);

  useEffect(() => {
    if(!user) return;
    if (snippet?.owner?._id === user?._id) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  })
  

  // const handleDelete = async () => {
  //   try {
  //     // API call would go here
  //     showSuccess('Snippet deleted successfully');
  //     onClose();
  //   } catch (error) {
  //     showError('Failed to delete snippet');
  //   }
  // };

  // useEffect(() => {
  //   console.log(searchParams.get('title'));
  //   console.log(searchParams.get('id'));
  // }
  // , [searchParams]

  // )

  console.log(snippet?.tags);

  const { mutate: postView } = useMutation({
    mutationFn: () => postSnippetView(snippet?._id),
  });

  useEffect(() => {
    postView();
  }, []);

  return (
    snippet && (
      <div className="h-full overflow-auto">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={()=>{
                window.history.back();
              }} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeftIcon size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
                {snippet.title}
              </h2>
              <SnippetMetadata snippet={snippet} />
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-6 flex flex-col lg:flex-row lg:space-y-0 lg:gap-6">
          <div className="flex-grow lg:w-2/3">
            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="text-gray-600 dark:text-gray-300 break-words">
                {snippet.description}
              </p>
            </div>

            <SnippetReadme snippet={snippet} isOwner={isOwner} />

            <div className="space-y-4 m-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Code
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Language:{" "}
                  </span>
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-1 rounded-full text-sm">
                    {snippet.language}
                  </span>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <CodeEditor
                  value={snippet.currentVersion.updatedCode || ""}
                  language={snippet.language || "javascript"}
                  height="400px"
                  readOnly={true}
                />
              </div>
            </div>

            <SnippetCodeExecution snippet={snippet} />

            <SnippetVersionControl snippet={snippet} isOwner={isOwner} />

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <SnippetOwner owner={snippet.owner} />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6 pb-2 flex justify-between items-center">
              <SnippetActions snippet={snippet} />
              {isAuthenticated && <SnippetCollection snippet={snippet} />}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-4">
              <SnippetComments
                snippet={snippet}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </div>
          
          <div className="lg:w-1/3 mt-6 lg:mt-0">
            <RecommendedSnippets tags={snippet?.tags} id={snippet?._id} />
          </div>
        </div>
      </div>
    )
  );
}
