import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../Utils/axiosHelper.js";
import useAuthStore from "../store/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showSuccess } from "../Utils/toast.js";

const fetchCollections = (username) => api.get(`/collection/${username}`);
const postCollection = (collection) => api.post("/collection", collection);
const deleteCollection = (collectionId) =>
  api.delete(`/collection/${collectionId}`);

export default function Collections() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [collections, setCollection] = useState([
    /* ... previous collections data ... */
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["collections", user.username],
    queryFn: () => fetchCollections(user.username),
    staleTime: 1000 * 60 * 2,
  });
  console.log(data);

  const { mutate: createCollectionMutation } = useMutation({
    mutationKey: ["createCollection"],
    mutationFn: (collection) => postCollection(collection),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["collections", user.username]);
      console.log(data);
    },
  });

  const { mutate: deleteCollectionMutation } = useMutation({
    mutationKey: ["deleteCollection"],
    mutationFn: (collectionId) => deleteCollection(collectionId),
    onSuccess: (data) => {
      console.log(data);

      queryClient.invalidateQueries(["collections", user.username]);

      showSuccess("Collection deleted successfully");
    },
  });

  // useEffect(() => {
  //   if (data) {
  //     console.log(data.data.data);
  //     setCollection(prev => data.data.data);

  //   }
  // } , [data]);

  const handleCreateCollection = (e) => {
    e.preventDefault();
    console.log("New collection:", newCollection);
    setShowCreateModal(false);
    setNewCollection({ name: "", description: "" });
    createCollectionMutation(newCollection);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Collections
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Collection
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data &&
            data?.data?.data?.map((collection) => (
              <Link
                key={collection._id}
                to={`/collections/${collection._id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {collection.name}
                  </h3>
                  <svg
                    onClick={(e) => {
                      e.preventDefault();
                      deleteCollectionMutation(collection._id);
                    }}
                    className="w-6 h-6"
                    viewBox="0 0 24.00 24.00"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M10 12V17"
                        stroke="#bd0013"
                        strokeWidth="0.984"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                      <path
                        d="M14 12V17"
                        stroke="#bd0013"
                        strokeWidth="0.984"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                      <path
                        d="M4 7H20"
                        stroke="#bd0013"
                        strokWidth="0.984"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                      <path
                        d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
                        stroke="#bd0013"
                        strokeWidth="0.984"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                      <path
                        d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                        stroke="#bd0013"
                        strokeWidth="0.984"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {collection.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>{collection.snippets?.length} snippets</span>
                  <span>
                    Updated{" "}
                    {new Date(collection?.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Create New Collection
              </h2>
              <form onSubmit={handleCreateCollection} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newCollection.name}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        name: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newCollection.description}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    rows="3"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
