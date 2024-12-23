import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Search.css';

const Search = ({ placeholder }) => {
  const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === '') {
      setFilteredResults([]);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      const API_BASE_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

      // Fetch search results from the backend
      const response = await fetch(
        `${API_BASE_URL}/restaurants/search?query=${encodeURIComponent(value)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch search results.');
      }

      setFilteredResults(data);
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred while fetching search results.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Find Your Next Meal</h1>
        <input
          type="text"
          placeholder={placeholder || 'Search for restaurants...'}
          value={query}
          onChange={handleInputChange}
          className="search-input"
        />
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <ul className="search-results">
        {loading ? (
          <li className="loading-message">Loading results...</li>
        ) : filteredResults.length > 0 ? (
          filteredResults.map((result) => (
            // Updated the key to use `_id`
            <li key={result._id} className="search-result-item">
              <Link to={`/restaurants/${result._id}`}>
                <h3>{result.name}</h3>
                <p><strong>Cuisine:</strong> {result.cuisine}</p>
                {/* Fallback if location is missing */}
                <p><strong>Location:</strong> {result.location || 'Location not available'}</p>
              </Link>
            </li>
          ))
        ) : query ? (
          <li className="no-results">No results found for "{query}"</li>
        ) : (
          <li className="no-results">Start typing to search for restaurants...</li>
        )}
      </ul>
    </div>
  );
};

export default Search;
