import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LocationAutocomplete = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value.length > 2) {
      const fetchSuggestions = async () => {
        try {
          const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
              q: value,
              format: 'json',
              addressdetails: 1,
              limit: 5,
            },
          });
          setSuggestions(response.data);
        } catch (error) {
          console.error('Error fetching location suggestions:', error);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [value]);

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      setSuggestions([]);
    }, 100); // delay to allow click event to be processed
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsFocused(true);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className="mt-1 p-2 w-full border rounded-md"
        placeholder="Enter your location"
      />
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => {
                onChange(suggestion.display_name);
                setIsFocused(false);
              }}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;


