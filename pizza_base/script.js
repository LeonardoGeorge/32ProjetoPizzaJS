const s = (el)=>{return document.querySelector(el)};
const sa = (el)=>{return document.querySelectorAll(el)};


pizzaJson.map((pizza, index) => {
    let pizzaItem = s('.models .pizza-item').cloneNode(true);

    s('.pizza-area').append(pizzaItem);
})