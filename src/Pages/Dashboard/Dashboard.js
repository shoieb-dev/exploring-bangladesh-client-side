import {
  faArrowRight,
  faCalendarCheck,
  faCompass,
  faHeart,
  faRoute,
  faSuitcaseRolling,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { HashLink } from "react-router-hash-link";
import useAuth from "../../hooks/useAuth";
import { bookingsAPI, packagesAPI } from "../../services/api";
import "./Dashboard.css";
import DashboardSidebar from "./DashboardSidebar";

const fetchList = async (url, label) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Unable to load ${label} (${response.status}).`);

  const result = await response.json();
  const list = Array.isArray(result) ? result : result?.data;
  if (!Array.isArray(list)) throw new Error(`The ${label} response has an unexpected format.`);
  return list;
};

const hasItinerary = (pack) =>
  [1, 2, 3].some((day) =>
    [pack[`day${day}`], pack[`description${day}`]].some((value) => typeof value === "string" && value.trim()),
  );

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "Traveler";
  const [bookingsCount, setBookingsCount] = useState(null);
  const [packages, setPackages] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    if (!isAdmin) return undefined;

    let isMounted = true;
    const loadStats = async () => {
      setStatsLoading(true);
      setStatsError("");
      const results = await Promise.allSettled([
        fetchList(bookingsAPI, "bookings"),
        fetchList(packagesAPI, "packages"),
      ]);

      if (isMounted) {
        const errors = [];
        if (results[0].status === "fulfilled") setBookingsCount(results[0].value.length);
        else errors.push(results[0].reason.message);
        if (results[1].status === "fulfilled") setPackages(results[1].value);
        else errors.push(results[1].reason.message);
        setStatsError(errors.join(" "));
        setStatsLoading(false);
      }
    };

    loadStats();
    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  return (
    <main className="dashboard-shell">
      <DashboardSidebar />

      <section className="dashboard-window">
        <header className="dashboard-window-header">
          <div>
            <span className="dashboard-kicker">{isAdmin ? "Admin console" : "Your travel dashboard"}</span>
            <h1>
              {isAdmin ? `Welcome back, ${displayName}` : `Good to see you, ${displayName}`}
            </h1>
            <p>
              {isAdmin
                ? "Manage packages, bookings, and itinerary details from one place."
                : "Keep your upcoming adventures and saved travel plans in one place."}
            </p>
          </div>
          <div className="dashboard-avatar" aria-label={`${displayName}'s profile`}>
            {displayName.charAt(0).toUpperCase()}
          </div>
        </header>

        {isAdmin ? (
          <>
            <div className="dashboard-stat-grid">
              <article className="dashboard-stat-card accent-teal" aria-busy={statsLoading}>
                <span className="dashboard-stat-icon">
                  <FontAwesomeIcon icon={faCalendarCheck} />
                </span>
                <div>
                  <strong>{bookingsCount === null ? "—" : bookingsCount}</strong>
                  <span>Total bookings</span>
                </div>
              </article>
              <article className="dashboard-stat-card accent-gold" aria-busy={statsLoading}>
                <span className="dashboard-stat-icon">
                  <FontAwesomeIcon icon={faSuitcaseRolling} />
                </span>
                <div>
                  <strong>{packages === null ? "—" : packages.length}</strong>
                  <span>Packages</span>
                </div>
              </article>
              <article className="dashboard-stat-card accent-blue" aria-busy={statsLoading}>
                <span className="dashboard-stat-icon">
                  <FontAwesomeIcon icon={faRoute} />
                </span>
                <div>
                  <strong>{packages === null ? "—" : packages.filter(hasItinerary).length}</strong>
                  <span>Packages with itinerary</span>
                </div>
              </article>
            </div>
            {statsError && (
              <div className="dashboard-stats-error" role="alert">
                {statsError}
              </div>
            )}

            <div className="dashboard-content-grid">
              <section className="dashboard-panel dashboard-welcome-panel">
                <div className="dashboard-panel-heading">
                  <span className="dashboard-kicker">Package library</span>
                  <h2>Keep the catalog fresh</h2>
                  <p>Add new itineraries, update pricing, or remove retired packages.</p>
                </div>
                <HashLink to="/home#packages" className="dashboard-primary-action">
                  Manage packages <FontAwesomeIcon icon={faArrowRight} />
                </HashLink>
              </section>
              <section className="dashboard-panel dashboard-activity-panel">
                <div className="dashboard-panel-title-row">
                  <h2>Reservations</h2>
                  <FontAwesomeIcon icon={faCalendarCheck} />
                </div>
                <div className="dashboard-empty-state">
                  <FontAwesomeIcon icon={faSuitcaseRolling} />
                  <p>Review and fulfill traveler bookings.</p>
                  <span>Search by traveler, package, or date.</span>
                </div>
              </section>
            </div>
          </>
        ) : (
          <>
            <div className="dashboard-stat-grid">
              <article className="dashboard-stat-card accent-teal">
                <span className="dashboard-stat-icon">
                  <FontAwesomeIcon icon={faCalendarCheck} />
                </span>
                <div>
                  <strong>0</strong>
                  <span>Upcoming trips</span>
                </div>
              </article>
              <article className="dashboard-stat-card accent-gold">
                <span className="dashboard-stat-icon">
                  <FontAwesomeIcon icon={faHeart} />
                </span>
                <div>
                  <strong>0</strong>
                  <span>Saved packages</span>
                </div>
              </article>
              <article className="dashboard-stat-card accent-blue">
                <span className="dashboard-stat-icon">
                  <FontAwesomeIcon icon={faSuitcaseRolling} />
                </span>
                <div>
                  <strong>0</strong>
                  <span>Completed trips</span>
                </div>
              </article>
            </div>

            <div className="dashboard-content-grid">
              <section className="dashboard-panel dashboard-welcome-panel">
                <div className="dashboard-panel-heading">
                  <span className="dashboard-kicker">Start exploring</span>
                  <h2>Your next story starts here</h2>
                  <p>Browse curated experiences across Bangladesh and find a route worth remembering.</p>
                </div>
                <HashLink to="/home#packages" className="dashboard-primary-action">
                  Browse tour packages <FontAwesomeIcon icon={faArrowRight} />
                </HashLink>
              </section>
              <section className="dashboard-panel dashboard-activity-panel">
                <div className="dashboard-panel-title-row">
                  <h2>Recent activity</h2>
                  <FontAwesomeIcon icon={faCalendarCheck} />
                </div>
                <div className="dashboard-empty-state">
                  <FontAwesomeIcon icon={faCompass} />
                  <p>Your booked trips will appear here.</p>
                  <span>Ready when you are.</span>
                </div>
              </section>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
