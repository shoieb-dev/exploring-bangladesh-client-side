import { faArrowRight, faMapMarkedAlt, faPlus, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { servicesAPI } from "../../services/api";
import "../Dashboard/Dashboard.css";
import DashboardSidebar from "../Dashboard/DashboardSidebar";
import "./PackageManaging.css";

const PackageManaging = () => {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadPackages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(servicesAPI);
        if (!response.ok) throw new Error("Unable to load packages.");
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
  }, []);

  const visiblePackages = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return packages;
    return packages.filter((item) => item.name?.toLowerCase().includes(normalizedSearch));
  }, [packages, searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this package? This action cannot be undone.")) return;

    try {
      setDeletingId(id);
      const response = await axios.delete(`${servicesAPI}/${id}`);
      if (response.data.deletedCount === 0) throw new Error("The package could not be deleted.");
      setPackages((current) => current.filter((item) => item._id !== id));
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete package.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <main className="dashboard-shell manage-packages-shell">
      <DashboardSidebar />
      <section className="dashboard-window">
        <header className="dashboard-window-header manage-packages-header">
          <div>
            <span className="dashboard-kicker">Administration</span>
            <h1>Manage packages</h1>
            <p>Review, search, and maintain the experiences available to travelers.</p>
          </div>
          <div className="manage-packages-header-icon">
            <FontAwesomeIcon icon={faMapMarkedAlt} />
          </div>
        </header>

        <section className="manage-packages-panel">
          <div className="manage-packages-toolbar">
            <div>
              <span className="manage-packages-kicker">Package library</span>
              <h2>
                Published packages <span>{packages.length}</span>
              </h2>
            </div>
            <Link to="/addPackage" className="manage-add-button">
              <FontAwesomeIcon icon={faPlus} /> Add package
            </Link>
          </div>

          <div className="manage-search">
            <FontAwesomeIcon icon={faSearch} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search packages"
              aria-label="Search packages"
            />
          </div>

          {error && (
            <div className="manage-packages-error" role="alert">
              {error}
            </div>
          )}
          {isLoading ? (
            <div className="manage-packages-state">
              <span className="manage-spinner" />
              Loading packages...
            </div>
          ) : visiblePackages.length === 0 ? (
            <div className="manage-packages-state">
              <FontAwesomeIcon icon={faMapMarkedAlt} />
              <p>{searchTerm ? "No matching packages found." : "No packages have been published yet."}</p>
            </div>
          ) : (
            <div className="manage-package-list">
              {visiblePackages.map((pack) => (
                <article className="manage-package-row" key={pack._id}>
                  <div className="manage-package-image">
                    <img src={pack.img1} alt="" />
                  </div>
                  <div className="manage-package-details">
                    <h3>{pack.name}</h3>
                    <span>{pack.duration || "Itinerary available"}</span>
                    {pack.price && <small>BDT {pack.price} per person</small>}
                  </div>
                  <button
                    type="button"
                    className="manage-delete-button"
                    onClick={() => handleDelete(pack._id)}
                    disabled={deletingId === pack._id}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    {deletingId === pack._id ? "Deleting..." : "Delete"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <HashLink to="/home#packages" className="manage-footer-link">
          View public packages <FontAwesomeIcon icon={faArrowRight} />
        </HashLink>
      </section>
    </main>
  );
};

export default PackageManaging;
