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
import { useState, useEffect, useCallback } from "react";
import initializeAuthentication from "./../Pages/Login/Firebase/firebase.init";

initializeAuthentication();

// Backend base URL — set in frontend .env:
// REACT_APP_API_URL=https://your-server.vercel.app  (prod)
// REACT_APP_API_URL=http://localhost:5000          (local dev)
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const useFirebase = () => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ---- backend-synced role state (normal vs admin) ----
  const [backendUser, setBackendUser] = useState(null);
  const [role, setRole] = useState("user"); // "user" | "admin"
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);

  const auth = getAuth();

  // Get a fresh Firebase ID token for admin-only backend calls
  const getAuthToken = useCallback(async () => {
    if (!auth.currentUser) return null;
    try {
      return await auth.currentUser.getIdToken();
    } catch {
      return null;
    }
  }, [auth]);

  // POST /api/users/upsert — creates/updates Mongo user.
  // Allowlisted ADMIN_EMAILS become admin automatically (bootstrap).
  // Never blocks login: backend down => login still succeeds.
  const syncUserToBackend = useCallback(async (fbUser) => {
    if (!fbUser?.email) return null;
    try {
      const res = await fetch(`${API_BASE}/api/users/upsert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || "",
          photoURL: fbUser.photoURL || "",
          provider: fbUser.providerData?.[0]?.providerId || "firebase",
        }),
      });
      const json = await res.json().catch(() => null);
      if (json?.success && json?.data) {
        setBackendUser(json.data);
        if (json.data.role) {
          setRole(json.data.role);
          setIsAdmin(json.data.role === "admin");
        }
        return json.data;
      }
      return null;
    } catch {
      // backend offline — ignore, Firebase login already succeeded
      return null;
    }
  }, []);

  // GET /api/users/me?email= — public role lookup for UI gating
  const refreshRole = useCallback(
    async (email) => {
      const target = (email || auth.currentUser?.email || "").toLowerCase();
      if (!target) {
        setRole("user");
        setIsAdmin(false);
        return { role: "user", isAdmin: false };
      }
      setRoleLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/users/me?email=${encodeURIComponent(target)}`);
        const json = await res.json().catch(() => null);
        if (json?.success && json?.data) {
          setRole(json.data.role || "user");
          setIsAdmin(Boolean(json.data.isAdmin));
          return json.data;
        }
      } catch {
        // keep previous role on network error
      } finally {
        setRoleLoading(false);
      }
      return { role, isAdmin };
    },
    [auth, role, isAdmin],
  );

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

    return signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        // sync to backend (upsert) + pull role, don't block on failure
        await syncUserToBackend(result.user);
        await refreshRole(result.user?.email);
        return result;
      })
      .catch((err) => {
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
      .then(async (result) => {
        // Update profile with display name
        if (displayName) {
          await updateProfile(result.user, { displayName }).catch(() => {});
        }
        await syncUserToBackend(auth.currentUser || result.user);
        await refreshRole(email);
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
    return signInWithEmailAndPassword(auth, email, password)
      .then(async (result) => {
        await syncUserToBackend(result.user);
        await refreshRole(result.user?.email);
        return result;
      })
      .catch((err) => {
        setError(err.message);
        throw err;
      });
  };

  // Update user profile with additional info
  const updateUserProfile = (profileData) => {
    setError("");
    return updateProfile(auth.currentUser, profileData)
      .then(async (res) => {
        // keep backend displayName/photo in sync
        await syncUserToBackend(auth.currentUser);
        return res;
      })
      .catch((err) => {
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
    const unsubscribed = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        // sync on refresh/login-persist + load role for gating
        await syncUserToBackend(fbUser);
        await refreshRole(fbUser.email);
      } else {
        setUser({});
        setBackendUser(null);
        setRole("user");
        setIsAdmin(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribed;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logOut = () => {
    setIsLoading(true);
    setError("");
    signOut(auth)
      .then(() => {
        setBackendUser(null);
        setRole("user");
        setIsAdmin(false);
      })
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
    // ---- new: backend role ----
    role, // "user" | "admin"
    isAdmin, // boolean — use for `isAdmin && <AdminLink/>`
    backendUser, // Mongo user doc (has role, id, ...)
    roleLoading,
    refreshRole,
    getAuthToken, // for admin-only calls: Authorization: Bearer <token>
  };
};

export default useFirebase;
