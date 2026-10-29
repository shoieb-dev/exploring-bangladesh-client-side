import { faUpload, faTrashAlt, faExclamationCircle, faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "./ImageUploader.css";

const MAX_SIZE_MB = 1;
const CANVAS_MAX_DIM = 900;
const JPEG_QUALITY = 0.75;

// Compress file via canvas, return a Blob
const compressToBlob = (file) =>
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
        canvas.toBlob((blob) => resolve(blob), file.type || "image/jpeg", JPEG_QUALITY);
      };
      img.onerror = () => reject(new Error("Could not read image."));
    };
    reader.onerror = () => reject(new Error("Could not read image file."));
  });

// Upload blob directly to Cloudinary (unsigned preset)
const uploadToCloudinary = async (blob, { cloudName, uploadPreset }) => {
  const formData = new FormData();
  formData.append("file", blob);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Cloudinary upload failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  if (!data.secure_url) throw new Error("Cloudinary did not return a secure URL.");
  return data.secure_url;
};

const ImageUploader = ({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  maxSizeMB = MAX_SIZE_MB,
  accept = "image/*",
  cloudinary = null, // { cloudName, uploadPreset }
}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(value || null);
  const [error, setError] = useState(null);
  const [reading, setReading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = async (e) => {
    const selected = e.target.files?.[0] || null;
    if (!selected) return;
    setFile(selected);
    setError(null);
    setUploadProgress(0);

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
      // 1. Compress locally first
      const blob = await compressToBlob(selected);

      // Create preview URL from compressed blob
      const previewUrl = URL.createObjectURL(blob);
      setPreview(previewUrl);

      // 2. Upload to Cloudinary if configured
      if (cloudinary?.cloudName && cloudinary?.uploadPreset) {
        setUploadProgress(30);
        const secureUrl = await uploadToCloudinary(blob, cloudinary);
        setUploadProgress(100);
        setPreview(secureUrl); // show the real cloud image
        onChange(secureUrl);
      } else {
        // Fallback: pass compressed data URL as before
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
          onChange(reader.result);
        };
        reader.onerror = () => setError("Failed to process image.");
      }
    } catch {
      setError("Failed to process or upload image.");
    } finally {
      setReading(false);
    }
  };

  const removeImage = () => {
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setError(null);
    setUploadProgress(0);
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
            {reading && (
              <span className="image-uploader-loading">
                {cloudinary?.cloudName ? "Uploading to cloud…" : "Compressing…"}
              </span>
            )}
            {reading && cloudinary && (
              <div className="image-uploader-progress">
                <div className="image-uploader-progress-bar" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}
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
              <FontAwesomeIcon icon={cloudinary ? faCloudUploadAlt : faUpload} />
              <span>{cloudinary ? "Upload to cloud" : "Choose image"}</span>
            </label>
            {error && (
              <span className="image-uploader-error">
                <FontAwesomeIcon icon={faExclamationCircle} /> {error}
              </span>
            )}
            <p className="image-uploader-hint">
              Max {maxSizeMB}MB — auto-resized to ≤{CANVAS_MAX_DIM}px
              {cloudinary?.cloudName ? " — uploaded to Cloudinary" : ""}
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
