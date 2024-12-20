import { useState } from 'react';
import ReviewForm from './ReviewForm';

const ReviewItem = ({ review, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (updatedReview) => {
    onEdit(review.id, updatedReview);
    setIsEditing(false);
  };

  return (
    <div className="review-item">
      {isEditing ? (
        <ReviewForm existingReview={review} onSubmit={handleEdit} />
      ) : (
        <>
          <h3>{review.bestDish}</h3>
          <p><strong>Rating:</strong> {review.rating}</p>
          <p>{review.details}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onDelete(review.id)}>Delete</button>
        </>
      )}
    </div>
  );
};

export default ReviewItem;
