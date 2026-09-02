/**
 * Validate password strength
 * Requirements:
 * - At least 8 characters
 * - Contains uppercase letter
 * - Contains lowercase letter
 * - Contains number
 * - Contains special character
 */
export const validatePassword = (password) => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const strength = Object.values(requirements).filter(Boolean).length;

  return {
    isValid: Object.values(requirements).every(Boolean),
    strength: strength,
    requirements,
    strengthLabel: ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"][strength],
  };
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Bangladesh format and international)
 */
export const validatePhone = (phone) => {
  // Bangladesh: +880XXXXXXXXXX or 01XXXXXXXXX
  // International: +XXX...
  const phoneRegex = /^(\+88|0088|01|\+)?[0-9]{10,14}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ""));
};

/**
 * Get password strength color
 */
export const getPasswordStrengthColor = (strength) => {
  const colors = ["danger", "warning", "warning", "info", "success", "success"];
  return colors[strength] || "danger";
};
