import { useState } from "react";
import { Link } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../utils/axiosHelper";
import SnippetReadme from "../components/snippet/SnippetReadme";
import MDEditor, { title } from "@uiw/react-md-editor";
import { showError, showSuccess } from "../utils/toast";
import { InfinitySpin } from "react-loader-spinner";

const fetchSnippet = () => api.get("/user/getSnippets/");
const getStats = () => api.get("/dashboard/stats");
const putSnippet = (snippetId, data) => api.put(`/snippet/${snippetId}`, data );
const deleteSnippet = (snippetId) => api.delete(`/snippet/${snippetId}`);
export default function Dashboard() {

  const queryClient = useQueryClient();
  // const [stats] = useState({
  //   snippets: 12,
  //   collections: 3,
  //   likes: 45,
  //   views: 230,
  // });
  const [editingSnippet, setEditingSnippet] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [snippetToDelete, setSnippetToDelete] = useState(null);
  const [mySnippets, setMySnippets] = useState([
    {
      id: 1,
      title: "React Custom Hook for API Calls",
      description: "A reusable custom hook for handling API calls",
      language: "javascript",
      code: `const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, loading, error };
};`,
      createdAt: "2024-02-20",
      likes: 42,
      views: 156,
    },
    {
      id: 2,
      title: "Python Data Processing Script",
      description: "Efficient script for processing large CSV files",
      language: "python",
      code: `import pandas as pd

def process_csv(filename):
    df = pd.read_csv(filename)
    df = df.dropna()
    df = df.drop_duplicates()
    
    result = df.groupby('category').agg({
        'value': ['mean', 'sum', 'count']
    })
    
    return result`,
      createdAt: "2024-02-19",
      likes: 28,
      views: 98,
    },
  ]);

  // const [updatedSnippet , setUpdatedSnippet] = useState({});

  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
    error: statsError,
  } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  const {
    data: snippets,
    isLoading: isSnippetsLoading,
    isError: isSnippetsError,
    error: snippetsError,
  } = useQuery({
    queryKey: ["mysSnippets"],
    queryFn: fetchSnippet,
  });

  const {mutate: updateSnippet} = useMutation({
    mutationFn: ({ snippetId, data }) => putSnippet(snippetId, data),
    onMutate: async (data) => {
      
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("mySnippets");
      // console.log(data);
      showSuccess("Snippet updated successfully");
    },
    onError: (error, variables, context) => {
      // console.log(error);
    },
  });

  const {mutate: deleteSnippetMutation} = useMutation({
    mutationFn: (snippetId) => deleteSnippet(snippetId),
    
    onSuccess: (data) => {
      queryClient.invalidateQueries("mySnippets");
      // console.log(data);
      showSuccess("Snippet deleted successfully");
    },
    onError: (error, variables, context) => {
      // console.log(error);
      showError("Something went wrong while deleting snippet");
    },
  })

  // console.log(stats);
  // console.log(snippets);

 

  // console.log(editingSnippet);

  const handleEdit = (snippet) => {
    setEditingSnippet({
      _id : snippet._id,
      title: snippet.title,
      description: snippet.description,
      code: snippet.currentVersion.updatedCode,
      documentation: snippet.documentation,
      language: snippet.language,
      tags : snippet.tags?.toString()
    });
  };

  const handleUpdate = () => {

    // console.log(editingSnippet);
    

    updateSnippet({snippetId: editingSnippet._id, data : editingSnippet });

    // setMySnippets((snippets) =>
    //   snippets.map((snippet) =>
    //     snippet.id === editingSnippet.id
    //       ? {
    //           ...snippet,
    //           title: editingSnippet.newTitle,
    //           description: editingSnippet.newDescription,
    //           code: editingSnippet.newCode,
    //         }
    //       : snippet
    //   )
    // );
    setEditingSnippet(null);
  };

  const handleDelete = (snippet) => {
    setSnippetToDelete(snippet);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {

    deleteSnippetMutation(snippetToDelete._id);

    // setMySnippets((snippets) =>
    //   snippets.filter((snippet) => snippet.id !== snippetToDelete.id)
    // );
    
    setShowDeleteModal(false);
    setSnippetToDelete(null);
  };

  if (isStatsLoading || isSnippetsLoading) return <div className="w-full h-[90vh] flex justify-center items-center">
  <div>
    <InfinitySpin
      visible={true}
      width="200"
      color="#4F46E5"
      ariaLabel="infinity-spin-loading"
    />
  </div>
</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              Snippets
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats?.data.data?.snippetCount}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              Collections
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats?.data.data?.collectionCount}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              Likes
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats?.data.data?.upVoteCount}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              Views
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats?.data.data?.views}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                My Snippets
              </h2>
              <Link
                to="/create"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Create New Snippet
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {snippets?.data.data.map((snippet) => (
              <div key={snippet._id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {snippet.title?.length < 30 ? snippet.title : `${snippet.title.substring(0, 30)}...`}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {snippet?.description?.length > 100 ? `${snippet.description.slice(0, 100)}...` : snippet.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{snippet.language}</span>
                      <span>
                        Created on{" "}
                        {new Date(snippet.createdAt).toLocaleDateString()}
                      </span>
                      <span>{snippet.voteCount} likes</span>
                      <span>{snippet.views} views</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(snippet)}
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(snippet)}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <CodeEditor
                  value={snippet.currentVersion.updatedCode}
                  language={snippet.language}
                  height="200px"
                  readOnly={true}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Edit Modal */}
        {editingSnippet && (
          <div className="fixed  inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white max-h-[95vh] overflow-auto dark:bg-gray-800 rounded-lg w-full max-w-3xl">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Edit Snippet
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editingSnippet.title}
                      onChange={(e) =>
                        setEditingSnippet({
                          ...editingSnippet,
                          title: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editingSnippet.description}
                      onChange={(e) =>
                        setEditingSnippet({
                          ...editingSnippet,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={editingSnippet.tags}
                      onChange={(e) =>
                        setEditingSnippet({
                          ...editingSnippet,
                          tags: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Code
                    </label>
                    <CodeEditor
                      value={editingSnippet.code}
                      onChange={(value) =>
                        setEditingSnippet({
                          ...editingSnippet,
                          code: value,
                        })
                      }
                      language={editingSnippet.language}
                      height="300px"
                    />
                  </div>
                  {/* <SnippetReadme onReadmeChange={(value) => setEditingSnippet({
                        ...editingSnippet,
                        doecumentation: value
                      })} snippet={editingSnippet} isOwner={true} /> */}
                  <MDEditor
                    value={editingSnippet.documentation}
                    onChange={(value) => {
                      setEditingSnippet({
                        ...editingSnippet,
                        documentation: value,
                      });
                    }}
                    preview="edit"
                    height={400}
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setEditingSnippet(null)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Delete Snippet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete "{snippetToDelete?.title}"? This
                action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
