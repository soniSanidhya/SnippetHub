import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import useAuthStore from "../../store/authStore";
import { api } from "../../utils/axiosHelper";
import { showError, showSuccess } from "../../utils/toast";


const fetchCollections = (username) => api.get(`/collection/${username}`);
const postCollection = (collectionId , snippetId) => api.post(`/collection/${collectionId}/${snippetId}`);

const SnippetCollection = ({ snippet }) => {
  const [selectedCollection, setSelectedCollection] = useState("");
    const { user } = useAuthStore();
  const {
    data: collections,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["collections", user?.username],
    queryFn: () => fetchCollections(user?.username),
    staleTime: 1000 * 60 * 2,
  });

  const {mutate : addSnippetToCollectionMutation} = useMutation({
    mutationKey : ["addSnippetToCollection"],
    mutationFn : (snippetId)=> postCollection(selectedCollection, snippetId),
    onSuccess : (data)=>{
        // console.log(data);
        showSuccess('Snippet added to collection');
    },
    onError : (error)=>{
      const parser = new DOMParser();
      const doc = parser.parseFromString(error.response.data, 'text/html');
      const msg = doc.querySelector('pre').textContent.split('at')[0].trim();
      showError(msg);
    }
  })

  // console.log(snippet);
//   const collections = [
//     { id: 1, name: "Favorite Snippets" },
//     { id: 2, name: "React Hooks" },
//     { id: 3, name: "Utility Functions" },
//   ];
  
const handleAddToCollection = () => {
    if (selectedCollection) {
        addSnippetToCollectionMutation(snippet._id);
      // console.log(`Added to collection: ${selectedCollection}`);
    }
  };

//   if (isLoading) return 
//   <div className="w-full flex justify-center items-center">
//   <div >
    
//   </div>
// </div>;

  return (
    <div className="flex items-center space-x-2">
      <select
        value={selectedCollection}
        onChange={(e) => setSelectedCollection(e.target.value)}
        className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <option value="">Select collection...</option>
        {collections && collections?.data.data?.map((collection) => (
          <option key={collection._id} value={collection._id}>
            {collection.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleAddToCollection}
        disabled={!selectedCollection}
        className="bg-blue-500 text-white px-4 py-1 rounded-lg disabled:opacity-50 hover:bg-blue-600"
      >
        Add
      </button>
    </div>
  );
};

export default SnippetCollection;
