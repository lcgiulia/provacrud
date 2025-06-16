js do código:

// Recupera os pedidos do LocalStorage ou cria um array vazio se não tiver nada salvo
let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

// Variável que guarda o índice do pedido que está sendo editado (se houver)
let editandoIndex = null;

// Adiciona um ouvinte de evento para o envio do formulário
document.getElementById("formPedido").addEventListener("submit", function (e) {
  // Evita o recarregamento da página
  e.preventDefault();

  // Pega os valores digitados pelo usuário
  const nome = document.getElementById("nome").value;
  const tipo = document.getElementById("tipo").value;
  const quantidade = parseInt(document.getElementById("quantidade").value);

  // Pega as restrições alimentares marcadas (checkboxes)
  const restricoes = [...document.querySelectorAll(".restricao:checked")].map(cb => cb.value);

  // Calcula o valor base (R$25 por marmita)
  let valorTotal = quantidade * 25;

  // Se for do tipo vegetariana, aplica 10% de desconto
  if (tipo === "Vegetariana") valorTotal *= 0.9;

  // Se tiver pelo menos uma restrição, adiciona R$5 por marmita
  if (restricoes.length > 0) valorTotal += quantidade * 5;

  // Monta o objeto com os dados do pedido
  const pedido = {
    nome,
    tipo,
    quantidade,
    restricoes,
    valorTotal: `R$${valorTotal.toFixed(2)}` // valor formatado com 2 casas decimais
  };

  // Se não estiver editando, adiciona um novo pedido
  if (editandoIndex === null) {
    pedidos.push(pedido);
  } else {
    // Se estiver editando, substitui o pedido antigo pelo novo
    pedidos[editandoIndex] = pedido;
    editandoIndex = null; // volta ao modo normal
  }

  // Salva os pedidos no LocalStorage
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  // Limpa o formulário
  this.reset();

  // Atualiza a tabela com os dados novos
  renderizarTabela();
});

// Função para desenhar a tabela com os pedidos
function renderizarTabela() {
  const tbody = document.getElementById("tabelaPedidos");
  tbody.innerHTML = ""; // Limpa a tabela antes de preencher de novo

  // Para cada pedido, cria uma nova linha (tr)
  pedidos.forEach((pedido, index) => {
    // Garante que restricoes seja uma string (evita erros com .join)
    const restricoesTexto = Array.isArray(pedido.restricoes)
      ? pedido.restricoes.join(", ")
      : pedido.restricoes || "";

    // Cria a linha da tabela com os dados do pedido
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
    tbody.appendChild(tr); // Adiciona a linha na tabela
  });
}

// Função chamada quando o botão "Editar" é clicado
function editarPedido(index) {
  const pedido = pedidos[index];

  // Preenche o formulário com os dados existentes
  document.getElementById("nome").value = pedido.nome;
  document.getElementById("tipo").value = pedido.tipo;
  document.getElementById("quantidade").value = pedido.quantidade;

  // Marca os checkboxes que estavam selecionados
  document.querySelectorAll(".restricao").forEach(cb => {
    cb.checked = Array.isArray(pedido.restricoes) && pedido.restricoes.includes(cb.value);
  });

  // Define o índice do pedido sendo editado
  editandoIndex = index;
}

// Função chamada quando o botão "Excluir" é clicado
function excluirPedido(index) {
  // Remove o pedido do array
  pedidos.splice(index, 1);

  // Atualiza o LocalStorage
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  // Reatualiza a tabela
  renderizarTabela();
}

// Ao abrir a página, já renderiza a tabela com os pedidos salvos
renderizarTabela();
