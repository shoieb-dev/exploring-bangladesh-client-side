import React from 'react';
import { Redirect, Route } from 'react-router';
import useAuth from './../../../hooks/useAuth';
import TravelLoader from '../../../components/TravelLoader/TravelLoader';

const AdminRoute = ({ children, ...rest }) => {
    const { user, isLoading, isAdmin, roleLoading } = useAuth();
    if (isLoading || roleLoading) {
        return <TravelLoader message="Checking admin access…" />;
    }
    return (
        <Route
            {...rest}
            render={({ location }) =>
                user?.email && isAdmin ? (
                    children
                ) : user?.email ? (
                    <Redirect
                        to={{
                            pathname: "/dashboard",
                            state: { from: location },
                        }}
                    ></Redirect>
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location },
                        }}
                    ></Redirect>
                )
            }
        >
        </Route>
    );
};

export default AdminRoute;
