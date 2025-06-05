import React, { useEffect, useState, useContext } from 'react';
import './Genres.css';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const { id: selectedGenreId } = useParams();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
          params: {
            api_key: import.meta.env.VITE_TMDB_API_KEY,
            language: 'en-US',
          },
        });

        // Filter only genres user selected at registration
        const filtered = res.data.genres.filter((genre) =>
          user.genres.includes(genre.id)
        );

        setGenres(filtered);
      } catch (err) {
        console.error('Genre API error:', err);
      }
    };

    fetchGenres();
  }, [user.genres]); // Refetch if user.genres changes

  return (
    <div className="genres">
      <h3>Your Selected Genres</h3>
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