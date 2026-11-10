import { faEdit, faImage, faMapMarkedAlt, faPlus, faRoute } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { packagesAPI } from "../../services/api";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import "../Dashboard/Dashboard.css";
import DashboardSidebar from "../Dashboard/DashboardSidebar";
import "./PackageAdding.css";

const CLOUDINARY = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
};

const PackageAdding = () => {
  const { packageId } = useParams();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(packageId));
  const [packageData, setPackageData] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const isEditing = Boolean(packageId);

  useEffect(() => {
    let isMounted = true;

    if (!packageId) {
      setPackageData(null);
      setLoadError("");
      setIsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    const loadPackage = async () => {
      try {
        setIsLoading(true);
        setLoadError("");
        const response = await axios.get(`${packagesAPI}/${packageId}`);
        const data = response.data?.data && typeof response.data.data === "object" ? response.data.data : response.data;
        if (!data || typeof data !== "object" || Array.isArray(data)) {
          throw new Error("The requested package could not be loaded.");
        }

        if (isMounted) {
          setPackageData(data);
          reset({ ...data, price: data.price ?? "" });
          [1, 2, 3].forEach((day) => setValue(`img${day}`, data[`img${day}`] || ""));
        }
      } catch (error) {
        if (isMounted) setLoadError(error.message || "Unable to load package.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadPackage();
    return () => {
      isMounted = false;
    };
  }, [packageId, reset, setValue]);

  const onSubmit = async (data) => {
    setStatus({ type: "", message: "" });
    try {
      setIsSaving(true);
      if (isEditing) {
        await axios.put(`${packagesAPI}/${packageId}`, data);
        setPackageData((current) => ({ ...current, ...data }));
        setStatus({ type: "success", message: "Package updated successfully." });
        setTimeout(() => history.push("/managePackages"), 1500);
      } else {
        const response = await axios.post(packagesAPI, data);
        if (!response.data?.data?.insertedId) throw new Error("The package could not be created.");
        reset();
        [1, 2, 3].forEach((day) => setValue(`img${day}`, ""));
        setStatus({ type: "success", message: "Package published successfully." });
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message || `Unable to ${isEditing ? "update" : "publish"} package.` });
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    reset(isEditing ? { ...packageData, price: packageData?.price ?? "" } : {});
    [1, 2, 3].forEach((day) => setValue(`img${day}`, packageData?.[`img${day}`] || ""));
    setStatus({ type: "", message: "" });
  };

  const onImageChange = (field, url) => {
    setValue(field, url || "");
  };

  return (
    <main className="dashboard-shell add-package-shell">
      <DashboardSidebar />
      <section className="dashboard-window">
        <header className="dashboard-window-header add-package-header">
          <div>
            <span className="dashboard-kicker">Administration</span>
            <h1>{isEditing ? "Edit package" : "Add a package"}</h1>
            <p>
              {isEditing
                ? "Update the itinerary and images travelers see when they discover this package."
                : "Create a complete itinerary that travelers can discover and book."}
            </p>
          </div>
          <div className="add-package-header-icon">
            <FontAwesomeIcon icon={isEditing ? faEdit : faPlus} />
          </div>
        </header>

        {isLoading ? (
          <div className="package-form-status" role="status">
            Loading package...
          </div>
        ) : loadError ? (
          <>
            <div className="package-form-status error" role="alert">
              {loadError}
            </div>
            <div className="package-form-actions">
              <button type="button" className="package-cancel-button" onClick={() => history.push("/managePackages")}>
                Back to packages
              </button>
            </div>
          </>
        ) : (
          <form className="package-editor" onSubmit={handleSubmit(onSubmit)}>
            <section className="package-editor-section">
              <div className="package-editor-section-heading">
                <span className="package-editor-icon">
                  <FontAwesomeIcon icon={faMapMarkedAlt} />
                </span>
                <div>
                  <h2>Package basics</h2>
                  <p>Give travelers the essential information first.</p>
                </div>
              </div>
              <div className="package-form-grid">
                <label className="package-field package-field-wide">
                  <span>
                    Package name <b>*</b>
                  </span>
                  <input
                    {...register("name", {
                      required: "Package name is required",
                      maxLength: { value: 50, message: "Use 50 characters or fewer" },
                    })}
                    placeholder="e.g. Dhaka - Saint Martins Island - Dhaka"
                  />
                  {errors.name && <small>{errors.name.message}</small>}
                </label>
                <label className="package-field">
                  <span>Duration</span>
                  <input {...register("duration")} placeholder="e.g. 3 Days / 2 Nights" />
                </label>
                <label className="package-field">
                  <span>Price (BDT)</span>
                  <input type="number" min="0" {...register("price")} placeholder="6500" />
                </label>
              </div>
            </section>

            <section className="package-editor-section">
              <div className="package-editor-section-heading">
                <span className="package-editor-icon">
                  <FontAwesomeIcon icon={faRoute} />
                </span>
                <div>
                  <h2>Itinerary</h2>
                  <p>Add the day titles and descriptions travelers will see.</p>
                </div>
              </div>
              <div className="package-days-grid">
                {[1, 2, 3].map((day) => (
                  <fieldset className="package-day-card" key={day}>
                    <legend>Day {day}</legend>
                    <label className="package-field">
                      <span>Day title</span>
                      <input {...register(`day${day}`)} placeholder={`Day ${day} title`} />
                    </label>
                    <label className="package-field">
                      <span>Description</span>
                      <textarea
                        {...register(`description${day}`)}
                        placeholder="Describe the day's experience"
                        rows="5"
                      />
                    </label>
                  </fieldset>
                ))}
              </div>
            </section>

            <section className="package-editor-section">
              <div className="package-editor-section-heading">
                <span className="package-editor-icon">
                  <FontAwesomeIcon icon={faImage} />
                </span>
                <div>
                  <h2>Package images</h2>
                  <p>Upload a cover image for each itinerary day (max 1MB each).</p>
                </div>
              </div>
              <div className="package-image-grid">
                {[1, 2, 3].map((n) => (
                  <div key={n}>
                    <input type="hidden" {...register(`img${n}`)} />
                    <ImageUploader
                      label={`Day ${n} image`}
                      value={watch(`img${n}`)}
                      onChange={(url) => onImageChange(`img${n}`, url)}
                      cloudinary={CLOUDINARY}
                    />
                  </div>
                ))}
              </div>
            </section>

            {status.message && (
              <div className={`package-form-status ${status.type}`} role="status">
                {status.message}
              </div>
            )}
            <div className="package-form-actions">
              <button type="button" className="package-cancel-button" onClick={resetForm}>
                {isEditing ? "Reset changes" : "Clear form"}
              </button>
              <button type="submit" className="package-submit-button" disabled={isSaving}>
                {isSaving
                  ? isEditing
                    ? "Saving..."
                    : "Publishing..."
                  : isEditing
                    ? "Save changes"
                    : "Publish package"}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
};

export default PackageAdding;
