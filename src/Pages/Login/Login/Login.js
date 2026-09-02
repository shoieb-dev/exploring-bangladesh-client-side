import React, { useState } from "react";
import { Button, Spinner, Form } from "react-bootstrap";
import { useHistory, useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useAuth from "./../../../hooks/useAuth";
import { validateEmail } from "./../../../services/passwordValidator";
import ToastNotification from "../../../components/ToastNotification";
import "./Login.css";

const Login = () => {
  const { signInUsingGoogle, signInWithEmail, error: authError, setError } = useAuth();
  const location = useLocation();
  const history = useHistory();
  const redirect_uri = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError2] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });

  const emailValid = email && validateEmail(email);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const clearToast = () => setToast({ type: "", message: "" });

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError2(null);
    setError("");
    clearToast();
    signInUsingGoogle()
      .then(() => {
        setIsLoading(false);
        showToast("success", "Signed in successfully!");
        setTimeout(() => history.push(redirect_uri), 800);
      })
      .catch((err) => {
        setIsLoading(false);
        setError2("Google login failed. Please try again.");
        showToast("error", "Google login failed. Please try again.");
        console.error("Google login error:", err);
      });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError2(null);
    setError("");
    clearToast();

    if (!email.trim() || !password.trim()) {
      const message = "Please enter both email and password";
      setError2(message);
      showToast("error", message);
      return;
    }

    if (!emailValid) {
      const message = "Please enter a valid email address";
      setError2(message);
      showToast("error", message);
      return;
    }

    try {
      setIsLoading(true);
      await signInWithEmail(email, password);
      setIsLoading(false);
      showToast("success", "Welcome back! Redirecting to your dashboard...");
      setTimeout(() => history.push(redirect_uri), 800);
    } catch (err) {
      setIsLoading(false);
      const message = err.message || "Login failed. Please try again.";
      setError2(message);
      showToast("error", message);
      console.error("Email login error:", err);
    }
  };

  const displayError = error || authError || error;

  return (
    <>
      <div className="toast-wrapper">
        {toast.message && <ToastNotification type={toast.type} message={toast.message} onClose={clearToast} />}
      </div>

      <div className="login">
        <div className="login-container text-white px-5 py-5 mx-auto bg-login">
          <div className="login-content">
            <div className="login-header text-center">
              <h2 className="login-title">Sign In</h2>
              <p className="login-subtitle">
                to <span className="brand">X-Ploring </span>
                <span className="text-info">BANGLADESH</span>
              </p>
            </div>

            {displayError && !toast.message && (
              <div className="auth-inline-message auth-inline-message-error">{displayError}</div>
            )}

            {/* Email Login Form - Primary */}
            <Form onSubmit={handleEmailLogin} className="login-form text-start">
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError2(null);
                  }}
                  isInvalid={!!error && email}
                  isValid={email && emailValid && !error}
                  placeholder="your.email@example.com"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError2(null);
                    }}
                    isInvalid={!!error && password}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                    disabled={isLoading}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </Form.Group>

              <div className="login-links mb-3">
                <Link to="/forgotPassword" className="forgot-link">
                  Forgot Password?
                </Link>
              </div>

              <Button
                variant="info"
                size="lg"
                className="login-button w-100 fw-bold mb-4"
                type="submit"
                disabled={isLoading || !emailValid || !password}
              >
                {isLoading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </Form>

            {/* Divider */}
            <div className="login-divider">
              <span>Or continue with</span>
            </div>

            {/* Google Login - Alternative */}
            <Button
              onClick={handleGoogleLogin}
              variant="outline-info"
              size="lg"
              className="google-button fw-bold mb-2"
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
                  <img
                    width="24"
                    height="24"
                    className="me-2"
                    src="https://i.ibb.co/QXzZcXK/image.png"
                    alt="Google logo"
                  />
                  Google
                </>
              )}
            </Button>

            {/* Signup Link */}
            <div className="login-signup">
              <p className="text-center text-light mb-0">
                Don't have an account?{" "}
                <Link to="/signup" className="signup-link-text">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
