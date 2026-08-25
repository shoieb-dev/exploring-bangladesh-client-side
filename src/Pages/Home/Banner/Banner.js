import React from "react";
import { Carousel, Button } from "react-bootstrap";
import "./Banner.css";

const Banner = () => {
  return (
    <div id="tourism-banner">
      <Carousel fade interval={4000}>
        <Carousel.Item>
          <img className="d-block w-100 hero-img" src="https://i.ibb.co/Tv9ktZ5/image.png" alt="Saint Martins Island" />
          <Carousel.Caption className="bg-carousel p-4 p-md-10">
            <span className="badge bg-warning text-dark mb-2 px-3 py-2 fs-6">Popular Destination</span>
            <h2 className="display-4 fw-bold">Discover Saint Martin's Island</h2>
            <p className="fs-5">Experience crystal blue waters, coral reefs, and pristine beach sunsets.</p>
            <Button variant="light" size="lg" className="fw-bold me-2">
              Explore Packages
            </Button>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100 hero-img"
            src="https://i.ibb.co.com/VcHNjXLk/best-tea-gardens-Bangladesh.jpg"
            alt="Sylhet Tea Gardens"
          />
          <Carousel.Caption className="bg-carousel p-4 p-md-10">
            <span className="badge bg-info text-dark mb-2 px-3 py-2 fs-6">Adventure Trip</span>
            <h2 className="display-4 fw-bold">Trek Through Sylhet’s Tea Gardens</h2>
            <p className="fs-5">Immerse yourself in lush green hills, waterfalls, and nature walks.</p>
            <Button variant="warning" size="lg" className="fw-bold">
              Book 3D/2N Tour
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default Banner;
