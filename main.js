const cadastro_produto_form = document.querySelector('#cadastro_produto_form');
const cadastro_venda_form = document.querySelector('#cadastro_venda_form');

function open_form(formId){
    const form = document.getElementById(formId);

    if (form.style.display === "block") {
        form.style.display = "none"; // se já está aberto, fecha
    } else {
        form.style.display = "block"; // se está fechado, abre
    }
}

function close_form(formId){
    cadastro_produto_form.reset();
    document.getElementById(formId).style.display = "none";
}

function mostrar_produtos(filtro = "") {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const lista = document.getElementById('estoque');
    const limite_baixo = 5;
    lista.innerHTML = "";

    const produtosFiltrados = produtos.filter(produto =>
        produto.nome_produto.toLowerCase().includes(filtro.toLowerCase()) ||
        produto.tamanho_produto.toLowerCase().includes(filtro.toLowerCase())
    );

    const produtosAgrupados = {};

    produtosFiltrados.forEach(produto => {
        const nome = produto.nome_produto;
        if (!produtosAgrupados[nome]) {
            produtosAgrupados[nome] = [];
        }
        produtosAgrupados[nome].push(produto);
    });

    produtosFiltrados.sort((a, b) => {
        const aBaixo = parseInt(a.qtd_disponivel) <= limite_baixo;
        const bBaixo = parseInt(b.qtd_disponivel) <= limite_baixo;
        return bBaixo - aBaixo;
    });

    if (produtosFiltrados.length === 0) {
        lista.innerHTML = "<p>Nenhum produto encontrado.</p>";
        return;
    }

    produtosFiltrados.forEach((produto, index) => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <h3>${produto.nome_produto}</h3>
            <p><strong>Preço de compra:</strong> R$ ${produto.preco_compra}</p>
            <p><strong>Preço de venda:</strong> R$ ${produto.preco_venda}</p>
            <p><strong>Quantidade no estoque:</strong> ${produto.qtd_disponivel}</p>
        `;

        if (parseInt(produto.qtd_disponivel) <= limite_baixo) {
            card.style.backgroundColor = '#ffb3b3'; // vermelho claro
        }

        const realIndex = produtos.findIndex(p => 
            p.nome_produto === produto.nome_produto &&
            p.tamanho_produto === produto.tamanho_produto
        );

        const btnEditar = document.createElement('button');
        btnEditar.textContent = "Editar";
        btnEditar.onclick = () => editar_produto(realIndex);

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = "Excluir";
        btnExcluir.classList.add('excluir');
        btnExcluir.onclick = () => excluir_produto(realIndex);

        card.appendChild(btnEditar);
        card.appendChild(btnExcluir);

        lista.appendChild(card);
    });
}

function mostrar_vendas(){
    const vendas = JSON.parse(localStorage.getItem('vendas')) || [];
    const lista = document.getElementById('vendas');

    lista.innerHTML="";

    if(vendas.length === 0){
        lista.innerHTML = "<p>Nenhuma venda realizada.</p>";
        return;
    }

    vendas.forEach(venda => {
        const precoVenda = parseFloat(String(venda.preco_venda).replace(',', '.')) || 0;
        const valorTotal = (parseFloat(venda.qtd_vendida) * precoVenda).toFixed(2);
        
        const card = `
            <div class="card">
                <h3>${venda.nome_venda}</h3>
                <p><strong>Nome do cliente: </strong> ${venda.nome_cliente}</p>
                <p><strong>Produto: </strong> ${venda.select_produto}</p>
                <p><strong>Tamanho: </strong> ${venda.tamanho_produto}</p>
                <p><strong>Quantidade comprada: </strong> ${venda.qtd_vendida}</p>
                <p><strong>Forma de pagamento: </strong> ${venda.forma_pagamento}</p>
                <p><strong>Data da venda: </strong> ${venda.data_venda}</p>
                <p><strong>Valor total da venda:</strong> R$ ${valorTotal}</p>
            </div>
        `;
        lista.innerHTML += card;
    });
}

function select_produtos(){
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const select = document.getElementById('select_produto');

    select.innerHTML = '';

    const opcaoInicial = document.createElement('option');
    opcaoInicial.value = '';
    opcaoInicial.textContent = 'Selecione um produto';
    select.appendChild(opcaoInicial);

    produtos.forEach(produto => {
    const option = document.createElement('option');
    option.value = produto.nome_produto;  // ou outro identificador, se quiser
    option.textContent = produto.nome_produto;
    select.appendChild(option);
    });
}

function excluir_produto(index) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos.splice(index, 1); // Remove o item pelo índice
    localStorage.setItem('produtos', JSON.stringify(produtos));
    mostrar_produtos(); // Atualiza a tela
}

function editar_produto(index) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produto = produtos[index];

    // Preenche os campos do formulário com os dados do produto
    document.getElementById('nome_produto').value = produto.nome_produto;
    document.getElementById('tamanho_produto').value = produto.tamanho_produto;
    document.getElementById('preco_compra').value = produto.preco_compra;
    document.getElementById('preco_venda').value = produto.preco_venda;
    document.getElementById('qtd_disponivel').value = produto.qtd_disponivel;

    // Armazena o índice do produto que está sendo editado (temporariamente)
    document.getElementById('cadastro_produto_form').dataset.editIndex = index;

    // Abre o modal de cadastro
    open_form('cadastro_produto_form_div');
}

function showAlert(msg, cor = "#323232") {
  const alerta = document.getElementById("alerta");
  alerta.textContent = msg;
  alerta.style.background = cor;
  alerta.classList.add("show");
  setTimeout(() => alerta.classList.remove("show"), 2500);
}

cadastro_produto_form.addEventListener('submit', function(event){
    event.preventDefault();

    const formData = new FormData(cadastro_produto_form);
    const data = Object.fromEntries(formData);
    let produtos= JSON.parse(localStorage.getItem('produtos')) || [];
    const editIndex = cadastro_produto_form.dataset.editIndex;


        for (const campo in data) {
        if (data[campo].trim() === '') {
            showAlert("Erro: preencha todos os campos!", "#E53935");
            return; // interrompe o envio
        }
    }

    // 🔢 Verifica se números são válidos
    if (isNaN(data.preco_compra) || isNaN(data.preco_venda) || isNaN(data.qtd_disponivel)) {
        showAlert("Erro: Preço e quantidade devem ser números!", "#E53935");
        return;
    }

    if (editIndex !== undefined && editIndex !== "") {
        // Atualiza o produto existente
        produtos[editIndex] = data;
        delete cadastro_produto_form.dataset.editIndex; // limpa o modo de edição
        showAlert("Produto atualizado com sucesso!", "#4CAF50");
    } else {
        // Adiciona um novo produto
        produtos.push(data);
        showAlert("Produto cadastrado com sucesso!", "#4CAF50");
    }
    
    localStorage.setItem('produtos', JSON.stringify(produtos));
    mostrar_produtos();
    
    cadastro_produto_form.reset();

    console.log("Produto salvo!", produtos);
})

cadastro_venda_form.addEventListener('submit', function(event){
    event.preventDefault();

    // Lê o formulário e os produtos
    const formData = new FormData(cadastro_venda_form);
    const data = Object.fromEntries(formData);
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    let vendas = JSON.parse(localStorage.getItem('vendas')) || [];

    data.data_venda = new Date().toLocaleString('pt-BR');

    for (const campo in data) {
        if (data[campo].trim() === '') {
            alert("Por favor, preencha todos os campos!");
            return; // interrompe o envio
        }
    }

    if (isNaN(data.qtd_vendida)) {
        alert("Quantidade deve ser número!");
        return;
    }

    // Captura o produto selecionado e a quantidade vendida
    const produtoSelecionado = data.select_produto;
    const qtdVendida = parseInt(data.qtd_vendida) || 1; // usa 1 por padrão, se não tiver campo
    const produto = produtos.find(p => p.nome_produto === produtoSelecionado);

    if (!produto) {
        alert("Produto não encontrado!");
        return;
    }

    data.preco_venda = Number(produto.preco_venda.toString().replace(',', '.'));
    
    // Converte para número e verifica estoque
    const qtdAtual = parseInt(produto.qtd_disponivel) || 0;

    if (qtdAtual < qtdVendida) {
        alert("Estoque insuficiente!");
        return;
    }

    // Atualiza estoque
    produto.qtd_disponivel = qtdAtual - qtdVendida;

    // Salva a venda e o novo estoque
    vendas.push(data);
    localStorage.setItem('vendas', JSON.stringify(vendas));
    localStorage.setItem('produtos', JSON.stringify(produtos));

    // Reseta e atualiza tela
    cadastro_venda_form.reset();
    close_form('cadastro_venda_form_div');
    mostrar_produtos();

    console.log("Venda registrada:", data);
})

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('estoque')) {
    mostrar_produtos();
    const filtro = document.getElementById('filtro_produto');
    if (filtro) {
      filtro.addEventListener('input', (event) => {
        mostrar_produtos(event.target.value);
      });
    }
  }

  if (document.getElementById('select_produto')) {
    select_produtos();
  }

  if (document.getElementById('vendas')) {
    mostrar_vendas();
  }
});