// REQUERIMOS NODE-FETCH PARA HACER PETICION A API
const fetch = require("node-fetch");

//CREAMOS VARIABLE DE TOKEN QUE ESTA ALMACENADO EN VARIABLE DE ENTORNO Y URL DE LA PETICION PARA API DE INSTAGRAM
const token = process.env.IG_ACCESS_TOKEN;

const url = `https://graph.instagram.com/me/media?fields=thumbnail_url,media_url,caption,permalink&limit=50&access_token=${token}`;

// ADENTRO DEL MODULE.EXPORTS CREAMOS TODOS LOS CONTROLADORES QUE CONTROLARAN CADA RUTA
module.exports = {
  home: async (req, res) => {
    let instaData;
    //TRY CATCH PARA MOSTRAR ERROR SI LOS HAY EN EL FETCH DE INSTAGRAM API
    try {
      // HACEMOS LA PETICION A LA API
      const instaFetch = await fetch(url);
      const instaJson = await instaFetch.json();
      instaData = instaJson.data;
    } catch (error) {
      console.log("Error en el servicio de Instagram: " + error);
        //si instadata es null se renderiza la vista "instagram-fetch-error" como lo establece el if ternario en el ejs del home
      instaData = null;
    }  
    

    // RENDERIZAMOS LA VISTA HOME Y LE PASAMOS OBJETO CON LA INFO NECESARIA
    res.render("home", { instaData });
  },
  listaProductos: async (req, res) => {
    res.render("lista-productos")
  },
  detalleProducto: async (req,res) => {
    res.render("detalle-producto")
  },
  login: async (req,res) => {
    res.render("login")
  },
  loginProcess: async (req,res) => {

  },
  register: async (req,res) => {
    res.render("register")
  }
}
  