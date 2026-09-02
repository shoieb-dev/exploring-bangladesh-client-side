import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import "./ToastNotification.css";

const ToastNotification = ({ type = "info", message, onClose }) => {
  useEffect(() => {
    if (!message) return undefined;

    const timer = setTimeout(() => {
      onClose?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const toastType = {
    success: { icon: faCheckCircle, label: "Success" },
    error: { icon: faTimesCircle, label: "Error" },
    info: { icon: faInfoCircle, label: "Info" },
  };

  const selectedType = toastType[type] || toastType.info;

  return (
    <div className={`toast-notification ${type}`} role="alert" aria-live="polite">
      <div className="toast-icon">
        <FontAwesomeIcon icon={selectedType.icon} />
      </div>

      <div className="toast-content">
        <strong>{selectedType.label}</strong>
        <span>{message}</span>
      </div>

      <button type="button" className="toast-close" aria-label="Close notification" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default ToastNotification;
