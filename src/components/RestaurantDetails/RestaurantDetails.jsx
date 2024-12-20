import { useParams, Link } from 'react-router-dom';
import './RestaurantDetails.css';

const RestaurantDetails = ({ data }) => {
  const { id } = useParams();
  const restaurant = data.find((rest) => rest.id === parseInt(id));

  if (!restaurant) {
    return <h2>Restaurant not found</h2>;
  }

  return (
    <div className="restaurant-details">
      <div className="restaurant-header">
        <div className="restaurant-header-left">
          <h1>{restaurant.name}</h1>
          <div className="restaurant-rating">
            <span>{'★'.repeat(Math.round(restaurant.rating))}</span>
            <span className="rating-count">{restaurant.rating} ({restaurant.reviewsCount} reviews)</span>
          </div>
          <p className="restaurant-category">{restaurant.cuisine} • {restaurant.priceRange}</p>
        </div>
        <div className="restaurant-header-right">
          <Link to={`/restaurants/${restaurant.id}/write-review`} className="action-button">
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
          <p>{restaurant.city}, {restaurant.state}</p>
          <p>{restaurant.phone}</p>
          <Link to="#" className="edit-link">Edit</Link>
        </div>
        <div className="restaurant-photos">
          {restaurant.photos.length > 0 ? (
            restaurant.photos.map((photo, index) => (
              <img key={index} src={photo} alt={`Restaurant ${index + 1}`} className="restaurant-photo" />
            ))
          ) : (
            <p>No photos available</p>
          )}
          {restaurant.photos.length > 0 && (
            <Link to="#" className="see-more-link">See all {restaurant.photos.length} photos</Link>
          )}
        </div>
      </div>

      <div className="restaurant-details-section">
        <div className="hours">
          <p>Today: <span>{restaurant.hours}</span></p>
          <Link to="#" className="menu-link">Full Menu</Link>
        </div>
       
      </div>

      <h2>Featured Reviews</h2> 
      <div className="featured-reviews">
        {restaurant.reviews.length > 0 ? (
          restaurant.reviews.slice(0, 3).map((review, index) => (
            <div key={index} className="review">
              <p>{review.comment}</p>
              {review.highlight && <Link to="#">{review.highlight}</Link>}
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to <Link to={`/restaurants/${restaurant.id}/write-review`}>write a review</Link>!</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;
