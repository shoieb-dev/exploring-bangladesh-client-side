import { faEnvelope, faSearch, faShieldAlt, faSync, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import { usersAPI, usersFromBookingsAPI } from "../../services/api";
import "../Dashboard/Dashboard.css";
import DashboardSidebar from "../Dashboard/DashboardSidebar";
import "./UserList.css";

const unwrapList = (data) => (Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []);

const UserList = () => {
  const [activeTab, setActiveTab] = useState("mongo"); // "mongo" | "bookings"
  const [mongoUsers, setMongoUsers] = useState([]);
  const [bookingUsers, setBookingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        setError("");
        // Both endpoints work without Firebase keys.
        // #1 synced users (needs one login via /upsert),
        // #2 derived from bookings (works before anyone logs in).
        const [mongoRes, bookingsRes] = await Promise.all([
          fetch(`${usersAPI}?source=mongo`),
          fetch(usersFromBookingsAPI),
        ]);
        if (!mongoRes.ok) throw new Error(`Unable to load users (${mongoRes.status}).`);
        if (!bookingsRes.ok) throw new Error(`Unable to load booking users (${bookingsRes.status}).`);
        const [mongoJson, bookingsJson] = await Promise.all([mongoRes.json(), bookingsRes.json()]);
        if (isMounted) {
          setMongoUsers(unwrapList(mongoJson));
          setBookingUsers(unwrapList(bookingsJson));
        }
      } catch (loadError) {
        if (isMounted) setError(loadError.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  const users = activeTab === "mongo" ? mongoUsers : bookingUsers;
  const visibleUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.displayName, u.name, u.email, u.role, u.phone]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [users, searchTerm]);

  const formatDate = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
  };

  return (
    <main className="dashboard-shell user-list-shell">
      <DashboardSidebar />
      <section className="dashboard-window">
        <header className="dashboard-window-header">
          <div>
            <span className="dashboard-kicker">Administration</span>
            <h1>User list</h1>
            <p>Synced accounts and travelers derived from bookings.</p>
          </div>
          <div className="user-list-header-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
        </header>
        <section className="user-list-panel">
          <div className="user-list-toolbar">
            <div>
              <span className="user-list-kicker">Directory</span>
              <h2>
                {activeTab === "mongo" ? "Synced users" : "Booking users"} <span>{users.length}</span>
              </h2>
            </div>
            <div className="user-list-tabs" role="tablist" aria-label="User source">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "mongo"}
                className={activeTab === "mongo" ? "active" : ""}
                onClick={() => setActiveTab("mongo")}
              >
                Synced ({mongoUsers.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "bookings"}
                className={activeTab === "bookings" ? "active" : ""}
                onClick={() => setActiveTab("bookings")}
              >
                From bookings ({bookingUsers.length})
              </button>
            </div>
          </div>

          <p className="user-list-hint">
            {activeTab === "mongo"
              ? "Accounts after one login (POST /api/users/upsert). Roles come from Mongo."
              : "Travelers derived from bookings — visible even before anyone logs in."}
          </p>

          <div className="user-list-search">
            <FontAwesomeIcon icon={faSearch} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, role or phone"
              aria-label="Search users"
            />
          </div>

          {error && (
            <div className="user-list-error" role="alert">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="user-list-state">
              <span className="user-list-spinner" />
              Loading users...
            </div>
          ) : visibleUsers.length === 0 ? (
            <div className="user-list-state user-list-empty">
              <FontAwesomeIcon icon={faUsers} />
              <p>{searchTerm ? "No matching users found." : "No users found for this source yet."}</p>
            </div>
          ) : (
            <div className="user-list-grid">
              {visibleUsers.map((u, idx) => (
                <article className="user-list-row" key={u._id || u.email || u.uid || idx}>
                  <div className="user-list-avatar" aria-hidden="true">
                    {u.photoURL ? (
                      <img src={u.photoURL} alt="" loading="lazy" />
                    ) : (
                      <FontAwesomeIcon icon={faUser} />
                    )}
                  </div>
                  <div className="user-list-details">
                    <h3>
                      {u.displayName || u.name || "Unnamed traveler"}
                      {u.role === "admin" ? (
                        <span className="user-list-role admin">
                          <FontAwesomeIcon icon={faShieldAlt} /> admin
                        </span>
                      ) : (
                        <span className="user-list-role">user</span>
                      )}
                    </h3>
                    <span>
                      <FontAwesomeIcon icon={faEnvelope} /> {u.email || "No email"}
                    </span>
                    <span>
                      {u.bookingsCount != null ? <>Bookings: {u.bookingsCount} · </> : null}
                      {u.synced === false ? "Not synced to Mongo yet · " : ""}
                      Joined: {formatDate(u.createdAt || u.lastLoginAt)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}

          <p className="user-list-footnote">
            <FontAwesomeIcon icon={faSync} /> GET /api/users/me with <code>synced:false</code> means that
            email never reached Mongo — ask them to log in once so upsert returns 201.
          </p>
        </section>
      </section>
    </main>
  );
};

export default UserList;

