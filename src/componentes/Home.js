import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { Carousel, Image, Card, Modal, Form, FormGroup, FormLabel, FormControl, Button, } from 'react-bootstrap';

import carrossel1 from '../assets/carossel1.png';
import carrossel2 from '../assets/carossel2.png';
import carrossel3 from '../assets/carossel3.jpg';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      idTipo: 0,
      id: 0,
      tipo: '',
      preco: 0,
      imagem: '',
      prestacoes: [], // Updated state to store fetched "prestações"
      pedidos: [], // Updated state to store fetched "prestações"
      showModal: false,
      idCliente: 0,
      nome: '',
      email: '',
      telefone: '',
      opcao: '',
      data: ''
    };
  }

  componentDidMount() {
    this.buscarPrestacoes();
    this.buscarPedido();
  }

  buscarPrestacoes = () => {
    let url = 'https://api.sheety.co/1e2a5eeec0d760ba3c1d396e48fc8e4b/prestacao/prestacao';
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Resposta de rede não foi bem-sucedida');
        }
        return response.json();
      })
      .then(data => {
        console.log('Dados obtidos:', data);
        if (data && data.prestacao) {
          this.setState({ prestacoes: data.prestacao });
        }
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
      });
  };
  buscarPedido = () => {
    let url = 'https://api.sheety.co/1e2a5eeec0d760ba3c1d396e48fc8e4b/pedido/pedido';
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Resposta de rede não foi bem-sucedida');
        }
        return response.json();
      })
      .then(data => {
        console.log('Dados obtidos:', data);
        if (data && data.pedido) {
          this.setState({ pedidos: data.pedido });
        }
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
      });
  };

  cadastrarPedido = () => {
    const {
      nome,
      email,
      telefone,
      data,
      hora,
      tipo,
    } = this.state;
    
    const p = nome + ' ' + email + ' ' + telefone + ' ' + data + ' ' + hora + ' ' + tipo;
  
    let url = 'https://api.sheety.co/1e2a5eeec0d760ba3c1d396e48fc8e4b/pedido/pedido';
    
    const novoPedido = { pedido: p }; // Novo pedido a ser cadastrado
    
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pedido: novoPedido }) // Enviando um objeto com a chave "pedido" contendo o array com o novo pedido
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Erro ao cadastrar pedido');
      })
      .then(data => {
        console.log('Resposta da API após cadastrar pedido:', data);
        // Atualiza o estado 'pedidos' com o novo pedido adicionado
        this.setState(prevState => ({
          pedidos: [...prevState.pedidos, { ...novoPedido, id: data.pedido.id }]
        }));
      })
      .catch(error => {
        console.error('Erro ao cadastrar pedido:', error);
      });
  }
  
  
  Marcar = (id, tipo) => {
    this.setState({
      idTipo: id,
      tipo: tipo
    });

  };


  renderPrestacoes = () => {
    const { prestacoes } = this.state;

    const cards = prestacoes.map((prestacao, id) => (
      <Card style={{ width: '18rem' }} key={id}>
        <Card.Img variant="top" src={prestacao.imagem} />
        <Card.Body>
          <Card.Title>{prestacao.tipo}</Card.Title>
          <Card.Text>Preço: {prestacao.preco}€</Card.Text>
          <Button variant="primary" onClick={() => this.pedido(prestacao.tipo)}>
            Marcar
          </Button>

        </Card.Body>
      </Card>
    ));

    return (
      <div className="d-flex justify-content-around">
        {cards}
      </div>
    );
  };

  Carrossel = () => {
    return (
      <div>
        <Carousel className="carousel-dark">
          <Carousel.Item>
            <Image
              width={'100%'}
              height={'auto'}
              src={carrossel2}
              alt="Frist slide"
              fluid
            />
            <Carousel.Caption>
              <h5>Third slide label</h5>
              <p>
                Para as mulheres que procuram um olhar mais marcante, a extensão de pestanas é a opção certa.
              </p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <Image
              width={'100%'}
              height={'auto'}
              src={carrossel1}
              alt="Second slide"
              fluid
            />
            <Carousel.Caption>
              <h5>First slide label</h5>
              <p>
                Seja fio-a-fio ou o volume russo, o método consiste na aplicação de pestanas sintéticas e impermeáveis (fios de seda) sobre as pestanas naturais, preenchendo falhas e aumentando o seu volume.
              </p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <Image
              width={'100%'}
              height={'auto'}
              src={carrossel3}
              alt="Third slide"
              fluid
            />
            <Carousel.Caption>
              <h5>Third slide label</h5>
              <p>
                Para que o resultado fique o mais natural possível, os fios escolhidos têm tamanho, curvatura e espessura diferentes.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    );
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  renderForm = (tipo) => {
    const { nome, email, telefone, data, hora } = this.state;

    return (
      <div className="container">
        <Form>
          <FormGroup className="mb-3">
            <FormLabel>Nome:</FormLabel>
            <FormControl
              type="text"
              placeholder="Digite seu nome"
              name="nome"
              value={nome}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <FormLabel>Email:</FormLabel>
            <FormControl
              type="email"
              placeholder="Digite seu email"
              name="email"
              value={email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <FormLabel>Telefone:</FormLabel>
            <FormControl
              type="tel"
              placeholder="Digite seu telefone"
              name="telefone"
              value={telefone}
              onChange={this.handleChange}
            />
          </FormGroup>{/* Mapeie as prestações para criar opções no DropdownButton */}

          <FormGroup className="mb-3">
            <FormLabel>Prestação:</FormLabel>
            <FormControl
              type="text"
              value={tipo}
              disabled />
          </FormGroup>

          <FormGroup className="mb-3">
            <FormLabel>Escolha uma data:</FormLabel>
            <FormControl
              type="date"
              name="data"
              value={data}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <FormLabel>Escolha um horário:</FormLabel>
            <FormControl
              type="time"
              name="hora"
              value={hora}
              onChange={this.handleChange}
            />
          </FormGroup>

        </Form>
      </div>
    );

  }

  // Seu código importando módulos, definindo estados, funções e renderizando o conteúdo do componente Carrossel

  pedido = (tipo) => {
    this.setState({
      tipo: tipo,
      showModal: true, // Define o estado showModal como true para exibir o modal
    });
  };

  




  render() {
    const { showModal, tipo } = this.state;

    return (
      <div>
        {/* Renderiza o Carrossel */}
        {this.Carrossel()}
        <hr className="featurette-divider" />
        {/* Renderiza as "prestações" */}
        {this.renderPrestacoes()}
        {showModal && (
          <Modal show={showModal} onHide={() => this.setState({ showModal: false })}>
            <Modal.Header closeButton>
              <Modal.Title>Pedido de marcação</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.renderForm(tipo)}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => this.setState({ showModal: false })}>
                Close
              </Button>
              <Button variant="primary" onClick={() => this.cadastrarPedido()}>
                Save changes
              </Button>

            </Modal.Footer>
          </Modal>
        )}
      </div>
    );
  }
}

export default Home;

