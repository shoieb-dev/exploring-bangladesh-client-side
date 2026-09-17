import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useState, useEffect } from "react";
import initializeAuthentication from "./../Pages/Login/Firebase/firebase.init";

initializeAuthentication();

const useFirebase = () => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const auth = getAuth();

  const signInUsingGoogle = () => {
    // NOTE: do NOT toggle global isLoading here. Login/Signup live inside
    // PublicRoute which renders a full-page spinner (and unmounts them)
    // whenever global isLoading is true. Toggling it here would unmount
    // the Login page while the Google popup is still open, losing the
    // .then() redirect + success toast. Local button spinners in
    // Login/AuthModal already cover the waiting state.
    setError("");
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });

    return signInWithPopup(auth, googleProvider).catch((err) => {
      // Ignore user-dismissed popups quietly; surface real errors.
      if (err?.code === "auth/popup-closed-by-user" || err?.code === "auth/cancelled-popup-request") {
        throw err;
      }
      setError(err.message);
      throw err;
    });
  };

  // Email/Password Registration
  const signUpWithEmail = (email, password, displayName) => {
    // Same reason as above: keep global isLoading for initial auth-state
    // observation only; components manage their own button spinners.
    setError("");
    return createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        // Update profile with display name
        if (displayName) {
          return updateProfile(result.user, { displayName }).then(() => result);
        }
        return result;
      })
      .catch((err) => {
        setError(err.message);
        throw err;
      });
  };

  // Email/Password Login
  const signInWithEmail = (email, password) => {
    setError("");
    return signInWithEmailAndPassword(auth, email, password).catch((err) => {
      setError(err.message);
      throw err;
    });
  };

  // Update user profile with additional info
  const updateUserProfile = (profileData) => {
    setError("");
    return updateProfile(auth.currentUser, profileData).catch((err) => {
      setError(err.message);
      throw err;
    });
  };

  // Password Reset
  const resetPassword = (email) => {
    setError("");
    return sendPasswordResetEmail(auth, email).catch((err) => {
      setError(err.message);
      throw err;
    });
  };

  // observe user state change
  useEffect(() => {
    const unsubscribed = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser({});
      }
      setIsLoading(false);
    });
    return () => unsubscribed;
  }, []);

  const logOut = () => {
    setIsLoading(true);
    setError("");
    signOut(auth)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  return {
    user,
    isLoading,
    error,
    setError,
    signInUsingGoogle,
    signUpWithEmail,
    signInWithEmail,
    updateUserProfile,
    resetPassword,
    logOut,
  };
};

export default useFirebase;
