import React, { Component } from "react";
import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

class Prestacao extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: 0, // Isso é necessário para identificar o cliente a ser atualizado
            tipo: '', // Nome do tipo
            preco: 0, // Preço
            imagem: '', // URL da imagem
            prestacoes: [], // Lista de prestacoes obtidas da API
            modalAberto: false, // Estado do modal
            pastaIdGoogleDrive: 'xxxxxxxxxxxxxxxxxxxxxxx', // Substitua pelo ID da sua pasta
        };
    }
    componentDidMount() {
        this.buscarPrestacoes();

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
    carregarDados = (id) => {
        let url = 'https://api.sheety.co/1e2a5eeec0d760ba3c1d396e48fc8e4b/prestacao/prestacao/' + id;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados');
                }
                return response.json();
            })
            .then((data) => {
                // Verifica os dados retornados pela API
                console.log('Dados da prestação:', data);

                // Verifica se a propriedade de dados está correta
                if (data && data.prestacao) { // Ajuste para a propriedade da prestação (pode variar)
                    const prestacao = data.prestacao; // Assume que o objeto retornado tem a propriedade 'prestacao'

                    // Atualiza o estado com os dados da Prestação buscada
                    const preco = prestacao.preco ? parseInt(prestacao.preco) : ''; // Converte para inteiro se aplicável

                    this.setState({
                        id: parseInt(prestacao.id),
                        tipo: prestacao.tipo,
                        imagem: prestacao.imagem,
                        preco: preco
                    });
                    // Verifica se os valores estão corretos no estado
                    console.log('Estado atualizado:', this.state);
                } else {
                    throw new Error('Prestação não encontrada');
                }
            })
            .catch(error => {
                console.error('Erro ao carregar os dados da Prestação:', error);
            });
    }

    renderPrestacoes = () => {
        const { prestacoes } = this.state;

        const cards = prestacoes.map((prestacao, id) => (
            <Card style={{ width: '18rem' }} key={id}>
                <Card.Img variant="top" src={prestacao.imagem} />
                <Card.Body>
                    <Card.Title>{prestacao.tipo}</Card.Title>
                    <Card.Text>Preço: {prestacao.preco}€</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group">
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => { this.abrirModal(); this.carregarDados(prestacao.id); }}>
                                <FontAwesomeIcon icon={faEdit} className="me-2" />Editar
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => this.eliminarPrestacao(prestacao.id)}
                            >
                                <FontAwesomeIcon icon={faTrash} className="me-2" />
                                Excluir
                            </button>

                        </div>
                    </div>
                </Card.Body>
            </Card>
        ));

        return (
            <div className="d-flex justify-content-around">
                {cards}
            </div>
        );
    };
    //cadastrar 
    cadastraPrestacao = (prestacaos) => {
        let url = 'https://api.sheety.co/1e2a5eeec0d760ba3c1d396e48fc8e4b/prestacao/prestacao';
        const payload = { prestacao: prestacaos }; // Encapsula os detalhes do cliente na chave 'cliente'

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload) // Envia os detalhes do cliente dentro de um objeto com a chave 'cliente'
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Erro ao cadastrar');
            })
            .then(data => {
                console.log('Resposta da API após cadastrar :', data);
                this.setState(prevState => ({
                    prestacoes: [...prevState.prestacoes, { ...prestacaos, id: data.prestacao.id }]
                }));
                alert("Cadastrado!");
            })
            .catch(error => {
                console.error('Erro ao cadastrar:', error);
            });
    }

    // Método para eliminar um Cliente
    eliminarPrestacao = (id) => {
        let url = 'https://api.sheety.co/1e2a5eeec0d760ba3c1d396e48fc8e4b/prestacao/prestacao/' + id;
        fetch(url, { method: 'DELETE' })
            .then((response) => {
                if (response.ok) {
                    // Filtra os Clientes para manter apenas aqueles que não correspondem ao ID excluído
                    const novasPrestacoes = this.state.prestacoes.filter(prestacao => prestacao.id !== id);
                    // Atualiza o estado com a nova lista de Clientes
                    this.setState({ prestacoes: novasPrestacoes });
                    alert("Registro excluído!")
                }
            })
            .catch(error => {
                console.error('Erro ao excluir os dados do Cliente', error);
            });
    }

    fecharModal = () => {
        this.setState({
            modalAberto: false
        });
    }

    abrirModal = () => {
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
                            <h1 className="fw-bold mb-0 fs-2">Dados da prestacao</h1>
                        </div>
                        <div className="modal-body p-5 pt-0">
                            <form className="">
                                <div className="mb-3">
                                    <label htmlFor="Nome" className="form-label">Tipo</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        id="Tipo"
                                        placeholder="Digite o tipo"
                                        value={this.state.tipo}
                                        onChange={this.atualizaTipo}
                                        autoComplete="name"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Preco" className="form-label">Preço</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        id="Preco" // Corrigido o ID para "Preco"
                                        placeholder="Digite o preço"
                                        value={this.state.preco}
                                        onChange={this.atualizaPreco}
                                        autoComplete="name"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Imagem" className="form-label">Imagem URL</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        id="Imagem"
                                        placeholder="Digite a URL da imagem"
                                        value={this.state.imagem}
                                        onChange={this.atualizaImagem}
                                        autoComplete="off"
                                    />
                                    {this.state.imagem && (
                                        <img
                                            src={this.state.imagem}
                                            alt="Imagem"
                                            style={{ width: '100%', marginTop: '10px' }}
                                        />
                                    )}
                                    {/* Novo componente de upload de imagem */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={this.handleImageUpload}
                                    />
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

    // Função atualizaNome modificada
    atualizaTipo = (e) => {
        if (e && e.target) {
            this.setState({
                tipo: e.target.value || '' // Garante que o valor não seja undefined
            });
        }
    }

    // Função atualizaEmail modificada
    atualizaPreco = (e) => {
        if (e && e.target) {
            this.setState({
                preco: e.target.value || '' // Garante que o valor não seja undefined
            });
        }
    }

    // Função atualizaTelefone modificada
    atualizaImagem = (e) => {
        if (e && e.target) {
            this.setState({
                telefone: e.target.value || ''
            });
        }
    }

/*}
    Enviar = (event) => {
        event.preventDefault(); // Evita o comportamento padrão do formulário
        if (this.state.id === 0) {
            const prestacao = {
                tipo: this.state.tipo,
                imagem: this.state.imagem,
                preco: parseInt(this.state.preco) // Converte para número
            };
            this.cadastraPrestacao(prestacao);

            this.fecharModal();
            this.Reset();

        } else {
            const prestacao = {
                id: this.state.id,
                tipo: this.state.tipo,
                imagem: this.state.imagem,
                preco: parseInt(this.state.preco) // Converte para número
            };
            this.atualizarPrestacao(prestacao);

            this.fecharModal();
            this.Reset();
        }
    }*/

        Reset = () => {
        this.setState({
            id: 0, // Isso é necessário para identificar o cliente a ser atualizado
            tipo: '', // Nome do tipo
            preco: 0, // Preço
            imagem: '', // URL da imagem

        });
    }
    atualizarPrestacao = (prestacao) => {
        let url = 'https://api.sheety.co/1e2a5eeec0d760ba3c1d396e48fc8e4b/prestacao/prestacao/' + prestacao.id;

        fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prestacao: prestacao }) // Envia a prestacao atualizada dentro de um objeto 'prestacao'
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Erro ao atualizar dados da prestacao');
            })
            .then(data => {
                console.log(data); // Visualiza os dados retornados pela API
                // Atualiza o estado da prestação após a atualização bem-sucedida
                const prestacaoAtualizada = this.state.prestacoes.map(item => {
                    if (item.id === prestacao.id) {
                        return { ...item, ...data }; // Atualiza os dados da prestação específica
                    }
                    return item;
                });
                this.setState({ prestacoes: prestacaoAtualizada });
                alert("Dados atualizados")
            })
            .catch(error => {
                console.error('Erro ao atualizar dados da prestação:', error);
            });
    }


    Enviar = async (event) => {
        event.preventDefault(); // Evita o comportamento padrão do formulário
    
        try {
            // Verifica se há uma imagem a ser processada
            if (this.state.imagem) {
                // Converte a imagem para base64
                const base64Image = await this.convertImageToBase64(this.state.imagem);
    
                // Atualiza o estado com a imagem em base64
                this.setState({ imagem: base64Image });
            }
    
    
    
            // Decide se é uma atualização ou criação com base no ID
            if (this.state.id === 0) {
                // Cria um objeto com os dados da prestação
                const prestacao = {
                    tipo: this.state.tipo,
                    imagem: this.state.imagem,
                    preco: parseInt(this.state.preco) // Converte para número
                };
                // Chama a função para cadastrar uma nova prestação
                this.cadastraPrestacao(prestacao);
            } else {
                // Cria um objeto com os dados da prestação
                const prestacao = {
                    id: this.state.id,
                    tipo: this.state.tipo,
                    imagem: this.state.imagem,
                    preco: parseInt(this.state.preco) // Converte para número
                };
                // Chama a função para atualizar a prestação existente
                this.atualizarPrestacao(prestacao);
            }
    
            // Fecha o modal e reseta o estado
            this.fecharModal();
            this.Reset();
        } catch (error) {
            console.error('Erro ao processar a imagem:', error);
        }
    }
    //conf imagem 
    // Atualize a função handleImageUpload
handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64Data = reader.result.split(',')[1];
            this.setState({ imagem: base64Data });
        };

        reader.readAsDataURL(file);
    }
};

// Função para converter a imagem para base64
convertImageToBase64 = (imageUrl) => {
    return new Promise((resolve, reject) => {
        // Cria uma nova instância de Image
        const img = new Image();
        img.crossOrigin = 'Anonymous';

        // Define o manipulador de eventos para o carregamento da imagem
        img.onload = () => {
            // Cria um canvas para converter a imagem em base64
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            // Obtém o contexto do canvas
            const context = canvas.getContext('2d');

            // Desenha a imagem no canvas
            context.drawImage(img, 0, 0, img.width, img.height);

            // Obtém a representação em base64 da imagem no formato especificado (por padrão, PNG)
            const base64Image = canvas.toDataURL('image/png');

            // Resolve a Promise com a imagem em base64
            resolve(base64Image);
        };

        // Define o manipulador de eventos para erros de carregamento da imagem
        img.onerror = (error) => reject(error);

        // Define a origem da imagem
        img.src = imageUrl;
    });
};



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
                        Nova Prestacao
                    </Button>
                </div>
                {/* Renderiza as "prestações" */}
                <p>

                </p>
                {this.renderFormulario()}
                <p>

                </p>

                {this.renderPrestacoes()}

            </div>
        );
    }

}

export default Prestacao;  