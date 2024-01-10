import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


class Clientes extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false; // Inicializa a variável _isMounted como false

        // Inicializa o estado do componente com um array vazio para armazenar os Clientes
        this.state = {
            id: 0,
            nome: '',
            email: '',
            telefone: '',
            Clientes: [],
            modalAberto: false
        };
    }

    componentDidMount() {
        // Chama o método buscarClientes assim que o componente é montado no DOM
        this.buscarClientes();
        this._isMounted = true; // Define a flag _isMounted como true quando o componente é montado
    }

    componentWillUnmount() {
        this._isMounted = false; // Define a flag _isMounted como false quando o componente é desmontado
    }
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
                    alert("Registro excluído!")
                }
            })
            .catch(error => {
                console.error('Erro ao excluir os dados do Cliente', error);
            });
    }
    carregarDados = (id) => {
        let url = 'https://api.sheety.co/1e2a5eeec0d760ba3c1d396e48fc8e4b/clientes/clientes/' + id;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados');
                }
                return response.json();
            })
            .then((data) => {
                // Verifica os dados retornados pela API
                console.log('Dados do Cliente:', data);

                // Verifica se a propriedade de dados está correta
                if (data && data.cliente) { // Ajuste para a propriedade do cliente (pode variar)
                    const cliente = data.cliente; // Assume que o objeto retornado tem a propriedade 'cliente'

                    // Atualiza o estado com os dados do Cliente buscado
                    const telefone = cliente.telefone ? parseInt(cliente.telefone) : '';

                    // Atualiza o estado
                    this.setState({
                        id: parseInt(cliente.id),
                        nome: cliente.nome,
                        email: cliente.email,
                        telefone: telefone
                    });
                    this.abrirModal();

                    // Verifica se os valores estão corretos no estado
                    console.log('Estado atualizado:', this.state);
                } else {
                    throw new Error('Cliente não encontrado');
                }
            })
            .catch(error => {
                console.error('Erro ao carregar os dados do Cliente:', error);
            });
    }





    atualizarCliente = (clienteAtualizado) => {
        let url = `https://api.sheety.co/1e2a5eeec0d760ba3c1d396e48fc8e4b/clientes/clientes/${clienteAtualizado.id}`;
    
        fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cliente: clienteAtualizado }) // Envia o cliente atualizado dentro de um objeto 'cliente'
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Erro ao atualizar dados do cliente');
            })
            .then(data => {
                console.log(data); // Visualiza os dados retornados pela API
                // Atualiza o estado do cliente após a atualização bem-sucedida
                const clientesAtualizados = this.state.Clientes.map(item => {
                    if (item.id === clienteAtualizado.id) {
                        return { ...item, ...data }; // Atualiza os dados do cliente específico
                    }
                    return item;
                });
                this.setState({ Clientes: clientesAtualizados });
                this.buscarClientes();
                alert("Dados do cliente atualizados")
            })
            .catch(error => {
                console.error('Erro ao atualizar dados do cliente:', error);
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
            .then(data => {
                console.log('Resposta da API após cadastrar cliente:', data);
                this.setState(prevState => ({
                    Clientes: [...prevState.Clientes, { ...cliente, id: data.cliente.id }]
                }));
                this.abrirAlerta();
            })
            .catch(error => {
                console.error('Erro ao cadastrar cliente:', error);
            });
    }


    
    renderTabela() {
        return (
            <div className="album py-5 bg-light">
                <div className="container">
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                        {/* Mapeia os dados dos Clientes no estado e cria um cartão para cada Cliente */}
                        {this.state.Clientes.map((Cliente) => (
                            <div className="col" key={Cliente.id}>
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">{Cliente.nome}</h5>
                                        <p className="card-text">Email: {Cliente.email}</p>
                                        <p className="card-text">Telefone: {Cliente.telefone}</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => this.carregarDados(Cliente.id)}>   <FontAwesomeIcon icon={faEdit} className="me-2" />Editar
                                                </button>
                                                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => this.eliminarCliente(Cliente.id)}> <FontAwesomeIcon icon={faTrash} className="me-2" />Excluir
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


        );
    }



    // Função atualizaNome modificada
    atualizaNome = (e) => {
        if (e && e.target) {
            this.setState({
                nome: e.target.value || '' // Garante que o valor não seja undefined
            });
        }
    }

    // Função atualizaEmail modificada
    atualizaEmail = (e) => {
        if (e && e.target) {
            this.setState({
                email: e.target.value || '' // Garante que o valor não seja undefined
            });
        }
    }

    // Função atualizaTelefone modificada
    atualizaTelefone = (e) => {
        if (e && e.target) {
            const telefone = e.target.value !== '' ? parseInt(e.target.value) : '';
            this.setState({
                telefone: telefone
            });
        }
    }


    Enviar = (event) => {
        event.preventDefault(); // Evita o comportamento padrão do formulário
        if (this.state.id === 0) {
            event.preventDefault(); // Prevent default form behavior
            const cliente = {
                nome: this.state.nome,
                email: this.state.email,
                telefone: parseInt(this.state.telefone)
            };
            this.cadastraCliente(cliente); // Correct method invocation
            this.fecharModal();
            this.Reset(); // Reset form fields after submission
        } else {
            const Cliente = {
                id: this.state.id,
                nome: this.state.nome,
                email: this.state.email,
                telefone: parseInt(this.state.telefone) // Converte para número
            };
            this.atualizarCliente(Cliente);

            this.fecharModal();
            this.Reset();

        }



    }

    Reset = () => {
        // Limpa os campos após o envio do formulário
        this.setState({
            id: 0,
            nome: '',
            email: '',
            telefone: ''
        });
    }
    fecharModal = () => {
        this.setState({
            modalAberto: false
        });
    }

    abrirModal = () => {
        if (!this._isMounted) return; // Verifica se o componente está montado

        this.setState({
            modalAberto: true
        });
    }

    // Método para renderizar o formulário
    renderFormulario = () => {
        if (!this.state.modalAberto) return null; // Não renderizar o formulário se o modal não estiver aberto

        return (
            <div className="modal modal-signin position-static d-block bg-secondary py-5" tabIndex="-1" role="dialog" id="modalSignin">
                <div className="modal-dialog" role="document">
                    <div className="modal-content rounded-4 shadow">
                        <div className="modal-header p-5 pb-4 border-bottom-0">
                            <h1 className="fw-bold mb-0 fs-2">Dados do Cliente</h1>
                        </div>
                        <div className="modal-body p-5 pt-0">
                            <form className="">
                                <div className="mb-3">
                                    <label htmlFor="Nome" className="form-label">Nome</label>
                                    <input type="text" className="form-control rounded-3" id="Nome" placeholder="Digite o nome" value={this.state.nome} onChange={this.atualizaNome} autoComplete="name" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Email" className="form-label">Email</label>
                                    <input type="email" className="form-control rounded-3" id="Email" placeholder="Digite o email" value={this.state.email} onChange={this.atualizaEmail} autoComplete="email" />
                                    <div className="form-text text-muted">
                                        Utilize o seu melhor email.
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Telefone" className="form-label">Telefone</label>
                                    <input type="number" className="form-control rounded-3" id="Telefone" placeholder="Digite o telefone" value={this.state.telefone} onChange={this.atualizaTelefone} autoComplete="tel" />
                                </div>

                                <button className="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" onClick={this.Enviar}>Salvar</button>
                                <button className="w-100 mb-2 btn btn-lg rounded-3 btn-secondary" type="submit" onClick={this.fecharModal}>Fechar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <div className="d-grid gap-2">
                    <Button
                        style={{
                            backgroundColor: '#002d72',
                            color: 'white',
                            borderColor: '#002d72',
                            transition: 'background-color 0.3s ease',
                        }}
                        variant="light"
                        size="lg"
                        onClick={this.abrirModal}
                    >
                        Novo cliente
                    </Button>
                </div>
                {/* Renderiza o formulário */}
                {this.renderFormulario()}
                {/* Renderiza a tabela de Clientes */}
                {this.renderTabela()}

            </div>
        );
    }
}

export default Clientes;
