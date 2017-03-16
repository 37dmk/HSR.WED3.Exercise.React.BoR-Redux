import React from "react";
import { Redirect, Link } from "react-router-dom";
import { Button, Grid, Header } from "semantic-ui-react";
import { Form, Segment, Input, Message } from "semantic-ui-react";

import { signup } from "../api";

class Signup extends React.Component {
  state = {
    login: "",
    firstname: "",
    lastname: "",
    password: "",
    error: null,
    redirectToReferrer: false
  };

  onLoginChanged = event => {
    this.setState({ login: event.target.value });
  };

  onFirstNameChanged = event => {
    this.setState({ firstname: event.target.value });
  };

  onLastNameChanged = event => {
    this.setState({ lastname: event.target.value });
  };

  onPasswordChanged = event => {
    this.setState({ password: event.target.value });
  };

  onSubmit = event => {
    event.preventDefault();
    const { login, firstname, lastname, password } = this.state;
    signup(login, firstname, lastname, password)
      .then(result => {
        console.log("Signup result ", result);
        this.setState({ redirectToReferrer: true, error: null });
      })
      .catch(error => this.setState({ error }));
  };

  render() {
    const { redirectToReferrer, error } = this.state;

    if (redirectToReferrer) {
      return <Redirect to="/login" />;
    }

    return (
      <Grid className="LoginScreen" verticalAlign="middle" centered={true}>
        <Grid.Column>
          <Header as="h2" content="Bank of Rapperswil" />
          <Form size="large" error={error}>
            <Segment stacked={true}>
              <Header as="h3" content="Registrieren" />
              <Form.Field>
                <Input
                  onChange={this.onLoginChanged}
                  icon="user"
                  iconPosition="left"
                  placeholder="Login"
                  value={this.state.login}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  onChange={this.onFirstNameChanged}
                  icon="user"
                  iconPosition="left"
                  placeholder="Vorname"
                  value={this.state.firstname}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  onChange={this.onLastNameChanged}
                  icon="user"
                  iconPosition="left"
                  placeholder="Nachname"
                  value={this.state.lastname}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  onChange={this.onPasswordChanged}
                  icon="lock"
                  iconPosition="left"
                  placeholder="Passwort"
                  type="password"
                  value={this.state.password}
                />
              </Form.Field>
              <Button
                primary
                onClick={this.onSubmit}
                size="large"
                fluid={true}
                content="Log-in"
              />
            </Segment>
            <Message error content={error} />
          </Form>
          <Message>
            <Link to="/">Zurück zur Startseite</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Signup;
