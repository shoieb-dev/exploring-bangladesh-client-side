import { useCallback, useEffect, useState } from "react";
import { Carousel, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import "./Banner.css";

const SLIDES = [
  {
    id: "saint-martin",
    src: "https://i.ibb.co/Tv9ktZ5/image.png",
    alt: "Saint Martins Island",
  },
  {
    id: "sylhet-tea",
    src: "https://i.ibb.co.com/VcHNjXLk/best-tea-gardens-Bangladesh.jpg",
    alt: "Sylhet Tea Gardens",
  },
];

const Banner = () => {
  const [loaded, setLoaded] = useState({});
  const [hasError, setHasError] = useState({});
  const firstLoaded = !!loaded[SLIDES[0].id];
  const allLoaded = SLIDES.every((s) => loaded[s.id]);

  useEffect(() => {
    let mounted = true;
    SLIDES.forEach((slide, i) => {
      const img = new Image();
      img.decoding = "async";
      if (i === 0) img.fetchPriority = "high";
      img.src = slide.src;
      img.onload = () => {
        if (mounted) setLoaded((p) => (p[slide.id] ? p : { ...p, [slide.id]: true }));
      };
      img.onerror = () => {
        if (mounted) {
          setHasError((p) => ({ ...p, [slide.id]: true }));
          setLoaded((p) => (p[slide.id] ? p : { ...p, [slide.id]: true }));
        }
      };
    });
    return () => {
      mounted = false;
    };
  }, []);

  const onLoad = useCallback((id) => {
    setLoaded((p) => (p[id] ? p : { ...p, [id]: true }));
  }, []);

  const onError = useCallback((id) => {
    setHasError((p) => ({ ...p, [id]: true }));
    setLoaded((p) => (p[id] ? p : { ...p, [id]: true }));
  }, []);

  return (
    <div id="banner" className="banner-wrapper">
      {!firstLoaded && (
        <div className="banner-loader" aria-live="polite" aria-busy="true">
          <div className="banner-loader-shimmer" aria-hidden="true" />
          <div className="banner-loader-content">
            <Spinner animation="border" variant="warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="banner-loader-text mt-3 mb-1 fw-bold">Loading Amazing Destinations...</p>
            <p className="banner-loader-sub small mb-0">Fetching Saint Martin's Island views</p>
          </div>
        </div>
      )}
      <Carousel
        fade
        interval={firstLoaded ? 4000 : null}
        indicators={firstLoaded}
        controls={firstLoaded}
        pause="hover"
        className={firstLoaded ? "banner-visible" : "banner-hidden"}
      >
        <Carousel.Item>
          <div className="hero-img-wrap">
            {!loaded[SLIDES[0].id] && <div className="hero-img-skeleton" aria-hidden="true" />}
            {!hasError[SLIDES[0].id] ? (
              <img
                className={`d-block w-100 hero-img ${loaded[SLIDES[0].id] ? "img-loaded" : "img-loading"}`}
                src={SLIDES[0].src}
                alt={SLIDES[0].alt}
                fetchpriority="high"
                decoding="async"
                loading="eager"
                onLoad={() => onLoad(SLIDES[0].id)}
                onError={() => onError(SLIDES[0].id)}
              />
            ) : (
              <div className="hero-img-fallback" role="img" aria-label={SLIDES[0].alt} />
            )}
          </div>
          <Carousel.Caption className="bg-carousel p-4 p-md-10">
            <span className="badge bg-warning text-dark mb-2 px-3 py-2 fs-6">Popular Destination</span>
            <h2 className="display-4 fw-bold">Discover Saint Martin's Island</h2>
            <p className="fs-5">Experience crystal blue waters, coral reefs, and pristine beach sunsets.</p>
            <HashLink smooth to="/home#packages" className="btn btn-light btn-lg fw-bold me-2">
              Explore Packages
            </HashLink>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <div className="hero-img-wrap">
            {!loaded[SLIDES[1].id] && <div className="hero-img-skeleton" aria-hidden="true" />}
            {!hasError[SLIDES[1].id] ? (
              <img
                className={`d-block w-100 hero-img ${loaded[SLIDES[1].id] ? "img-loaded" : "img-loading"}`}
                src={SLIDES[1].src}
                alt={SLIDES[1].alt}
                decoding="async"
                loading="lazy"
                onLoad={() => onLoad(SLIDES[1].id)}
                onError={() => onError(SLIDES[1].id)}
              />
            ) : (
              <div className="hero-img-fallback" role="img" aria-label={SLIDES[1].alt} />
            )}
          </div>
          <Carousel.Caption className="bg-carousel p-4 p-md-10">
            <span className="badge bg-info text-dark mb-2 px-3 py-2 fs-6">Adventure Trip</span>
            <h2 className="display-4 fw-bold">Trek Through Sylhet’s Tea Gardens</h2>
            <p className="fs-5">Immerse yourself in lush green hills, waterfalls, and nature walks.</p>
            <Link to="/packages/617db78fd53add0d275824ce" className="btn btn-warning btn-lg fw-bold">
              Book 3D/2N Tour
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      {firstLoaded && !allLoaded && (
        <div className="banner-mini-loader">
          <Spinner animation="grow" size="sm" variant="warning" />
          <span className="ms-2 small">Loading next destination…</span>
        </div>
      )}
    </div>
  );
};

export default Banner;
