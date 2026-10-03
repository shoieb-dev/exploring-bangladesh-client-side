import React from 'react';
import { Redirect, Route } from 'react-router';
import useAuth from './../../../hooks/useAuth';
import TravelLoader from '../../../components/TravelLoader/TravelLoader';

const PrivateRoute = ({ children, ...rest }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) {
        return <TravelLoader message="Preparing your traveler space…" />
    }
    return (
        <Route
            {...rest}
            render={({ location }) => user.email ? children : <Redirect
                to={{
                    pathname: "/login",
                    state: { from: location }
                }}
            ></Redirect>

            }
        >
        </Route>
    );
};

export default PrivateRoute;