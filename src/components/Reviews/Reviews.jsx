import { useState } from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

const Reviews = ({ restaurantId }) => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      restaurantId: 1,
      rating: 5,
      bestDish: 'Margherita Pizza',
      details: 'Amazing pizza with fresh ingredients.',
    },
    {
      id: 2,
      restaurantId: 2,
      rating: 4,
      bestDish: 'Cheeseburger',
      details: 'Juicy burger with great flavor!',
    },
  ]); 
  
  const filteredReviews = reviews.filter((review) => review.restaurantId === restaurantId);

  const addReview = (newReview) => {
    setReviews([
      ...reviews,
      { ...newReview, id: reviews.length + 1, restaurantId },
    ]);
  };

  const updateReview = (id, updatedReview) => {
    setReviews(
      reviews.map((review) =>
        review.id === id ? { ...updatedReview, restaurantId } : review
      )
    );
  };

  const deleteReview = (id) => {
    setReviews(reviews.filter((review) => review.id !== id));
  };

  return (
    <div className="reviews-container">
      <h3>Add Your Review</h3>
      <ReviewForm onSubmit={addReview} />
      <h3>All Reviews</h3>
      <ReviewList reviews={filteredReviews} onEdit={updateReview} onDelete={deleteReview} />
    </div>
  );
};

export default Reviews;
