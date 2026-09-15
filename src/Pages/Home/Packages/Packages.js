import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import useAuth from "../../../hooks/useAuth";
import { servicesAPI } from "../../../services/api";
import Package from "../Package/Package";
import "./Packages.css";

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const { isLoading } = useAuth();

  useEffect(() => {
    let mounted = true;
    setFetching(true);
    setFetchError(null);
    fetch(servicesAPI)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load packages (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (mounted) setPackages(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (mounted) setFetchError(err.message);
      })
      .finally(() => {
        if (mounted) setFetching(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading || fetching) {
    return (
      <section id="packages" className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <span className="text-success fw-bold text-uppercase tracking-wider">Top Destinations</span>
            <h2 className="display-6 fw-bold mt-1">
              Featured Tour <span className="text-success">Packages</span>
            </h2>
            <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
              Handpicked guided adventures across Bangladesh with complete itineraries and flexible schedules.
            </p>
          </div>
          {/* Skeleton cards while fetching - same grid shape, no layout shift */}
          <Row xs={1} md={2} lg={3} className="g-4" aria-live="polite" aria-busy="true">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Col key={i}>
                <div className="p-3">
                  <div className="pkg-skeleton-card">
                    <div className="pkg-skeleton-img">
                      <Spinner animation="border" size="sm" variant="success" />
                    </div>
                    <div className="p-4">
                      <div className="pkg-skeleton-line w-75 mb-2" />
                      <div className="pkg-skeleton-line w-50 mb-3" />
                      <div className="pkg-skeleton-line w-100" />
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          <div className="d-flex justify-content-center align-items-center pt-4">
            <Spinner animation="border" variant="success" role="status">
              <span className="visually-hidden">Loading packages...</span>
            </Spinner>
            <span className="ms-2 text-muted">Loading tour packages…</span>
          </div>
        </Container>
      </section>
    );
  }

  if (fetchError) {
    return (
      <section id="packages" className="py-5 bg-light">
        <Container>
          <div className="text-center py-5">
            <p className="fw-bold mb-1">Could not load packages</p>
            <p className="text-muted small mb-3">{fetchError}</p>
            <button className="btn btn-success rounded-pill px-4" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </Container>
      </section>
    );
  }

  if (!packages.length) {
    return (
      <section id="packages" className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <span className="text-success fw-bold text-uppercase tracking-wider">Top Destinations</span>
            <h2 className="display-6 fw-bold mt-1">
              Featured Tour <span className="text-success">Packages</span>
            </h2>
            <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
              Handpicked guided adventures across Bangladesh with complete itineraries and flexible schedules.
            </p>
          </div>
          <p className="text-center text-muted py-4">No tour packages available right now. Please check back soon.</p>
        </Container>
      </section>
    );
  }

  return (
    <section id="packages" className="py-5 bg-light">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-5">
          <span className="text-success fw-bold text-uppercase tracking-wider">Top Destinations</span>
          <h2 className="display-6 fw-bold mt-1">
            Featured Tour <span className="text-success">Packages</span>
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
            Handpicked guided adventures across Bangladesh with complete itineraries and flexible schedules.
          </p>
        </div>

        {/* Package Grid */}
        <Row xs={1} md={2} lg={3} className="g-4">
          {packages.map((pack) => (
            <Col key={pack._id}>
              <Package pack={pack} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Packages;
