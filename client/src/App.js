import './App.scss';
import { Container } from 'react-bootstrap';
import Register from './pages/Register';
import ApolloProvider from './ApolloProvider';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import { AuthProvider } from './context/auth';
import DynamicRoute from './util/DynamicRoute';
function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <BrowserRouter>
          <Container className="pt-5">
            <Switch>
              <DynamicRoute path="/register" exact component={Register} guest />
              <DynamicRoute path="/login" exact component={Login} guest />
              <DynamicRoute path="/" exact component={Home} authenticated />
            </Switch>
          </Container>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
