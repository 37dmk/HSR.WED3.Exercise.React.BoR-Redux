import React from "react";
import { Table } from "semantic-ui-react";
import Moment from "moment";

function TransactionsTable({ transactions, user, children }) {
  return (
    <Table definition>
      <Table.Header>
        <Table.Row textAlign="right">
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell textAlign="left">Von</Table.HeaderCell>
          <Table.HeaderCell textAlign="left">Nach</Table.HeaderCell>
          <Table.HeaderCell>Betrag</Table.HeaderCell>
          <Table.HeaderCell>Saldo</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {transactions.map(({ from, target, amount, total, date }, index) => {
          const momentDate = Moment(date).format("D.M.YYYY");
          const kind = from === user.accountNr ? "Belastung" : "Gutschrift";
          return (
            <Table.Row key={index}>
              <Table.Cell textAlign="left">
                {momentDate} &ndash; {kind}
              </Table.Cell>
              <Table.Cell textAlign="left">{from}</Table.Cell>
              <Table.Cell textAlign="left">{target}</Table.Cell>
              <Table.Cell textAlign="right">{amount}.00 CHF</Table.Cell>
              <Table.Cell textAlign="right">{total}.00 CHF</Table.Cell>
            </Table.Row>
          );
        })}
        {children && (
          <Table.Row>
            <Table.Cell colSpan="5">{children}</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
}

export default TransactionsTable;
