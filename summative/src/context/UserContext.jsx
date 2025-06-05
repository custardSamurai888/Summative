import { createContext, useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { saveUserToFirestore } from "../firebase/firestoreUtils";  // Adjust path

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    genres: [],
    loggedIn: false,
  });

  const auth = getAuth();

  const login = (username) => {
    setUser((prev) => ({
      ...prev,
      username,
      loggedIn: true,
    }));
  };

  const logout = () => {
    setUser({
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      genres: [],
      loggedIn: false,
    });
  };

  // Updated register function to handle Firebase Auth + Firestore save
  const register = async ({
    firstName,
    lastName,
    email,
    password,
    genres,
  }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Save additional user info to Firestore
      await saveUserToFirestore(firebaseUser.uid, {
        firstName,
        lastName,
        email,
        username: email.split("@")[0],
        preferredGenres: genres,
      });

      // Update context state
      setUser({
        firstName,
        lastName,
        email,
        username: email.split("@")[0],
        genres,
        loggedIn: true,
      });
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
};
