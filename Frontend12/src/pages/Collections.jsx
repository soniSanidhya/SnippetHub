import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Collections() {
  const [collections] = useState([
    {
      id: 1,
      name: 'React Hooks',
      description: 'Collection of useful React hooks',
      snippetCount: 5,
      lastUpdated: '2024-02-20',
      tags: ['react', 'hooks', 'frontend'],
    },
    {
      id: 2,
      name: 'Database Queries',
      description: 'Optimized SQL and NoSQL queries',
      snippetCount: 3,
      lastUpdated: '2024-02-19',
      tags: ['sql', 'database', 'backend'],
    },
    {
      id: 3,
      name: 'CSS Tricks',
      description: 'Useful CSS snippets and animations',
      snippetCount: 8,
      lastUpdated: '2024-02-18',
      tags: ['css', 'animation', 'frontend'],
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
  });

  const handleCreateCollection = (e) => {
    e.preventDefault();
    // Handle collection creation
    console.log('New collection:', newCollection);
    setShowCreateModal(false);
    setNewCollection({ name: '', description: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Collections</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Collection
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              to={`/collections/${collection.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{collection.name}</h3>
              <p className="text-gray-600 mb-4">{collection.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{collection.snippetCount} snippets</span>
                <span>Updated {collection.lastUpdated}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {collection.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Create New Collection</h2>
              <form onSubmit={handleCreateCollection} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newCollection.name}
                    onChange={(e) =>
                      setNewCollection({ ...newCollection, name: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newCollection.description}
                    onChange={(e) =>
                      setNewCollection({ ...newCollection, description: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-500 hover:text-gray-700"
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