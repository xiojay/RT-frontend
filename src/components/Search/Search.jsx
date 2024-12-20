import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Search.css';

const Search = ({ placeholder, data }) => {
  const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (data) {
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.cuisine.toLowerCase().includes(value.toLowerCase()) ||
        item.location.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredResults(filtered);
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
      <ul className="search-results">
        {filteredResults.length > 0 ? (
          filteredResults.map((result) => (
            <li key={result.id} className="search-result-item">
              <Link to={`/restaurants/${result.id}`}>
                <h3>{result.name}</h3>
                <p><strong>Cuisine:</strong> {result.cuisine}</p>
                <p><strong>Location:</strong> {result.location}</p>
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
