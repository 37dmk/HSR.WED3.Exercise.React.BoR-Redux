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

export function fetchAccountDetails(token) {
  return (dispatch) => {
    dispatch({ type: "FETCH_ACCOUNT_DETAILS_STARTED" });

    return api
      .getAccountDetails(token)
      .then(({ amount: balance, owner: user }) => {
        dispatch({ type: "FETCH_ACCOUNT_DETAILS_SUCCEEDED", balance, user });
      })
      .catch((error) =>
        dispatch({ type: "FETCH_ACCOUNT_DETAILS_FAILED", error })
      );
  };
}

export function transfer(target, amount, token) {
  return (dispatch) => {
    api.transfer(target, amount, token).then((result) => {
      // Transfer succeeded, we just re-fetch the account details
      // instead of calculating the balance ourselves
      fetchAccountDetails(token)(dispatch);
      fetchTransactions(token)(dispatch);
    });
  };
}
