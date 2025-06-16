let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
let editandoIndex = null;

document.getElementById("formPedido").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const tipo = document.getElementById("tipo").value;
  const quantidade = parseInt(document.getElementById("quantidade").value);

  const restricoes = [...document.querySelectorAll(".restricao:checked")].map(cb => cb.value);

  let valorTotal = quantidade * 25;

  // Desconto para vegetariana
  if (tipo === "Vegetariana") {
    valorTotal *= 0.9;
  }

  // Taxa por restrição
  if (restricoes.length > 0) {
    valorTotal += quantidade * 5;
  }

  const pedido = {
    nome,
    tipo,
    quantidade,
    restricoes, // sempre será array
    valorTotal: `R$${valorTotal.toFixed(2)}`
  };

  if (editandoIndex === null) {
    pedidos.push(pedido);
  } else {
    pedidos[editandoIndex] = pedido;
    editandoIndex = null;
  }

  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  this.reset();
  renderizarTabela();
});

function renderizarTabela() {
  const tbody = document.getElementById("tabelaPedidos");
  tbody.innerHTML = "";

  pedidos.forEach((pedido, index) => {
    // Garantir que restricoes seja um array
    const restricoesTexto = Array.isArray(pedido.restricoes)
      ? pedido.restricoes.join(", ")
      : pedido.restricoes || "";

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${pedido.nome}</td>
      <td>${pedido.tipo}</td>
      <td>${pedido.quantidade}</td>
      <td>${restricoesTexto}</td>
      <td>${pedido.valorTotal}</td>
      <td>
        <button onclick="editarPedido(${index})">Editar</button>
        <button onclick="excluirPedido(${index})">Excluir</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function editarPedido(index) {
  const pedido = pedidos[index];
  document.getElementById("nome").value = pedido.nome;
  document.getElementById("tipo").value = pedido.tipo;
  document.getElementById("quantidade").value = pedido.quantidade;

  document.querySelectorAll(".restricao").forEach(cb => {
    cb.checked = Array.isArray(pedido.restricoes) && pedido.restricoes.includes(cb.value);
  });

  editandoIndex = index;
}

function excluirPedido(index) {
  pedidos.splice(index, 1);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  renderizarTabela();
}

renderizarTabela();
