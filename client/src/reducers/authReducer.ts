import { SET_CURRENT_USER, USER_LOADING } from "../actions/types";
import isEmpty = require("is-empty")

const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false,
};

// If no action taken in the react component, it will return current state as default status
// Reducer is capturing the action dispatched by the actions taken in authentication actions
export default function (state = initialState, action: any) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
