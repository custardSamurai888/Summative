import { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [genres, setGenres] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true); // <-- add loading state
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setGenres(data.genrePreferences || []);
          setPurchases(data.purchases || []);
        } else {
          setGenres([]);
          setPurchases([]);
        }
      } else {
        setFirebaseUser(null);
        setGenres([]);
        setPurchases([]);
      }
      setLoading(false); // <-- set loading to false after check
    });
    return () => unsubscribe();
  }, [auth]);

  const logout = async () => {
    await signOut(auth);
    setFirebaseUser(null);
    setGenres([]);
    setPurchases([]);
  };

  const updateGenres = async (newGenres) => {
    if (!firebaseUser) return;
    await updateDoc(doc(firestore, "users", firebaseUser.uid), { genrePreferences: newGenres });
    setGenres(newGenres);
  };

  const updatePurchases = async (newPurchases) => {
    if (!firebaseUser) return;
    await updateDoc(doc(firestore, "users", firebaseUser.uid), { purchases: newPurchases });
    setPurchases(newPurchases);
  };

  if (loading) return <div style={{color: "#fff", textAlign: "center", marginTop: "3rem"}}>Loading...</div>;

  return (
    <UserContext.Provider
      value={{
        firebaseUser,
        genres,
        purchases,
        setFirebaseUser,
        setGenres,
        setPurchases,
        logout,
        updateGenres,
        updatePurchases,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};