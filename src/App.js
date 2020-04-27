import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from "react-router-dom";
import { Container, Menu, Segment } from "semantic-ui-react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import PrivateRoute from "./components/PrivateRoute";

import * as api from "./api";

class App extends React.Component {
  constructor(props) {
    super(props);
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("user");
    if (token && user) {
      this.state = {
        // TODO: 'isAuthenticated' has to be in Redux-State
        isAuthenticated: true,
        token,
        user: JSON.parse(user)
      };
    } else {
      this.state = {
        isAuthenticated: false,
        token: undefined,
        user: undefined
      };
    }
  }

  authenticate = (login, password, callback) => {
    api
      .login(login, password)
      .then(({ token, owner }) => {
        this.setState({ isAuthenticated: true, token, user: owner });
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(owner));
        callback(null);
      })
      .catch(error => callback(error));
  };

  signout = callback => {
    this.setState({
      isAuthenticated: false,
      token: undefined,
      user: undefined
    });
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    callback();
  };

  render() {
    const { isAuthenticated, user, token } = this.state;

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
                      this.signout(() => history.push("/"));
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
            render={props => (
              <Home {...props} isAuthenticated={isAuthenticated} />
            )}
          />
          <Route
            path="/login"
            render={props => (
              <Login {...props} authenticate={this.authenticate} />
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
}

export default App;