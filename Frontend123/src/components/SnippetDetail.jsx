import { useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";
import CodePreview from "./CodePreview";
import ReactMarkdown from "react-markdown";
import Select from "react-select";
import CustomSelect from "./CustomSelect";
import api from "../Utils/axiosHelper";
import { useQuery } from "@tanstack/react-query";

const fetchVersions = (snippetId) => api.get(`/snippet/v/${snippetId}`);

export default function SnippetDetail({ snippet, onClose }) {
  const [comment, setComment] = useState("");
  const [votes, setVotes] = useState({ up: snippet.likes, down: 0 });
  const [userVote, setUserVote] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(snippet.code);
  const [editedTitle, setEditedTitle] = useState(snippet.title);
  const [editedDescription, setEditedDescription] = useState(
    snippet.description
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState(null); // 'version' or 'snippet'
  
  const {
    data: versions,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["versions", snippet.id],
    queryFn: () => fetchVersions(snippet._id),
  });
  
  console.log(versions);
  
  const [selectedVersion, setSelectedVersion] = useState({
    value: snippet.currentVersion._id,
    label: `Version ${snippet?.currentVersion?.version ? parseFloat(snippet.currentVersion.version).toFixed(1) : 1.0}`,
    code : snippet?.currentVersion?.updatedCode
  } );

  useEffect(() => {
    console.log(selectedVersion);
    
  } , [selectedVersion]);

  // Dummy collections data
  const collections = [
    { id: 1, name: "Favorite Snippets" },
    { id: 2, name: "React Hooks" },
    { id: 3, name: "Utility Functions" },
  ];

  // Dummy version history
  // const [versionss, setVersions] = useState([
  //   {
  //     value: "current",
  //     name: "Current Version",
  //     date: new Date().toISOString(),
  //   },
  //   { value: "v2", label: "Version 2", date: "2024-02-15T10:30:00Z" },
  //   { value: "v1", name: "Version 1", date: "2024-02-10T15:45:00Z" },
  // ]);

  const handleVote = (type) => {
    if (userVote === type) {
      setVotes((prev) => ({
        ...prev,
        [type]: prev[type] - 1,
      }));
      setUserVote(null);
    } else {
      setVotes((prev) => ({
        ...prev,
        [type]: prev[type] + 1,
        [type === "up" ? "down" : "up"]:
          userVote === (type === "up" ? "down" : "up")
            ? prev[type === "up" ? "down" : "up"] - 1
            : prev[type === "up" ? "down" : "up"],
      }));
      setUserVote(type);
    }
  };

  const handleAddToCollection = () => {
    if (selectedCollection) {
      console.log(`Added to collection: ${selectedCollection}`);
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      console.log("New comment:", comment);
      setComment("");
    }
  };

  const handleUpdate = () => {
    console.log("Updated snippet:", {
      title: editedTitle,
      description: editedDescription,
      code: editedCode,
    });
    setIsEditing(false);
  };

  const handleVersionChange = (option) => {
    setSelectedVersion(option);
    console.log(`Fetching version: ${option.value}`);
  };

  const handleDelete = (type) => {
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteType === "version") {
      setVersions(versions.filter((v) => v.value !== selectedVersion.value));
      setSelectedVersion(versions[0]);
    } else if (deleteType === "snippet") {
      console.log("Deleting entire snippet");
      onClose();
    }
    setShowDeleteModal(false);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          Loading...
        </div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          Error loading versions
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
            />
          ) : (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {snippet.title}
            </h2>
          )}
          <div className="flex items-center space-x-4">
            {snippet?.isOwner && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Code
                </h3>
                <div className="w-64">
                  <CustomSelect
                    onChange={handleVersionChange}
                    options={versions?.data.data.map((version) => ({
                      value: version._id,
                      label: `Version ${version.version.toFixed(1)}`,
                      code : version.updatedCode
                    }))}
                    value={selectedVersion}
                  />
                </div>
              </div>
              <CodeEditor
                value={
                  isEditing ? editedCode : selectedVersion?.code || snippet.code
                }
                onChange={setEditedCode}
                language={snippet.language}
                height="300px"
                readOnly={!isEditing}
              />
            </div>

            <CodePreview
              code={isEditing ? editedCode : snippet.currentVersion.updatedCode}
              language={snippet.language}
            />

            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  rows="3"
                />
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                How it works
              </h3>
              <div className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <ReactMarkdown>
                  {snippet.documentation || "No documentation available."}
                </ReactMarkdown>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
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
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleVote("up")}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg ${
                      userVote === "up"
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
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
                    <span>{votes.up}</span>
                  </button>
                  <button
                    onClick={() => handleVote("down")}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg ${
                      userVote === "down"
                        ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                    <span>{votes.down}</span>
                  </button>
                </div>
                <span className="text-gray-500 dark:text-gray-400">
                  {snippet.comments} comments
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select collection...</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
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
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Version History
                </h3>
                {snippet.isOwner && selectedVersion.value !== "current" && (
                  <button
                    onClick={() => handleDelete("version")}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete Version
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {versions?.data.data.map((version) => (
                  <div
                    key={version.version}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Version {version.version?.toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(version.date).toLocaleDateString()} at{" "}
                        {new Date(version.date).toLocaleTimeString()}
                      </p>
                    </div>
                    {version.value !== selectedVersion.value && (
                      <button
                        onClick={() => handleVersionChange(version)}
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {snippet.isOwner && (
              <div className="flex justify-end">
                <button
                  onClick={() => handleDelete("snippet")}
                  className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete Snippet
                </button>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Comments
              </h3>
              <form onSubmit={handleComment} className="mb-4">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  rows="3"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Post Comment
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        John Doe
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        2 days ago
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Great snippet! I've been looking for something like this.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {deleteType === "version" ? "Delete Version" : "Delete Snippet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {deleteType === "version"
                ? `Are you sure you want to delete version "${selectedVersion.label}"?`
                : "Are you sure you want to delete this snippet? This action cannot be undone."}
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
  );
}
