import { useState } from 'react';
import { motion } from 'framer-motion';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const languageOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'ruby', label: 'Ruby' },
];

const sortOptions = [
  { value: 'voteCount_desc', label: 'Most Voted' },
  { value: 'voteCount_asc', label: 'Least Voted' },
  { value: 'createdAt_desc', label: 'Newest' },
  { value: 'createdAt_asc', label: 'Oldest' },
  { value: 'views_desc', label: 'Most Viewed' },
];

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedLanguage,
  onLanguageChange,
  selectedSort,
  onSortChange,
  dateRange,
  onDateRangeChange,
  tags,
  onTagsChange,
  minVotes,
  onMinVotesChange,
  onApplyFilters,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSortChange = (option) => {
    const [sortBy, sortOrder] = option.value.split('_');
    onSortChange({ sortBy, sortOrder });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Main Search and Filters */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            value={selectedLanguage}
            onChange={onLanguageChange}
            options={languageOptions}
            placeholder="Language"
            isClearable
            className="text-sm"
            classNamePrefix="select"
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            value={selectedSort}
            onChange={handleSortChange}
            options={sortOptions}
            placeholder="Sort by"
            className="text-sm"
            classNamePrefix="select"
          />
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
        >
          <span>Filters</span>
          <svg
            className={`w-5 h-5 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date Range
            </label>
            <div className="flex gap-2">
              <DatePicker
                selected={dateRange.from}
                onChange={(date) => onDateRangeChange({ ...dateRange, from: date })}
                placeholderText="From"
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <DatePicker
                selected={dateRange.to}
                onChange={(date) => onDateRangeChange({ ...dateRange, to: date })}
                placeholderText="To"
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Minimum Votes
            </label>
            <input
              type="number"
              min="0"
              value={minVotes}
              onChange={(e) => onMinVotesChange(parseInt(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags.join(', ')}
              onChange={(e) => onTagsChange(e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
              placeholder="react, hooks, typescript"
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}