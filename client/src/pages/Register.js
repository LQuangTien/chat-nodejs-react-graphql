import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

const Register = () => {
  const [variables, setVariables] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log(variables);
  };
  return (
    <div>
      <Row className="bg-white p-5 justify-content-center shadow">
        <Col sm={8} md={6} lg={4}>
          <h1 className="text-center">Register</h1>
          <Form onSubmit={handleRegisterSubmit}>
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                value={variables.email}
                onChange={(e) =>
                  setVariables({ ...variables, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={variables.username}
                onChange={(e) =>
                  setVariables({ ...variables, username: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={variables.password}
                onChange={(e) =>
                  setVariables({ ...variables, password: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={variables.confirmPassword}
                onChange={(e) =>
                  setVariables({
                    ...variables,
                    confirmPassword: e.target.value
                  })
                }
              />
            </Form.Group>
            <div className="text-center">
              <Button variant="success" type="submit">
                Register
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
