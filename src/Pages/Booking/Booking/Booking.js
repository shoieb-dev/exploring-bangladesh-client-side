import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
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
    fetch(`${servicesAPI}/${serviceId}`)
      .then((res) => res.json())
      .then((data) => setService(data));
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

  return (
    <main className="package-detail">
      <section className="package-hero" style={{ backgroundImage: `url(${service.img1})` }}>
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
          {itinerary.map((item) => (
            <article className="timeline-item" key={item.day}>
              <div className="timeline-node">{item.day.replace("Day ", "")}</div>
              <div className="timeline-content">
                <div className="timeline-image-wrap">
                  <img src={item.image} alt={item.title || `${item.day} itinerary`} />
                </div>
                <div className="timeline-copy">
                  <span className="timeline-day">{item.day}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            </article>
          ))}
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
