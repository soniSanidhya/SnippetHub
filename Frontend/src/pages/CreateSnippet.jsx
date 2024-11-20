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
            {/* <Select
             id="language"
             options={languageOptions}
             value={language}
             onChange={setLanguage}
        // value={selectedVersion}
        // onChange={handleVersionChange}
        // options={}
        isSearchable={false}
        className="text-sm"
        classNamePrefix="select"
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            neutral0: 'var(--select-bg)',
            neutral5: 'var(--select-hover)',
            neutral10: 'var(--select-hover)',
            neutral20: 'var(--select-border)',
            neutral30: 'var(--select-border-hover)',
            neutral40: 'var(--select-text-placeholder)',
            neutral50: 'var(--select-text-placeholder)',
            neutral60: 'var(--select-text-placeholder)',
            neutral70: 'var(--select-text)',
            neutral80: 'var(--select-text)',
            neutral90: 'var(--select-text)',
            primary: 'var(--select-primary)',
            primary25: 'var(--select-primary-hover)',
            primary50: 'var(--select-primary-hover)',
            primary75: 'var(--select-primary-hover)'
          },
        })}
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: 'var(--select-bg)',
            borderColor: state.isFocused ? 'var(--select-border-focus)' : 'var(--select-border)',
            boxShadow: state.isFocused ? '0 0 0 1px var(--select-border-focus)' : 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              borderColor: 'var(--select-border-hover)', // Change border color on hover
              backgroundColor: 'var(--select-hover)' // Optional: change background on hover
            }
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: 'var(--select-bg)',
            border: '1px solid var(--select-border)',
          }),
          option: (base, { isFocused, isSelected }) => ({
            ...base,
            backgroundColor: isSelected 
              ? 'var(--select-primary)' 
              : isFocused 
                ? 'var(--select-primary-hover)' // Change background color on hover
                : 'transparent',
            color: isSelected 
              ? 'white' 
              : 'var(--select-text)',
            transition: 'background-color 0.2s ease, color 0.2s ease', // Smooth hover effect
            '&:hover': {
              backgroundColor: 'var(--select-primary-hover)', // Highlight color on hover
              color: isSelected ? 'white' : 'var(--select-text)' // Adjust text color
            }
          }),
          singleValue: (base) => ({
            ...base,
            color: 'var(--select-text)'
          }),
          input: (base) => ({
            ...base,
            color: 'var(--select-text)'
          }),
          indicatorSeparator: (base) => ({
            ...base,
            backgroundColor: 'var(--select-border)'
          }),
          dropdownIndicator: (base) => ({
            ...base,
            color: 'var(--select-text-placeholder)',
            transition: 'color 0.2s ease',
            '&:hover': {
              color: 'var(--select-text)' // Change color on hover
            }
          })
        }}
      />
      

      <style>{`
        :root {
          
          --select-hover: #f7fafc; 
          --select-primary-hover: #ebf8ff; 
          --select-bg: white;
          --select-text: #1a202c;
          --select-text-placeholder: #718096;
          --select-border: #e2e8f0;
          --select-border-hover: #cbd5e0;
          --select-border-focus: #4299e1;
          --select-primary: #4299e1;
          --select-primary-hover: #ebf8ff;

        }


        .dark {
          --select-hover: #374151;
  --select-primary-hover: #1f2937; 
          --select-bg: #1f2937;
          --select-text: #f3f4f6;
          --select-text-placeholder: #9ca3af;
          --select-border: #374151;
          --select-border-hover: #4b5563;
          --select-border-focus: #60a5fa;
          --select-primary: #3b82f6;
          --select-primary-hover: #1f2937;

        }
      `}</style> */}
      <CustomSelect options={languageOptions} onChange={setLanguage} value={language} />
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