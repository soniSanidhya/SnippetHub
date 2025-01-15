import { useState } from 'react';
import { motion } from 'framer-motion';
import CodeEditor from '../CodeEditor';
import { showSuccess, showError } from '../../utils/toast';
import { api } from '../../utils/axiosHelper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const fetchVersion = (snippet)=> api.get(`/snippet/v/${snippet._id}`);
const deleteVersion = (versionId)=> api.delete(`/snippet/v/${versionId}`);
export default function SnippetVersionControl({ snippet = {}, isOwner }) {
  // const [versions, setVersions] = useState([
  //   {
  //     id: 1,
  //     number: 1,
  //     code: snippet.code,
  //     createdAt: snippet.createdAt,
  //     description: 'Initial version'
  //   },
  //   ...(Array.isArray(snippet.versions) ? snippet.versions : [])
  // ]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isCreatingVersion, setIsCreatingVersion] = useState(false);
  const [newVersionData, setNewVersionData] = useState({
    code: snippet.currentVersion.updatedCode,
    description: ''
  });

  const {data : versions , isLoading , isError , error} = useQuery({
    queryKey : ["versions" , snippet._id],
    queryFn : ()=>fetchVersion(snippet),
  })

  const queryClient = useQueryClient();

  const {mutate : deleteVersionMutation} = useMutation({
    mutationKey : "deleteVersion",
    mutationFn : (versionId)=> deleteVersion(versionId),
    onSuccess : (data)=>{
      showSuccess('Version deleted successfully');
    //   queryClient.setQueryData(["versions" , snippet._id], (oldData)=>{
    //     return {
    //       data : oldData?.data?.filter((version)=> version._id !== data.data._id) || []
    //     }
    // })}
    queryClient.invalidateQueries(["versions" , snippet._id]);
}
});

  // console.log(versions);

  const handleCreateVersion = async () => {
    try {
      const newVersion = {
        id: Date.now(),
        number: versions?.length + 1,
        code: newVersionData.code,
        description: newVersionData.description,
        createdAt: new Date().toISOString()
      };
      setVersions([...versions, newVersion]);
      setIsCreatingVersion(false);
      setNewVersionData({ code: snippet.code, description: '' });
      showSuccess('Version created successfully');
    } catch (error) {
      showError('Failed to create version');
    }
  };

  const handleDeleteVersion = async (versionId) => {
    try {
      // setVersions(versions.filter(v => v.id !== versionId));
      deleteVersionMutation(versionId);
      
    } catch (error) {
      showError('Failed to delete version');
    }
  };

  const handleRestoreVersion = async (version) => {
    try {
      // API call would go here to restore the version
      showSuccess('Version restored successfully');
    } catch (error) {
      showError('Failed to restore version');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Version History</h3>
        {isOwner && !isCreatingVersion && (
          <button
            onClick={() => setIsCreatingVersion(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create New Version
          </button>
        )}
      </div>

      {isCreatingVersion && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              value={newVersionData.description}
              onChange={(e) => setNewVersionData({ ...newVersionData, description: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Describe your changes..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Code
            </label>
            <CodeEditor
              value={newVersionData.code}
              onChange={(code) => setNewVersionData({ ...newVersionData, code })}
              language={snippet.language}
              height="300px"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsCreatingVersion(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateVersion}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Save Version
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {versions?.data?.data?.map((version) => (
          <motion.div
            key={version._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Version {version?.version?.toFixed(1)}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(version.createdAt).toLocaleDateString()}
                </span>
                {version.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {version.description}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {isOwner && version.version !== 1 && (
                  <button
                    onClick={() => handleDeleteVersion(version._id)}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                )}
                {isOwner && (
                  <button
                    onClick={() => handleRestoreVersion(version)}
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Restore
                  </button>
                )}
                <button
                  onClick={() => setSelectedVersion(selectedVersion === version._id ? null : version._id)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {selectedVersion === version._id ? 'Hide Code' : 'Show Code'}
                </button>
              </div>
            </div>
            {selectedVersion === version._id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <CodeEditor
                  value={version.updatedCode}
                  language={snippet.language}
                  height="300px"
                  readOnly={true}
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}