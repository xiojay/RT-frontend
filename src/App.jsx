import { useState, useEffect, createContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import SignupForm from './components/Authentication/SignupForm/SignupForm';
import SigninForm from './components/Authentication/SigninForm/SigninForm';
import Search from './components/Search/Search';
import RestaurantDetails from './components/RestaurantDetails/RestaurantDetails';
import ReviewForm from './components/Reviews/ReviewForm';
import * as authService from '../src/services/authService'; 

export const AuthedUserContext = createContext(null)

const App = () => {
  const [user, setUser] = useState(authService.getUser())
  const [restaurants, setRestaurants] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleSignout = () => {
    localStorage.removeItem('token')
    authService.signout()
    setUser(null)
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true)
      const API_BASE_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;
      try {
        const token = localStorage.getItem('token')
//       if (!token) {
 //         throw new Error('User is not authenticated. No token found.')
 //       }

        const response = await fetch(`${API_BASE_URL}/restaurants/featured`, {
          headers: {
//            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch restaurants')
        }

        const data = await response.json()
        setRestaurants(data)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching restaurants:', err.message)
      } finally {
        setLoading(false)
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <>
      <AuthedUserContext.Provider value={user}>
        <NavBar user={user} handleSignout={handleSignout} />
        <Routes>
          {user ? (
            <Route path="/" element={<Dashboard user={user} />} />
          ) : (
            <Route path="/" element={<Landing />} />
          )}

          <Route path="/signup" element={<SignupForm setUser={setUser} />} />
          <Route path="/signin" element={<SigninForm setUser={setUser} />} />

          <Route
            path="/search"
            element={
              loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>Error loading restaurants: {error}</p>
              ) : (
                <Search
                  placeholder="Search by name, cuisine, or location..."
                  data={restaurants}
                />
              )
            }
          />

          <Route
            path="/restaurants/:id"
            element={<RestaurantDetails data={restaurants} />}
          />

          <Route
            path="/restaurants/:id/reviews"
            element={
              user ? (
                <ReviewForm
                  onSubmit={(reviewData) => {
                    console.log("Review submitted:", reviewData);
                  }}
                  data={restaurants}
                />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />
        </Routes>
      </AuthedUserContext.Provider>
    </>
  );
};

export default App;
