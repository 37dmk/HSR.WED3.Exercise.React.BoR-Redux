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
  setFilterYear,
  setFilterMonth,
  setFilterSkip,
  setFilterItems,
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

function Transactions({
  token,
  user,
  transactions,
  itemsPerPage,
  filterByMonth,
  filterByYear,
  skip,
  total,
  fetchAccountDetails,
  fetchTransactionsFiltered,
  setFilterYear,
  setFilterMonth,
  setFilterSkip,
  setFilterItems,
  error,
}) {
  useEffect(() => {
    if (!user) {
      fetchAccountDetails(token);
    }
  }, [fetchAccountDetails, token, user]);

  useEffect(() => {
    if (!transactions) {
      fetchTransactionsFiltered(token);
    }
  }, [fetchTransactionsFiltered, token, transactions]);


  const handleYearFilterChanged = (evt, { value }) => {
    setFilterYear( value );
    fetchTransactionsFiltered(token, value, filterByMonth, skip, itemsPerPage);
  };

  const handleMonthFilterChanged = (evt, { value }) => {
    setFilterMonth(value);
    fetchTransactionsFiltered(token, filterByYear, value, skip, itemsPerPage);
  };

  const handleClearFilters = () => {
    setFilterYear(undefined);
    setFilterMonth(undefined);
    setFilterSkip(0);
    setFilterItems(10);
    fetchTransactionsFiltered(token, undefined, undefined, 0, 10);
  };

  // Does not get executed at all
  const handleSkipBack = () => {
    skip -= itemsPerPage;
    setFilterSkip(skip);
    fetchTransactionsFiltered(token, filterByYear, filterByMonth, skip, itemsPerPage);
  }

  // Does not get executed at all
  const handleSkipForward = () => {
    skip -= itemsPerPage;
    setFilterSkip(skip);
    fetchTransactionsFiltered(token, filterByYear, filterByMonth, skip, itemsPerPage);
  }

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
            // NOT WORKING
            onBack={handleSkipBack}
            // NOT WORKING
            onForward={handleSkipForward}
          />
        ) : (
          <p>In diesem Zeitraum wurden keine Transaktionen getätigt</p>
        )}
      </Segment>
    </Segment.Group>
  );
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
  fetchAccountDetails,
  fetchTransactionsFiltered,
  setFilterYear,
  setFilterMonth,
  setFilterSkip,
  setFilterItems,
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
