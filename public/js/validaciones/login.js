//FUNCION PARA SABER SI UN INPUT ESTA VACIO
const isEmpty = (input) => input.value.trim() != "";

//CREAMOS UN ARRAY DE OBJETOS CON VALIDACIONES
const validations = [
  {
    inputName: "email",
    validations: [
      {
        validator: isEmpty,
        errorMsg: "Debes completar tu email",
      },
      {
        validator: (input) => /\S+@\S+\.\S+/.test(input.value) != "",
        errorMsg: "Email debe tener un formato válido",
      },
    ],
  },
  {
    inputName: "password",
    validations: [
      {
        validator: isEmpty,
        errorMsg: "Debes completar tu contraseña",
      },
      {
        validator: (input) => input.value.length >= 8,
        errorMsg: "Contraseña debe tener al menos ocho caracteres",
      },
    ],
  },
];

window.onload = function () {
  const formulario = document.querySelector("#formulario");

  //ESCUCHAMOS CUANDO SE ENVIA EL FORMULARIO
  formulario.addEventListener("submit", (evt) => {
    evt.preventDefault();
    //CREAMOS UN ARRAY DE ERRORES VACIOS AL CUAL PUSHEAREMOS LOS ERRORES
    const errores = [];

    //ITERAMOS LOS INPUTS Y APLICAMOS LAS VALIDACIONES
    validations.forEach((inputToValidate) => {
      const input = formulario[inputToValidate.inputName];
      for (const validation of inputToValidate.validations) {
        const isValid = validation.validator(input);
        // SI LA VALIDACIONES NO ES VALIDA PUSHEAMOS EL ERROR Y AGREGAMOS LAS CLASES CORRESPONDIENTES
        if (!isValid) {
          errores.push(validation.errorMsg);
          input.parentElement.classList.add("is-notvalid");
          input.parentElement.classList.remove("is-valid");
          input.parentElement.querySelector(".error").innerHTML =
            validation.errorMsg;
          return;
        }
      }
      // CASO CONTRARIO
      input.parentElement.classList.add("is-valid");
      input.parentElement.classList.remove("is-notvalid");
      input.parentElement.querySelector(".error").innerHTML = "";
    });

    if (errores.length > 0) {
      console.log(errores);
    } else {
      formulario.submit();
    }
  });
};