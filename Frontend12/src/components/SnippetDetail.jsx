import { useState } from 'react';
import CodeEditor from './CodeEditor';
import ReactMarkdown from 'react-markdown';

export default function SnippetDetail({ snippet, onClose }) {
  const [comment, setComment] = useState('');
  const [upvoted, setUpvoted] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('');

  // Dummy collections data
  const collections = [
    { id: 1, name: 'Favorite Snippets' },
    { id: 2, name: 'React Hooks' },
    { id: 3, name: 'Utility Functions' },
  ];

  const handleUpvote = () => {
    setUpvoted(!upvoted);
  };

  const handleAddToCollection = () => {
    if (selectedCollection) {
      console.log(`Added to collection: ${selectedCollection}`);
      // Add logic to save to collection
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      console.log('New comment:', comment);
      setComment('');
      // Add logic to save comment
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{snippet.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Code</h3>
              <CodeEditor
                value={snippet.code}
                language={snippet.language}
                height="400px"
                readOnly={true}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How it works</h3>
              <div className="prose max-w-none bg-gray-50 p-4 rounded-lg">
                <ReactMarkdown>
                  {snippet.documentation || "No documentation available."}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleUpvote}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
                    upvoted
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span>{upvoted ? snippet.likes + 1 : snippet.likes}</span>
                </button>
                <span className="text-gray-500">
                  {snippet.comments} comments
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1"
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
                  className="bg-blue-500 text-white px-4 py-1 rounded-lg disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Comments</h3>
              <form onSubmit={handleComment} className="mb-4">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Post Comment
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                {/* Dummy comments */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">John Doe</span>
                      <span className="text-gray-500 text-sm">2 days ago</span>
                    </div>
                  </div>
                  <p className="text-gray-700">
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