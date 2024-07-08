// Declarando as variáveis qs / qsAll para uma manipulação de DOM mais compacta. 
const qs = (el)=>{return document.querySelector(el)};
const qsAll = (el)=>{return document.querySelectorAll(el)};


//Mapeando atravez do .map a array para ter acesso aos dados dos produtos.
pizzaJson.map((item, index) => {
    // Clonando os elementos HTML para inserir os produtos da array.
    let pizzaItem = qs('.models .pizza-item').cloneNode(true);

    // Adicionando os produtos da array a tela;.
    qs('.pizza-area').append(pizzaItem);

    // Preenchendo dados na pagina.
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    
    // Criando evento de click.
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        // Bloqueando o comportamento padrão da pagina
        e.preventDefault();

        // Declarando a variável key, que nos permite acesso ao iD do produto.
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        
        // Preenchendo dados no modal atraves do id de cada item. 
        qs('.pizzaBig img').src = pizzaJson[key].img
        qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        qs('.pizzaInfo--sector').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
    
        // Ativando apareceção do modal e criando trasição
        qs('.pizzaWindowArea').style.opacity = 0;
        qs('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            qs('.pizzaWindowArea').style.opacity = 1;
        }, 200)
        
    })

})