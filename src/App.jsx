import { useState, createContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import SignupForm from './components/Authentication/SignupForm/SignupForm';
import SigninForm from './components/Authentication/SigninForm/SigninForm';
import Search from './components/Search/Search';
import RestaurantDetails from './components/RestaurantDetails/RestaurantDetails';
import ReviewForm from './components/Reviews/ReviewForm';
import * as authService from '../src/services/authService'; 

export const AuthedUserContext = createContext(null);

const App = () => {
  const [user, setUser] = useState(authService.getUser());

  // Fake restaurant data
  const restaurants = [
    {
      id: 1,
      name: "Not Found BBQ",
      rating: 4.5,
      reviewsCount: 255,
      cuisine: "Korean",
      priceRange: "$$",
      claimed: true,
      address: "600 Port of Bermuda",
      city: "Bermuda Triangle",
      state: "Unknown",
      phone: "(500) 510-000",
      hours: "24 hours",
      photos: [
        "https://via.placeholder.com/200",
        "https://via.placeholder.com/200",
        "https://via.placeholder.com/200",
      ],
      reviews: [
        { comment: "Hard place to find, but worth it!", highlight: "Chicken Bulgogi" },
        { comment: "Amazing Korean BBQ experience!", highlight: "Beef Bulgogi" },
        { comment: "The best spot for Korean food!", highlight: "Kimchi Stew" },
      ],
    },
    {
      id: 2,
      name: "Pizza Palace",
      rating: 4.2,
      reviewsCount: 120,
      cuisine: "Italian",
      priceRange: "$",
      claimed: false,
      address: "123 Pizza Street",
      city: "New York",
      state: "NY",
      phone: "(555) 123-4567",
      hours: "11:00 AM - 11:00 PM",
      photos: [
        "https://via.placeholder.com/200",
        "https://via.placeholder.com/200",
        "https://via.placeholder.com/200",
      ],
      reviews: [
        { comment: "Best pizza in town!", highlight: "Margherita Pizza" },
        { comment: "Great service and delicious pizza!", highlight: "Pepperoni Pizza" },
        { comment: "Love the ambiance and the garlic bread!", highlight: "Garlic Bread" },
      ],
    },
  ];

  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };

  return (
    <>
      <AuthedUserContext.Provider value={user}>
        <NavBar user={user} handleSignout={handleSignout} />
        <Routes>
          {/* Default Routes */}
          {user ? (
            <Route path="/" element={<Dashboard user={user} />} />
          ) : (
            <Route path="/" element={<Landing />} />
          )}

          {/* Authentication Routes */}
          <Route path="/signup" element={<SignupForm setUser={setUser} />} />
          <Route path="/signin" element={<SigninForm setUser={setUser} />} />

          {/* Search Route */}
          <Route
            path="/search"
            element={
              <Search
                placeholder="Search by name, cuisine, or location..."
                data={restaurants}
              />
            }
          />

  <Route
    path="/restaurants/:id"
    element={<RestaurantDetails data={restaurants} />}
  />

  {/* Write Review Form */}
  <Route
    path="/restaurants/:id/write-review"
    element={
      <ReviewForm
        onSubmit={(reviewData) => {
          console.log("Review submitted:", reviewData);
        }}
        data={restaurants} // Pass the restaurants data for dynamic lookup
      />
    }
  />
</Routes>

      </AuthedUserContext.Provider>
    </>
  );
};

export default App;
