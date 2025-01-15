import { Link } from 'react-router-dom';

export default function SnippetMetadata({ snippet }) {
  if (!snippet?.owner) {
    return null;
  }

  const { owner : author } = snippet;
  const displayName = author.name || author.username || 'Anonymous';
  const initial = displayName.charAt(0).toUpperCase();

  // console.log(snippet);
  
  return (
    <div className="flex items-center mt-1 space-x-2 text-sm text-gray-600 dark:text-gray-400">
      <Link to={`/user/${author.username}`} className="flex items-center space-x-2 hover:text-blue-500">
        {author.avatar ? (
          <img src={author.avatar} alt={displayName} className="w-6 h-6 rounded-full" />
        ) : (
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-xs">{initial}</span>
          </div>
        )}
        <span>{displayName}</span>
      </Link>
      <span>•</span>
      <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
      <span>•</span>
      <span>{snippet.language}</span>
    </div>
  
  );
}