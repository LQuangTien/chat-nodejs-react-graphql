import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { gql, useMutation } from '@apollo/client';

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      username
      email
      createdAt
    }
  }
`;
const Register = (props) => {
  const [variables, setVariables] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, res) {
      props.history.push('/login');
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    }
  });
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    registerUser({ variables });
  };
  return (
    <div>
      <Row className="bg-white p-5 justify-content-center shadow">
        <Col sm={8} md={6} lg={4}>
          <h1 className="text-center">Register</h1>
          <Form onSubmit={handleRegisterSubmit}>
            <Form.Group>
              <Form.Label className={errors.email && 'text-danger'}>
                {errors.email || 'Email address'}
              </Form.Label>
              <Form.Control
                type="email"
                value={variables.email}
                className={errors.email && 'is-invalid'}
                onChange={(e) =>
                  setVariables({ ...variables, email: e.target.value })
                }
              />
            </Form.Group>
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
            <Form.Group>
              <Form.Label className={errors.confirmPassword && 'text-danger'}>
                {errors.confirmPassword || 'Confirm password'}
              </Form.Label>
              <Form.Control
                type="password"
                value={variables.confirmPassword}
                className={errors.confirmPassword && 'is-invalid'}
                onChange={(e) =>
                  setVariables({
                    ...variables,
                    confirmPassword: e.target.value
                  })
                }
              />
            </Form.Group>
            <div className="text-center">
              <Button variant="success" type="submit" disabled={loading}>
                {loading ? 'Loading ...' : 'Register'}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
