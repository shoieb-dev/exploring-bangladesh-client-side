import {
  faCalendarCheck,
  faEnvelope,
  faPhone,
  faSearch,
  faSuitcaseRolling,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { bookingsAPI } from "../../services/api";
import "../Dashboard/Dashboard.css";
import DashboardSidebar from "../Dashboard/DashboardSidebar";
import "./ManageBookings.css";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await fetch(bookingsAPI);
        if (!response.ok) throw new Error("Unable to load bookings.");
        const data = await response.json();
        // API returns { success, count, data: [...] } — unwrap it.
        // Keep backward compat if API ever returns a plain array.
        const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        if (isMounted) setBookings(list);
      } catch (loadError) {
        if (isMounted) setError(loadError.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadBookings();
    return () => {
      isMounted = false;
    };
  }, []);

  const visibleBookings = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter((b) =>
      [b.name, b.email, b.package, b.phone, b.date].filter(Boolean).some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [bookings, searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking? This action cannot be undone.")) return;
    try {
      setDeletingId(id);
      await axios.delete(`${bookingsAPI}/${id}`);
      setBookings((current) => current.filter((item) => item._id !== id));
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete booking.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <main className="dashboard-shell manage-bookings-shell">
      <DashboardSidebar />
      <section className="dashboard-window">
        <header className="dashboard-window-header">
          <div>
            <span className="dashboard-kicker">Administration</span>
            <h1>Manage bookings</h1>
            <p>Review every reservation travelers have made.</p>
          </div>
          <div className="manage-bookings-header-icon">
            <FontAwesomeIcon icon={faCalendarCheck} />
          </div>
        </header>

        <section className="manage-bookings-panel">
          <div className="manage-bookings-toolbar">
            <div>
              <span className="manage-bookings-kicker">Reservation list</span>
              <h2>
                Total bookings <span>{bookings.length}</span>
              </h2>
            </div>
          </div>

          <div className="manage-bookings-search">
            <FontAwesomeIcon icon={faSearch} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, package, phone or date"
              aria-label="Search bookings"
            />
          </div>

          {error && (
            <div className="manage-bookings-error" role="alert">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="manage-bookings-state">
              <span className="manage-bookings-spinner" />
              Loading bookings...
            </div>
          ) : visibleBookings.length === 0 ? (
            <div className="manage-bookings-state manage-bookings-empty">
              <FontAwesomeIcon icon={faSuitcaseRolling} />
              <p>{searchTerm ? "No matching bookings found." : "No bookings have been made yet."}</p>
            </div>
          ) : (
            <div className="manage-bookings-list">
              {visibleBookings.map((b) => (
                <article className="manage-booking-row" key={b._id}>
                  <div className="manage-booking-icon">
                    <FontAwesomeIcon icon={faSuitcaseRolling} />
                  </div>
                  <div className="manage-booking-details">
                    <h3>{b.package || "Unnamed package"}</h3>
                    <span>
                      <FontAwesomeIcon icon={faUser} /> {b.name || "No name"}
                      {"  "}·<FontAwesomeIcon icon={faEnvelope} /> {b.email || "No email"}
                    </span>
                    <span>
                      Travel date: {b.date || "Not selected"}
                      {b.phone && (
                        <>
                          {"  "}· <FontAwesomeIcon icon={faPhone} /> {b.phone}
                        </>
                      )}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="manage-booking-delete"
                    onClick={() => handleDelete(b._id)}
                    disabled={deletingId === b._id}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    {deletingId === b._id ? "Deleting..." : "Delete"}
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

export default ManageBookings;
