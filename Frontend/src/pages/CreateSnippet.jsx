import { useState } from 'react';
import Select from 'react-select';
import CodeEditor from '../components/CodeEditor';
import MDEditor from '@uiw/react-md-editor';
import CustomSelect from '../components/CustomSelect';

const languageOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
];

export default function CreateSnippet() {
  const [title, setTitle] = useState('');
  const [readme, setReadme] = useState('# How it works\n\nDescribe how your code works here...');
  const [language, setLanguage] = useState(languageOptions[0]);
  const [code, setCode] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      title,
      readme,
      language: language.value,
      code,
      tags: tags.split(',').map(tag => tag.trim()),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Create New Snippet</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter a descriptive title"
              required
            />
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Language
            </label>
           
            <CustomSelect onChange={setLanguage} value={language} options={languageOptions}  />
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Code
            </label>
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language.value}
              height="400px"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              README
            </label>
            <div data-color-mode="light" className="dark:hidden">
              <MDEditor
                value={readme}
                onChange={setReadme}
                preview="edit"
                height={400}
              />
            </div>
            <div data-color-mode="dark" className="hidden dark:block">
              <MDEditor
                value={readme}
                onChange={setReadme}
                preview="edit"
                height={400}
              />
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter tags separated by commas"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Create Snippet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}