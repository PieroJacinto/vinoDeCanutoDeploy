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
    //TRAEMOS PRODUCTOS DE LA BASE DE DATOS
    const productos = index()
    // TRAEMOS LA CATEGORIA ELEGIDA POR EL USUARIO
    const categoria = req.params.categoria
    // SI LA CATEGORIA ES OFERTA, DESTACADOS O TODOS LOS PRODUCTOS, TRAEMOS LOS PRODUCTOS CORRESPONDIENTES
    if (categoria == "ofertas") {
      var productosCategoria = productos.filter(item => item.descuento > 0)
    } else if(categoria == "destacados") {
      var productosCategoria = productos.filter(item => item.destacados == true)
    } else if(categoria == "todosLosProductos"){
      var productosCategoria = productos
      // SI LAS CATEGORIAS SON OTRAS TRAEMOS PRODUCTOS CORRESPONDIENTES
    } else {
      var productosCategoria = productos.filter(item => item.categoria.toLowerCase() == categoria.toLowerCase())   
    }
    //INICIALIZAMOS LA VARIABLE ATRIBUTOS COMO UN OBJETO VACIO
    let atributos = {}  
    // FILTROS QUE QUEREMOS APLICAR
    const filtrosAAplicar = [
      "varietal","variedad","bodega", "categoria", "año", "region"
    ]
    for (let i = 0; i < productos.length; i++) {
      const producto = productos[i];
      for(const atributo of Object.keys(producto)){
        // SI LOS FILTROS A APLICAR INCLUYEN EL ATRIBUTO CONTINUA EL FOR
        if(!(filtrosAAplicar.includes(atributo)))continue
        // SI NO HAY ATRIBUTOS, ES UN OBJETO VACIO
        if(!atributos[atributo])atributos[atributo] = {}
        // SI NO HAY ATRIBUTOS EL CONTADOR SE SETEA EN 1, SI YA HAY, SE SUMA 1
        if (!(producto[atributo] in atributos[atributo]))atributos[atributo][producto[atributo]] = 1;
        else atributos[atributo][producto[atributo]] += 1;
      }        
    }   
    res.render("lista-productos",{productosCategoria, atributos, categoria})
  },
  detalleProducto: async (req,res) => {
    // OBTENEMOS EL ID DEL PRODUCTO Q BUSCO EL USUARIO
    const idBuscado = req.params.id
    // REQUERIMOS LOS PRODUCTOS DE LA BASE DE DATOS
    const productos = index()
    // FILTRAMOS EL PRODUCTO
    const productofiltrado = productos.filter(item => item.id == idBuscado) 
    // CREAMOS LA VARIABLE PRODUCTO QUE ENVIAREMOS A LA VISTA, EN POSICION 0, PORQUE ES UN ARRAY CON UN SOLO OBJETO.
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
    // REQUERIMOS LOS FILTROS USADOS POR EL USUARIO
    const filtros = req.body
    //REQUERIMOS LA CATEGORIA TOMADA POR EL USUARIO
    const categoria = req.params.categoria
    // REQUERIMOS TODOS LOS PRODUCTOS DE LA BASE DE DATOS
    const productos = index()
    //  INICIALIZAMOS LA VARIABLE ATRIBUTOS COMO UN OBJETO VACIO DONDE CONTAREMOS LA CANTIDAD DE PRODUCTOS Q TIENE CADA ATRIBUTO
    let atributos = {}  
    // DEFINIMOS LOS FILTROS QUE QUEREMOS APLICAR
    const filtrosAAplicar = [
      "varietal","variedad","bodega", "categoria", "año", "region"
    ]
    // RECORREMOS LOS PRODUCTOS 
    for (let i = 0; i < productos.length; i++) {
      const producto = productos[i];      
      for(const atributo of Object.keys(producto)){
        // si no incluye el filtro a aplicar continua
        if(!(filtrosAAplicar.includes(atributo)))continue
        // si el atributo en la variable atributos no existe, creamos el atributo en atributos
        if(!atributos[atributo])atributos[atributo] = {}
        // si la variable atributos no tienen ningun atributo, cuando encuentra, agrega el atributo y el contador inicia en uno
        if (!(producto[atributo] in atributos[atributo]))atributos[atributo][producto[atributo]] = 1;
        // si ya tiene el atributo del producto recorrido, se suma uno
        else atributos[atributo][producto[atributo]] += 1;
      }
    } 
    //definimos los types de los filtros    
    const tipoFiltros = {
      "precioMinimo": "string",
      "precioMaximo": "string",
      "categoria": "object",
      "varietal": "object",
      "variedad": "object",
      "año": "object",
      "bodega": "object"
    } 
    //reestructuramos los filtors para q tnegan el tipo de dato que queremos
    function reestructurarFiltros(filtros){     
      for (const filtro in filtros){
        if(tipoFiltros[filtro] != typeof(filtros[filtro])){
          filtros[filtro] = [filtros[filtro]]
        }      
    }
  }
  reestructurarFiltros(filtros)  

  // Hacemos las validaciones de los filtros para que nmos devuelva los productos filtrados
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
  },
  agregarCarrito : async (req,res) => {
    //encontramos el producto en la base de datos y la cantidad que agrego el usuario    
     
    let product = one(req.body.id);
    let cantidad = req.body.cantidad
    // Comprobamos si el producto existe en el carrito
    if (req.session.cart.find(item => item.id == product.id)){
        // Caso 1: existe y actualizamos cantidad
        req.session.cart = req.session.cart.map(item => {
            if (item.id == product.id) {
                item.quantity = item.quantity + cantidad
            }
            return item
        })
    }else {
        // Caso 2:agregamops el carrito y seteamos la cantidad
        req.session.cart.push({...product, quantity:cantidad})
    }    
    return res.redirect("/")
  },
  carrito: async (req,res) => { 
    let productoCarro = req.session.cart      
    res.render("carrito-de-compras", {productoCarro})
  }
}
  