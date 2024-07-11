// Declarando as variáveis qs / qsAll para uma manipulação de DOM mais compacta. 
const qs = (el)=>{return document.querySelector(el)};
const qsAll = (el)=>{return document.querySelectorAll(el)};

// Variável que armazena a quantidade de pizzas selecionadas no modal.
let modalQt = 1;

// Variável que armazena no carrinho as pizza selecionadas no modal.
let cart = [];

// Variável que irá definir o id da pizza selecionada para todo o modal. 
let modalKey = 0;

//Mapeando atravez do .map a array para ter acesso aos dados dos produtos.
pizzaJson.map((item, index) => {
    // Variável que contém o clone dos elementos HTML para inserir os produtos da array.
    let pizzaItem = qs('.models .pizza-item').cloneNode(true);

    // Variável que reseta o modal como 1.
    let modalQt = 1;

    // Adicionando os produtos da array a tela.
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

        // Eternizando a pizza selecionanda no modal
        modalKey = key;
        
        // Preenchendo dados no modal atraves do id de cada item. 
        qs('.pizzaBig img').src = pizzaJson[key].img;
        qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        qs('.pizzaInfo--sector').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        
        // Defindo a cor de seleção do tamanho da pizza. 
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        qsAll('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        })

        // Definindo que a variável modal é responsalvel pela quantidade de pizzas selecionadas.
        qs('.pizzaInfo--qt').innerHTML = modalQt;
    
        // Ativando apareceção do modal e criando trasição.
        qs('.pizzaWindowArea').style.opacity = 0;
        qs('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            qs('.pizzaWindowArea').style.opacity = 1;
        }, 200);
        
    })

})

// Criando a função cancelar pedido | fechar MODAL.
qsAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

function closeModal() {
    qs('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        qs('.pizzaWindowArea').style.display = 'none';
    }, 200)
}

// Criando função de aumentar e diminuir unidade do modal.
qs('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1) {
        modalQt--;
    }
    qs('.pizzaInfo--qt').innerHTML = modalQt;
})

qs('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    qs('.pizzaInfo--qt').innerHTML = modalQt;
})

// Selecionando botões de tamanho
qsAll('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })
   
})

// Criando ativação do botão Adicionar ao Carrinho.
qs('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'));

    // Criando uma identificador para a pizza clicada...
    let identifier = pizzaJson[modalKey].id+'/'+size;

    // Criando key que servira para procurar um identificado no carrinho para verificar se
    // já existe uma pizza com o mesmo id e tamanho, se não existir retornara -1,
    // se esxistir retornará um numero maior.
    let key = cart.findIndex((item)=>{
        return item.identifier == identifier;
    });

    // Verificando na prática o retorno da identificação,
    // ou seja, se o retorno for maior que -1, ja existe o produto, 
    // tenho apenas que adicionar a quantidade, se não, tenho que dar um push(). 
    if(key > -1){
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size: size,
            qt: modalQt
        })
    
    }
    updateCart();
    closeModal();
    
});
qs('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0) {
        qs('aside').style.left = '0';
    }
})
qs('.menu-closer').addEventListener('click', ()=>{
    qs('aside').style.left = '100vw';
    
})

//Função que trabalha fazendo o update de pedidos adicionados ao carrinho
function updateCart() {
    // Atualizar quantidades de itens adicionados | função Mobile
    qs('.menu-openner').innerHTML = cart.length;

    
    // Verificando se existe algum pedido adicionado se sim
    // abre o aside que mostra o pedido se não fecha o aside. 
    if(cart.length > 0) {
        qs('aside').classList.add('show');
        qs('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        // Loop que procura os pedidos adicinados para 
        // preencher os dados do produtos no carrinho(aside).
        for(let i in cart) {
            // Variável para buscar dados do procuto pelo id.
            let pizzaItem = pizzaJson.find((item)=>{
                return item.id == cart[i].id;
            });

            // Calculando subtotais
            subtotal += pizzaItem.price * cart[i].qt;
            
            //Clonando itens do modelo cart.
            let cartItem = qs('.models .cart--item').cloneNode(true);
            
            // Adicionando ao carrinho na tela pelo append.
            qs('.cart').append(cartItem);

          // Declarando pizzaSizeName para compor a variável pizzaName.
            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = '320g'
                    break;
                case 1: 
                    pizzaSizeName = '530g'
                    break;
                case 2: 
                    pizzaSizeName = '830g'
                    break;
            }
          
            // Variável para definir nome e tamanho da pizza.
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
          

            // Preenchendo dados do pelido no carrinho.
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt --;
                } else {
                    cart.splice(i, 1);
                }
                updateCart()
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt ++;
                updateCart();
            });


            // Calculo com desconto e calculo final.
            desconto = subtotal * 0.1;
            total = subtotal - desconto;

            qs('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
            qs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
            qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

            
        }
    } else {
        qs('aside').classList.remove('show');
        qs('aside').style.left = '100vw';
    }
}
























