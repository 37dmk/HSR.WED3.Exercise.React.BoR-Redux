import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import { Container, Menu, Segment } from "semantic-ui-react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import PrivateRoute from "./components/PrivateRoute";

import { connect } from "react-redux";
import { authenticate, signout } from "./actions";

function App({ isAuthenticated, user, token, ...props }) {
  const MenuBar = withRouter(({ history, location: { pathname } }) => {
    if (isAuthenticated && user) {
      return (
        <Segment.Group style={{ marginTop: "1em" }}>
          <Segment>
            <Menu pointing secondary color="blue">
              <Menu.Item header>
                {user.firstname} {user.lastname} &ndash; {user.accountNr}
              </Menu.Item>
              <Menu.Item
                name="Kontoübersicht"
                active={pathname === "/dashboard"}
                as={Link}
                to="/dashboard"
              />
              <Menu.Item
                name="Zahlungen"
                active={pathname === "/transactions"}
                as={Link}
                to="/transactions"
              />
              <Menu.Menu position="right">
                <Menu.Item
                  name={`Logout ${user.firstname} ${user.lastname}`}
                  onClick={() => {
                    props.signout(() => history.push("/"));
                  }}
                />
              </Menu.Menu>
            </Menu>
          </Segment>
        </Segment.Group>
      );
    } else {
      return null;
    }
  });

  return (
    <Router>
      <Container>
        <MenuBar />
        <Route
          exact
          path="/"
          render={(props) => (
            <Home {...props} isAuthenticated={isAuthenticated} />
          )}
        />
        <Route
          path="/login"
          render={(props) => (
            <Login {...props} authenticate={this.props.authenticate} />
          )}
        />
        <Route path="/signup" component={Signup} />
        <PrivateRoute
          isAuthenticated={isAuthenticated}
          token={token}
          path="/dashboard"
          component={Dashboard}
        />
        <PrivateRoute
          isAuthenticated={isAuthenticated}
          token={token}
          user={user}
          path="/transactions"
          component={Transactions}
        />
      </Container>
    </Router>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.authentication.isAuthenticated,
    user: state.authentication.user,
    token: state.authentication.token,
  };
};

const mapDispatchToProps = {
  authenticate,
  signout,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
