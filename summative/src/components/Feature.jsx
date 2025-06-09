import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Feature.css';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';

const Feature = () => {
  const [movies, setMovies] = useState([]);
  const { addToCart, isInCart } = useContext(CartContext);
  const { firebaseUser, purchases } = useContext(UserContext);

  // Helper to check if purchased (by title and release_date)
  const isPurchased = (movie) =>
    purchases &&
    purchases.some(
      (p) => p.title === movie.title && p.release_date === movie.release_date
    );

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await axios.get(
          'https://api.themoviedb.org/3/movie/now_playing',
          {
            params: {
              api_key: import.meta.env.VITE_TMDB_API_KEY,
              language: 'en-US',
              page: 1,
            },
          }
        );
        // Randomize the movies and pick 3
        const shuffled = response.data.results
          .slice()
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        setMovies(shuffled);
      } catch (err) {
        console.error('Failed to fetch now playing movies:', err);
      }
    };

    fetchNowPlaying();
  }, []);

  return (
    <div className="feature">
      <h2>Featured Now Playing</h2>
      <div className="movie-cards">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <Link to={`/movie/${movie.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
              />
              <p><strong>{movie.title}</strong></p>
            </Link>

            {/* Only show Add to Cart if logged in and not purchased */}
            {!!firebaseUser && (
              isPurchased(movie) ? (
                <button disabled className="cart-button added">
                  Purchased
                </button>
              ) : isInCart(movie.id) ? (
                <button disabled className="cart-button added">
                  Added to Cart
                </button>
              ) : (
                <button className="cart-button" onClick={() => addToCart(movie)}>
                  Add to Cart
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feature;