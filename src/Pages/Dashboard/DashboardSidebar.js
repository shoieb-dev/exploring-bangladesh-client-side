import {
  faArrowRight,
  faCalendarCheck,
  faCompass,
  faMapMarkedAlt,
  faPlus,
  faSuitcaseRolling,
  faTachometerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import useAuth from "../../hooks/useAuth";

const DashboardSidebar = () => {
  const { user, isAdmin, roleLoading } = useAuth();
  const location = useLocation();

  // Normal users: travel workspace only.
  const travelerItems = [
    { label: "Overview", path: "/dashboard", icon: faTachometerAlt },
    { label: "My Packages", path: "/myPackages", icon: faSuitcaseRolling },
  ];

  // Admins: management workspace only.
  const adminItems = [
    { label: "Overview", path: "/dashboard", icon: faTachometerAlt },
    { label: "Add Package", path: "/addPackage", icon: faPlus },
    { label: "Manage Packages", path: "/managePackages", icon: faMapMarkedAlt },
    { label: "Manage Bookings", path: "/manageBookings", icon: faCalendarCheck },
  ];

  const items = isAdmin ? adminItems : travelerItems;

  return (
    <aside className="dashboard-sidebar" aria-label="Dashboard navigation">
      <div className="dashboard-sidebar-brand">
        <div className="dashboard-brand-mark">
          <FontAwesomeIcon icon={faCompass} />
        </div>
        <div>
          <strong>{isAdmin ? "Admin console" : "Traveler space"}</strong>
          <span>X-Ploring Bangladesh</span>
        </div>
      </div>

      <nav className="dashboard-nav">
        <span className="dashboard-nav-label">{isAdmin ? "Administration" : "Workspace"}</span>
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`dashboard-nav-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={item.icon} />
            {item.label}
          </Link>
        ))}
        {/* While role is resolving, keep layout stable but hint at pending state */}
        {roleLoading && user?.email && (
          <span className="dashboard-nav-item dashboard-nav-pending" aria-live="polite">
            Checking access…
          </span>
        )}
      </nav>

      <div className="dashboard-sidebar-footer">
        <span>Need a new adventure?</span>
        <HashLink to="/home#packages">
          Explore packages <FontAwesomeIcon icon={faArrowRight} />
        </HashLink>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
