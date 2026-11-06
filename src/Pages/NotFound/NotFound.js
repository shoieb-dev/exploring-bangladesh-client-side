import { faArrowLeft, faCompass, faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => (
  <main className="not-found-page">
    <section className="not-found-card" aria-labelledby="not-found-title">
      <div className="not-found-illustration" aria-hidden="true">
        <span className="not-found-sun" />
        <span className="not-found-cloud not-found-cloud-one" />
        <span className="not-found-cloud not-found-cloud-two" />
        <span className="not-found-route" />
        <span className="not-found-map-pin">
          <FontAwesomeIcon icon={faMapMarkedAlt} />
        </span>
        <span className="not-found-number">404</span>
        <span className="not-found-compass">
          <FontAwesomeIcon icon={faCompass} />
        </span>
      </div>

      <div className="not-found-copy">
        <span className="not-found-eyebrow">Looks like you took a detour</span>
        <h1 id="not-found-title">This page is off the map.</h1>
        <p>
          The page you’re looking for may have moved or no longer exists. Let’s get you back to exploring Bangladesh.
        </p>
        <div className="not-found-actions">
          <Link to="/home" className="not-found-home-button">
            Go to homepage
          </Link>
          <Link to="/home#packages" className="not-found-explore-link">
            <FontAwesomeIcon icon={faArrowLeft} />
            Explore tour packages
          </Link>
        </div>
      </div>
    </section>
  </main>
);

export default NotFound;
