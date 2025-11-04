function open_form(formId){
    document.getElementById(formId).style.display = "block";
}

function close_form(formId){
    document.getElementById(formId).style.display = "none";
}



const cadastro_produto = document.querySelector('#cadastro_produto_form');

cadastro_produto.addEventListener('submit', event =>{
     event.preventDefault();

     const formData = new FormData(cadastro_produto);
     const data = Object.fromEntries(formData);

     console.log(data);
})