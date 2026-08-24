exigirLogin();

const STATUS_LABEL = {
  agendado: "Agendado",
  concluido: "Concluído",
  cancelado: "Cancelado",
  nao_compareceu: "Não compareceu",
};

async function carregarClientesNoSelect() {
  const resposta = await apiFetch("/clientes");
  if (!resposta || !resposta.ok) return;

  const clientes = await resposta.json();
  const select = document.getElementById("cliente_id");
  select.innerHTML = clientes
    .map((c) => `<option value="${c.id}">${c.nome}</option>`)
    .join("");
}

async function carregarAgendamentos() {
  const filtroData = document.getElementById("filtro-data").value;
  const caminho = filtroData ? `/agendamentos?data=${filtroData}` : "/agendamentos";

  const resposta = await apiFetch(caminho);
  if (!resposta || !resposta.ok) return;

  const agendamentos = await resposta.json();
  const tbody = document.getElementById("tabela-agenda");
  tbody.innerHTML = "";

  agendamentos.forEach((a) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${formatarData(a.data)}</td>
      <td>${a.horario}</td>
      <td>${a.cliente_nome}</td>
      <td>${a.servico}</td>
      <td><span class="status status-${a.status}">${STATUS_LABEL[a.status]}</span></td>
      <td class="acoes">
        <select onchange="mudarStatus(${a.id}, this.value)">
          <option value="">Mudar status...</option>
          <option value="agendado">Agendado</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
          <option value="nao_compareceu">Não compareceu</option>
        </select>
        <button class="btn-remover" onclick="removerAgendamento(${a.id})">Remover</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function formatarData(isoData) {
  const [ano, mes, dia] = isoData.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Safari no iOS deixa date e time completamente em branco até serem tocados.
// Preencher com a data e a hora atuais dá um ponto de partida visível (e é o
// caso mais comum ao agendar); o tom suave indica que ainda é o valor padrão.
function preencherDataHoraAtuais() {
  const agora = new Date();
  const dois = (n) => String(n).padStart(2, "0");

  const dataEl = document.getElementById("data");
  const horarioEl = document.getElementById("horario");

  dataEl.value = `${agora.getFullYear()}-${dois(agora.getMonth() + 1)}-${dois(
    agora.getDate()
  )}`;
  horarioEl.value = `${dois(agora.getHours())}:${dois(agora.getMinutes())}`;

  [dataEl, horarioEl].forEach((el) => {
    el.classList.add("valor-padrao");
    el.addEventListener("change", () => el.classList.remove("valor-padrao"), {
      once: true,
    });
  });
}

function limparFiltro() {
  document.getElementById("filtro-data").value = "";
  carregarAgendamentos();
}

async function criarAgendamento() {
  const cliente_id = document.getElementById("cliente_id").value;
  const servico = document.getElementById("servico").value.trim();
  const data = document.getElementById("data").value;
  const horario = document.getElementById("horario").value;
  const erroEl = document.getElementById("erro");
  erroEl.style.display = "none";

  if (!cliente_id || !servico || !data || !horario) {
    erroEl.textContent = "Preencha todos os campos";
    erroEl.style.display = "block";
    return;
  }

  const resposta = await apiFetch("/agendamentos", {
    method: "POST",
    body: JSON.stringify({ cliente_id: Number(cliente_id), servico, data, horario }),
  });

  if (!resposta) return;

  if (!resposta.ok) {
    const dados = await resposta.json();
    erroEl.textContent = dados.erro || "Erro ao criar agendamento";
    erroEl.style.display = "block";
    return;
  }

  document.getElementById("servico").value = "";
  preencherDataHoraAtuais();
  carregarAgendamentos();
}

async function mudarStatus(id, novoStatus) {
  if (!novoStatus) return;

  const resposta = await apiFetch(`/agendamentos/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status: novoStatus }),
  });

  if (!resposta) return;
  carregarAgendamentos();
}

async function removerAgendamento(id) {
  if (!confirm("Tem certeza que deseja remover esse agendamento?")) return;

  const resposta = await apiFetch(`/agendamentos/${id}`, { method: "DELETE" });
  if (!resposta) return;

  carregarAgendamentos();
}

preencherDataHoraAtuais();
carregarClientesNoSelect();
carregarAgendamentos();
