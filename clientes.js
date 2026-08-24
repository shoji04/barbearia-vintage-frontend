exigirLogin();

let editandoId = null;

async function carregarClientes() {
  const resposta = await apiFetch("/clientes");
  if (!resposta || !resposta.ok) return;

  const clientes = await resposta.json();
  const tbody = document.getElementById("tabela-clientes");
  tbody.innerHTML = "";

  clientes.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.nome}</td>
      <td>${c.email}</td>
      <td>${c.observacoes || "-"}</td>
      <td class="acoes">
        <button class="btn-editar" onclick="editarCliente(${c.id})">Editar</button>
        <button class="btn-remover" onclick="removerCliente(${c.id})">Remover</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // guarda os dados na memória da página pra reusar no "editar" sem nova requisição
  window._clientes = clientes;
}

async function salvarCliente() {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const observacoes = document.getElementById("observacoes").value.trim();
  const erroEl = document.getElementById("erro");
  erroEl.style.display = "none";

  if (!nome || !email) {
    erroEl.textContent = "Nome e e-mail são obrigatórios";
    erroEl.style.display = "block";
    return;
  }

  const corpo = JSON.stringify({ nome, email, observacoes });
  let resposta;

  if (editandoId) {
    resposta = await apiFetch(`/clientes/${editandoId}`, { method: "PUT", body: corpo });
  } else {
    resposta = await apiFetch("/clientes", { method: "POST", body: corpo });
  }

  if (!resposta) return;

  if (!resposta.ok) {
    const dados = await resposta.json();
    erroEl.textContent = dados.erro || "Erro ao salvar cliente";
    erroEl.style.display = "block";
    return;
  }

  limparFormulario();
  carregarClientes();
}

function editarCliente(id) {
  const cliente = window._clientes.find((c) => c.id === id);
  if (!cliente) return;

  editandoId = id;
  document.getElementById("titulo-form").textContent = "Editar cliente";
  document.getElementById("nome").value = cliente.nome;
  document.getElementById("email").value = cliente.email;
  document.getElementById("observacoes").value = cliente.observacoes || "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function removerCliente(id) {
  if (!confirm("Tem certeza que deseja remover esse cliente?")) return;

  const resposta = await apiFetch(`/clientes/${id}`, { method: "DELETE" });
  if (!resposta) return;

  carregarClientes();
}

function limparFormulario() {
  editandoId = null;
  document.getElementById("titulo-form").textContent = "Novo cliente";
  document.getElementById("nome").value = "";
  document.getElementById("email").value = "";
  document.getElementById("observacoes").value = "";
}

carregarClientes();
