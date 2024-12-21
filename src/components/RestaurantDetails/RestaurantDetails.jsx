import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './RestaurantDetails.css';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`http://localhost:5000/restaurants/${id}`)

        if (!response.ok) {
          throw new Error('Failed to fetch restaurant details')
        }

        const data = await response.json()
        setRestaurant(data);
        setLoading(false);
      } catch (error) {
        setErrorMessage(error.message);
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) {
    return <h2>Loading...</h2>
  }

  if (errorMessage) {
    return <h2>{errorMessage}</h2>
  }

  if (!restaurant) {
    return <h2>Restaurant not found</h2>
  }

  return (
    <div className="restaurant-details">
      <div className="restaurant-header">
        <div className="restaurant-header-left">
          <h1>{restaurant.name}</h1>
          <div className="restaurant-rating">
            <span>{'★'.repeat(Math.round(restaurant.rating))}</span>
            <span className="rating-count">
              {restaurant.rating} ({restaurant.reviews.length} reviews)
            </span>
          </div>
          <p className="restaurant-category">
            {restaurant.cuisine} • {restaurant.priceRange}
          </p>
        </div>
        <div className="restaurant-header-right">
          <Link
            to={`/restaurants/${restaurant._id}/write-review`}
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
          <p>{restaurant.address}</p>
          <p>
            {restaurant.city}, {restaurant.state}
          </p>
          <p>{restaurant.phone}</p>
          <Link to="#" className="edit-link">
            Edit
          </Link>
        </div>
        <div className="restaurant-photos">
          {restaurant.photos && restaurant.photos.length > 0 ? (
            restaurant.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Restaurant ${index + 1}`}
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
            Today: <span>{restaurant.hours}</span>
          </p>
          <Link to="#" className="menu-link">
            Full Menu
          </Link>
        </div>
      </div>

      <h2>Featured Reviews</h2>
      <div className="featured-reviews">
        {restaurant.reviews && restaurant.reviews.length > 0 ? (
          restaurant.reviews.slice(0, 3).map((review, index) => (
            <div key={index} className="review">
              <p>{review.comment}</p>
              {review.highlight && <Link to="#">{review.highlight}</Link>}
            </div>
          ))
        ) : (
          <p>
            No reviews yet. Be the first to{' '}
            <Link to={`/restaurants/${restaurant._id}/write-review`}>
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
