import { useState } from 'react';
import CodeEditor from './CodeEditor';
import CodePreview from './CodePreview';
import ReactMarkdown from 'react-markdown';
import Select from 'react-select';
import CustomSelect from './CustomSelect';

export default function SnippetDetail({ snippet, onClose }) {
  const [comment, setComment] = useState('');
  const [upvoted, setUpvoted] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(snippet.code);
  const [editedTitle, setEditedTitle] = useState(snippet.title);
  const [editedDescription, setEditedDescription] = useState(snippet.description);
  const [selectedVersion, setSelectedVersion] = useState({ value: 'current', label: 'Current Version' });
console.log(snippet);

  // Dummy collections data
  const collections = [
    { id: 1, name: 'Favorite Snippets' },
    { id: 2, name: 'React Hooks' },
    { id: 3, name: 'Utility Functions' },
  ];

  // Dummy version history
  const versions = [
    { value: 'current', label: 'Current Version', date: new Date().toISOString() },
    { value: 'v2', label: 'Version 2', date: '2024-02-15T10:30:00Z' },
    { value: 'v1', label: 'Version 1', date: '2024-02-10T15:45:00Z' },
  ];

  const handleUpvote = () => {
    setUpvoted(!upvoted);
  };

  const handleAddToCollection = () => {
    if (selectedCollection) {
      console.log(`Added to collection: ${selectedCollection}`);
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      console.log('New comment:', comment);
      setComment('');
    }
  };

  const handleUpdate = () => {
    console.log('Updated snippet:', {
      title: editedTitle,
      description: editedDescription,
      code: editedCode,
    });
    setIsEditing(false);
  };

  const handleVersionChange = (option) => {
    setSelectedVersion(option);
    // In a real app, fetch the code for this version
    console.log(`Fetching version: ${option.value}`);
  };

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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{snippet.title}</h2>
          )}
          <div className="flex items-center space-x-4">
            {snippet.isOwner && !isEditing && (
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Code</h3>
                {/* <div className="w-64  ">
                  <Select

                    value={selectedVersion}
                    onChange={handleVersionChange}
                    options={versions}
                    isSearchable={false}
                    className="text-sm"
             

                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        neutral0: 'var(--bg-color, white)',
                        neutral80: 'var(--text-color, black)',
                      },
                    })}
                  />
                   
                </div> */}
                 <div className="w-64">

          <CustomSelect options={versions} value={selectedVersion} onChange={handleVersionChange} />
    </div>
              </div>
              <CodeEditor
                value={isEditing ? editedCode : snippet.code}
                onChange={setEditedCode}
                language={snippet.language}
                height="300px"
                readOnly={!isEditing}
              />
            </div>

            <CodePreview 
              code={isEditing ? editedCode : snippet.code}
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
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">How it works</h3>
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
                <button
                  onClick={handleUpvote}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
                    upvoted
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span>{upvoted ? snippet.likes + 1 : snippet.likes}</span>
                </button>
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
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Version History</h3>
              <div className="space-y-4">
                {versions.map((version) => (
                  <div
                    key={version.value}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{version.label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(version.date).toLocaleDateString()} at{' '}
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

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Comments</h3>
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
                      <span className="font-semibold text-gray-900 dark:text-white">John Doe</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">2 days ago</span>
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
    </div>
  );
}