import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../../../services/authService';
import RTLogo from '../../../assets/Illustration5.jpg';
import "../auth.css";

const SigninForm = (props) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const updateMessage = (msg) => {
    setMessage(msg);
  };

  const handleChange = (e) => {
    updateMessage('');
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const response = await fetch('http://localhost:5000/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid username or password.');
      }

      
      localStorage.setItem('token', data.token);
      props.setUser(data.user);

      navigate('/'); 
    } catch (err) {
      if (err.message === 'Invalid username or password.') {
        updateMessage('The username or password you entered is incorrect. Please try again.');
      } else {
        updateMessage('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <main className="auth-container">
      <img src={RTLogo} alt="RT Logo" className="auth-logo" />
      <h1>Log In</h1>
      <p>{message}</p>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            autoComplete="off"
            id="username"
            value={formData.username}
            name="username"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            autoComplete="off"
            id="password"
            value={formData.password}
            name="password"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit">Log In</button>
          <Link to="/">
            <button type="button">Cancel</button>
          </Link>
        </div>
      </form>
    </main>
  );
};

export default SigninForm;
