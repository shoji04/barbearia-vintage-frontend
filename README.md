# THE GENTLEMEN'S CLUB 300

Frontend do sistema de gestão da barbearia **The Gentlemen's Club 300**, usado pelos funcionários para autenticação, cadastro de clientes e controle da agenda de atendimentos.

🔗 **Deploy:** [https://thegentlemensclub300.vercel.app](https://thegentlemensclub300.vercel.app)

## Tecnologias usadas

- HTML5
- CSS3
- JavaScript puro (Vanilla JS), sem frameworks ou bibliotecas
- Consumo de API REST via `fetch`, com autenticação por token salvo no `localStorage`

## Como rodar localmente

Este é um projeto estático, sem processo de build ou dependências para instalar.

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd barbearia-vintage-frontend
   ```
2. Configure a API que o frontend vai consumir, editando o arquivo `config.js`:
   ```js
   const API_URL = "http://localhost:5001";
   ```
   - Aponte para o backend rodando localmente (ex: `http://localhost:5001`) durante o desenvolvimento.
   - Para usar a API em produção, aponte para `https://barbearia-vintage-backend.onrender.com`.
3. Abra o arquivo `index.html` diretamente no navegador, ou sirva a pasta com um servidor estático simples (ex: extensão "Live Server" do VS Code) para evitar problemas de CORS/paths relativos.

## Páginas do sistema

| Página | Arquivo | Descrição |
|---|---|---|
| **Login** | `index.html` | Tela inicial do sistema. Autentica o funcionário com e-mail e senha, salva o token de sessão e redireciona para a página de Clientes. |
| **Cadastro** | `cadastro.html` | Criação de conta de novo funcionário. Exige nome, e-mail, senha e um código de funcionário fornecido pelo proprietário para validar o vínculo com a barbearia. |
| **Clientes** | `clientes.html` | Área logada para cadastrar novos clientes (nome, e-mail e observações) e visualizar/editar a lista de clientes já cadastrados. |
| **Agenda** | `agenda.html` | Área logada para criar agendamentos (cliente, serviço, data e horário) e visualizar a agenda de atendimentos, com filtro por data. |

Todas as páginas internas (Clientes e Agenda) exigem login válido — o token é verificado a cada requisição, e uma sessão expirada redireciona automaticamente para o login.
