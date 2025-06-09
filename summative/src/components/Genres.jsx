import React, { useEffect, useState, useContext } from 'react';
import './Genres.css';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Genres = () => {
  const [genresList, setGenresList] = useState([]);
  const { id: selectedGenreId } = useParams();
  const { firebaseUser, genres } = useContext(UserContext);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
          params: {
            api_key: import.meta.env.VITE_TMDB_API_KEY,
            language: 'en-US',
          },
        });

        // genres is now array of {id, name}
        const userGenreIds = (genres || []).map(g =>
          typeof g === "object" && g !== null ? g.id : g
        );

        const filtered = res.data.genres.filter((genre) =>
          userGenreIds.includes(genre.id)
        );

        setGenresList(filtered);
      } catch (err) {
        console.error('Genre API error:', err);
        setGenresList([]);
      }
    };

    fetchGenres();
  }, [genres]);

  return (
    <div className="genres">
      <h3>Your Selected Genres</h3>
      {genresList.length === 0 ? (
        <p>No genres selected. Please register and select your favorite genres.</p>
      ) : (
        <ul>
          {genresList.map((genre) => (
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
      )}
    </div>
  );
};

export default Genres;