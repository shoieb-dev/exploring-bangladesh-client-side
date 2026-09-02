import React, { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../../hooks/useAuth";
import { validateEmail } from "../../../services/passwordValidator";
import ToastNotification from "../../../components/ToastNotification";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });

  const emailValid = email && validateEmail(email);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
    setToast({ type: "", message: "" });
  };

  const clearToast = () => setToast({ type: "", message: "" });

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    clearToast();

    if (!email.trim()) {
      const message = "Email address is required";
      setError(message);
      setToast({ type: "error", message });
      return;
    }

    if (!emailValid) {
      const message = "Please enter a valid email address";
      setError(message);
      setToast({ type: "error", message });
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword(email);
      const message = "Password reset email sent successfully! Check your inbox.";
      setSuccessMessage(message);
      setToast({ type: "success", message });
      setSubmitted(true);
      setEmail("");
    } catch (err) {
      const message = err.message || "Failed to send reset email. Please try again.";
      setError(message);
      setToast({ type: "error", message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="toast-wrapper">
        {toast.message && <ToastNotification type={toast.type} message={toast.message} onClose={clearToast} />}
      </div>

      <div className="forgot-password">
        <div className="forgot-password-container">
          <div className="forgot-password-card">
            {!submitted ? (
              <>
                <h2 className="reset-title">Forgot Your Password?</h2>
                <p className="reset-subtitle">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                {error && !toast.message && (
                  <div className="auth-inline-message auth-inline-message-error">{error}</div>
                )}

                <Form onSubmit={handleResetPassword} className="reset-form text-start">
                  <Form.Group className="mb-4">
                    <Form.Label>Email Address *</Form.Label>
                    <div className="input-group">
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={handleChange}
                        isInvalid={!!error && email}
                        isValid={email && emailValid && !error}
                        placeholder="your.email@example.com"
                        disabled={isLoading}
                        autoComplete="email"
                      />
                      {email && (
                        <span className="input-group-text">
                          {emailValid ? (
                            <FontAwesomeIcon icon={faCheck} className="text-success" />
                          ) : (
                            <span className="text-danger">✕</span>
                          )}
                        </span>
                      )}
                    </div>
                  </Form.Group>

                  <Button
                    variant="info"
                    size="lg"
                    className="reset-button w-100 fw-bold mb-3"
                    type="submit"
                    disabled={isLoading || !emailValid}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </Form>

                <div className="reset-links">
                  <Link to="/login" className="reset-link">
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    Back to Login
                  </Link>
                </div>
              </>
            ) : (
              <div className="success-section text-center">
                <div className="success-icon">
                  <FontAwesomeIcon icon={faCheck} />
                </div>
                <h3 className="success-title">Check Your Email</h3>
                <p className="success-message">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="success-instructions">
                  Click the link in the email to reset your password. If you don't see the email, check your spam
                  folder.
                </p>

                <div className="reset-actions">
                  <Button
                    variant="outline-info"
                    className="reset-back-button fw-bold"
                    onClick={() => setSubmitted(false)}
                  >
                    Try Another Email
                  </Button>
                  <Link to="/login" className="btn btn-info fw-bold reset-to-login">
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    Back to Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
