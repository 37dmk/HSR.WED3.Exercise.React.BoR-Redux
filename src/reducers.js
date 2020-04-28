import { combineReducers } from "redux";

const initialTransactionsState = {
  entries: null,
  isLoading: false,
  error: null,
};

function transactions(state = initialTransactionsState, action) {
  switch (action.type) {
    case "FETCH_TRANS_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_TRANS_SUCCESS":
      return { ...state, isLoading: false, entries: action.transactions };
    case "FETCH_TRANS_FAIL":
      return { ...state, isLoading: false, error: action.error };
    default:
      return state;
  }
}

const initialFilterState = {
  itemsPerPage: 10,
  transactions: undefined,
  filterByMonth: undefined,
  filterByYear: undefined,
  skip: 0,
  total: 0,
}

function filters(state = initialFilterState, action) {
  switch (action.type) {
    case "SET_BY_YEAR":
      return { ...state, filterByYear: action.filterByYear};
    case "SET_BY_BOTH":
      return { ...state, filterByYear: action.filterByYear, filterByMonth: action.filterByMonth};
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

function getInitialAuthenticationState() {
  const token = sessionStorage.getItem("token");
  const user = sessionStorage.getItem("user");
  if (token && user) {
    return {
      isAuthenticated: true,
      token,
      user: JSON.parse(user),
    };
  } else {
    return {
      isAuthenticated: false,
      token: undefined,
      user: undefined,
    };
  }
}

function authentication(state = getInitialAuthenticationState(), action) {
  switch (action.type) {
    case "AUTHENTICATION_SUCCEEDED":
      return {
        ...state, // Not necessary because we set all properties, but a
        // precaution should we later add more properties to this state slice.
        isAuthenticated: true,
        token: action.token,
        user: action.user,
      };
    case "SIGNOUT":
      return {
        ...state,
        isAuthenticated: false,
        token: undefined,
        user: undefined,
      };
    default:
      return state;
  }
}

const reducers = combineReducers({
  transactions,
  user,
  authentication,
  filters,
  // balance,
});

export default reducers;

// Selectors:

export function getTransactions(state) {
  return state.transactions.entries;
}

export function getUser(state) {
  return state.user.user;
}

export function getFilterByMonth(state) {
  return state.filters.filterByMonth;
}

export function getFilterByYear(state) {
  return state.filters.filterByYear;
}

export function getItemsPerPage(state) {
  return state.filters.itemsPerPage;
}

export function getSkip(state) {
  return state.filters.skip;
}

export function getTotal(state) {
  return state.filters.total;
}

export function getBalance(state) {
  return state.user.balance;
}

export function isLoadingTransactions(state) {
  return state.transactions.isLoading;
}

export function getTransactionLoadingError(state) {
  return state.transactions.error;
}