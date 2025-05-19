// Genres.jsx
import React, { useEffect, useState } from 'react';
import './Genres.css';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const allowedGenreIds = [28, 80, 36, 878, 12, 10751, 27, 10752, 16, 14, 9648, 37];

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const { id: selectedGenreId } = useParams();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
          params: {
            api_key: import.meta.env.VITE_TMDB_API_KEY,
            language: 'en-US',
          },
        });

        const filtered = res.data.genres.filter((genre) =>
          allowedGenreIds.includes(genre.id)
        );
        setGenres(filtered);
      } catch (err) {
        console.error('Genre API error:', err);
      }
    };

    fetchGenres();
  }, []);

  return (
    <div className="genres">
      <h3>Genres</h3>
      <ul>
        {genres.map((genre) => (
          <li key={genre.id}>
            <Link
              to={`/genre/${genre.id}`}
              className={selectedGenreId === String(genre.id) ? 'active-genre' : ''}
            >
              {genre.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Genres;
