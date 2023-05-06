//FUNCION PARA SABER SI UN INPUT ESTA VACIO
const isEmpty = (input) => input.value.trim() != "";

//CREAMOS UN ARRAY DE OBJETOS CON VALIDACIONES
const validations = [
  {
    inputName: "nombre",
    validations: [
      {
        validator: isEmpty,
        errorMsg: "Nombre no puede estar vacío",
      },
      {
        validator: (input) => input.value.length >= 2,
        errorMsg: "Nombre debe tener al menos dos caracteres",
      },
    ],
  },
  {
    inputName: "apellido",
    validations: [
      {
        validator: isEmpty,
        errorMsg: "Apellido no puede estar vacío",
      },
      {
        validator: (input) => input.value.length >= 2,
        errorMsg: "Apellido debe tener al menos dos caracteres",
      },
    ],
  }, 
  {
    inputName: "email",
    validations: [
      {
        validator: isEmpty,
        errorMsg: "Email no puede estar vacío",
      },
      {
        validator: (input) => /\S+@\S+\.\S+/.test(input.value) != "",
        errorMsg: "Email debe tener un formato válido",
      },
    ],
  },
  {
    inputName: "contraseña",
    validations: [
      {
        validator: isEmpty,
        errorMsg: "Contraseña no puede estar vacío",
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

    formulario.addEventListener("submit", (evt) => {
        evt.preventDefault();
        const errores = [];

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
            input.parentElement.classList.add("is-valid");
            input.parentElement.classList.remove("is-notvalid");
            input.parentElement.querySelector(".error").innerHTML = "";
        });

        if (errores.length == 0) {
        formulario.submit();
        } else {
        console.log(errores);
        }
    });
};
