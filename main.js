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

function mostrar_produtos(){
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const lista = document.getElementById('estoque');

    lista.innerHTML="";

    if(produtos.length === 0){
        lista.innerHTML = "<p>Nenhum produto cadastrado ainda.</p>";
        return;
    }

    produtos.forEach(produto => {
        const card = `
            <div class="card">
                <h3>${produto.nome_produto}</h3>
                <p><strong>Preço de compra: </strong>R$ ${produto.preco_compra}</p>
                <p><strong>Preço de venda: </strong>R$ ${produto.preco_venda}</p>
                <p><strong>Quantidade no estoque: </strong> ${produto.qtd_disponivel}</p>
            </div>
        `;
        lista.innerHTML += card;
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
        const card = `
            <div class="card">
                <h3>${venda.nome_venda}</h3>
                <p><strong>Nome do cliente: </strong> ${venda.nome_cliente}</p>
                <p><strong>Produto: </strong> ${venda.select_produto}</p>
                <p><strong>Tamanho: </strong> ${venda.tamanho_produto}</p>
                <p><strong>Quantidade comprada: </strong> ${venda.qtd_vendida}</p>
                <p><strong>Forma de pagamento: </strong> ${venda.forma_pagamento}</p>
                <p><strong>Data da venda: </strong> ${venda.data_venda}</p>
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

cadastro_produto_form.addEventListener('submit', function(event){
    event.preventDefault();

    const formData = new FormData(cadastro_produto_form);
    const data = Object.fromEntries(formData);
    let produtos= JSON.parse(localStorage.getItem('produtos')) || [];

        for (const campo in data) {
        if (data[campo].trim() === '') {
            alert("Por favor, preencha todos os campos!");
            return; // interrompe o envio
        }
    }

    // 🔢 Verifica se números são válidos
    if (isNaN(data.preco_compra) || isNaN(data.preco_venda) || isNaN(data.qtd_disponivel)) {
        alert("Preço e quantidade devem ser números!");
        return;
    }

    
    produtos.push(data);
    localStorage.setItem('produtos', JSON.stringify(produtos));
    
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

document.addEventListener('DOMContentLoaded', () =>{
    mostrar_produtos();
    select_produtos();
    mostrar_vendas();
});