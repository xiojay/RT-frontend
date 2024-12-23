import { useState } from 'react';
import ReviewForm from './ReviewForm';

const ReviewItem = ({ review, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleEdit = async (updatedReview) => {
    const API_BASE_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;  
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${review.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
        body: JSON.stringify(updatedReview),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update the review.');
      }

      setSuccessMessage('Review updated successfully!');
      onEdit(review.id, updatedReview); 
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred while updating the review.');
    }
  };

  const handleDelete = async () => {
  const API_BASE_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${review.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete the review.');
      }

      setSuccessMessage('Review deleted successfully!');
      onDelete(review.id); 
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred while deleting the review.');
    }
  };

  return (
    <div className="review-item">
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {isEditing ? (
        <ReviewForm existingReview={review} onSubmit={handleEdit} />
      ) : (
        <>
          <h3>{review.bestDish}</h3>
          <p><strong>Rating:</strong> {review.rating}</p>
          <p>{review.details}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </div>
  );
};

export default ReviewItem;
