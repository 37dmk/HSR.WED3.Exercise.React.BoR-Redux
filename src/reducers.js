import { combineReducers } from "redux";

const initialTransactionsState = {
  entries: null,
  isLoading: false,
  error: null,
};

function transactions(state = initialTransactionsState, action) {
  switch (action.type) {
    case "FETCH_TRANSACTIONS_STARTED":
      return { ...state, isLoading: true, error: null };
    case "FETCH_TRANSACTIONS_SUCCEEDED":
      return { ...state, isLoading: false, entries: action.transactions };
    case "FETCH_TRANSACTIONS_FAILED":
      return { ...state, isLoading: false, error: action.error };
    default:
      return state;
  }
}

const initialUserState = {
  balance: null,
  user: null,
  isLoading: false,
  error: null,
};

function user(state = initialUserState, action) {
  switch (action.type) {
    case "FETCH_ACCOUNT_DETAILS_STARTED":
      return { ...state, isLoading: true, error: null };
    case "FETCH_ACCOUNT_DETAILS_SUCCEEDED":
      return {
        ...state,
        isLoading: false,
        balance: action.balance,
        user: action.user,
      };
    case "FETCH_TRANSACTIONS_FAILED":
      return { ...state, isLoading: false, error: action.error };
    default:
      return state;
  }
}

const reducers = combineReducers({
  transactions,
  user,
});

export default reducers;
