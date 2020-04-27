import React from "react";
import {
  Grid,
  Header,
  Dimmer,
  Loader,
  Segment,
  Button
} from "semantic-ui-react";

import { connect } from "react-redux";
import {
  fetchTransactionsFiltered
} from "../actions";

import { YearDropdown } from "../components/YearDropdown";
import { MonthDropdown } from "../components/MonthDropdown";
import { PaginatedTransactionsTable } from "../components/PaginatedTransactionsTable";

// TODO: 'Transactions' have to be in Redux-State too
class Transactions extends React.Component {
  itemsPerPage = 10;

  state = {
    transactions: undefined,
    filterByMonth: undefined,
    filterByYear: undefined,
    skip: 0,
    total: 0
  };

  componentDidMount() {
    const { transactions } = this.state;
    if (!transactions) {
      this.fetchTransactions();
    }
  }

  fetchTransactions = () => {
    fetchTransactionsFiltered(this.props, this.state, this.itemsPerPage);
  }

  handleYearFilterChanged = (event, { value }) => {
    fetchTransactionsFiltered(this.props, { filterByYear: value, skip: 0 }, this.itemsPerPage);
    // this.setState({ filterByYear: value, skip: 0 }, this.fetchTransactions);
  };

  handleMonthFilterChanged = (event, { value }) => {
    fetchTransactionsFiltered(this.props, { filterByMonth: value, skip: 0 }, this.itemsPerPage);
    // this.setState({ filterByMonth: value, skip: 0 }, this.fetchTransactions);
  };

  handleClearFilters = () => {
    fetchTransactionsFiltered(this.props, { filterByMonth: undefined, filterByYear: undefined }, this.itemsPerPage);
    // this.setState( { filterByMonth: undefined, filterByYear: undefined }, this.fetchTransactionsc);
  };

  render() {
    const { user } = this.props;
    const {
      transactions,
      filterByMonth,
      filterByYear,
      skip,
      total
    } = this.state;

    if (!transactions) {
      return (
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      );
    }

    return (
      <Segment.Group>
        <Segment>
          <Header as="h1">
            All Transaktionen des Accounts {user.accountNr}
          </Header>
        </Segment>
        <Segment>
          <Grid>
            <Grid.Column width={8}>
              <YearDropdown
                value={filterByYear}
                onChange={this.handleYearFilterChanged}
              />
            </Grid.Column>
            <Grid.Column width={7}>
              <MonthDropdown
                onChange={this.handleMonthFilterChanged}
                value={filterByMonth}
              />
            </Grid.Column>
            <Grid.Column width={1}>
              <Button fluid icon="remove" onClick={this.handleClearFilters} />
            </Grid.Column>
          </Grid>
          {transactions.length > 0 ? (
            <PaginatedTransactionsTable
              user={user}
              transactions={transactions}
              skip={skip}
              total={total}
              onBack={() =>
                this.setState(
                  { skip: skip - this.itemsPerPage },
                  this.fetchTransactions
                )
              }
              onForward={() =>
                this.setState(
                  { skip: skip + this.itemsPerPage },
                  this.fetchTransactions
                )
              }
            />
          ) : (
            <p>In diesem Zeitraum wurden keine Transaktionen getätigt</p>
          )}
        </Segment>
      </Segment.Group>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    transactions: state.transactions,
    amount: state.amount,
  };
};

const mapDispatchToProps = {
  fetchTransactionsFiltered,
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
