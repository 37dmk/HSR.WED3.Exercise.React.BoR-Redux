import React from "react";
import { Button, Form, Message } from "semantic-ui-react";

class TransferFundsForm extends React.Component {
  state = {
    to: "",
    amount: 0,
    error: undefined,
    loading: false,
    isValid: true
  };

  handleSubmit = event => {
    event.preventDefault();
    const { to, amount } = this.state;
    this.setState({ loading: true });
    this.props
      .onSubmit(to, amount)
      .then(result => {
        this.setState({
          error: undefined,
          amount: 0,
          to: "",
          loading: false
        });
      })
      .catch(error =>
        this.setState({
          error: "Überprüfen Sie das Zielkonto.",
          loading: false
        })
      );
  };

  handleAccountChanged = event => {
    if (event.target instanceof HTMLInputElement) {
      const to = event.target.value;
      this.setState({ to });
      this.props
        .isValidTargetAccount(to)
        .then(ok => this.setState({ isValid: ok }));
    }
  };

  isValid = () => {
    return this.state.to && this.state.amount && this.state.amount > 0;
  };

  render() {
    const { accountNr, balance } = this.props;
    const { to, amount, error, loading, isValid } = this.state;
    return (
      <Form onSubmit={this.handleSubmit} error={!!error}>
        <Form.Select
          label="Von"
          options={[{ text: `${accountNr} (CHF ${balance})`, value: 0 }]}
          value={0}
        />
        <Form.Input
          error={!isValid}
          label="Nach"
          placeholder="Zielkontonummer"
          value={to}
          onChange={this.handleAccountChanged}
        />
        <Form.Input
          label="Betrag"
          placeholder="Betrag"
          type="number"
          value={amount}
          onChange={event => this.setState({ amount: event.target.value })}
        />
        <Message error header="Überweisung fehlgeschlagen" content={error} />
        <Button
          loading={loading}
          primary
          fluid
          disabled={!this.isValid()}
          type="submit"
        >
          Betrag Überweisen
        </Button>
      </Form>
    );
  }
}

export default TransferFundsForm;
