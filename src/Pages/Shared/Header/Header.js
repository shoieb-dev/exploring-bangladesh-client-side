import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import useAuth from "../../../hooks/useAuth";
import "./Header.css";

const Header = () => {
  const { user, logOut } = useAuth();

  const navLinks = [
    { label: "Home", path: "/home#banner" },
    { label: "Tour Packages", path: "/home#packages" },
    { label: "Success", path: "/home#success" },
    { label: "Testimonials", path: "/home#testimonial" },
  ];

  const userDropdownItems = [
    { label: "Add Package", path: "/addPackage" },
    { label: "Manage Packages", path: "/managePackages" },
    { label: "My Package", path: "/myPackages" },
  ];

  return (
    <Navbar collapseOnSelect expand="lg" variant="dark" className="header" fixed="top" role="navigation">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand-container">
          <img
            src="https://i.ibb.co/smrxtD7/Tour-Today-BD.png"
            width="50"
            height="50"
            className="me-2"
            alt="X-Ploring Bangladesh Logo"
          />
          <div className="brand-text">
            <h5 className="brand text-warning">X-PLORING</h5>
            <h6 className="text-info">BANGLADESH</h6>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto fw-bold">
            {navLinks.map((link, index) => (
              <Nav.Link key={index} as={HashLink} to={link.path} className="nav-link-item">
                {link.label}
              </Nav.Link>
            ))}
            {user?.email ? (
              <NavDropdown
                title={user?.displayName || "Account"}
                menuVariant="dark"
                className="user-dropdown ms-3"
                id="user-nav-dropdown"
              >
                {userDropdownItems.map((item, index) => (
                  <NavDropdown.Item key={index} as={Link} to={item.path}>
                    {item.label}
                  </NavDropdown.Item>
                ))}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logOut} className="logout-item">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login" className="login-link ms-2">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
