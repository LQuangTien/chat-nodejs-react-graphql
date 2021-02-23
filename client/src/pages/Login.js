import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;
const Login = (props) => {
  const [variables, setVariables] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onCompleted(data) {
      const { login } = data;
      localStorage.setItem('token', login.token);
      props.history.push('/');
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    }
  });
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loginUser({ variables });
  };
  return (
    <div>
      <Row className="bg-white p-5 justify-content-center shadow">
        <Col sm={8} md={6} lg={4}>
          <h1 className="text-center">Login</h1>
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group>
              <Form.Label className={errors.username && 'text-danger'}>
                {errors.username || 'Username'}
              </Form.Label>
              <Form.Control
                value={variables.username}
                className={errors.username && 'is-invalid'}
                onChange={(e) =>
                  setVariables({ ...variables, username: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className={errors.password && 'text-danger'}>
                {errors.password || 'Password'}
              </Form.Label>
              <Form.Control
                type="password"
                value={variables.password}
                className={errors.password && 'is-invalid'}
                onChange={(e) =>
                  setVariables({ ...variables, password: e.target.value })
                }
              />
            </Form.Group>
            <div className="text-center">
              <Button variant="success" type="submit" disabled={loading}>
                {loading ? 'Loading ...' : 'Login'}
              </Button>
              <div>
                <small>
                  Don't have an account ? <Link to="/register">Register</Link>
                </small>
              </div>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
