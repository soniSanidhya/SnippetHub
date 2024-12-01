import { useState } from 'react';
import { motion } from 'framer-motion';
import CodeEditor from '../CodeEditor';
import { showSuccess, showError } from '../../utils/toast';

export default function SnippetVersions({ snippet = {}, isOwner }) {
  const [versions, setVersions] = useState(Array.isArray(snippet.versions) ? snippet.versions : []);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const handleDeleteVersion = async (versionId) => {
    try {
      // API call would go here
      setVersions(versions.filter(v => v.id !== versionId));
      showSuccess('Version deleted successfully');
    } catch (error) {
      showError('Failed to delete version');
    }
  };

  if (versions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Versions</h3>
      <div className="space-y-4">
        {versions.map((version) => (
          <motion.div
            key={version.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Version {version.number}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(version.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {isOwner && (
                  <button
                    onClick={() => handleDeleteVersion(version.id)}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={() => setSelectedVersion(selectedVersion === version.id ? null : version.id)}
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {selectedVersion === version.id ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            {selectedVersion === version.id && (
              <CodeEditor
                value={version.code || ''}
                language={snippet.language || 'javascript'}
                height="200px"
                readOnly={true}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}