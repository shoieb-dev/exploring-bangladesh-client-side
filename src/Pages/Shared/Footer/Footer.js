import { faFacebookF, faLinkedin, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faBuilding, faEnvelopeOpen, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Container, Row } from "react-bootstrap";
import { HashLink } from "react-router-hash-link";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialMedia = [
    { icon: faFacebookF, url: "https://www.facebook.com/shoieb.ctg", label: "Facebook" },
    { icon: faTwitter, url: "https://twitter.com/Shoieb5", label: "Twitter" },
    { icon: faLinkedin, url: "https://www.linkedin.com/in/shoieb-alam/", label: "LinkedIn" },
    { icon: faYoutube, url: "https://www.youtube.com/channel/UCCIDe_dIDwvX1rBK-Yz30VA", label: "YouTube" },
  ];

  const usefulLinks = [
    { label: "Home", path: "/home#banner" },
    { label: "Tour Packages", path: "/home#packages" },
    { label: "Success", path: "/home#success" },
    { label: "Testimonials", path: "/home#testimonial" },
  ];

  const contactInfo = [
    { icon: faPhone, text: "+88-031-214365", href: "tel:+88031214365", label: "Phone" },
    { icon: faEnvelopeOpen, text: "support.xpbd@gmail.com", href: "mailto:support.xpbd@gmail.com", label: "Email" },
    { icon: faBuilding, text: "Motijhil, Dhaka-1230 Bangladesh", href: null, label: "Address" },
  ];
  return (
    <footer className="bg-dark text-white py-3">
      <div className="text-start py-5">
        <Container>
          <Row xs={1} md={2} lg={3} className="g-4">
            {/* Brand Section */}
            <Col>
              <div className="footer-section">
                <div className="d-flex align-items-center mb-4">
                  <img
                    src="https://i.ibb.co/smrxtD7/Tour-Today-BD.png"
                    width="60"
                    height="60"
                    className="me-3"
                    alt="X-Ploring Bangladesh Logo"
                  />
                  <div>
                    <h4 className="brand text-warning mb-1">X-PLORING</h4>
                    <h6 className="text-info mb-0">BANGLADESH</h6>
                  </div>
                </div>

                {/* Social Media Icons */}
                <div className="social-media">
                  {socialMedia.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Visit our ${social.label} page`}
                      title={social.label}
                    >
                      <FontAwesomeIcon icon={social.icon} />
                    </a>
                  ))}
                </div>
              </div>
            </Col>

            {/* Useful Links Section */}
            <Col>
              <div className="footer-section">
                <h5 className="mb-3">Useful Links</h5>
                <nav className="footer-links">
                  {usefulLinks.map((link, index) => (
                    <HashLink key={index} to={link.path} className="footer-link d-block mb-2">
                      {link.label}
                    </HashLink>
                  ))}
                </nav>
              </div>
            </Col>

            {/* Contact Info Section */}
            <Col>
              <div className="footer-section">
                <h5 className="mb-3">Get In Touch</h5>
                <div className="contact-info">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="mb-3">
                      <FontAwesomeIcon icon={info.icon} className="me-2 text-warning" />
                      {info.href ? (
                        <a href={info.href} className="footer-link" aria-label={info.label}>
                          {info.text}
                        </a>
                      ) : (
                        <span>{info.text}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="footer-bottom text-center py-3 border-top border-secondary">
        <small>Copyright © {currentYear}, All Rights Reserved. X-Ploring Bangladesh.</small>
      </div>
    </footer>
  );
};

export default Footer;
