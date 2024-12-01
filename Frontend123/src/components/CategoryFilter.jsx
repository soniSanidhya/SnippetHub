import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../Utils/axiosHelper.js';

const fetchCategory = () => api.get('/category');

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const { data, isLoading, isError, error } = useQuery(
   { 
    queryKey : ['categories'],
    queryFn : fetchCategory,  
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message || 'Failed to load categories'}</div>;

  const categories = [
    { _id: 'all', name: 'All Categories' }, // Default category
    ...(data.data.data), // Append fetched categories
  ];

  console.log(...(data.data.data));
  

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() => onCategoryChange(category._id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category._id
              ? 'bg-blue-500 text-white dark:bg-blue-600'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
