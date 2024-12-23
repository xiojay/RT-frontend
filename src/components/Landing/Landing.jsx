import { useEffect, useState } from 'react';
import './Landing.css';

const Landing = () => {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchFeaturedRestaurants = async () => {
    const API_BASE_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL; 
      try {
        const response = await fetch(`${API_BASE_URL}/restaurant/featured`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch featured restaurants.');
        }

        setFeaturedRestaurants(data);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    fetchFeaturedRestaurants();
  }, []);

  return (
    <main className="landing-container">
      <h3>Welcome to a new world of different tastes.</h3>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {featuredRestaurants.length > 0 ? (
        <div className="featured-restaurants">
          <h4>Featured Restaurants:</h4>
          <ul>
            {featuredRestaurants.map((restaurant) => (
              <li key={restaurant._id}>
                <h5>{restaurant.name}</h5>
                <p>{restaurant.cuisine}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !errorMessage && <p>Loading featured restaurants...</p>
      )}
    </main>
  );
};

export default Landing;
