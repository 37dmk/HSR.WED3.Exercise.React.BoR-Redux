import React from "react";
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

class Dashboard extends React.Component {
  state = {
    user: undefined,
    transactions: undefined,
    amount: undefined
  };

  fetchAccountDetails = () => {
    const { token } = this.props;
    getAccountDetails(token).then(({ amount, owner: user }) =>
      this.setState({ user, amount })
    );
  };

  fetchTransactions = () => {
    const { token } = this.props;
    getTransactions(token).then(({ result: transactions }) =>
      this.setState({ transactions })
    );
  };

  handleSubmit = (target: AccountNr, amount) => {
    return transfer(target, amount, this.props.token).then(result => {
      // Transfer succeeded, we just re-fetch the account details
      // instead of calculating the balance ourselves
      this.fetchAccountDetails();
      // same for the transactions
      this.fetchTransactions();
      return result; // to the caller, i.e., TransferFunds
    });
  };

  isValidTargetAccount = (accountNr: AccountNr) => {
    return getAccount(accountNr, this.props.token).then(
      result => true,
      failure => false
    );
  };

  render() {
    const { user, transactions, amount } = this.state;
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
                isValidTargetAccount={this.isValidTargetAccount}
                onSubmit={this.handleSubmit}
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
}

export default Dashboard;
