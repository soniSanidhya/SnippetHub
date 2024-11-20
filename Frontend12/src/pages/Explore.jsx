import { useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import SnippetDetail from '../components/SnippetDetail';
import CategoryFilter from '../components/CategoryFilter';

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [snippets, setSnippets] = useState([]);
  snippets = async () => {fetch('http://localhost:8000/api/snippets')}
  
  // Dummy data for demonstration
//   const snippets = [
//     {
//       id: 1,
//       title: 'React Custom Hook for API Calls',
//       description: 'A reusable custom hook for handling API calls in React applications',
//       language: 'javascript',
//       category: 'frontend',
//       author: 'johndoe',
//       likes: 42,
//       comments: 5,
//       documentation: `
// # useApi Hook

// A custom React hook for handling API calls with built-in loading and error states.

// ## Usage

// \`\`\`javascript
// const { data, loading, error } = useApi('https://api.example.com/data');
// \`\`\`

// ## Features

// - Automatic loading state
// - Error handling
// - Type-safe response
// - Automatic cleanup on unmount
// `,
//       code: `const useApi = (url) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(url);
//         const json = await response.json();
//         setData(json);
//         setLoading(false);
//       } catch (err) {
//         setError(err);
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [url]);

//   return { data, loading, error };
// };`,
//     },
//     {
//       id: 2,
//       title: 'Python Data Processing Script',
//       description: 'Efficient script for processing large CSV files using pandas',
//       language: 'python',
//       category: 'backend',
//       author: 'janedoe',
//       likes: 38,
//       comments: 3,
//       documentation: `
// # CSV Data Processor

// A Python script that efficiently processes large CSV files using pandas.

// ## Features

// - Automatic data cleaning
// - Duplicate removal
// - Group-by operations
// - Statistical analysis

// ## Example Usage

// \`\`\`python
// result = process_csv('data.csv')
// print(result)
// \`\`\`
// `,
//       code: `import pandas as pd

// def process_csv(filename):
//     # Read the CSV file
//     df = pd.read_csv(filename)
    
//     # Perform data cleaning
//     df = df.dropna()
//     df = df.drop_duplicates()
    
//     # Process the data
//     result = df.groupby('category').agg({
//         'value': ['mean', 'sum', 'count']
//     })
    
//     return result`,
//     },
//   ];

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesCategory = selectedCategory === 'all' || snippet.category === selectedCategory;
    const matchesLanguage = !selectedLanguage || snippet.language === selectedLanguage;
    const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLanguage && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Explore Snippets</h1>
          <div className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search snippets..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedSnippet(snippet)}
            >
              <h3 className="text-xl font-semibold mb-2">{snippet.title}</h3>
              <p className="text-gray-600 mb-4">{snippet.description}</p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {snippet.language}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                    {snippet.category}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    {snippet.likes}
                  </div>
                  <div className="flex items-center text-gray-600">
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