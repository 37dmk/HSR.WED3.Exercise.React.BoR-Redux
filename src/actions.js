import * as api from "./api";
import Moment from "moment";


// reducer for transactions
export function fetchTransactions(token) {
  return (dispatch) => {
    dispatch({ type: "FETCH_TRANS_START" });
    return api.getTransactions(token)
      .then(({ result: transactions }) => {
        dispatch({ type: "FETCH_TRANS_SUCCESS", transactions });
      })
      .catch((error) => dispatch({ type: "FETCH_TRANS_FAIL", error }));
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

export function authenticate(login, password) {
  return (dispatch) => {
    return api.login(login, password).then(({ token, owner }) => {
      dispatch({ type: "AUTHENTICATION_SUCCEEDED", token, user: owner });
      // TODO: handle token in Redux
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(owner));
    });
  };
}

export function signout(callback) {
  return (dispatch) => {
    dispatch({ type: "SIGNOUT" });
    // TODO: handle token in Redux
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };
}





// EXCERCISE RESULTS! DO NOT DELETE!
export function fetchTransactionsFiltered(token, filterByYear, filterByMonth, skip, itemsPerPage) {
  let fromDate = "";
  let toDate = "";

  // somehow i never get into the if statement
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

  return (dispatch) => {
    dispatch({type: "FETCH_TRANS_START"});
    return api.getTransactions(
        token,
        fromDate,
        toDate,
        itemsPerPage,
        skip,
      ).then(({ result: transactions }) => {
        dispatch({type: "FETCH_TRANS_SUCCESS", transactions})
      }).catch(
        (error) => dispatch({type: "FETCH_TRANS_FAIL", error})
      );
  }
}

export function setFilterYear(filterByYear){
  return (dispatch)=>{
    dispatch({type: "SET_YEAR", filterByYear});
  }
}

export function setFilterMonth(filterByMonth){
  return (dispatch)=>{
    dispatch({type: "SET_MONTH", filterByMonth});
  }
}

export function setFilterSkip(skip){
  return (dispatch)=>{
    dispatch({type: "SET_SKIP", skip});
  }
}

export function setFilterItems(itemsPerPage){
  return (dispatch)=>{
    dispatch({type: "SET_ITEMS", itemsPerPage});
  }
}
