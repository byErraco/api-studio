//Modulos requeridos
const express = require('express');
const router = express.Router();

//Autenticacion
const { isAuthenticated } = require('../helpers/auth')

//Controlador
const { newApplicantions } = require('../controllers/applications.controller');

//Ruta de creacion de aplicacion a anuncio
router.post('/appli/newApplicantions', isAuthenticated, newApplicantions)

//Exportando modulo
module.exports = router;