import React, { Component } from 'react';
import { Form, FormGroup, FormLabel, FormControl, Button, DropdownButton, Dropdown, Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

class Marcacao extends Component {
    constructor(props) {
        super(props);

        this.state = {
            idOpcao: 0,
            opcao: '',
            data: '',
            hora: '',
            prestacoes: [], // Popule com os dados obtidos da API
            Clientes: [],
            marcacao: [],
            nome: '',
            email: '',
            telefone: '',
            idCliente: 0

        };
    }
    componentDidMount() {
        this.buscarPrestacoes();
        this.buscarClientes();
        this.buscarMarcacao();

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
    buscarMarcacao = () => {
        let url = 'https://api.sheety.co/1e2a5eeec0d760ba3c1d396e48fc8e4b/marcacao/marcacao';
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Resposta de rede não foi bem-sucedida');
                }
                return response.json();
            })
            .then(data => {
                console.log('Dados obtidos:', data);
                if (data && data.marcacao) {
                    this.setState({ marcacao: data.marcacao });
                }
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });
    };

    // Método para buscar os Clientes da API
    buscarClientes = () => {
        let url = 'https://api.sheety.co/1e2a5eeec0d760ba3c1d396e48fc8e4b/clientes/clientes';
        fetch(url)
            .then((response) => response.json())
            .then(data => {
                if (data && data.clientes) {
                    console.log(data); // Adicione este console.log para visualizar os dados retornados pela API

                    // Atualiza o estado do componente com os dados dos Clientes recebidos da API
                    this.setState({ Clientes: data.clientes });
                }
            })
            .catch(error => {
                console.error('Erro ao buscar os dados dos Clientes:', error);
            });
    }

    //cadastrar 
    cadastraCliente = (cliente) => {
        let url = 'https://api.sheety.co/1e2a5eeec0d760ba3c1d396e48fc8e4b/clientes/clientes';
        const payload = { cliente: cliente }; // Encapsula os detalhes do cliente na chave 'cliente'

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload) // Envia os detalhes do cliente dentro de um objeto com a chave 'cliente'
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Erro ao cadastrar cliente');
            })
            .then(responseData => {
                console.log('Resposta da API após cadastrar cliente:', responseData);
                this.setState(prevState => ({
                    Clientes: [...prevState.Clientes, { ...cliente, idCliente: responseData.cliente.id }]
                }));
                console.log('o id pra controlar', responseData.cliente.id);
                // Em algum lugar do seu código onde você chama cadastraMarcacao
                const { idOpcao, data, hora } = this.state;
                this.cadastraMarcacao(responseData.cliente.id, idOpcao, data, hora);



            })
            .catch(error => {
                console.error('Erro ao cadastrar cliente:', error);
            });
    }

    cadastraMarcacao = (idCliente, idOpcao, data, hora) => {
        const url = 'https://api.sheety.co/1e2a5eeec0d760ba3c1d396e48fc8e4b/marcacao/marcacao';
        const payload = {
            marcacao: {
                cliente: idCliente,
                prestacao: idOpcao,
                data: data,
                hora: hora
            }
        };

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Erro ao cadastrar marcação');
            })
            .then(data => {
                console.log('Resposta da API após cadastrar marcação:', data);
                // Faça algo com a resposta se necessário
                alert("Marcação feita com sucesso!");
            })
            .catch(error => {
                console.error('Erro ao cadastrar marcação:', error);
            });
    };



    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form behavior
        const cliente = {
            nome: this.state.nome,
            email: this.state.email,
            telefone: parseInt(this.state.telefone)
        };
        this.cadastraCliente(cliente); // Chama a função para cadastrar o cliente



    };
    Reset = () => {
        // Limpa os campos após o envio do formulário
        this.setState({
            idOpcao: 0,
            opcao: '',
            data: '',
            hora: '',
            nome: '',
            email: '',
            telefone: '',
            idCliente: 0
        });
    }
    handleDropdownSelect = (prestacao) => {
        this.setState({
            opcao: prestacao.tipo,
            idOpcao: prestacao.id,
        });
    };
    renderForm = () => {
        const { nome, email, telefone, opcao, data, hora, prestacoes } = this.state;

        return (
            <div className="container">
                <h1>Fazer Marcação</h1>
                <Form >
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
                        <DropdownButton title={opcao || 'Escolha uma opção'}>
                            {prestacoes.map((prestacao, id) => (
                                <Dropdown.Item
                                    key={id}
                                    onClick={() => this.handleDropdownSelect(prestacao)}
                                >
                                    {prestacao.tipo}    {prestacao.preco} €
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
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
                    <FormGroup className="mb-3">
                        <Button variant="primary" type="submit" onClick={this.handleSubmit}>Validar</Button>
                        <Button variant="secondary" type="reset">Cancelar</Button>
                    </FormGroup>
                </Form>
            </div>
        );

    }
    renderTabela = () => {
        const { marcacao, prestacoes, Clientes } = this.state;

        if (!marcacao.length || !prestacoes.length || !Clientes.length) {
            return <p>Carregando...</p>;
        }

        const encontrarCliente = (idCliente) => {
            return Clientes.find((cliente) => cliente.id === idCliente);
        };

        const encontrarPrestacao = (idPrestacao) => {
            return prestacoes.find((prestacao) => prestacao.id === idPrestacao);
        };

        return (
            <>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Cliente</th>
                            <th scope="col">Prestação</th>
                            <th scope="col">Data</th>
                            <th scope="col">Hora</th>
                            <th scope="col">Opções</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marcacao.map((item) => (
                            <tr key={item.id}>
                                <td>{encontrarCliente(item.cliente)?.nome || 'Cliente não encontrado'}</td>
                                <td>{encontrarPrestacao(item.prestacao)?.tipo || 'Prestação não encontrada'}</td>
                                <td>{item.data}</td>
                                <td>{item.hora}</td>
                                <td><button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => this.eliminarMarcacao(item.id, item.cliente)}> <FontAwesomeIcon icon={faTrash} className="me-2" />Cancelar
                                </button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        );
    };
    // Método para eliminar um Cliente
    eliminarCliente = (id) => {
        let url = 'https://api.sheety.co/1e2a5eeec0d760ba3c1d396e48fc8e4b/clientes/clientes/' + id;
        fetch(url, { method: 'DELETE' })
            .then((response) => {
                if (response.ok) {
                    // Filtra os Clientes para manter apenas aqueles que não correspondem ao ID excluído
                    const novosClientes = this.state.Clientes.filter(Cliente => Cliente.id !== id);
                    // Atualiza o estado com a nova lista de Clientes
                    this.setState({ Clientes: novosClientes });
                    
                }
            })
            .catch(error => {
                console.error('Erro ao excluir os dados do Cliente', error);
            });
    }
    // Método para eliminar um Cliente
    eliminarMarcacao = (id, cliente) => {
        let url = 'https://api.sheety.co/1e2a5eeec0d760ba3c1d396e48fc8e4b/marcacao/marcacao/' + id;
        fetch(url, { method: 'DELETE' })
            .then((response) => {
                if (response.ok) {
                    // Filtra as Marcacoes para manter apenas aqueles que não correspondem ao ID excluído
                    const novosMarcacao = this.state.marcacao.filter(marcacao => marcacao.id !== id);
                    // Atualiza o estado com a nova lista de Clientes
                    this.setState({ marcacao: novosMarcacao });
                    this.eliminarCliente(cliente);
                    alert("Marcação cancelada!")
                }
            })
            .catch(error => {
                console.error('Erro ao excluir os dados do Cliente', error);
            });
    }

    render() {
        return (
            <Tabs
                defaultActiveKey="profile"
                id="justify-tab-example"
                className="mb-3"
                justify
            >
                <Tab eventKey="form" title="Marcações">
                    {this.renderTabela()}
                </Tab>
                <Tab eventKey="profile" title="Marcar">
                    {this.renderForm()}
                </Tab>

            </Tabs>
        );

    }
}

export default Marcacao;
