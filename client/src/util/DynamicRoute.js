import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuthState } from '../context/auth';
const DynamicRoute = (props) => {
  const { user } = useAuthState();
  if (props.authenticated && !user) {
    return <Redirect to="/login" />;
  } else if (props.guest && user) {
    return <Redirect to="/" />;
  }
  return <Route component={props.component} {...props} />;
};

export default DynamicRoute;
