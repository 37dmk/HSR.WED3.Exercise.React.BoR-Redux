import React from "react";
import { Redirect, Link } from "react-router-dom";
import { Button, Grid, Header } from "semantic-ui-react";
import { Form, Segment, Input, Message } from "semantic-ui-react";

class Login extends React.Component {
  state = {
    login: "",
    password: "",
    loading: false,
    error: undefined,
    redirectToReferrer: false
  };

  onLoginChanged = event => {
    this.setState({ login: event.target.value });
  };

  onPasswordChanged = event => {
    this.setState({ password: event.target.value });
  };

  onSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });
    const { login, password } = this.state;
    this.props.authenticate(login, password, error => {
      if (error) {
        this.setState({ error, loading: false });
      } else {
        this.setState({
          redirectToReferrer: error === null,
          error: null,
          loading: false
        });
      }
    });
  };

  render() {
    const { from } = this.props.location.state || {
      from: { pathname: "/dashboard" }
    };
    const { redirectToReferrer, error, loading } = this.state;

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
                  onChange={this.onLoginChanged}
                  icon="user"
                  iconPosition="left"
                  placeholder="Login"
                  value={this.state.login}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  onChange={this.onPasswordChanged}
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                  value={this.state.password}
                />
              </Form.Field>
              <Button
                primary
                loading={loading}
                onClick={this.onSubmit}
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
}

export default Login;
