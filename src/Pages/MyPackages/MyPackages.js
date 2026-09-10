import { faArrowRight, faCalendarAlt, faSuitcaseRolling, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { myPackagesAPI } from "../../services/api";
import "../Dashboard/Dashboard.css";
import DashboardSidebar from "../Dashboard/DashboardSidebar";
import "./MyPackages.css";

const MyPackages = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadPackages = async () => {
      if (!user?.email) return;
      try {
        setIsLoading(true);
        const response = await fetch(`${myPackagesAPI}/${user.email}`);
        if (!response.ok) throw new Error("Unable to load your packages.");
        const data = await response.json();
        if (isMounted) setPackages(Array.isArray(data) ? data : []);
      } catch (loadError) {
        if (isMounted) setError(loadError.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadPackages();
    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  const handleDelete = async (packageId) => {
    if (!window.confirm("Remove this booking from your packages?")) return;

    try {
      setDeletingId(packageId);
      await axios.delete(`${myPackagesAPI}/${packageId}`);
      setPackages((current) => current.filter((item) => item._id !== packageId));
    } catch (deleteError) {
      setError(deleteError.message || "Unable to remove this booking.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <main className="dashboard-shell my-packages-shell">
      <DashboardSidebar />
      <section className="dashboard-window">
        <header className="dashboard-window-header my-packages-header">
          <div>
            <span className="dashboard-kicker">Your reservations</span>
            <h1>My Packages</h1>
            <p>Review the Bangladesh adventures you have booked.</p>
          </div>
          <div className="my-packages-header-icon">
            <FontAwesomeIcon icon={faSuitcaseRolling} />
          </div>
        </header>

        <section className="my-packages-panel">
          <div className="my-packages-panel-heading">
            <div>
              <span className="my-packages-panel-kicker">
                <FontAwesomeIcon icon={faCalendarAlt} /> Booking history
              </span>
              <h2>Booked packages</h2>
            </div>
            <span className="my-packages-count">
              {packages.length} {packages.length === 1 ? "booking" : "bookings"}
            </span>
          </div>

          {error && (
            <div className="my-packages-error" role="alert">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="my-packages-state">
              <span className="my-packages-spinner" />
              Loading your bookings...
            </div>
          ) : packages.length === 0 ? (
            <div className="my-packages-state my-packages-empty">
              <FontAwesomeIcon icon={faSuitcaseRolling} />
              <h3>No bookings yet</h3>
              <p>Choose a package and start planning your next story.</p>
              <Link to="/home#packages" className="dashboard-primary-action">
                Explore packages <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          ) : (
            <div className="my-packages-list">
              {packages.map((pack) => (
                <article className="my-package-item" key={pack._id}>
                  <div className="my-package-item-icon">
                    <FontAwesomeIcon icon={faSuitcaseRolling} />
                  </div>
                  <div className="my-package-item-details">
                    <h3>{pack.package || "Unnamed package"}</h3>
                    <span>{pack.date ? `Travel date: ${pack.date}` : "Travel date not selected"}</span>
                    {pack.phone && <small>Contact: {pack.phone}</small>}
                  </div>
                  <button
                    type="button"
                    className="my-package-delete"
                    onClick={() => handleDelete(pack._id)}
                    disabled={deletingId === pack._id}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    {deletingId === pack._id ? "Removing..." : "Remove"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default MyPackages;
