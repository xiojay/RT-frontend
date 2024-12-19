import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RTLogo from '../../../assets/Illustration5.jpg';
import '../auth.css';

const SignupForm = ({ setUser }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConf: '',
  });

  const handleChange = (e) => {
    setMessage('');
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, passwordConf } = formData
    if (password !== passwordConf) {
      setMessage('Passwords do not match, try again.')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error)
      }

      localStorage.setItem('token', data.token)
      setUser(data.user)
      navigate('/')
    } catch (err) {
      setMessage(err.message)
    }
  };

  return (
    <main className="auth-container">
    <img src={RTLogo} alt="RT Logo" className="auth-logo" />
      <h1>Sign Up</h1>
      {message && <p className="error-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="passwordConf">Confirm Password</label>
          <input
            type="password"
            id="passwordConf"
            name="passwordConf"
            value={formData.passwordConf}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
        <Link to="/">
          <button type="button">Cancel</button>
        </Link>
      </form>
    </main>
  );
};

export default SignupForm;
