import React, { useEffect } from "react";
import {
  Button,
  Grid,
  Header,
  Dimmer,
  Loader,
  Segment,
} from "semantic-ui-react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { fetchTransactions, fetchAccountDetails, transfer } from "../actions";

import TransferFundsForm from "../components/TransferFundsForm";
import TransactionsTable from "../components/TransactionsTable";

import { getAccount } from "../api";

function Dashboard({
  token,
  user,
  balance,
  transactions /* from mapStateToProps */,
  isLoading /* from mapStateToProps */,
  error /* from mapStateToProps */,
  dispatch /* from connect */,
}) {
  const isValidTargetAccount = (accountNr) => {
    return getAccount(accountNr, token).then(
      (result) => true,
      (failure) => false
    );
  };

  const handleSubmit = (target, amount) => {
    dispatch(transfer(target, amount, token));
  };

  useEffect(() => {
    if (!user) {
      dispatch(fetchAccountDetails(token));
    }
  }, [dispatch, token, user]);

  useEffect(() => {
    if (!transactions) {
      dispatch(fetchTransactions(token));
    }
  }, [dispatch, token, transactions]);

  if (!user || !transactions || isLoading) {
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
              balance={balance}
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

const mapStateToProps = (state) => {
  return {
    transactions: state.transactions.entries,
    user: state.user.user,
    balance: state.user.balance,
    isLoading: state.transactions.isLoading,
    error: state.transactions.error,
  };
};

export default connect(mapStateToProps)(Dashboard);
