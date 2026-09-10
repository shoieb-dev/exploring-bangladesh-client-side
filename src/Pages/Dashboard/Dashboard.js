import {
  faArrowRight,
  faCalendarCheck,
  faCompass,
  faHeart,
  faSuitcaseRolling,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HashLink } from "react-router-hash-link";
import useAuth from "../../hooks/useAuth";
import "./Dashboard.css";
import DashboardSidebar from "./DashboardSidebar";

const Dashboard = () => {
  const { user } = useAuth();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "Traveler";

  return (
    <main className="dashboard-shell">
      <DashboardSidebar />

      <section className="dashboard-window">
        <header className="dashboard-window-header">
          <div>
            <span className="dashboard-kicker">Your travel dashboard</span>
            <h1>Good to see you, {displayName}</h1>
            <p>Keep your upcoming adventures and saved travel plans in one place.</p>
          </div>
          <div className="dashboard-avatar" aria-label={`${displayName}'s profile`}>
            {displayName.charAt(0).toUpperCase()}
          </div>
        </header>

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
      </section>
    </main>
  );
};

export default Dashboard;
