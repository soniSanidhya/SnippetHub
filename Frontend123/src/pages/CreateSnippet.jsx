import { useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import MDEditor from '@uiw/react-md-editor';
import CustomSelect from '../components/CustomSelect';
import api from '../Utils/axiosHelper';
import { useMutation } from "@tanstack/react-query";



const postSnippet = snippetData => api.post("/snippet" , snippetData);

export default function CreateSnippet() {
  const [title, setTitle] = useState('');
  const [documentation, setDocumentation] = useState('# How it works\n\nDescribe how your code works here...');
  const [language, setLanguage] = useState({ value: 'javascript', label: 'JavaScript' });
  const [categoryOptions, setCategoryOptions] = useState([
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'fullstack', label: 'Full Stack' },
    { value: 'devops', label: 'DevOps' },
    { value: 'database', label: 'Database' },
    { value: 'algorithms', label: 'Algorithms' },
    { value: 'security', label: 'Security' },
    { value: 'other', label: 'Other' },
  ]);
  const [category, setCategory] = useState(categoryOptions[0]);
  const [code, setCode] = useState('');
  const [tags, setTags] = useState('');
  const [data , setData] = useState(null);

  const handleCreateOption = (inputValue) => {
    console.log("Creating new option:", inputValue);
    
    const newOption = { value: inputValue, label: inputValue };
    setCategoryOptions((prevOptions) => [...prevOptions, newOption]);
    setCategory(newOption); // Automatically select the newly created option
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const snippetData = {
      title,
      documentation,
      language: language.value,
      category: category.value,
      code,
      tags,
    };

    setData(snippetData);

    mutate();

  }

    // Collect data for submission
    
    const {mutate, error, isError , isPending} =  useMutation(
      {
        mutationFn : () => postSnippet(data),
        onSuccess : (data) => {
          console.log(data);
        }
      }
    )

    console.log(data);

 
   

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Language
              </label>
              <CustomSelect
                onChange={setLanguage}
                value={language}
                options={[
                  { value: 'javascript', label: 'JavaScript' },
                  { value: 'python', label: 'Python' },
                  { value: 'java', label: 'Java' },
                  { value: 'cpp', label: 'C++' },
                  { value: 'typescript', label: 'TypeScript' },
                  { value: 'html', label: 'HTML' },
                  { value: 'css', label: 'CSS' },
                  { value: 'sql', label: 'SQL' },
                ]}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <CustomSelect
                onChange={setCategory}
                onCreateOption={handleCreateOption}
                value={category}
                options={categoryOptions}
                isSearchable={true}
              />
            </div>
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
                value={documentation}
                onChange={setDocumentation}
                preview="edit"
                height={400}
              />
            </div>
            <div data-color-mode="dark" className="hidden dark:block">
              <MDEditor
                value={documentation}
                onChange={setDocumentation}
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
