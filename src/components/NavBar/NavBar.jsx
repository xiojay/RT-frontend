import { Link } from 'react-router-dom';
import { AuthedUserContext } from '../../App';
import { useContext } from 'react';
import './NavBar.css';
import RTLogo from '../../assets/Illustration5.jpg';

const NavBar = ({ handleSignout }) => {
  const user = useContext(AuthedUserContext);

  return (
    <nav className="navbar">

      <div className="navbar-logo">
        <Link to="/">
          <img src={RTLogo} alt="RT Logo" />
        </Link>
      </div>

      <ul className="navbar-links">
        {user ? (
          <>
            <li className="navbar-welcome">Welcome, {user.username}</li>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/search" className="search-link">Search</Link>
            </li>
            <li>
              <Link to="/" onClick={handleSignout} className="signout-button">
                Sign Out
              </Link>
            </li>
          </>
        ) : (
          <>
           <li>
              <Link to="/search" className="search-link">Search</Link>
            </li>
            <li>
              <Link to="/signin">Sign In</Link>
            </li>
            <li>
              <Link to="/signup" className="signup-button">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
