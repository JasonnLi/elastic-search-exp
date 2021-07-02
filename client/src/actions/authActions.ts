import * as jwt_decode from "jwt-decode";
import UserApi, { IUser, ILoginRequest } from "../services/UserApi";
import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from "./types";
// import setAuthToken from "../utils/setAuthToken";

export interface IUserToken {
  id: string;
  name: string;
  exp: number;
}

// Register User
export const registerUser = (userData: IUser, history: any) => (
  dispatch: any
) => {
  UserApi.createUser(userData)
    .then((res) => history.push("/plays/login"))
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err,
      });
    });
};

// Login - get user token
export const userLogin = (userData: ILoginRequest, history: any) => (dispatch: any) => {
  UserApi.login(userData)
    .then((res) => {
      // Save to localStorage
      // Set token to localStorage, it can be used for testing. In real case, it is not safe to save the token in local storrage
      const token = res.token;
      console.log(token);
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      // setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode<IUserToken>(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
      history.push("/plays")
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err,
      });
    });
};

// Set logged in user
export const setCurrentUser = (decoded: any) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING,
  };
};

// Log user out
export const userLogout = () => (dispatch: any) => {
  // UserApi.logout();
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  // setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
