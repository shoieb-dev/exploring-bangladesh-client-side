import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import AuthModal from "../../../components/AuthModal/AuthModal";
import useAuth from "../../../hooks/useAuth";
import { bookingsAPI, servicesAPI } from "../../../services/api";
import "./Booking.css";

const Booking = () => {
  const { serviceId } = useParams();
  const { user } = useAuth();
  const [service, setService] = useState({});
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [heroError, setHeroError] = useState(false);
  const [imgState, setImgState] = useState({});
  const [showBooking, setShowBooking] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const bookingFormRef = useRef(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    let mounted = true;
    setFetching(true);
    setFetchError(null);
    setHeroLoaded(false);
    setHeroError(false);
    setImgState({});
    fetch(`${servicesAPI}/${serviceId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load package (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setService(data || {});
        // Preload hero so backgroundImage doesn't pop in blank
        if (data?.img1) {
          const hero = new Image();
          hero.decoding = "async";
          hero.src = data.img1;
          hero.onload = () => mounted && setHeroLoaded(true);
          hero.onerror = () => mounted && setHeroError(true);
        } else {
          setHeroError(true);
        }
      })
      .catch((err) => mounted && setFetchError(err.message))
      .finally(() => mounted && setFetching(false));
    return () => {
      mounted = false;
    };
  }, [serviceId]);

  const revealBookingForm = () => {
    setShowBooking(true);
    window.setTimeout(() => bookingFormRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
  };

  const openAuthModal = () => {
    setShowAuthModal(true);
  };

  const finishAuthentication = () => {
    setShowBooking(true);
    window.setTimeout(() => bookingFormRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
  };

  const onSubmit = (data) => {
    axios.post(bookingsAPI, data).then((res) => {
      if (res.data.insertedId) {
        window.alert("Package Booked Successfully");
        reset();
      }
    });
  };

  const itinerary = [
    { day: "Day 1", title: service.day1, description: service.description1, image: service.img1 },
    { day: "Day 2", title: service.day2, description: service.description2, image: service.img2 },
    { day: "Day 3", title: service.day3, description: service.description3, image: service.img3 },
  ];

  const setLoaded = (day) => setImgState((p) => (p[day]?.loaded ? p : { ...p, [day]: { ...p[day], loaded: true } }));
  const setError = (day) =>
    setImgState((p) => ({ ...p, [day]: { loaded: true, error: true } }));

  const heroReady = heroLoaded || heroError;

  if (fetching) {
    return (
      <main className="package-detail" aria-busy="true" aria-live="polite">
        <section className="package-hero package-hero-loading">
          <div className="package-hero-overlay">
            <Container>
              <div className="package-hero-content">
                <Spinner animation="border" variant="light" role="status">
                  <span className="visually-hidden">Loading package...</span>
                </Spinner>
                <p className="mt-3 mb-0 fw-bold text-white">Loading your adventure…</p>
              </div>
            </Container>
          </div>
        </section>
        <Container>
          <section className="package-intro">
            <div className="w-100">
              <div className="booking-skeleton-line w-25 mb-2" />
              <div className="booking-skeleton-line w-50 mb-2" />
              <div className="booking-skeleton-line w-75" />
            </div>
          </section>
          <section className="itinerary-timeline" aria-label="Loading itinerary">
            {[0, 1, 2].map((i) => (
              <article className="timeline-item" key={i}>
                <div className="timeline-node">…</div>
                <div className="timeline-content">
                  <div className="timeline-image-wrap booking-img-loading">
                    <Spinner animation="border" size="sm" variant="info" />
                  </div>
                  <div className="timeline-copy w-100">
                    <div className="booking-skeleton-line w-25 mb-2" />
                    <div className="booking-skeleton-line w-75 mb-2" />
                    <div className="booking-skeleton-line w-100" />
                  </div>
                </div>
              </article>
            ))}
          </section>
        </Container>
      </main>
    );
  }

  if (fetchError) {
    return (
      <main className="package-detail">
        <Container>
          <div className="text-center py-5">
            <p className="fw-bold mb-1">Could not load this package</p>
            <p className="text-muted small mb-3">{fetchError}</p>
            <button type="button" className="package-cta" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="package-detail">
      <section
        className={`package-hero ${heroReady ? "hero-ready" : "package-hero-loading"}`}
        style={heroLoaded && service.img1 ? { backgroundImage: `url(${service.img1})` } : undefined}
      >
        {!heroReady && (
          <div className="package-hero-loader" aria-hidden="true">
            <Spinner animation="border" variant="light" role="status">
              <span className="visually-hidden">Loading cover photo...</span>
            </Spinner>
          </div>
        )}
        <div className="package-hero-overlay">
          <Container>
            <div className="package-hero-content">
              <span className="package-eyebrow">Curated Bangladesh escape</span>
              <h1>{service.name || "Discover your next adventure"}</h1>
              <div className="package-meta" aria-label="Package highlights">
                <span>⏱ 3 Days / 2 Nights</span>
                <span>👥 Small group</span>
                <span>🍽 Meals included</span>
              </div>
            </div>
          </Container>
        </div>
      </section>

      <Container>
        <section className="package-intro">
          <div>
            <span className="section-kicker">Your journey</span>
            <h2>Explore the itinerary</h2>
            <p>Three memorable days, thoughtfully planned from Dhaka to Saint Martins Island and back.</p>
          </div>
          <aside className="package-summary" aria-label="Package summary">
            <span className="summary-label">Starting from</span>
            <strong>BDT {service.price || "6,500"}</strong>
            <small>Per person, twin/triple basis</small>
            {user?.email ? (
              <button type="button" className="package-cta" onClick={revealBookingForm}>
                Book this package
              </button>
            ) : (
              <button type="button" className="package-cta" onClick={openAuthModal}>
                Sign in to book
              </button>
            )}
          </aside>
        </section>

        <section className="itinerary-timeline" aria-label="Package itinerary">
          {itinerary.map((item) => {
            const st = imgState[item.day] || {};
            const showLoader = !st.loaded && item.image;
            return (
              <article className="timeline-item" key={item.day}>
                <div className="timeline-node">{item.day.replace("Day ", "")}</div>
                <div className="timeline-content">
                  <div className={`timeline-image-wrap ${showLoader ? "booking-img-loading" : ""}`}>
                    {showLoader && (
                      <span className="booking-img-spinner" aria-hidden="true">
                        <Spinner animation="border" size="sm" variant="info" />
                      </span>
                    )}
                    {item.image && !st.error ? (
                      <img
                        src={item.image}
                        alt={item.title || `${item.day} itinerary`}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setLoaded(item.day)}
                        onError={() => setError(item.day)}
                        className={st.loaded ? "booking-img-loaded" : "booking-img-hidden"}
                      />
                    ) : (
                      !showLoader && (
                        <div className="booking-img-fallback" role="img" aria-label={item.title || item.day}>
                          <span>🏝️</span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="timeline-copy">
                    <span className="timeline-day">{item.day}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {user?.email ? (
          showBooking && (
            <section className="booking-panel" ref={bookingFormRef}>
              <div className="booking-panel-heading">
                <span className="section-kicker">Almost there</span>
                <h2>Complete your booking</h2>
                <p>Your package is reserved for the next step.</p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <input defaultValue={user.displayName} {...register("name")} aria-label="Name" />
                <input defaultValue={user.email} {...register("email", { required: true })} aria-label="Email" />
                {errors.email && <span className="error">This field is required</span>}
                <input defaultValue={service.name} {...register("package", { required: true })} aria-label="Package" />
                <input type="date" {...register("date", { required: true })} aria-label="Date" />
                <input
                  placeholder="Phone Number"
                  {...register("phone", { required: true })}
                  aria-label="Phone Number"
                />
                <button type="submit">Confirm booking</button>
              </form>
            </section>
          )
        ) : (
          <section className="booking-panel booking-login-panel">
            <div className="booking-panel-heading">
              <span className="section-kicker">Ready to go?</span>
              <h2>Log in to complete your reservation</h2>
              <p>Select your dates and reserve this package after signing in.</p>
            </div>
            <button type="button" onClick={openAuthModal}>
              Log in to book
            </button>
          </section>
        )}
      </Container>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onAuthenticated={finishAuthentication} />}
    </main>
  );
};

export default Booking;
