/*//Modulos requeridos
const express = require('express');
const router = express.Router();

//Controlador de Email
const { enviarEmaildeContacto } = require('../controllers/emails.controller');

//Controlador de Contacto
const { crearMensajeDeContacto } = require('../controllers/index.controller')

//Ruta de creacion de aplicacion a anuncio
router.post('/formulario-contacto', enviarEmaildeContacto, crearMensajeDeContacto)

//Exportando modulo
module.exports = router;*/