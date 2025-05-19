import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const { cart } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const suggestionsRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') return;
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    setSuggestions([]);
    setSearchQuery('');
  };

  useEffect(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout);

    if (searchQuery.trim() === '') {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get('https://api.themoviedb.org/3/search/movie', {
          params: {
            api_key: import.meta.env.VITE_TMDB_API_KEY,
            query: searchQuery,
          },
        });
        setSuggestions(res.data.results.slice(0, 5)); // only top 5 suggestions
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    }, 600); // debounce delay

    setDebounceTimeout(timeout);
  }, [searchQuery]);

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <Link to="/" className="logo-link">
        <img className="logo" src="/images/hmm.png" alt="Logo" />
      </Link>

      {user.loggedIn && <h1 className="welcome-heading">Welcome, {user.username}!</h1>}

      <div className="search-form" ref={suggestionsRef}>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {suggestions.length > 0 && (
          <ul className="suggestions-dropdown">
            {suggestions.map((movie) => (
              <li key={movie.id} onClick={() => {
                navigate(`/movie/${movie.id}`);
                setSuggestions([]);
                setSearchQuery('');
              }}>
                {movie.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="header-buttons">
        {user.loggedIn ? (
          <>
            <p className="welcome">Hi {user.username}</p>
            <button onClick={() => navigate('/cart')}>
              Cart {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </button>
            <button onClick={() => navigate('/settings')}>Settings</button>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/register')}>Register</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
