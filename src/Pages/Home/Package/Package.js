import React from "react";
import { Link } from "react-router-dom";
import { Card, Button, Badge } from "react-bootstrap";
import "./Package.css";

const Package = ({ pack }) => {
  const {
    _id,
    name,
    price,
    duration,
    img1,
    difficulty = "Moderate",
    maxGroup = "10 People",
    inclusions = ["Transport", "Guide", "Meals"],
  } = pack;

  return (
    <div className="p-3">
      <Card className="tour-card h-100 border-0 shadow-sm">
        {/* Image Container with Top Badge */}
        <div className="card-img-wrapper position-relative">
          <Card.Img variant="top" src={img1} className="tour-card-img" />
          <Badge bg="dark" className="position-absolute top-0 end-0 m-3 px-3 py-2 opacity-75">
            {difficulty}
          </Badge>
        </div>

        <Card.Body className="d-flex flex-column justify-content-between p-4">
          <div>
            {/* Title */}
            <Card.Title className="fw-bold fs-5 text-start mb-2 title-clamp">{name}</Card.Title>

            {/* Trip Metadata Badges */}
            <div className="d-flex flex-wrap gap-1 mb-3">
              {inclusions.map((item, idx) => (
                <Badge key={idx} bg="light" text="dark" className="border fw-normal">
                  ✓ {item}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            {/* Duration & Price Row */}
            <div className="d-flex justify-content-between align-items-center py-2 border-top border-bottom mb-3">
              <span className="text-muted fw-semibold small">⏱️ {duration}</span>
              <span className="fw-bold text-success fs-5">BDT {price}</span>
            </div>

            {/* CTA Button */}
            <Link to={`/booking/${_id}`} className="d-grid text-decoration-none">
              <Button variant="success" className="rounded-pill fw-bold py-2 shadow-sm">
                View Itinerary & Book
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Package;
