import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Container, Button, Form } from 'react-bootstrap';
import Logo from './assets/Logo5.png';
import 'bootstrap/dist/css/bootstrap.min.css';

class Header extends Component {
  state = {
    showClient: false,
    showMarcacoes: false,
    showPrestacoes: false,
    isLoggedIn: false,
    username: '',
    password: '',
    users:[]
  };
  componentDidMount() {
    this.buscarUsers();
    

}
    // Método para buscar os Clientes da API
    buscarUsers = () => {
      let url = 'https://api.sheety.co/1e2a5eeec0d760ba3c1d396e48fc8e4b/login/login';
      fetch(url)
          .then((response) => response.json())
          .then(data => {
              if (data && data.login) {
                  console.log(data); // Adicione este console.log para visualizar os dados retornados pela API

                  // Atualiza o estado do componente com os dados dos Clientes recebidos da API
                  this.setState({ users: data.login });
              }
          })
          .catch(error => {
              console.error('Erro ao buscar os dados dos Clientes:', error);
          });
  } 
  handleLoginClick = () => {
    const { username, password, users } = this.state;

    // Verifica se o username e a senha correspondem a algum usuário no array
    const isValidLogin = users.some(user => user.username === username && user.password === password);

    if (isValidLogin) {
      this.setState({
        showMarcacoes: true,
        showClient: true,
        showPrestacoes: true,
        isLoggedIn: true,
      });
    } else {
      // Handle login inválido
      console.error('Login failed');
    }
  };

  handleLogout = () => {
    this.setState({
      showMarcacoes: false,
      showClient: false,
      showPrestacoes: false,
      isLoggedIn: false,
    });
  };

  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  login = () => {
    return (
      <Form onSubmit={this.handleLoginClick}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            name="username"
            onChange={this.handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            onChange={this.handleInputChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    );
  };

render() {
    const { showClient, showMarcacoes, showPrestacoes, isLoggedIn } = this.state;

    return (
      <header className="py-3 mb-4 border-bottom" style={{ background: '#002d72' }}>
        <Container className="d-flex flex-wrap align-items-center justify-content-between">
          <Link to="/" className="d-flex align-items-center mb-2 mb-md-0 text-decoration-none">
            <img src={Logo} alt="Logo" width="105" height="70" className="me-2" />
          </Link>

          <Nav className="col-12 col-md-auto mb-2 justify-content-center mb-md-0">
            <Nav.Item>
              <Nav.Link as={Link} to="/" className="nav-link px-2 link-light fs-5">Home</Nav.Link>
            </Nav.Item>
            {showClient && (
              <Nav.Item>
                <Nav.Link as={Link} to="/clientes" className="nav-link px-2 link-light fs-5">Clientes</Nav.Link>
              </Nav.Item>
            )}
            {showMarcacoes && (
              <Nav.Item>
                <Nav.Link as={Link} to="/marcar" className="nav-link px-2 link-light fs-5">Marcações</Nav.Link>
              </Nav.Item>
            )}
            {showPrestacoes && (
              <Nav.Item>
                <Nav.Link as={Link} to="/prestacao" className="nav-link px-2 link-light fs-5">Prestações</Nav.Link>
              </Nav.Item>
            )}
            <Nav.Item>
              <Nav.Link as={Link} to="/sobre" className="nav-link px-2 link-light fs-5">About</Nav.Link>
            </Nav.Item>
          </Nav>
          <div className="col-md-3 text-md-end">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button
                variant="outline-light"
                className="me-2"
                onClick={isLoggedIn ? this.handleLogout : this.handleLoginClick}
              >
                {isLoggedIn ? 'Logout' : 'Login'}
              </Button>
            </Link>
          </div>
        </Container>
      </header >
    );
  }
}

export default Header;