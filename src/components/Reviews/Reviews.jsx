import { useState, useEffect } from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

const Reviews = ({ restaurantId }) => {
  const [reviews, setReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch reviews from the backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/restaurants/${restaurantId}/reviews`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch reviews.');
        }

        setReviews(data);
      } catch (error) {
        setErrorMessage(error.message || 'An error occurred while fetching reviews.');
      }
    };

    fetchReviews();
  }, [restaurantId]);

  // Add a new review
  const addReview = async (newReview) => {
    try {
      const response = await fetch(`http://localhost:5000/restaurants/${restaurantId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newReview),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add review.');
      }

      setReviews((prevReviews) => [...prevReviews, { ...data, restaurantId }]);
      setSuccessMessage('Review added successfully!');
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred while adding the review.');
    }
  };

  // Update an existing review
  const updateReview = async (id, updatedReview) => {
    try {
      const response = await fetch(`http://localhost:5000/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedReview),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update review.');
      }

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === id ? { ...review, ...updatedReview } : review
        )
      );
      setSuccessMessage('Review updated successfully!');
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred while updating the review.');
    }
  };

  // Delete a review
  const deleteReview = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete review.');
      }

      setReviews((prevReviews) => prevReviews.filter((review) => review.id !== id));
      setSuccessMessage('Review deleted successfully!');
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred while deleting the review.');
    }
  };

  return (
    <div className="reviews-container">
      <h3>Add Your Review</h3>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <ReviewForm onSubmit={addReview} />
      <h3>All Reviews</h3>
      <ReviewList reviews={reviews} onEdit={updateReview} onDelete={deleteReview} />
    </div>
  );
};

export default Reviews;
