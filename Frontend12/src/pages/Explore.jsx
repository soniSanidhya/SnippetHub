import { useEffect, useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import SnippetDetail from '../components/SnippetDetail';
import CategoryFilter from '../components/CategoryFilter';

const fetchData = async () => {
  const response = await fetch('http://localhost:8000/api/snippet/');
  const result = await response.json();
  return { data: result.data }; // Extract data from the API response
};

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [snippets, setSnippets] = useState([]);

  useEffect(() => {
    fetchData().then(result => {
      // Transform the API data to match your existing component structure
      const transformedSnippets = result.data.map(snippet => ({
        id: snippet._id,
        title: snippet.title,
        description: snippet.documentation || '', // Use documentation as description
        language: snippet.language,
        category: snippet.category[0]?.name || 'uncategorized', // Get first category name
        author: snippet.owner?.username || 'Unknown',
        likes: 0, // Add logic to fetch likes if available
        comments: 0, // Add logic to fetch comments if available
        isOwner: true, // Add logic to determine ownership
        code: snippet.currentVersion?.updatedCode || '', // Use current version code
        documentation: snippet.documentation || ''
      }));

      setSnippets(transformedSnippets);
    });
  }, []);

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesCategory = selectedCategory === 'all' || snippet.category === selectedCategory;
    const matchesLanguage = !selectedLanguage || snippet.language === selectedLanguage;
    const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLanguage && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Explore Snippets</h1>
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
          {filteredSnippets.map((snippet) => (
            <div
              key={snippet.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedSnippet(snippet)}
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{snippet.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{snippet.description}</p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm">
                    {snippet.language}
                  </span>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-sm">
                    {snippet.category}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    {snippet.likes}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    {snippet.comments}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <CodeEditor
                  value={snippet.code}
                  language={snippet.language}
                  height="200px"
                  readOnly={true}
                  preview={true}
                />
              </div>
            </div>
          ))}
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