import { createContext, useState, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";
import { CartContext } from "./CartContext";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Store only Firebase user object, genre preferences, and purchases
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [genres, setGenres] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const auth = getAuth();
  const { clearCart } = useContext(CartContext);

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
    });
    return () => unsubscribe();
  }, [auth]);

  const logout = async () => {
    await signOut(auth);
    setFirebaseUser(null);
    setGenres([]);
    setPurchases([]);
    clearCart();
  };

  // Update genres in context and Firestore
  const updateGenres = async (newGenres) => {
    if (!firebaseUser) return;
    await updateDoc(doc(firestore, "users", firebaseUser.uid), { genrePreferences: newGenres });
    setGenres(newGenres);
  };

  // Update purchases in context and Firestore
  const updatePurchases = async (newPurchases) => {
    if (!firebaseUser) return;
    await updateDoc(doc(firestore, "users", firebaseUser.uid), { purchases: newPurchases });
    setPurchases(newPurchases);
  };

  return (
    <UserContext.Provider
      value={{
        firebaseUser,      // Use !!firebaseUser to check login status
        genres,            // Use genres directly
        purchases,         // Use purchases directly
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