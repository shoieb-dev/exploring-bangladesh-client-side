import { faHandsHelping, faUserCheck, faUserClock, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Col, Container, Row } from "react-bootstrap";
import "./Success.css";

const Success = () => {
  return (
    <section id="success" className="pt-5 success-bg">
      <div className="success-heading py-5">
        <h2>
          Why Choose
          <span className="d-block mt-3">
            <span className="brand bg-warning px-2 rounded-3">X-PLORING</span>{" "}
            <span className="bg-info px-2 rounded-3">BANGLADESH</span>
          </span>
        </h2>
      </div>
      <div className="pb-5">
        <Container>
          <Row xs={1} md={2} lg={4} className="g-4">
            <Col className="d-flex">
              <Card className="success-card w-100 p-3">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <FontAwesomeIcon className="my-3" icon={faUserFriends} size="4x" aria-hidden="true" />
                  <Card.Title>100+ Local Guides</Card.Title>
                </Card.Body>
              </Card>
            </Col>

            <Col className="d-flex">
              <Card className="success-card w-100 p-3">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <FontAwesomeIcon className="my-3" icon={faHandsHelping} size="4x" aria-hidden="true" />
                  <Card.Title>100% Trusted Travel Agency</Card.Title>
                </Card.Body>
              </Card>
            </Col>

            <Col className="d-flex">
              <Card className="success-card w-100 p-3">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <FontAwesomeIcon className="my-3" icon={faUserClock} size="4x" aria-hidden="true" />
                  <Card.Title>5+ Years of Travel Experience</Card.Title>
                </Card.Body>
              </Card>
            </Col>

            <Col className="d-flex">
              <Card className="success-card w-100 p-3">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <FontAwesomeIcon className="my-3" icon={faUserCheck} size="4x" aria-hidden="true" />
                  <Card.Title>80% Happy Travelers</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default Success;
