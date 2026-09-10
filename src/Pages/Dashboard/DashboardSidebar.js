import {
  faArrowRight,
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
  const { user } = useAuth();
  const location = useLocation();
  const workspaceItems = [
    { label: "Overview", path: "/dashboard", icon: faTachometerAlt },
    { label: "My Packages", path: "/myPackages", icon: faSuitcaseRolling },
  ];

  return (
    <aside className="dashboard-sidebar" aria-label="Dashboard navigation">
      <div className="dashboard-sidebar-brand">
        <div className="dashboard-brand-mark">
          <FontAwesomeIcon icon={faCompass} />
        </div>
        <div>
          <strong>Traveler space</strong>
          <span>X-Ploring Bangladesh</span>
        </div>
      </div>

      <nav className="dashboard-nav">
        <span className="dashboard-nav-label">Workspace</span>
        {workspaceItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`dashboard-nav-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={item.icon} />
            {item.label}
          </Link>
        ))}
        {user?.email && (
          <>
            <span className="dashboard-nav-label dashboard-nav-label-spaced">Administration</span>
            <Link
              to="/addPackage"
              className={`dashboard-nav-item ${location.pathname === "/addPackage" ? "active" : ""}`}
            >
              <FontAwesomeIcon icon={faPlus} />
              Add Package
            </Link>
            <Link
              to="/managePackages"
              className={`dashboard-nav-item ${location.pathname === "/managePackages" ? "active" : ""}`}
            >
              <FontAwesomeIcon icon={faMapMarkedAlt} />
              Manage Packages
            </Link>
          </>
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
