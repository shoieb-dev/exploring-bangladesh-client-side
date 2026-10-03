import React from "react";
import { Redirect, Route } from "react-router";
import useAuth from "./../../../hooks/useAuth";
import TravelLoader from "../../../components/TravelLoader/TravelLoader";

// PublicRoute (guest-only): authenticated users are redirected away,
// preventing them from visiting login / signup / forgot-password pages.
const PublicRoute = ({ children, ...rest }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <TravelLoader message="Getting things ready…" />;
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        !user?.email ? children : <Redirect to={location.state?.from || { pathname: "/dashboard" }}></Redirect>
      }
    ></Route>
  );
};

export default PublicRoute;
