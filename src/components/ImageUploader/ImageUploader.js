import { faUpload, faTrashAlt, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "./ImageUploader.css";

const MAX_SIZE_MB = 1; // hard cap on selected file
const CANVAS_MAX_DIM = 900; // max width/height after compression
const JPEG_QUALITY = 0.75; // output quality for base64

const compressImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > CANVAS_MAX_DIM) {
          height = Math.round((height * CANVAS_MAX_DIM) / width);
          width = CANVAS_MAX_DIM;
        }
        if (height > CANVAS_MAX_DIM) {
          width = Math.round((width * CANVAS_MAX_DIM) / height);
          height = CANVAS_MAX_DIM;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL(file.type || "image/jpeg", JPEG_QUALITY));
      };
      img.onerror = () => reject(new Error("Could not read image."));
    };
    reader.onerror = () => reject(new Error("Could not read image file."));
  });

const ImageUploader = ({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  maxSizeMB = MAX_SIZE_MB,
  accept = "image/*",
}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(value || null);
  const [error, setError] = useState(null);
  const [reading, setReading] = useState(false);

  const handleChange = async (e) => {
    const selected = e.target.files?.[0] || null;
    if (!selected) return;
    setFile(selected);
    setError(null);

    if (!selected.type || !selected.type.startsWith("image/")) {
      setError("Please select an image file.");
      setPreview(value || null);
      return;
    }
    if (selected.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be under ${maxSizeMB}MB.`);
      setPreview(value || null);
      return;
    }

    setReading(true);
    try {
      const dataUrl = await compressImage(selected);
      setPreview(dataUrl);
      onChange(dataUrl);
    } catch {
      setError("Failed to process image.");
    } finally {
      setReading(false);
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    onChange(null);
  };

  const hasValue = !!preview || !!file;

  return (
    <div className="image-uploader" aria-label={label}>
      <label className="image-uploader-label">
        {label}
        {required && <span className="image-uploader-required"> *</span>}
      </label>

      <div className="image-uploader-preview">
        {preview ? (
          <div className="image-uploader-preview-wrap">
            <img src={preview} alt={label} className="image-uploader-img" loading="lazy" />
            <button
              type="button"
              className="image-uploader-remove"
              onClick={removeImage}
              disabled={disabled}
              title="Remove image"
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
            {reading && <span className="image-uploader-loading">Compressing…</span>}
          </div>
        ) : (
          <div className="image-uploader-drop">
            <input
              type="file"
              id={`image-uploader-${label.replace(/\s+/g, "-").toLowerCase()}`}
              accept={accept}
              onChange={handleChange}
              disabled={disabled}
              className="image-uploader-input"
              aria-label={label}
            />
            <label
              className="image-uploader-browse"
              htmlFor={`image-uploader-${label.replace(/\s+/g, "-").toLowerCase()}`}
            >
              <FontAwesomeIcon icon={faUpload} />
              <span>Choose image</span>
            </label>
            {error && (
              <span className="image-uploader-error">
                <FontAwesomeIcon icon={faExclamationCircle} /> {error}
              </span>
            )}
            <p className="image-uploader-hint">
              Max {maxSizeMB}MB — auto-resized to ≤{CANVAS_MAX_DIM}px before upload
            </p>
          </div>
        )}
      </div>
      {hasValue && error === null && (
        <p className="image-uploader-hint">
          {file ? `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)` : "Image ready"}
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
