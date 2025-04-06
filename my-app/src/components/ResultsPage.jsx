// ResultsPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultsPage.css';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results || [];

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="resultsPage">
      <div className="resultsHeader">
        <button className="backButton" onClick={handleBack}>
          ← Back to Search
        </button>
        <h1>Search Results</h1>
      </div>
      
      <div className="resultsContainer">
        {results.length === 0 ? (
          <div className="noResults">
            <p>No results found. Try a different search.</p>
          </div>
        ) : (
          <div className="resultsGrid">
            {results.map((item, index) => (
              <div key={index} className="resultCard">
                <h3>{item.name}</h3>
                <p className="price">${item.price.toFixed(2)}</p>
                <div className="itemDetails">
                  <p>Color: {item.color || 'N/A'}</p>
                  <p>Size: {item.size || 'N/A'}</p>
                  <p>Brand: {item.brand || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
