//Modulos requeridos
const express = require('express');
const router = express.Router();

//Controlador
const  { renderBlog, 
         renderBlogDetalles } = require('../controllers/blog.controller');

//Ruta Blogs
router.get('/blog', renderBlog);

//Ruta Blog
router.get('/blog/:id', renderBlogDetalles);

//Exportando modulo
module.exports = router;