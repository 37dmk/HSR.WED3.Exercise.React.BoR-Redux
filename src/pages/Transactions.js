import React from "react";
import {
  Grid,
  Header,
  Dimmer,
  Loader,
  Segment,
  Dropdown,
  Button,
  Menu,
  Icon
} from "semantic-ui-react";
import Moment from "moment";

import TransactionsTable from "../components/TransactionsTable";

import { getTransactions } from "../api";

const currentYear = new Date().getFullYear();

const yearOptions = [currentYear - 2, currentYear - 1, currentYear].map(y => ({
  value: y,
  text: y
}));

const monthOptions = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember"
].map((m, i) => ({ value: i + 1, text: m }));

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
    const { token } = this.props;
    const { filterByYear, filterByMonth, skip } = this.state;

    let fromDate = "";
    let toDate = "";

    if (filterByYear && filterByMonth) {
      fromDate = Moment(
        `01-${filterByMonth}-${filterByYear}`,
        "D-M-YYYY"
      ).toISOString();
      toDate = Moment(
        `31-${filterByMonth}-${filterByYear}`,
        "D-M-YYYY"
      ).toISOString();
    } else if (filterByYear) {
      fromDate = Moment(`01-01-${filterByYear}`, "D-M-YYYY").toISOString();
      toDate = Moment(`31-12-${filterByYear}`, "D-M-YYYY").toISOString();
    }

    getTransactions(
      token,
      fromDate,
      toDate,
      this.itemsPerPage,
      skip
    ).then(({ result: transactions, query: { resultcount } }) =>
      this.setState({ transactions, total: resultcount })
    );
  };

  handleYearFilterChanged = (event, { value }) => {
    this.setState({ filterByYear: value, skip: 0 }, this.fetchTransactions);
  };

  handleMonthFilterChanged = (event, { value }) => {
    this.setState({ filterByMonth: value, skip: 0 }, this.fetchTransactions);
  };

  handleClearFilters = () => {
    this.setState(
      { filterByMonth: undefined, filterByYear: undefined },
      this.fetchTransactions
    );
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
              <Dropdown
                onChange={this.handleYearFilterChanged}
                value={filterByYear}
                placeholder="Nach Jahr Filtern"
                fluid
                search
                selection
                options={yearOptions}
              />
            </Grid.Column>
            <Grid.Column width={7}>
              <Dropdown
                onChange={this.handleMonthFilterChanged}
                value={filterByMonth}
                placeholder="Nach Monat Filtern"
                fluid
                search
                selection
                options={monthOptions}
              />
            </Grid.Column>
            <Grid.Column width={1}>
              <Button fluid icon="remove" onClick={this.handleClearFilters} />
            </Grid.Column>
          </Grid>
          {transactions.length > 0 ? (
            <TransactionsTable user={user} transactions={transactions}>
              <Menu floated="right" pagination>
                <Menu.Item
                  as={Button}
                  disabled={skip === 0}
                  icon
                  onClick={() =>
                    this.setState(
                      { skip: skip - this.itemsPerPage },
                      this.fetchTransactions
                    )
                  }
                >
                  <Icon name="left chevron" />
                </Menu.Item>
                <Menu.Item disabled>
                  Transaktionen {skip + 1} bis {skip + transactions.length} von{" "}
                  {total}
                </Menu.Item>
                <Menu.Item
                  as={Button}
                  disabled={skip + transactions.length >= total}
                  icon
                  onClick={() =>
                    this.setState(
                      { skip: skip + this.itemsPerPage },
                      this.fetchTransactions
                    )
                  }
                >
                  <Icon name="right chevron" />
                </Menu.Item>
              </Menu>
            </TransactionsTable>
          ) : (
            <p>In diesem Zeitraum wurden keine Transaktionen getätigt</p>
          )}
        </Segment>
      </Segment.Group>
    );
  }
}

export default Transactions;
