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
    setIsLoading(true);
    setError("");
    const googleProvider = new GoogleAuthProvider();

    return signInWithPopup(auth, googleProvider)
      .catch((err) => {
        setError(err.message);
        throw err;
      })
      .finally(() => setIsLoading(false));
  };

  // Email/Password Registration
  const signUpWithEmail = (email, password, displayName) => {
    setIsLoading(true);
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
      })
      .finally(() => setIsLoading(false));
  };

  // Email/Password Login
  const signInWithEmail = (email, password) => {
    setIsLoading(true);
    setError("");
    return signInWithEmailAndPassword(auth, email, password)
      .catch((err) => {
        setError(err.message);
        throw err;
      })
      .finally(() => setIsLoading(false));
  };

  // Update user profile with additional info
  const updateUserProfile = (profileData) => {
    setIsLoading(true);
    setError("");
    return updateProfile(auth.currentUser, profileData)
      .catch((err) => {
        setError(err.message);
        throw err;
      })
      .finally(() => setIsLoading(false));
  };

  // Password Reset
  const resetPassword = (email) => {
    setIsLoading(true);
    setError("");
    return sendPasswordResetEmail(auth, email)
      .catch((err) => {
        setError(err.message);
        throw err;
      })
      .finally(() => setIsLoading(false));
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
