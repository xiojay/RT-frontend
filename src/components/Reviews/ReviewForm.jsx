import { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ReviewForm.css';

const ReviewForm = ({ onSubmit, data }) => {
  const { id } = useParams();
  const restaurant = data.find((rest) => rest.id === parseInt(id))

  const [formData, setFormData] = useState({
    rating: 0,
    categories: { food: false, service: false, ambiance: false },
    reviewText: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Star rating descriptions
  const ratingDescriptions = ["Not Good", "Not the Best", "Decent", "Good", "Amazing"];

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating })
  };

  const handleCategoryChange = (category) => {
    setFormData({
      ...formData,
      categories: { ...formData.categories, [category]: !formData.categories[category] },
    })
  };

  const handleChange = (e) => {
    setFormData({ ...formData, reviewText: e.target.value })
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.rating === 0) {
      alert('Please select a rating')
      return;
    }

    try {
      // Post review to the backend
      const response = await fetch(`http://localhost:5000/restaurants/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit the review')
      }

      setMessage('Review submitted successfully!')
      onSubmit(formData); 
      setFormData({
        rating: 0,
        categories: { food: false, service: false, ambiance: false },
        reviewText: '',
      });
    } catch (err) {
      setError(err.message || 'An error occurred while submitting the review.')
    }
  };

  return (
    <div className="review-form-container">
      <h1>Write a Review for {restaurant?.name || "the restaurant"}</h1>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form className="review-form" onSubmit={handleSubmit}>
        
        <div className="rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${formData.rating >= star ? 'selected' : ''}`}
              onClick={() => handleRatingChange(star)}
            >
              ★
            </span>
          ))}
          <span className="rating-label">
            {formData.rating > 0 ? ratingDescriptions[formData.rating - 1] : 'Select a Rating'}
          </span>
        </div>

        <div className="categories">
          <p>A few things to consider in your review:</p>
          <button
            type="button"
            className={`category ${formData.categories.food ? 'active' : ''}`}
            onClick={() => handleCategoryChange('food')}
          >
            Food
          </button>
          <button
            type="button"
            className={`category ${formData.categories.service ? 'active' : ''}`}
            onClick={() => handleCategoryChange('service')}
          >
            Service
          </button>
          <button
            type="button"
            className={`category ${formData.categories.ambiance ? 'active' : ''}`}
            onClick={() => handleCategoryChange('ambiance')}
          >
            Ambiance
          </button>
        </div>

        <textarea
          placeholder="Start your review..."
          value={formData.reviewText}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-button">
          Post Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
