import React, { useState } from "react";
import { Button, Form, ProgressBar, Spinner } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../../hooks/useAuth";
import {
  validatePassword,
  validateEmail,
  validatePhone,
  getPasswordStrengthColor,
} from "../../../services/passwordValidator";
import ToastNotification from "../../../components/ToastNotification/ToastNotification";
import "./Signup.css";

const Signup = () => {
  const { signUpWithEmail, updateUserProfile } = useAuth();
  const history = useHistory();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [toast, setToast] = useState({ type: "", message: "" });

  const passwordValidation = validatePassword(formData.password);
  const emailValid = formData.email && validateEmail(formData.email);
  const phoneValid = formData.phone === "" || (formData.phone && validatePhone(formData.phone));
  const passwordsMatch =
    formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailValid) newErrors.email = "Invalid email format";

    if (formData.phone && !phoneValid) newErrors.phone = "Invalid phone number format";

    if (!formData.password) newErrors.password = "Password is required";
    else if (!passwordValidation.isValid) newErrors.password = "Password does not meet requirements";

    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm password";
    else if (!passwordsMatch) newErrors.confirmPassword = "Passwords do not match";

    if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setSuccessMessage("");
    setToast({ type: "", message: "" });

    if (!validateForm()) {
      const errorMessage = "Please review the form and fix the highlighted fields.";
      setGeneralError(errorMessage);
      setToast({ type: "error", message: errorMessage });
      return;
    }

    try {
      setIsLoading(true);
      const displayName = `${formData.firstName} ${formData.lastName}`;

      await signUpWithEmail(formData.email, formData.password, displayName);
      await updateUserProfile({
        displayName: displayName,
        phoneNumber: formData.phone || null,
      });

      const message = "Registration successful! Redirecting to home...";
      setSuccessMessage(message);
      setToast({ type: "success", message });
      setTimeout(() => {
        history.push("/");
      }, 1800);
    } catch (error) {
      const message = error.message || "Registration failed. Please try again.";
      setGeneralError(message);
      setToast({ type: "error", message });
    } finally {
      setIsLoading(false);
    }
  };

  const clearToast = () => setToast({ type: "", message: "" });

  return (
    <>
      <div className="toast-wrapper">
        {toast.message && <ToastNotification type={toast.type} message={toast.message} onClose={clearToast} />}
      </div>

      <div className="signup">
        <div className="signup-container">
          <div className="signup-card">
            <h2 className="signup-title">Create Your Account</h2>
            <p className="signup-subtitle">Join our community and start planning your next adventure!</p>

            {generalError && !toast.message && (
              <div className="auth-inline-message auth-inline-message-error">{generalError}</div>
            )}

            {successMessage && !toast.message && (
              <div className="auth-inline-message auth-inline-message-success">{successMessage}</div>
            )}

            <Form onSubmit={handleSignup} className="signup-form text-start">
              {/* Name Fields */}
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>First Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      isInvalid={!!errors.firstName}
                      placeholder="Enter your first name"
                    />
                    <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      isInvalid={!!errors.lastName}
                      placeholder="Enter your last name"
                    />
                    <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>

              {/* Email Field */}
              <Form.Group className="mb-3">
                <Form.Label>Email Address *</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    isValid={formData.email && emailValid && !errors.email}
                    placeholder="your.email@example.com"
                  />
                  {formData.email && (
                    <span className="input-group-text email-check">
                      {emailValid ? (
                        <FontAwesomeIcon icon={faCheck} className="text-success" />
                      ) : (
                        <FontAwesomeIcon icon={faTimes} className="text-danger" />
                      )}
                    </span>
                  )}
                </div>
                {errors.email && <Form.Text className="text-danger d-block mt-1">{errors.email}</Form.Text>}
              </Form.Group>

              {/* Phone Field */}
              <Form.Group className="mb-3">
                <Form.Label>Phone Number (Optional)</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    isInvalid={!!errors.phone}
                    isValid={formData.phone && phoneValid && !errors.phone}
                    placeholder="+880 1XXXXXXXXX or 01XXXXXXXXX"
                  />
                  {formData.phone && (
                    <span className="input-group-text phone-check">
                      {phoneValid ? (
                        <FontAwesomeIcon icon={faCheck} className="text-success" />
                      ) : (
                        <FontAwesomeIcon icon={faTimes} className="text-danger" />
                      )}
                    </span>
                  )}
                </div>
                {errors.phone && <Form.Text className="text-danger d-block mt-1">{errors.phone}</Form.Text>}
                <Form.Text className="text-light">Format: +880XXXXXXXXXX or 01XXXXXXXXX</Form.Text>
              </Form.Group>

              {/* Password Field */}
              <Form.Group className="mb-3">
                <Form.Label>Password *</Form.Label>
                <div className="input-group position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password && formData.password}
                    placeholder="Enter a strong password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>

                {formData.password && (
                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <small className="fw-bold">Password Strength</small>
                      <small className={`text-${getPasswordStrengthColor(passwordValidation.strength)}`}>
                        {passwordValidation.strengthLabel}
                      </small>
                    </div>
                    <ProgressBar
                      now={(passwordValidation.strength / 5) * 100}
                      variant={getPasswordStrengthColor(passwordValidation.strength)}
                      className="mb-3"
                      style={{ height: "6px" }}
                    />

                    <div className="password-requirements">
                      <small className={passwordValidation.requirements.length ? "text-success" : "text-light"}>
                        <FontAwesomeIcon
                          icon={passwordValidation.requirements.length ? faCheck : faTimes}
                          className="me-1"
                        />
                        At least 8 characters
                      </small>
                      <br />
                      <small className={passwordValidation.requirements.uppercase ? "text-success" : "text-light"}>
                        <FontAwesomeIcon
                          icon={passwordValidation.requirements.uppercase ? faCheck : faTimes}
                          className="me-1"
                        />
                        One uppercase letter (A-Z)
                      </small>
                      <br />
                      <small className={passwordValidation.requirements.lowercase ? "text-success" : "text-light"}>
                        <FontAwesomeIcon
                          icon={passwordValidation.requirements.lowercase ? faCheck : faTimes}
                          className="me-1"
                        />
                        One lowercase letter (a-z)
                      </small>
                      <br />
                      <small className={passwordValidation.requirements.number ? "text-success" : "text-light"}>
                        <FontAwesomeIcon
                          icon={passwordValidation.requirements.number ? faCheck : faTimes}
                          className="me-1"
                        />
                        One number (0-9)
                      </small>
                      <br />
                      <small className={passwordValidation.requirements.special ? "text-success" : "text-light"}>
                        <FontAwesomeIcon
                          icon={passwordValidation.requirements.special ? faCheck : faTimes}
                          className="me-1"
                        />
                        One special character (!@#$%^&*)
                      </small>
                    </div>
                  </div>
                )}

                {errors.password && <Form.Text className="text-danger d-block mt-2">{errors.password}</Form.Text>}
              </Form.Group>

              {/* Confirm Password Field */}
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password *</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.confirmPassword && formData.confirmPassword}
                    isValid={formData.confirmPassword && passwordsMatch && !errors.confirmPassword}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex="-1"
                  >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                  </button>
                  {formData.confirmPassword && (
                    <span className="input-group-text">
                      {passwordsMatch ? (
                        <FontAwesomeIcon icon={faCheck} className="text-success" />
                      ) : (
                        <FontAwesomeIcon icon={faTimes} className="text-danger" />
                      )}
                    </span>
                  )}
                </div>
                {errors.confirmPassword && (
                  <Form.Text className="text-danger d-block mt-1">{errors.confirmPassword}</Form.Text>
                )}
              </Form.Group>

              {/* Terms & Conditions */}
              <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  name="agreeTerms"
                  label="I agree to the Terms and Conditions"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  isInvalid={!!errors.agreeTerms}
                  feedback={errors.agreeTerms}
                />
              </Form.Group>

              {/* Submit Button */}
              <Button
                variant="info"
                size="lg"
                className="signup-button w-100 fw-bold mb-3"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Login Link */}
              <p className="text-center text-light">
                Already have an account?{" "}
                <Link to="/login" className="signup-link">
                  Sign In Here
                </Link>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
