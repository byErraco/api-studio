//Modulos requeridos
const { Router } = require('express');
const app = require('../server')
const router = Router();

//Controladores
const { renderPerfilUser,
        renderEditPerfil,
        editPerfil,
        expeEstudios,
        expeTrabajo,
        renderListaCandidatos,
        renderLoginForm,
        login,
        renderChooseSignupOption,
        renderSignupForm,
        signup,
        logout } = require('../controllers/user.controller');
const { isAuthenticated } = require('../helpers/auth');

//Ruta de lista de freelancers
router.get('/candidatos/:page', renderListaCandidatos);

//Ruta de perfil de freelancer
router.get('/perfil-user/:id', renderPerfilUser);

//Ruta de Editar Perfil
router.get('/user/edit-perfil', isAuthenticated, renderEditPerfil);
router.post('/edit-perfil', editPerfil);
router.post('/user/expe_trabajos', expeTrabajo );
router.post('/user/expe_estudios', expeEstudios );


//Ruta de inicio de sesion
router.get('/user/login', renderLoginForm);
router.post('/user/login', login);

//Ruta de elección de registro de usuario
router.get('/user/choose-signup-option', renderChooseSignupOption);

//Ruta de creacion de usuario
router.get('/user/signup', renderSignupForm);
router.post('/user/signup', signup);

//Ruta de creacion usuario-empresa
router.get('/user/signup-enterprise', renderSignupForm);
router.post('/user/signup-enterprise', signup);

//Ruta de cerrar sesion
router.get('/user/logout', logout);

//Exportando modulo
module.exports = router;