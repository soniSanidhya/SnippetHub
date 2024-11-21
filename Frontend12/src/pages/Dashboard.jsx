import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats] = useState({
    snippets: 12,
    collections: 3,
    likes: 45,
    views: 230,
  });

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'snippet_created',
      title: 'React Custom Hook for API Calls',
      date: '2024-02-20',
    },
    {
      id: 2,
      type: 'collection_created',
      title: 'React Hooks Collection',
      date: '2024-02-19',
    },
    {
      id: 3,
      type: 'snippet_liked',
      title: 'Python Data Processing Script',
      date: '2024-02-18',
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg dark:bg-gray-800  shadow-md p-6">
            <h3 className="text-lg font-medium  text-gray-600 mb-2">Snippets</h3>
            <p className="text-3xl font-bold">{stats.snippets}</p>
          </div>
          <div className="bg-white dark:bg-gray-800  rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-600 mb-2">Collections</h3>
            <p className="text-3xl font-bold">{stats.collections}</p>
          </div>
          <div className="bg-white dark:bg-gray-800  rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-600 mb-2">Likes</h3>
            <p className="text-3xl font-bold">{stats.likes}</p>
          </div>
          <div className="bg-white dark:bg-gray-800  rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-600 mb-2">Views</h3>
            <p className="text-3xl font-bold">{stats.views}</p>
          </div>
        </div>

        <div className="grid grid-cols-1  lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800  rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-500">
                      {activity.type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800  rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/create"
                className="flex items-center justify-center p-4 bg-blue-50 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors"
              >
                Create Snippet
              </Link>
              <Link
                to="/collections"
                className="flex items-center justify-center p-4 bg-purple-50 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors"
              >
                View Collections
              </Link>
              <Link
                to="/profile"
                className="flex items-center justify-center p-4 bg-green-50 rounded-lg text-green-700 hover:bg-green-100 transition-colors"
              >
                Edit Profile
              </Link>
              <Link
                to="/explore"
                className="flex items-center justify-center p-4 bg-yellow-50 rounded-lg text-yellow-700 hover:bg-yellow-100 transition-colors"
              >
                Explore Snippets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}