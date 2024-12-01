import React, { useState, useEffect, useRef } from 'react';
 // Adjust the path according to your project structure
import { Search } from 'lucide-react';
import Input from './Input';
import { api } from '../../Utils/axiosHelper';
import { useQuery } from '@tanstack/react-query';


const fetchAutoComplete = (query)=> api.get("/search/autocomplete" , {params : {query}});


// Sample data for autocomplete (can be replaced with API call or larger dataset)
const sampleData = [
  'Apple', 
  'Banana', 
  'Cherry', 
  'Date', 
  'Elderberry', 
  'Fig', 
  'Grape', 
  'Honeydew', 
  'Kiwi', 
  'Lemon', 
  'Mango', 
  'Nectarine', 
  'Orange', 
  'Papaya', 
  'Quince', 
  'Raspberry', 
  'Strawberry', 
  'Tangerine', 
  'Watermelon'
];

const SearchAutocomplete = ({setSearchQuery , searchQuery , fetchSearch}) => {
//   const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestion1 , setSuggestion1] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Handle input change and generate suggestions

  const {data  , isLoading , isError , error} = useQuery({
    queryKey : ["autocomplete" , searchQuery],
    queryFn : ()=>fetchAutoComplete(searchQuery),
    enabled : searchQuery.length > 1
  });

  useEffect(()=>{
    if(data){
        // console.log(data);
        setSuggestions(data?.data.data?.map((item)=>item.title));
    }
  }, [data])


  

  const handleInputChange = (e) => {
    const value = e.target.value;
    // setQuery(value);
    setSearchQuery(value);
    setActiveSuggestionIndex(-1);

    if (value.length > 0) {
      const filteredSuggestions = sampleData
        .filter(item => 
          item.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5); // Limit to 5 suggestions
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

//   console.log(index);
  

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion , index) => {
    setSearchQuery(suggestion);
    setActiveSuggestionIndex(index);
    setSuggestions([]);
    setShowSuggestions(false);
  };

//   console.log(activeSuggestionIndex);
  

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prevIndex => 
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prevIndex => 
        prevIndex > 0 ? prevIndex - 1 : -1
      );
    } else if (e.key === 'Enter') {
      if (activeSuggestionIndex !== -1 && suggestions[activeSuggestionIndex]) {
        setSearchQuery(suggestions[activeSuggestionIndex]);
        setShowSuggestions(false);
      } else if (searchQuery) {
        // Perform search
        // alert(`Searching for: ${searchQuery}`);
        fetchSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  // Close suggestions if clicked outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      !suggestionsRef.current?.contains(event.target) &&
      !inputRef.current?.contains(event.target)
    ) {
      setShowSuggestions(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          className="pr-10"
        />
        <Search 
        onClick={()=>{fetchSearch();}}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          size={20} 
        />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul 
          ref={suggestionsRef}
          className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion , index)}
              className={`
                px-4 py-2 cursor-pointer 
                ${index === activeSuggestionIndex 
                  ? 'bg-gray-900' 
                  : 'hover:bg-gray-900'
                }
              `}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchAutocomplete;