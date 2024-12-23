import { useEffect, useState } from 'react';

const SavedRestaurants = () => {
  const [savedRestaurants, setSavedRestaurants] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedRestaurants = async () => {
    const API_BASE_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;
      try {
        const response = await fetch(`${API_BASE_URL}/saved-restaurants`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch saved restaurants.')
        }

        setSavedRestaurants(data);
        setLoading(false);
      } catch (err) {
        setErrorMessage(err.message || 'An error occurred while fetching saved restaurants.')
        setLoading(false);
      }
    };

    fetchSavedRestaurants();
  }, []);
  const handleSave = async (restaurantId) => {
  const API_BASE_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;
    try{ 
      const res = await fetch (`${API_BASE_URL}/restaurants/${restaurantId}/save`, {
        method: 'POST',
        headers: {Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content Type': 'application/json',
    }})
    res.json()
    }catch(error){
      setErrorMessage(err.message || 'Can not save restaurants' );
    }
  }

  if (loading) {
    return <p>Loading saved restaurants...</p>;
  }

  return (
    <div>
      <h1>Saved Restaurants</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {savedRestaurants.length > 0 ? (
        <div className="saved-restaurants-list">
          {savedRestaurants.map((restaurant) => (
            <div key={restaurant._id} className="saved-restaurant-item">
              <h2>{restaurant.name}</h2>
              <p><strong>Address:</strong> {restaurant.address}</p>
              <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No saved restaurants yet.</p>
      )}
    </div>
  );
};

export default SavedRestaurants;
