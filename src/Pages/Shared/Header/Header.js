import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import useAuth from "../../../hooks/useAuth";
// import logo from '../../../images/logo.png';
import "./Header.css";

const Header = () => {
  const { user, logOut } = useAuth();

  return (
    <div>
      {/* responsive navbar */}
      <Navbar collapseOnSelect expand="lg" variant="dark" className="header" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <div className="d-flex text-start">
              <div>
                <img
                  src="https://i.ibb.co/smrxtD7/Tour-Today-BD.png"
                  width="60"
                  height="60"
                  className="d-inline-block align-top me-2"
                  alt="logo"
                />
              </div>
              <div>
                <span className="brand text-warning"> X-PLORING </span>{" "}
                <p>
                  {" "}
                  <small className="text-info"> BANGLADESH </small>{" "}
                </p>
              </div>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto fw-bold">
              <Nav.Link as={HashLink} to="/home#banner">
                Home
              </Nav.Link>
              <Nav.Link as={HashLink} to="/home#packages">
                Tour Packages
              </Nav.Link>
              <Nav.Link as={HashLink} to="/home#success">
                Success
              </Nav.Link>
              <Nav.Link as={HashLink} to="/home#testimonial">
                Testimonials
              </Nav.Link>

              {/* showing username in the navbar if the user logged in  */}
              {user?.email ? (
                <>
                  <NavDropdown
                    title={user?.displayName}
                    menuVariant="dark"
                    className="btn-outline-info rounded-pill px-3 ms-2"
                    id="basic-nav-dropdown"
                  >
                    <NavDropdown.Item as={Link} to="/addPackage">
                      Add Package
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/managePackages">
                      Manage Packages
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/myPackages">
                      My Package
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      onClick={logOut}
                      variant="secondary"
                      className="bg-warning text-black rounded-pill"
                    >
                      Logout {user?.displayName}
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <Nav.Link as={Link} to="/login" className="login-link rounded-pill px-3">
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
