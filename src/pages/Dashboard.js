import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Header,
  Dimmer,
  Loader,
  Segment
} from "semantic-ui-react";
import { Link } from "react-router-dom";

import TransferFundsForm from "../components/TransferFundsForm";
import TransactionsTable from "../components/TransactionsTable";

import {
  getAccountDetails,
  getAccount,
  transfer,
  getTransactions
} from "../api";

function Dashboard({ token }) {
  const [user, setUser] = useState(undefined);
  const [transactions, setTransactions] = useState(undefined);
  const [amount, setAmount] = useState(undefined);

  const isValidTargetAccount = accountNr => {
    return getAccount(accountNr, token).then(
      result => true,
      failure => false
    );
  };

  const handleSubmit = (target, amount) => {
    transfer(target, amount, token).then(result => {
      // Transfer succeeded, we just re-fetch the account details
      // instead of calculating the balance ourselves
      getAccountDetails(token).then(({ amount, owner: user }) => {
        setUser(user);
        setAmount(amount);
      });
      // same for the transactions
      getTransactions(token).then(({ result: transactions }) =>
        setTransactions(transactions)
      );
    });
  };

  useEffect(() => {
    if (!user) {
      getAccountDetails(token).then(({ amount, owner: user }) => {
        setUser(user);
        setAmount(amount);
      });
    }
  }, [token, user]);

  useEffect(() => {
    if (!transactions) {
      getTransactions(token).then(({ result: transactions }) =>
        setTransactions(transactions)
      );
    }
  }, [token, transactions]);

  if (!user || !transactions) {
    return (
      <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
    );
  }
  return (
    <Segment.Group>
      <Segment>
        <Header as="h1">Kontoübersicht {user.accountNr}</Header>
      </Segment>
      <Segment>
        <Grid>
          <Grid.Column width={6}>
            <Header as="h3" content="Neue Zahlung" />
            <TransferFundsForm
              accountNr={user.accountNr}
              balance={amount}
              isValidTargetAccount={isValidTargetAccount}
              onSubmit={handleSubmit}
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Header as="h3" content="Letzte Zahlungen" />
            <TransactionsTable
              user={user}
              transactions={transactions}
            ></TransactionsTable>
            <Button floated="right" as={Link} to={"/transactions"}>
              Alle Transaktionen anzeigen
            </Button>
          </Grid.Column>
        </Grid>
      </Segment>
    </Segment.Group>
  );
}

export default Dashboard;
