// CAPTURAMOS DEL DOM LOS ELEMENTOS DEL SLIDER DE PRECIO CON LOS QUE VAMOS A TRABAJAR
const rangeInput = document.querySelectorAll(".range-input input"),
priceInput = document.querySelectorAll(".price-input input"),
range = document.querySelector(".slider .progress");

// INICIALIZAMOS LA VARIABLE con la que va a cambiar el precio (cambia cada 1000)
let priceGap = 1000;

// RECORREMOS LOS INPUTS DE PRECIO Y PARSEAMOS LOS VALORES
priceInput.forEach(input =>{
    input.addEventListener("input", e =>{
        // guardamos en variables los precios que pone el usuario con los inputs numericos
        let minPrice = parseInt(priceInput[0].value),
        maxPrice = parseInt(priceInput[1].value);        

        // CONDICIONES PARA QUE AUMENTE O DISMINUYA EL PRECIO DESDE LOS INPUTS NUMERICOS
        
        if((maxPrice - minPrice >= priceGap) && maxPrice <= rangeInput[1].max){
            if(e.target.className === "input-min"){
                //si el usuario coloca un precio minimo, el slider de la izquierda toma ese valor
                rangeInput[0].value = minPrice;
                range.style.left = ((minPrice / rangeInput[0].max) * 100) + "%";
            }else{
                // si el usuario coloca precio maximo el slider de la derecha toma ese valor
                rangeInput[1].value = maxPrice;
                range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
            }
        }
    });
});

// RECORREMOS LOS INPUTS DEL SLIDER
rangeInput.forEach(input =>{

    //ESCUCHAMOS LOS INPUTS Y PONEMOS LAS CONDICIONES PARA QUE AUMENTE O DISMIUYA DE PRECIO SEGUN EL SLIDER
    input.addEventListener("input", e =>{
        // guardamos en variables los precios que pone el usuario con el slider
        let minVal = parseInt(rangeInput[0].value),
        maxVal = parseInt(rangeInput[1].value);

        // CONDICIONES PARA QUE AUMENTE O DISMINUYA EL PRECIO DESDE LOS SLIDERS
        if((maxVal - minVal) < priceGap){
            if(e.target.className === "range-min"){
                rangeInput[0].value = maxVal - priceGap
            }else{
                rangeInput[1].value = minVal + priceGap;
            }
        }else{
            priceInput[0].value = minVal;
            priceInput[1].value = maxVal;
            range.style.left = ((minVal / rangeInput[0].max) * 100) + "%";
            range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
        }
    });
});