import { AuthedUserContext } from '../../App';
import { useContext, useEffect, useState } from 'react';

const Dashboard = () => {
  const user = useContext(AuthedUserContext);
  const [savedRestaurants, setSavedRestaurants] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!user) return;

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
      } catch (error) {
        setErrorMessage(error.message)
      }
    };

    fetchSavedRestaurants();
  }, [user]);

  if (!user) {
    return (
      <main>
        <h1>You must be logged in to view this page.</h1>
      </main>
    );
  }

  return (
    <main>
      <h1>Welcome, {user.username}</h1>
      <p>Here you will see a list of your saved restaurants:</p>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {savedRestaurants.length > 0 ? (
        <ul>
          {savedRestaurants.map((restaurant) => (
            <li key={restaurant._id}>
              <h3>{restaurant.name}</h3>
              <p>{restaurant.address}</p>
              <p>{restaurant.cuisine}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't saved any restaurants yet.</p>
      )}
    </main>
  );
};

export default Dashboard;
