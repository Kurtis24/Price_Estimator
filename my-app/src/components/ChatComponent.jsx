// ChatComponent.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatComponent.css';

const ChatComponent = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateInput = (input) => {
    if (!input.trim()) {
      return 'Please enter a search query';
    }
    if (input.length < 2) {
      return 'Search query must be at least 2 characters long';
    }
    return null;
  };

  const handleSearch = () => {
    // Clear previous errors
    setError('');
    
    // Validate input
    const validationError = validateInput(query);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Redirect immediately to results page
    navigate('/results', { 
      state: { 
        results: [
          {
            name: "Sample Blue Shorts",
            price: 49.99,
            color: "Blue",
            size: "M",
            brand: "Sample Brand"
          },
          {
            name: "Another Blue Shorts",
            price: 54.99,
            color: "Blue",
            size: "L",
            brand: "Another Brand"
          }
        ]
      } 
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="chatComponent">
      <div className="centerBox">
        <div className="inputContainer">
          <input
            type="text"
            placeholder="Search for clothing..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="chatInput"
            disabled={isLoading}
          />
          <button 
            className="sendButton" 
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && <div className="errorMessage">{error}</div>}
      </div>
    </div>
  );
};

export default ChatComponent;
