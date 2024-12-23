import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './RestaurantDetails.css';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const [editingReview, setEditingReview] = useState(null);
  const [editDetails, setEditDetails] = useState('');
  const [editRating, setEditRating] = useState(0);

  useEffect(() => {
    const fetchRestaurant = async () => {
    const API_BASE_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

      try {
        const response = await fetch(`${API_BASE_URL}/restaurants/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch restaurant details');
        }

        const data = await response.json();
        setRestaurant(data);
        setLoading(false);
      } catch (error) {
        setErrorMessage(error.message);
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditDetails(review.details);
    setEditRating(review.rating);
  };

  const handleEditSubmit = async () => {
  const API_BASE_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;  
    try {
      const response = await fetch(
        `${API_BASE_URL}/reviews/restaurant/${restaurant._id}/reviews/${editingReview._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ details: editDetails, rating: editRating }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update review.');
      }

      const updatedReview = await response.json();

      setRestaurant((prev) => ({
        ...prev,
        reviews: prev.reviews.map((review) =>
          review._id === updatedReview._id ? updatedReview : review
        ),
      }));

      setEditingReview(null);
    } catch (error) {
      console.error('Error updating review:', error.message);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const API_BASE_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;  
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get('Content-Type');
        let errorData;
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          errorData = { error: 'Unexpected error occurred.' };
        }
        throw new Error(errorData.error || 'Failed to delete review.');
      }

      setRestaurant((prev) => ({
        ...prev,
        reviews: prev.reviews.filter((review) => review._id !== reviewId),
      }));

      console.log('Review deleted successfully.');
    } catch (error) {
      console.error('Error deleting review:', error.message);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (errorMessage) {
    return <h2>{errorMessage}</h2>;
  }

  if (!restaurant) {
    return <h2>Restaurant not found</h2>;
  }

  const reviews = restaurant.reviews || [];

  return (
    <div className="restaurant-details">
      <div className="restaurant-header">
        <div className="restaurant-header-left">
          <h1>{restaurant.name}</h1>
          <div className="restaurant-rating">
            <span>{'★'.repeat(Math.round(restaurant.rating || 0))}</span>
            <span className="rating-count">
              {restaurant.rating || 0} ({reviews.length} reviews)
            </span>
          </div>
          <p className="restaurant-category">
            {restaurant.cuisine || 'N/A'} • {restaurant.priceRange || 'N/A'}
          </p>
        </div>
        <div className="restaurant-header-right">
          <Link
            to={`/restaurants/${restaurant._id}/reviews`}
            className="action-button"
          >
            Write a Review
          </Link>
          <button className="action-button">Add Photo</button>
          <button className="action-button">Share</button>
          <button className="action-button">Save</button>
        </div>
      </div>

      <div className="restaurant-info-section">
        <div className="restaurant-address">
          <p>{restaurant.address || 'Address not available'}</p>
          <p>
            {restaurant.city || ''}, {restaurant.state || ''}
          </p>
          <p>{restaurant.phone || 'Phone not available'}</p>
          <Link to="#" className="edit-link">
            Edit
          </Link>
        </div>
        <div className="restaurant-photos">
     {    restaurant.photos && restaurant.photos.length > 0 ? (
            restaurant.photos.map((photo, index) => (
          <img
        key={index}
        src={photo}
        alt={`Photo ${index + 1}`}
        className="restaurant-photo"
      />
    ))
  ) : (
    <p>No photos available</p>
          )}
          {restaurant.photos && restaurant.photos.length > 0 && (
            <Link to="#" className="see-more-link">
              See all {restaurant.photos.length} photos
            </Link>
          )}
        </div>
      </div>

      <div className="restaurant-details-section">
        <div className="hours">
          <p>
            Today: <span>{restaurant.hours || 'Hours not available'}</span>
          </p>
          <Link to="#" className="menu-link">
            Full Menu
          </Link>
        </div>
      </div>

      <h2>Featured Reviews</h2>
      <div className="featured-reviews">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="review">
              {editingReview && editingReview._id === review._id ? (
                <div className="edit-review-form">
                  <textarea
                    value={editDetails}
                    onChange={(e) => setEditDetails(e.target.value)}
                    placeholder="Edit your review"
                  />
                  <input
                    type="number"
                    value={editRating}
                    onChange={(e) => setEditRating(e.target.value)}
                    min="1"
                    max="5"
                    placeholder="Edit your rating"
                  />
                  <button onClick={handleEditSubmit}>Save</button>
                  <button onClick={() => setEditingReview(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <p>
                    <strong>{review.user?.username || 'Anonymous'}</strong>
                  </p>
                  <p>{review.details}</p>
                  <p>Rating: {review.rating}</p>
                  <div className="review-actions">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="action-link"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="action-link delete"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p>
            No reviews yet. Be the first to{' '}
            <Link to={`/restaurants/${restaurant._id}/reviews`}>
              write a review
            </Link>
            !
          </p>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;
