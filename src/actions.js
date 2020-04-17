import * as api from "./api";

export function fetchTransactions(token) {
  return (dispatch) => {
    dispatch({ type: "FETCH_TRANSACTIONS_STARTED" });

    return api
      .getTransactions(token)
      .then(({ result: transactions }) => {
        dispatch({ type: "FETCH_TRANSACTIONS_SUCCEEDED", transactions });
      })
      .catch((error) => dispatch({ type: "FETCH_TRANSACTIONS_FAILED", error }));
  };
}
