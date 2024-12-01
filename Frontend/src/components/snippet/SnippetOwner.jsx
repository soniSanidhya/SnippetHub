import { Link } from 'react-router-dom';

export default function SnippetOwner({ owner }) {
  if (!owner) {
    return null;
  }

  const displayName = owner.name || owner.username || 'Anonymous';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="flex-shrink-0">
        {owner.avatar ? (
          <img src={owner.avatar} alt={displayName} className="w-12 h-12 rounded-full" />
        ) : (
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-lg font-medium">{initial}</span>
          </div>
        )}
      </div>
      <div>
        <Link 
          to={`/user/${owner.username}`} 
          className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
        >
          {displayName}
        </Link>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          {owner.github && (
            <a 
              href={`https://github.com/${owner.github}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              GitHub
            </a>
          )}
          {owner.linkedin && (
            <a 
              href={`https://linkedin.com/in/${owner.linkedin}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              LinkedIn
            </a>
          )}
          {owner.website && (
            <a 
              href={owner.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
}