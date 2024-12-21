import { useEffect, useState } from 'react';
import ReviewItem from './ReviewItem';

const ReviewList = ({ restaurantId, onEdit, onDelete }) => {
  const [reviews, setReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch reviews from the backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:3000/restaurant/${restaurantId}/reviews`);

        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        setReviews(data); // Set reviews from the backend response
        setLoading(false);
      } catch (error) {
        setErrorMessage(error.message || 'An error occurred while fetching reviews.');
        setLoading(false);
      }
    };

    fetchReviews();
  }, [restaurantId]);

  // Handle review updates
  const handleEdit = (id, updatedReview) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === id ? { ...review, ...updatedReview } : review
      )
    );
    if (onEdit) onEdit(id, updatedReview);
  };

  // Handle review deletions
  const handleDelete = (id) => {
    setReviews((prevReviews) => prevReviews.filter((review) => review.id !== id));
    if (onDelete) onDelete(id);
  };

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  if (errorMessage) {
    return <p className="error-message">{errorMessage}</p>;
  }

  return (
    <div className="review-list">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <p>No reviews yet. Be the first to write one!</p>
      )}
    </div>
  );
};

export default ReviewList;
