import React from "react";
import { Link } from "react-router-dom";
import { Button, Grid, Header } from "semantic-ui-react";
import { Segment } from "semantic-ui-react";
import { Redirect } from "react-router";


import { connect } from "react-redux";
import { getAuthenticationState } from "../reducers";


const Home = ({ isAuthenticated }) => (
  <Grid className="HomeScreen" verticalAlign="middle" centered={true}>
    <Grid.Column>
      <Header as="h2" content="Bank of Rapperswil" />
      <Segment stacked={true}>
        <Header as="h3" content="E-Banking Portal" />
        {isAuthenticated ? (
          <Redirect to="/dashboard" />
        ) : (
          <div>
            <Button
              style={{ marginBottom: "1em" }}
              fluid
              primary
              as={Link}
              to={"/login"}
              content="Einloggen"
            />
            <p>
              Falls Sie noch keinen Account besitzen können Sie sich hier
              registrieren:
            </p>
            <Button fluid as={Link} to={"/signup"} content="Registrieren" />
          </div>
        )}
      </Segment>
    </Grid.Column>
  </Grid>
);


const mapStateToProps = (state) => {
  return {
    isAuthenticated: getAuthenticationState(state),
  };
};


export default connect(mapStateToProps)(Home);
