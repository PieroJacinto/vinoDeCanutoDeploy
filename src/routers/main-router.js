// REQUERIMOS ROUTER DE EXPRESS
const { Router } = require("express");

//EJECUTAMOS ROUTER
const router = Router();

//EXPORTAMOS ROUTER
module.exports = router;

// REQUERIMOS EL MAIN CONTROLLER
const mainControllers = require("../controllers/main-controllers");

// HACEMOS LAS PETICIONES GET Y PUT CON SUS RESPECTIVOS CONTROLADORES

// HOME
router.get("/", mainControllers.home);

// LISTA DE PRODUCTOS SEGUN CATEGORIA
router.get("/listaProductos", mainControllers.listaProductos);

router.get("/login", mainControllers.login);
router.post("/login", mainControllers.loginProcess);
router.get("/register", mainControllers.register);
router.get("/detalleProducto/:id", mainControllers.detalleProducto);
router.get("/listaProductos/:categoria", mainControllers.listaProductos);
router.post("/listaProductos/productosFiltrados", mainControllers.productosFiltrados);
router.post('/carrito/agregar',mainControllers.agregarCarrito)
router.get("/carrito",mainControllers.carrito)