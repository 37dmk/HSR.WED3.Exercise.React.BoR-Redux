import React, { useEffect } from "react";
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
  fetchTransactionsFiltered,
  fetchAccountDetails,
  fetchTransactions,
} from "../actions";
import {
  getTransactionLoadingError,
  getUser,
  getTransactions,
  getFilterByMonth,
  getFilterByYear,
  getItemsPerPage,
  getSkip,
  getTotal,
} from "../reducers";


import { YearDropdown } from "../components/YearDropdown";
import { MonthDropdown } from "../components/MonthDropdown";
import { PaginatedTransactionsTable } from "../components/PaginatedTransactionsTable";

// TODO: 'Transactions' have to be in Redux-State too
function Transactions({
  token,
  user,
  transactions,
  itemsPerPage,
  filterByMonth,
  filterByYear,
  skip,
  total,
  error,
}) {
  /*  
  itemsPerPage = 10;

  state = {
    transactions: undefined,
    filterByMonth: undefined,
    filterByYear: undefined,
    skip: 0,
    total: 0
  };

  fetchTransactions = () => {
    fetchTransactionsFiltered(this.props, this.state, this.itemsPerPage);
  }
  */

  useEffect(() => {
    if (!user) {
      fetchAccountDetails(token);
    }
  }, [fetchAccountDetails, token, user]);

  useEffect(() => {
    if (!transactions) {
      fetchTransactions(token);
    }
  }, [fetchTransactions, token, transactions]);


  const handleYearFilterChanged = (event, { value }) => {
    fetchTransactionsFiltered(token, { filterByYear: value, skip: 0 }, itemsPerPage);
    // this.setState({ filterByYear: value, skip: 0 }, this.fetchTransactions);
  };

  const handleMonthFilterChanged = (event, { value }) => {
    fetchTransactionsFiltered(token, { filterByMonth: value, skip: 0 }, itemsPerPage);
    // this.setState({ filterByMonth: value, skip: 0 }, this.fetchTransactions);
  };

  const handleClearFilters = () => {
    fetchTransactionsFiltered(token, { filterByMonth: undefined, filterByYear: undefined }, itemsPerPage);
    // this.setState( { filterByMonth: undefined, filterByYear: undefined }, this.fetchTransactionsc);
  };

  /*
  render() {
    const { user } = this.props;
    const {
      transactions,
      filterByMonth,
      filterByYear,
      skip,
      total
    } = this.state;
    */

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
                onChange={handleYearFilterChanged}
              />
            </Grid.Column>
            <Grid.Column width={7}>
              <MonthDropdown
                onChange={handleMonthFilterChanged}
                value={filterByMonth}
              />
            </Grid.Column>
            <Grid.Column width={1}>
              <Button fluid icon="remove" onClick={handleClearFilters} />
            </Grid.Column>
          </Grid>
          {transactions.length > 0 ? (
            <PaginatedTransactionsTable
              user={user}
              transactions={transactions}
              skip={skip}
              total={total}
              onBack={
                fetchTransactionsFiltered(
                  token,
                  filterByYear,
                  filterByMonth,
                  (skip - itemsPerPage),
                  itemsPerPage
                )
                // use fetchTransactionsFiltered
                /*
                () =>
                this.setState(
                  { skip: skip - this.itemsPerPage },
                  this.fetchTransactions
                )
                */
              }
              onForward={
                fetchTransactionsFiltered(
                  token,
                  filterByYear,
                  filterByMonth,
                  (skip + itemsPerPage),
                  itemsPerPage
                )
                /*
                () =>
                this.setState(
                  { skip: skip + this.itemsPerPage },
                  this.fetchTransactions
                )
                */
              }
            />
          ) : (
            <p>In diesem Zeitraum wurden keine Transaktionen getätigt</p>
          )}
        </Segment>
      </Segment.Group>
    );
  // }
}

const mapStateToProps = (state) => {
  return {
    user: getUser(state),
    transactions: getTransactions(state),
    filterByMonth: getFilterByMonth(state),
    filterByYear: getFilterByYear(state),
    itemsPerPage: getItemsPerPage(state),
    skip: getSkip(state),
    total: getTotal(state),
    error: getTransactionLoadingError(state),
  };
};

const mapDispatchToProps = {
  fetchTransactionsFiltered,
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
