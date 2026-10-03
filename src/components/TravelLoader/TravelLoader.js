import React, { useEffect, useState } from "react";
import "./TravelLoader.css";

const MESSAGES = [
  "Packing your adventure across Bangladesh…",
  "Sailing to Saint Martin's Island…",
  "Wandering Sylhet's tea gardens…",
  "Chasing waterfalls in Bandarban…",
];

const TravelLoader = ({ message, fullScreen = true, minHeight = 320 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (message) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 2200);
    return () => clearInterval(id);
  }, [message]);

  return (
    <div
      className={`travel-loader ${fullScreen ? "travel-loader-full" : "travel-loader-inline"}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={fullScreen ? undefined : { minHeight }}
    >
      {/* animated sky */}
      <div className="travel-loader-sky" aria-hidden="true">
        <span className="travel-loader-sun" />
        <span className="travel-loader-cloud cloud-1" />
        <span className="travel-loader-cloud cloud-2" />
        <span className="travel-loader-cloud cloud-3" />
        {/* flying plane */}
        <span className="travel-loader-plane">✈️</span>
      </div>

      {/* rolling road with jeep */}
      <div className="travel-loader-road" aria-hidden="true">
        <span className="travel-loader-palm palm-left">🌴</span>
        <span className="travel-loader-jeep">🚙</span>
        <span className="travel-loader-palm palm-right">🌴</span>
      </div>

      <p className="travel-loader-brand">
        <span className="travel-loader-brand-x">X-PLORING</span>{" "}
        <span className="travel-loader-brand-bd">BANGLADESH</span>
      </p>
      <p className="travel-loader-message">{message || MESSAGES[index]}</p>

      <div className="travel-loader-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <span className="visually-hidden">Loading… please wait</span>
    </div>
  );
};

export default TravelLoader;
