import React, { useState, useEffect } from "react";
import "./RegisterView.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebaseConfig";

const RegisterView = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [googleUid, setGoogleUid] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const allowedGenreIds = [
    28, 80, 36, 878, 12, 10751, 27, 10752, 16, 14, 9648, 37,
  ];

  // Pre-fill from location.state if present
  useEffect(() => {
    if (location.state) {
      setEmail(location.state.email || "");
      setFirstName(location.state.firstName || "");
      setLastName(location.state.lastName || "");
      setGoogleUid(location.state.googleUid || null);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get(
          "https://api.themoviedb.org/3/genre/movie/list",
          {
            params: {
              api_key: import.meta.env.VITE_TMDB_API_KEY,
              language: "en-US",
            },
          }
        );
        const filtered = res.data.genres.filter((g) =>
          allowedGenreIds.includes(g.id)
        );
        setGenres(filtered);
      } catch (err) {
        alert("Failed to load genres");
      }
    };
    fetchGenres();
  }, []);

  const handleGenreChange = (id) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !firstName ||
      !lastName ||
      !email ||
      (!googleUid && (!password || !rePassword))
    ) {
      alert("All fields are required.");
      return;
    }

    if (!googleUid && password !== rePassword) {
      alert("Passwords do not match.");
      return;
    }

    if (selectedGenres.length < 5) {
      alert("Please select at least 5 genres.");
      return;
    }

    try {
      let uid;

      if (googleUid) {
        uid = googleUid;
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        uid = userCredential.user.uid;
      }

      // Map selected IDs to objects with id and name
      const selectedGenreObjects = genres
        .filter((g) => selectedGenres.includes(g.id))
        .map((g) => ({ id: g.id, name: g.name }));

      await setDoc(doc(firestore, "users", uid), {
        email,
        firstName,
        lastName,
        genrePreferences: selectedGenreObjects,
        purchases: [],
        createdAt: new Date(),
      });

      alert("Registration successful!");

      if (selectedGenreObjects.length > 0) {
        navigate(`/genre/${selectedGenreObjects[0].id}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      if (err.code === "auth/email-already-in-use") {
        alert("Email already in use.");
      } else {
        alert("Registration failed: " + err.message);
      }
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const nameParts = user.displayName?.split(" ") || [];
      const first = nameParts[0] || "";
      const last = nameParts.slice(1).join(" ") || "";

      setFirstName(first);
      setLastName(last);
      setEmail(user.email);
      setGoogleUid(user.uid);
      alert("Google account linked! Complete the form to finish registration.");
    } catch (err) {
      console.error("Google sign-in failed:", err);
      alert("Google sign-in failed: " + err.message);
    }
  };

  return (
    <div className="register-view">
      <form onSubmit={handleRegister}>
        <h2>Register</h2>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={!!googleUid}
        />
        {!googleUid && (
          <>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Re-enter Password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              required
            />
          </>
        )}

        <div className="genre-checkboxes">
          <p>Select at least 5 favorite genres:</p>
          {genres.map((genre) => (
            <label key={genre.id}>
              <input
                type="checkbox"
                value={genre.id}
                checked={selectedGenres.includes(genre.id)}
                onChange={() => handleGenreChange(genre.id)}
              />
              {genre.name}
            </label>
          ))}
        </div>

        <button type="submit">Register</button>
        <button
          type="button"
          className="google-register"
          onClick={handleGoogleRegister}
        >
          Link Google Account
        </button>
      </form>
    </div>
  );
};

export default RegisterView;