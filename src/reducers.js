import { combineReducers } from "redux";

const initialState = {
  entries: null,
  isLoading: false,
  error: null,
};

function transactions(state = initialState, action) {
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

const reducers = combineReducers({
  transactions,
});

export default reducers;
