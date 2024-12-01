import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { motion } from 'framer-motion';
import { showSuccess, showError } from '../../Utils/toast';

export default function SnippetReadme({ snippet = {}, isOwner , onReadmeChange}) {
  const [isEditing, setIsEditing] = useState(false);
  const [readme, setReadme] = useState(snippet.documentation || '# How it works\n\nDescribe how your code works here...');

  // console.log(readme);
  

  const handleSave = async () => {
    try {
      // API call would go here
      showSuccess('README updated successfully');
      setIsEditing(false);
    } catch (error) {
      showError('Failed to update README');
    }
  };

  return (
    <div className="space-y-4 ">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">README</h3>
        {isOwner && (
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="prose dark:prose-invert max-w-none border-solid dark:border-white border-gray-900 rounded-md   border p-1"
      >
        {isEditing ? (
          <div  data-color-mode={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}>
            <MDEditor
              value={readme}
              onChange={(value) => setReadme(value || '')}
              preview="edit"
              height={400}
            />
          </div>
        ) : (
          <div data-color-mode={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}>
            <MDEditor.Markdown source={readme} />
          </div>
        )}
      </motion.div>
    </div>
  );
}