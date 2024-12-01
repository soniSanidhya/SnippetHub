import { useState } from 'react';
import Select from 'react-select';
import {DatePicker} from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const sortOptions = [
  { value: 'voteCount', label: 'Vote Count' },
  { value: 'createdAt', label: 'Creation Date' },
  { value: 'views', label: 'Views' },
];

const orderOptions = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' },
];

export default function AdvancedFilters({
  minVotes,
  setMinVotes,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  tags,
  setTags,
  onApplyFilters,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [localTags, setLocalTags] = useState(tags.join(', '));

  const handleTagsChange = (value) => {
    setLocalTags(value);
    setTags(value.split(',').map(tag => tag.trim()).filter(Boolean));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          Advanced Filters
        </span>
        <svg
          className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Minimum Votes
              </label>
              <input
                type="number"
                min="0"
                value={minVotes}
                onChange={(e) => setMinVotes(parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={localTags}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="react, javascript, hooks"
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <Select
                value={sortOptions.find(option => option.value === sortBy)}
                onChange={(option) => setSortBy(option.value)}
                options={sortOptions}
                className="text-sm"
                classNamePrefix="select"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort Order
              </label>
              <Select
                value={orderOptions.find(option => option.value === sortOrder)}
                onChange={(option) => setSortOrder(option.value)}
                options={orderOptions}
                className="text-sm"
                classNamePrefix="select"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date From
              </label>
              <DatePicker
                selected={dateFrom}
                onChange={setDateFrom}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                maxDate={dateTo || new Date()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date To
              </label>
              <DatePicker
                selected={dateTo}
                onChange={setDateTo}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                minDate={dateFrom}
                maxDate={new Date()}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onApplyFilters}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}