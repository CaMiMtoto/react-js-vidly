import React from 'react';
import {Redirect, Route} from "react-router-dom";
import authService from "../../services/authService";

const ProtectedRoute = ({path, component: Component, render, ...rest}) => {
    const user = authService.getCurrentUser();
    return (
        <Route
            {...rest}
            render={props => {
                if (!user) return <Redirect to={{
                    pathname: '/login',
                    state: {
                        intended: props.location,
                    }
                }}/>
                return Component ? <Component {...props}/> : render(props);
            }}/>
    );
};

export default ProtectedRoute;