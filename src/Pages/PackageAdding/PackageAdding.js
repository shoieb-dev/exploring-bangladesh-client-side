import { faImage, faMapMarkedAlt, faPlus, faRoute } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { servicesAPI } from "../../services/api";
import "../Dashboard/Dashboard.css";
import DashboardSidebar from "../Dashboard/DashboardSidebar";
import "./PackageAdding.css";

const PackageAdding = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const onSubmit = async (data) => {
    setStatus({ type: "", message: "" });
    try {
      setIsSaving(true);
      const response = await axios.post(servicesAPI, data);
      if (!response.data.insertedId) throw new Error("The package could not be created.");
      reset();
      setStatus({ type: "success", message: "Package published successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Unable to publish package." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="dashboard-shell add-package-shell">
      <DashboardSidebar />
      <section className="dashboard-window">
        <header className="dashboard-window-header add-package-header">
          <div>
            <span className="dashboard-kicker">Administration</span>
            <h1>Add a package</h1>
            <p>Create a complete itinerary that travelers can discover and book.</p>
          </div>
          <div className="add-package-header-icon">
            <FontAwesomeIcon icon={faPlus} />
          </div>
        </header>

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
                    <textarea {...register(`description${day}`)} placeholder="Describe the day's experience" rows="5" />
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
                <p>Use clear, high-quality image URLs for each itinerary day.</p>
              </div>
            </div>
            <div className="package-form-grid">
              {[1, 2, 3].map((image) => (
                <label className="package-field" key={image}>
                  <span>Day {image} image URL</span>
                  <input {...register(`img${image}`)} type="url" placeholder="https://..." />
                </label>
              ))}
            </div>
          </section>

          {status.message && (
            <div className={`package-form-status ${status.type}`} role="status">
              {status.message}
            </div>
          )}
          <div className="package-form-actions">
            <button type="button" className="package-cancel-button" onClick={() => reset()}>
              Clear form
            </button>
            <button type="submit" className="package-submit-button" disabled={isSaving}>
              {isSaving ? "Publishing..." : "Publish package"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default PackageAdding;
