import React, { useState, useEffect } from 'react';
import colleges from './colleges';

const CollegeAutocomplete = ({ value = '', onChange }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (value.length > 1) {
      const filteredSuggestions = colleges.filter((college) =>
        college.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [value]);

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 p-2 w-full border rounded-md"
        placeholder="Enter your school"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => {
                onChange(suggestion);
                setSuggestions([]);
              }}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CollegeAutocomplete;
