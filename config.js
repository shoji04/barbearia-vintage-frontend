// Endereço onde o backend Flask está rodando
const API_URL = "https://barbearia-vintage-backend.onrender.com";

// Funções auxiliares usadas em todas as páginas

function getToken() {
  return localStorage.getItem("token");
}

function salvarToken(token, nome) {
  localStorage.setItem("token", token);
  localStorage.setItem("nome_funcionario", nome);
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("nome_funcionario");
  window.location.href = "index.html";
}

// Protege páginas que exigem login: chama isso no topo de clientes.html e agenda.html
function exigirLogin() {
  if (!getToken()) {
    window.location.href = "index.html";
  }
}

// Mostra "Olá, {nome}" no header, usando o nome salvo no login
function mostrarSaudacaoFuncionario() {
  const nome = localStorage.getItem("nome_funcionario");
  const el = document.getElementById("saudacao-funcionario");
  if (el && nome) {
    el.textContent = `Olá, ${nome}`;
  }
}

// Destaca no menu o link da página que está aberta
function marcarLinkAtivo() {
  const paginaAtual = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("header nav a").forEach((link) => {
    if (link.getAttribute("href") === paginaAtual) {
      link.classList.add("ativo");
    }
  });
}

// Wrapper do fetch que já manda o token de autenticação
async function apiFetch(caminho, opcoes = {}) {
  if (!getToken()) {
    // sem token não há requisição a fazer - evita mandar "Bearer null" pro backend
    logout();
    return null;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
    ...opcoes.headers,
  };

  let resposta;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, { ...opcoes, headers });
  } catch (e) {
    // falha de rede (backend fora do ar, sem internet, etc.) - sem isso a
    // exceção ficava sem tratamento e a página travava sem avisar o usuário
    alert("Não foi possível conectar ao servidor.");
    return null;
  }

  if (resposta.status === 401) {
    // token inválido ou expirado - manda de volta pro login
    logout();
    return null;
  }

  return resposta;
}
