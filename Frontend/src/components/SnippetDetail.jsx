import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CodeEditor from './CodeEditor';
import SnippetActions from './snippet/SnippetActions';
import SnippetOwner from './snippet/SnippetOwner';
import SnippetMetadata from './snippet/SnippetMetadata';
import SnippetVersionControl from './snippet/SnippetVersionControl';
import SnippetComments from './snippet/SnippetComments';
import SnippetReadme from './snippet/SnippetReadme';
import SnippetCodeExecution from './snippet/SnippetCodeExecution';
import useAuthStore from '../store/authStore';
import { showSuccess, showError } from '../utils/toast';
import { useState } from 'react';
import SnippetCollection from './snippet/SnippetCollection';

export default function SnippetDetail({ snippet = {}, onClose }) {
  const { isAuthenticated, user } = useAuthStore();
  const isOwner = isAuthenticated && user?.id === snippet?.author?.id;
  
  const handleDelete = async () => {
    try {
      // API call would go here
      showSuccess('Snippet deleted successfully');
      onClose();
    } catch (error) {
      showError('Failed to delete snippet');
    }
  };

  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="  fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="max-h-[95vh] overflow-auto bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl my-8"
      >
        <div className="    bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center z-10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{snippet.title}</h2>
            <SnippetMetadata snippet={snippet} />
          </div>
          <div className="flex items-center space-x-4">
            {isOwner && (
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              >
                Delete
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8 ">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300">{snippet.description}</p>
          </div>

          <SnippetReadme snippet={snippet} isOwner={false} />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Code</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Language: </span>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm">
                  {snippet.language}
                </span>
              </div>
            </div>
            <CodeEditor
              value={snippet.currentVersion.updatedCode || ''}
              language={snippet.language || 'javascript'}
              height="400px"
              readOnly={true}
            />
          </div>

          <SnippetCodeExecution snippet={snippet} />
          
          <SnippetVersionControl snippet={snippet} isOwner={isOwner} />
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <SnippetOwner owner={snippet.owner} />
          </div>

          <div className="border-t border-gray-200 flex justify-between dark:border-gray-700 pt-6">
            <SnippetActions snippet={snippet} />
          
            <SnippetCollection snippet={snippet} />
              </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <SnippetComments snippet={snippet} isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}