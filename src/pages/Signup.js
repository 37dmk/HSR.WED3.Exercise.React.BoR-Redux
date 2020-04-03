import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { Button, Grid, Header } from "semantic-ui-react";
import { Form, Segment, Input, Message } from "semantic-ui-react";

import { signup } from "../api";

function Signup() {
  const [login, setLogin] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [redirectToReferrer, setRedirectToReferrrer] = useState(false);

  const onSubmit = event => {
    event.preventDefault();
    signup(login, firstname, lastname, password)
      .then(result => {
        setRedirectToReferrrer(true);
        setError(null);
      })
      .catch(setError);
  };

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
                onChange={event => setLogin(event.target.value)}
                icon="user"
                iconPosition="left"
                placeholder="Login"
                value={login}
              />
            </Form.Field>
            <Form.Field>
              <Input
                onChange={event => setFirstname(event.target.value)}
                icon="user"
                iconPosition="left"
                placeholder="Vorname"
                value={firstname}
              />
            </Form.Field>
            <Form.Field>
              <Input
                onChange={event => setLastname(event.target.value)}
                icon="user"
                iconPosition="left"
                placeholder="Nachname"
                value={lastname}
              />
            </Form.Field>
            <Form.Field>
              <Input
                onChange={event => setPassword(event.target.value)}
                icon="lock"
                iconPosition="left"
                placeholder="Passwort"
                type="password"
                value={password}
              />
            </Form.Field>
            <Button
              primary
              onClick={onSubmit}
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

export default Signup;
