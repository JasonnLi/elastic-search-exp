import * as React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { connect } from "react-redux";
import * as PropTypes from "prop-types";

const PrivateRoute = ({component: Component, auth, ...rest}: {
  [index: string]: any;
}) => (
  <Route
    {...rest}
    render={(props) =>
      auth.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/plays/login" />
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};
const mapStateToProps = (state: { auth: any; }) => ({
  auth: state.auth
});
export default connect(mapStateToProps)(PrivateRoute);
