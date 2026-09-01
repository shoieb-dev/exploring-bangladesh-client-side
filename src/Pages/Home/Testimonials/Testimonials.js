import { faQuoteLeft, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Container, Row } from "react-bootstrap";
import "./Testimonials.css";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Brian Davis",
      rating: 5,
      location: "Cox's Bazar",
      text: "We had fantastic service in Cox's Bazar. I strongly recommend that everyone use this website.",
      avatar: "https://i.ibb.co.com/Jjf09Wng/face-image.jpg",
    },
    {
      id: 2,
      name: "John Smith",
      rating: 5,
      location: "Kuakata",
      text: "In Kuakata, we had excellent service. I strongly advise anyone to utilize this website.",
      avatar: "https://i.ibb.co.com/GvxYxhY9/uifaces-popular-image-2.jpg",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      rating: 5,
      location: "Bandarban",
      text: "We had outstanding service in Bandarban. This is a website that I strongly recommend to anybody.",
      avatar: "https://i.ibb.co.com/5g453PQ0/v3-0056533.jpg",
    },
  ];

  const renderStars = (rating) => (
    <div className="testimonial-rating justify-content-center d-flex">
      {Array.from({ length: 5 }, (_, i) => (
        <FontAwesomeIcon key={i} icon={faStar} className={i < rating ? "text-warning" : "text-secondary"} size="sm" />
      ))}
    </div>
  );

  return (
    <section id="testimonial" className="testimonials-section bg-light">
      <div className="pt-5 pb-2">
        <h2 className="text-center mb-2">
          What <span className="text-info">Travellers</span> Say
        </h2>
        <p className="text-center text-muted mb-5">Real experiences from our happy clients</p>
      </div>
      <div className="py-5">
        <Container>
          <Row xs={1} md={2} lg={3} className="g-4">
            {testimonials.map((testimonial) => (
              <Col key={testimonial.id} className="d-flex">
                <article className="testimonial-card w-100 h-100 d-flex flex-column position-relative">
                  <FontAwesomeIcon className="quote-icon" icon={faQuoteLeft} aria-hidden="true" />
                  <div className="text-center mt-4 mb-3">
                    <img className="testimonial-avatar" src={testimonial.avatar} alt={testimonial.name} />
                  </div>
                  <div className="d-flex flex-column flex-grow-1 px-3">
                    <h5 className="card-title mb-2">{testimonial.name}</h5>
                    {renderStars(testimonial.rating)}
                    <p className="testimonial-text flex-grow-1 mt-3">{testimonial.text}</p>
                    <small className="text-muted">{testimonial.location}</small>
                  </div>
                </article>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default Testimonials;
