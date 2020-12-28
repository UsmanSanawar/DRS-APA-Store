import React from "react";
import {Route, Redirect} from "react-router-dom";
import { isTokenValid } from "./constant/helpers";

export const ProtectedRoutes = ({
  component: Component,
  location,
  authUser,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      JSON.parse(localStorage.getItem('token')) && isTokenValid(localStorage.getItem('token')) ? (
        <Component {...rest} {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/store/login",
            state: { from: location.pathname },
          }}
        />
      )
    }
  />
);