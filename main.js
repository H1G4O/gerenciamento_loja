const cadastro_produto_form = document.querySelector('#cadastro_produto_form');
const cadastro_venda_form = document.querySelector('#cadastro_venda_form');

function open_form(formId){
    document.getElementById(formId).style.display = "block";
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

cadastro_produto_form.addEventListener('submit', function(event){
    event.preventDefault();

    const formData = new FormData(cadastro_produto_form);
    const data = Object.fromEntries(formData);
    let produtos= JSON.parse(localStorage.getItem('produtos')) || [];
    
    produtos.push(data);
    localStorage.setItem('produtos', JSON.stringify(produtos));
    
    cadastro_produto_form.reset();

    console.log("Produto salvo!", produtos);
})

cadastro_venda_form.addEventListener('submit', function(event){
    event.preventDefault();

    const formData = new FormData(cadastro_venda_form);
    const data = Object.fromEntries(formData);
    let vendas= JSON.parse(localStorage.getItem('vendas')) || [];
    
    vendas.push(data);
    localStorage.setItem('vendas', JSON.stringify(vendas));
    
    cadastro_venda_form.reset();

    console.log("Produto salvo!", vendas);
})

document.addEventListener('DOMContentLoaded', mostrar_produtos);
mostrar_produtos();