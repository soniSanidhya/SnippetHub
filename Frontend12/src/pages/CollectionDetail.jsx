import { useState } from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';

export default function CollectionDetail() {
  const { id } = useParams();
  const [collection] = useState({
    id: 1,
    name: 'React Hooks',
    description: 'Collection of useful React hooks',
    snippets: [
      {
        id: 1,
        title: 'useApi Hook',
        description: 'Custom hook for handling API calls',
        language: 'javascript',
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
        author: 'johndoe',
        likes: 42,
        comments: 5,
      },
      {
        id: 2,
        title: 'useLocalStorage Hook',
        description: 'Hook for managing localStorage data',
        language: 'javascript',
        code: `const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};`,
        author: 'janedoe',
        likes: 35,
        comments: 3,
      },
    ],
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{collection.name}</h1>
          <p className="text-gray-600">{collection.description}</p>
        </div>

        <div className="space-y-8">
          {collection.snippets.map((snippet) => (
            <div key={snippet.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{snippet.title}</h3>
                  <p className="text-gray-600 mb-2">{snippet.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>By {snippet.author}</span>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      {snippet.likes}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      {snippet.comments}
                    </div>
                  </div>
                </div>
                <button className="text-blue-500 hover:text-blue-600">
                  View Details
                </button>
              </div>
              <CodeEditor
                value={snippet.code}
                language={snippet.language}
                height="200px"
                readOnly={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}