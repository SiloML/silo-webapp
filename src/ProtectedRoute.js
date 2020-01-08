import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Comp, user, path, ...rest }) => {
    return (
      <Route
        path={path}
        {...rest}
        render={props => {
          return user ? (
            <Comp {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  error: "You need to be logged in to view profile.",
                },
              }}
            />
          );
        }}
      />
    );
  };

  export default ProtectedRoute;
  