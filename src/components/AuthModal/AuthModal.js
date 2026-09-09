import React, { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";
import { validateEmail, validatePassword } from "../../services/passwordValidator";
import "./AuthModal.css";

const AuthModal = ({ onClose, onAuthenticated }) => {
  const { signInUsingGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
  };

  const completeAuth = () => {
    onClose();
    onAuthenticated?.();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (mode === "signup" && !form.name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (mode === "signup" && !validatePassword(form.password).isValid) {
      setError("Password must meet all password requirements.");
      return;
    }
    if (mode === "login" && !form.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setIsLoading(true);
      if (mode === "signup") {
        await signUpWithEmail(form.email, form.password, form.name.trim());
      } else {
        await signInWithEmail(form.email, form.password);
      }
      completeAuth();
    } catch (authError) {
      setError(authError.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      setIsLoading(true);
      await signInUsingGoogle();
      completeAuth();
    } catch (authError) {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isSignup = mode === "signup";

  return (
    <div className="auth-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className="auth-modal-close" onClick={onClose} aria-label="Close authentication dialog">
          &times;
        </button>

        <div className="login-header text-center mb-4">
          <h2 id="login-title">{isSignup ? "Create an account" : "Sign In"}</h2>
          <p className="login-subtitle">
            to <span className="brand">X-Ploring </span>
            <span className="text-info">BANGLADESH</span>
          </p>
        </div>

        {error && (
          <div className="auth-modal-error" role="alert">
            {error}
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          {isSignup && (
            <Form.Group className="mb-3">
              <Form.Label>Full name</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="Your full name"
                disabled={isLoading}
                autoFocus
              />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              placeholder="your.email@example.com"
              autoComplete="email"
              disabled={isLoading}
              autoFocus={!isSignup}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <div className="auth-password-field">
              <Form.Control
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={updateField}
                placeholder="Enter your password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </Form.Group>
          <Button type="submit" className="auth-modal-submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Please wait...
              </>
            ) : isSignup ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </Button>
        </Form>

        <div className="auth-modal-divider">
          <span>Or continue with</span>
        </div>
        {/* Google Login - Alternative */}
        <Button
          onClick={handleGoogle}
          variant="outline-info"
          size="lg"
          className="google-button fw-bold"
          disabled={isLoading}
          aria-label="Sign in with Google"
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
              Signing in...
            </>
          ) : (
            <>
              <img width="24" height="24" className="me-2" src="https://i.ibb.co/QXzZcXK/image.png" alt="Google logo" />
              Google
            </>
          )}
        </Button>
        <div className="login-signup">
          <p className="text-center text-light mb-0">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              className="bg-transparent border-0 signup-link-text"
              onClick={() => {
                setMode(isSignup ? "login" : "signup");
                setError("");
              }}
            >
              {isSignup ? "Sign in" : "Create one now"}
            </button>
          </p>
        </div>
      </section>
    </div>
  );
};

export default AuthModal;
