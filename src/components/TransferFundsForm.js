import React, { useState, useEffect } from "react";
import { Button, Form, Message } from "semantic-ui-react";

function TransferFundsForm({
  accountNr,
  balance,
  onSubmit,
  isValidTargetAccount
}) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(true);

  const handleSubmit = event => {
    event.preventDefault();
    setLoading(true);
    onSubmit(to, amount);
  };

  const handleAccountChanged = event => {
    const to = event.target.value;
    setTo(to);
    isValidTargetAccount(to).then(setValid);
  };

  /* This replacted the componentDidUpdate implementation to reset the form when the balance changes. It also runs on mount, which is wasteful but not incorrect. */

  useEffect(() => {
    setError(undefined);
    setAmount(0);
    setTo("");
    setLoading(false);
  }, [balance]);

  const isComplete = to && amount && amount > 0;

  return (
    <Form onSubmit={handleSubmit} error={!!error}>
      <Form.Select
        label="Von"
        options={[{ text: `${accountNr} (CHF ${balance})`, value: 0 }]}
        value={0}
      />
      <Form.Input
        error={!valid}
        label="Nach"
        placeholder="Zielkontonummer"
        value={to}
        onChange={handleAccountChanged}
      />
      <Form.Input
        label="Betrag"
        placeholder="Betrag"
        type="number"
        value={amount}
        onChange={event => setAmount(event.target.value)}
      />
      <Message error header="Überweisung fehlgeschlagen" content={error} />
      <Button
        loading={loading}
        primary
        fluid
        disabled={!isComplete}
        type="submit"
      >
        Betrag Überweisen
      </Button>
    </Form>
  );
}

export default TransferFundsForm;
