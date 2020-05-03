import React from "react";
import { Route, Redirect } from "react-router-dom";

/*
// This would introduce the redux state actions
import { connect } from "react-redux";
import {
  getAuthenticationSate,
  getUser,
} from "../reducers";
*/

function PrivateRoute({
  component, 
  isAuthenticated, 
  user, 
  token, 
  ...rest 
}) {
  if (isAuthenticated) {
    // if the user is authenticated, just render the component
    return (
      <Route
        {...rest}
        render={props =>
          React.createElement(component, { ...props, user, token })
        }
      />
    );
  } else {
    // otherwise redirect to the login page
    return (
      <Route
        {...rest}
        render={props => (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )}
      />
    );
  }
}

/*
// Introducing the redux state in this part does NOT work somehow
const mapStateToProps = (state) => {
  return {
    isAuthenticated: getAuthenticationSate(state),
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(PrivateRoute);
*/


export default PrivateRoute;