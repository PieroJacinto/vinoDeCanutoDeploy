// CAPTURAMOS HAMBURGUER
const menuBtn = document.querySelector(".menu-btn");
// INICIAMOS VARIABLE EN FALSO PARA QUE EL HAMBURGUER SE MUESTRE NORMAL
let menuOpen = false;

// CON ADDEVENTLISTENER Y SU FUNCION CLICK HACEMOS QUE  SE AGREGUEN Y QUITEN LAS CLASES(CLASSLIST ADD Y REMOVE) PARA LA ANIMACION AL MOMENTO DE HACER CLICK
menuBtn.addEventListener("click", () => {
    if(!menuOpen) {
        menuBtn.classList.add("open");
        menuOpen = true;
    } else {
        menuBtn.classList.remove("open");
        menuOpen = false;
    }
});