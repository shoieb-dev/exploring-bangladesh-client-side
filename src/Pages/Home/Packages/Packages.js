import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import useAuth from "../../../hooks/useAuth";
import { servicesAPI } from "../../../services/api";
import Package from "../Package/Package";
import "./Packages.css";

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const { isLoading } = useAuth();

  useEffect(() => {
    fetch(servicesAPI)
      .then((res) => res.json())
      .then((data) => setPackages(data));
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" variant="success" />
      </div>
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
