// REQUERIMOS NODE-FETCH PARA HACER PETICION A API
const fetch = require("node-fetch");
//requerimo base de datos json
const {index,one} = require('../models/producto.model');

//CREAMOS VARIABLE DE TOKEN QUE ESTA ALMACENADO EN VARIABLE DE ENTORNO Y URL DE LA PETICION PARA API DE INSTAGRAM
const token = process.env.IG_ACCESS_TOKEN;

const url = `https://graph.instagram.com/me/media?fields=thumbnail_url,media_url,caption,permalink&limit=50&access_token=${token}`;

// ADENTRO DEL MODULE.EXPORTS CREAMOS TODOS LOS CONTROLADORES QUE CONTROLARAN CADA RUTA
module.exports = {
  home: async (req, res) => {
    // creamos variable con los productos para enviarlos a la vista
    const productos = index();
    // creamos variable instadata a la que luego asignaremos valor
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
    res.render("home", { instaData, productos });
  },
  listaProductos: async (req, res) => {
    const productos = index()
    const categoria = req.params.categoria
    if (categoria == "ofertas") {
      var productosCategoria = productos.filter(item => item.descuento > 0)
    } else if(categoria == "destacados") {
      var productosCategoria = productos.filter(item => item.destacados == true)
    } else if(categoria == "todosLosProductos"){
      var productosCategoria = productos
    } else {
      var productosCategoria = productos.filter(item => item.categoria.toLowerCase() == categoria.toLowerCase())   
    }
    let atributos = {}  

    const filtrosAAplicar = [
      "varietal","variedad","bodega", "categoria", "año", "region"
    ]
    for (let i = 0; i < productos.length; i++) {
      const producto = productos[i];
      for(const atributo of Object.keys(producto)){
        if(!(filtrosAAplicar.includes(atributo)))continue
        if(!atributos[atributo])atributos[atributo] = {}
        if (!(producto[atributo] in atributos[atributo]))atributos[atributo][producto[atributo]] = 1;
        else atributos[atributo][producto[atributo]] += 1;
      }  
      
    }
    
    
    res.render("lista-productos",{productosCategoria, atributos, categoria})
  },
  detalleProducto: async (req,res) => {
    const idBuscado = req.params.id
    const productos = index()
    const productofiltrado = productos.filter(item => item.id == idBuscado) 
    const producto = productofiltrado[0]     
    res.render("detalle-producto", {producto})
  },
  login: async (req,res) => {
    res.render("login")
  },
  loginProcess: async (req,res) => {

  },
  register: async (req,res) => {
    res.render("register")
  },
  productosFiltrados: async (req, res) => {
    const filtros = req.body
    const categoria = req.params.categoria
    const productos = index()

    let atributos = {}  

    const filtrosAAplicar = [
      "varietal","variedad","bodega", "categoria", "año", "region"
    ]
    for (let i = 0; i < productos.length; i++) {
      const producto = productos[i];
      for(const atributo of Object.keys(producto)){
        if(!(filtrosAAplicar.includes(atributo)))continue
        if(!atributos[atributo])atributos[atributo] = {}
        if (!(producto[atributo] in atributos[atributo]))atributos[atributo][producto[atributo]] = 1;
        else atributos[atributo][producto[atributo]] += 1;
      }
    }   
    const tipoFiltros = {
      "precioMinimo": "string",
      "precioMaximo": "string",
      "categoria": "object",
      "varietal": "object",
      "variedad": "object",
      "año": "object",
      "bodega": "object"
    } 
    function reestructurarFiltros(filtros){     
      for (const filtro in filtros){
        if(tipoFiltros[filtro] != typeof(filtros[filtro])){
          filtros[filtro] = [filtros[filtro]]
        }      
    }
  }
  reestructurarFiltros(filtros)  

  productosFiltrados = [];
  for (let i = 0; i < productos.length; i++) {
    const producto = productos[i];
    const cumplePrecioMinimo = !filtros.precioMinimo || +producto.precio >= +filtros.precioMinimo;
    const cumplePrecioMaximo = !filtros.precioMaximo || +producto.precio <= +filtros.precioMaximo;
    const cumpleCategorias = !filtros.categoria || filtros.categoria.includes(producto.categoria);
    const cumpleVarietal = !filtros.varietal || filtros.varietal.includes(producto.varietal);
    const cumpleVariedad = !filtros.variedad || filtros.variedad.includes(producto.variedad);
    const cumpleAnio = !filtros.año || filtros.año.includes(producto.año.toString());
    const cumpleBodega = !filtros.bodega || filtros.bodega.includes(producto.bodega);
    const cumpleFiltros = cumpleCategorias && cumplePrecioMaximo && cumplePrecioMinimo && cumpleVarietal && cumpleVariedad && cumpleAnio && cumpleBodega;
    if(cumpleFiltros)productosFiltrados.push(producto)
  }  
  
  res.render("productos-filtrados",{productosFiltrados, categoria, atributos})    
  }
}
  