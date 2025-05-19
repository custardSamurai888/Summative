import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './SearchView.css';

const SearchView = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
          params: {
            api_key: import.meta.env.VITE_TMDB_API_KEY,
            query: query,
            include_adult: false,
            language: 'en-US',
            page: 1,
          }
        });
        setResults(response.data.results || []);
      } catch (error) {
        console.error('Search failed:', error);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div className="search-view">
      <h2>Search Results for "{query}"</h2>
      {results.length > 0 ? (
        <div className="results-grid">
          {results.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchView;
