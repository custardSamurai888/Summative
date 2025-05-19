// src/components/Feature.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Feature.css";
import { CartContext } from "../context/CartContext";

const Feature = () => {
  const [movies, setMovies] = useState([]);
  const { addToCart, removeFromCart, isInCart } = useContext(CartContext);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/movie/now_playing",
          {
            params: {
              api_key: import.meta.env.VITE_TMDB_API_KEY,
              language: "en-US",
              page: 1,
            },
          }
        );

        const shuffled = response.data.results.sort(() => 0.5 - Math.random());
        setMovies(shuffled.slice(0, 5));
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }

    fetchMovies();
  }, []);

  return (
    <div className="feature-section">
      <h2>Featured Now Playing</h2>
      <div className="feature-movies">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <Link to={`/movie/${movie.id}`}>
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
              )}
              <p>{movie.title}</p>
            </Link>
            {isInCart(movie.id) ? (
              <button className="cart-button added" disabled>
                Added to Cart
              </button>
            ) : (
              <button className="cart-button" onClick={() => addToCart(movie)}>
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feature;
