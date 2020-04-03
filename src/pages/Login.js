import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { Button, Grid, Header } from "semantic-ui-react";
import { Form, Segment, Input, Message } from "semantic-ui-react";

function Login({ location, authenticate }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  const onSubmit = event => {
    event.preventDefault();
    setLoading(true);
    authenticate(login, password, error => {
      setLoading(false);
      if (error) {
        setError(error);
      } else {
        setError(undefined);
        setRedirectToReferrer(true);
      }
    });
  };

  const { from } = location.state || {
    from: { pathname: "/dashboard" }
  };

  if (redirectToReferrer) {
    return <Redirect to={from} />;
  }

  return (
    <Grid className="LoginScreen" verticalAlign="middle" centered={true}>
      <Grid.Column>
        <Header as="h2" content="Bank of Rapperswil" />
        <Form size="large" error={error}>
          <Segment stacked={true}>
            <Header as="h3" content="Einloggen" />
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
                onChange={event => setPassword(event.target.value)}
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                value={password}
              />
            </Form.Field>
            <Button
              primary
              loading={loading}
              onClick={onSubmit}
              size="large"
              fluid={true}
              content="Log-in"
            />
          </Segment>
          <Message error content="Login fehlgeschlagen" />
        </Form>
        <Message>
          <Link to="/signup">Noch keinen Account?</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
}

export default Login;
