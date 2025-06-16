# provacrud


<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Gerenciador de Marmitas Fit</title>

    </head>

<body>

<h2>Gerenciador de Marmitas Fit</h2>

<!-- Formulário -->
Nome: <input type="text" id="nome"><br>

Tipo:
<select id="tipo">
    <option value="Low Carb">Low Carb</option>
    <option value="Vegetariana">Vegetariana</option>
    <option value="Tradicional">Tradicional</option>
</select><br>

//Quantidade: <input type="number" id="quantidade"><br>

Restrições:
<label><input type="checkbox" id="gluten">Sem glúten</label>
<label><input type="checkbox" id="lactose">Sem lactose</label><br>

<button onclick="registrarPedido()" class="btn">Registrar Pedido</button>

<hr>

<!-- Tabela dos pedidos -->
<table>
    <thead>
        <tr>
            <th>Cliente</th>
            <th>Tipo</th>
            <th>Qtde</th>
            <th>Restrições</th>
            <th>Valor Total</th>
            <th>Ações</th>
        </tr>
    </thead>
    <tbody id="tabelaPedidos"></tbody>
</table>

<script>
    // Array que guarda os pedidos
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    let editandoIndex = null; // Se estiver editando, guarda o índice

    // ✅ Atualiza a tabela sempre que carrega a página
    window.onload = carregarTabela;

    // 📦 Função para registrar um novo pedido ou atualizar um existente
    function registrarPedido() {
        const nome = document.getElementById('nome').value;
        const tipo = document.getElementById('tipo').value;
        const quantidade = parseInt(document.getElementById('quantidade').value);
        const gluten = document.getElementById('gluten').checked;
        const lactose = document.getElementById('lactose').checked;

        // Verifica quais restrições foram marcadas
        const restricoes = [];
        if (gluten) restricoes.push('Sem glúten');
        if (lactose) restricoes.push('Sem lactose');

        // Calcula o valor total
        const valorTotal = calcularValor(tipo, quantidade, restricoes.length);

        // Cria o objeto do pedido
        const pedido = {
            nome,
            tipo,
            quantidade,
            restricoes: restricoes.join(', '),
            valorTotal: `R$${valorTotal},00`
        };

        // Se está editando, atualiza o pedido existente
        if (editandoIndex !== null) {
            pedidos[editandoIndex] = pedido;
            editandoIndex = null;
        } else {
            // Senão, adiciona um novo
            pedidos.push(pedido);
        }

        // Salva no LocalStorage
        localStorage.setItem('pedidos', JSON.stringify(pedidos));

        // Limpa o formulário e atualiza a tabela
        limparFormulario();
        carregarTabela();
    }

    // 💰 Calcula o valor total do pedido
    function calcularValor(tipo, quantidade, qtdRestricoes) {
        let preco = 25 * quantidade;

        // Desconto de 10% se for Vegetariana
        if (tipo === 'Vegetariana') {
            preco -= preco * 0.10;
        }

        // Taxa de R$5 por marmita se houver restrições
        if (qtdRestricoes > 0) {
            preco += quantidade * 5;
        }

        return preco;
    }

    // 🔁 Carrega os dados na tabela
    function carregarTabela() {
        const tabela = document.getElementById('tabelaPedidos');
        tabela.innerHTML = '';

        pedidos.forEach((pedido, index) => {
            const linha = `<tr>
                <td>${pedido.nome}</td>
                <td>${pedido.tipo}</td>
                <td>${pedido.quantidade}</td>
                <td>${pedido.restricoes}</td>
                <td>${pedido.valorTotal}</td>
                <td>
                    <button onclick="editar(${index})" class="btn">Editar</button>
                    <button onclick="excluir(${index})" class="btn">Excluir</button>
                </td>
            </tr>`;
            tabela.innerHTML += linha;
        });
    }

    // ✏️ Função para editar um pedido
    function editar(index) {
        const pedido = pedidos[index];
        document.getElementById('nome').value = pedido.nome;
        document.getElementById('tipo').value = pedido.tipo;
        document.getElementById('quantidade').value = pedido.quantidade;
        document.getElementById('gluten').checked = pedido.restricoes.includes('glúten');
        document.getElementById('lactose').checked = pedido.restricoes.includes('lactose');

        editandoIndex = index; // Marca que está editando
    }

    // ❌ Função para excluir um pedido
    function excluir(index) {
        if (confirm('Deseja excluir este pedido?')) {
            pedidos.splice(index, 1); // Remove do array
            localStorage.setItem('pedidos', JSON.stringify(pedidos)); // Atualiza o LocalStorage
            carregarTabela(); // Atualiza a tabela
        }
    }

    // 🔄 Limpa os campos do formulário
    function limparFormulario() {
        document.getElementById('nome').value = '';
        document.getElementById('tipo').value = 'Low Carb';
        document.getElementById('quantidade').value = '';
        document.getElementById('gluten').checked = false;
        document.getElementById('lactose').checked = false;
    }
</script>

</body>
</html>
