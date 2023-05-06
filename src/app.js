require("dotenv").config();

const express = require("express");

const app = express();

// REQUERIMOS PATH Y STATIC PARA LAS RUTAS
const { join } = require("path");
const { static } = require("express");

app.set("view engine", "ejs");
app.set("views", join(__dirname, "./views"));

// USAMOS STATIC Y JOIN PARA QUE TODO LO QUE AGREGEMOS AL HTML SE REDIRIJA A PUBLIC AUTOMATICAMENTE, Y ASI ACORTAR LAS RUTAS
app.use(static(join(__dirname, "../public")));

// configuramos express para recibir y parsear peticiones HTTP
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//REQUERIMOS EL ROUTEADOR PRINCIPAL
const mainRouter = require("./routers/main-router");

// MONTAMOS MAIN ROUTER
app.use(mainRouter);

module.exports = app