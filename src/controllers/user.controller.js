//Creacion del controlador
const userCtrl = {};

//Importando modelo de Usuarios
const User = require('../models/Users')

//Importando modulo de autenticacon
const passport = require('passport');
const { application } = require('express');
const flash = require('connect-flash')

//Vista de sección de elección
userCtrl.renderChooseSignupOption = (req, res) => {
    res.render('users/choose-signup-option')
}

//Vista de formulario de Signup 
userCtrl.renderSignupForm = (req, res) => {
    res.render('users/signup')
}

//Creacion de Usuarios
userCtrl.signup = async (req, res) => {
    let errors = [];
    
    failureFlash: true;
    const { username, email, password, password_confirm, tipo_cuenta,ciudad,pais } = req.body;
    //tipo_cuenta='Empresa';
    //console.log(tipo_cuenta)
    if (password != password_confirm) {
       // req.flash('message','las contrasenas no coinciden');
       // res.redirect('/user/signup');
        console.log('ERROR CONTRASENA NO ES IGUAL')
        errors.push({ text: "Las Contraseñas no coinciden." });
    }
    if (password.length < 4) {
        errors.push({ text: "La Contraseña debe tener al menos 4 digitos." });
    }
    if (errors.length > 0) {
        //  res.redirect('/user/signup');
        //const alert = errors.array()
         console.log(errors);
         ///console.log(alert)
         console.log('errores')
         res.render('users/signup', {
           errors
        });
    }

    else {
        // Si el correo ya existe
        const emailUser = await User.findOne({ email: email });
        if (emailUser || errors.length>0) {
            //req.flash("error_msg", "El Email se encuentra en uso.");
            //res.redirect('/');
            errors.push({ text: "El email ya se encuentra en uso." });
            console.log(errors);
            console.log("ERROR EMAIL EN USO")
            res.render('users/signup', {
                errors
             });
        } else {
            // Guardo el usuario
            const newUser = new User({ username, email, password, tipo_cuenta,ciudad,pais });
            
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            
            req.flash('success_msg', 'Usuario registrado exitosamente.')
            res.redirect('/user/login');
            
            console.log(exitoso)
        }
    }
    console.log(req.body);
    res.send('received');
    console.log('prueba')
};

//Vista de formulario de Login
userCtrl.renderLoginForm =  (req, res) => {
    res.render('users/signin')
}

//Inicio de Sesion    
userCtrl.login = passport.authenticate('local', {
    failureRedirect: '/user/signin',
    successRedirect: '/',
    failureFlash: true
});

//Vista de Cerrar sesion
userCtrl.logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'Tu sesion ha sido cerrada');
    res.redirect('/')
};

//Vista de lista de freelancer
userCtrl.renderListaCandidatos = async (req, res) => {
    if (req.query.buscar_free) {
        if (req.user) {
            const tipo_cuenta = req.user.tipo_cuenta;
            const buscar_free = req.query.buscar_free;
            const xPage = 6;
            const page = req.params.page || 1;
            const applicant = await User.find({ username: { $regex: '.*' + buscar_free + '.*', $options: 'i' }, tipo_cuenta: 'Freelancer' }, function (error, applicant) {
                if (error) {
                    console.log('error en el find')
                }
            })
                .skip((xPage * page) - xPage).limit(xPage).exec((err, applicant) => {
                    User.count({tipo_cuenta: 'Freelancer'}, (err, count) => {
                        if (err) {
                            console.log('error en el conteo')
                        } else {
                            res.render('./users/candidatos', { tipo_cuenta, applicant, current: page, pages: Math.ceil(count / xPage) })
                        }
                    })
                })
        } else {
            const buscar_free = req.query.buscar_free;
            const xPage = 6;
            const page = req.params.page || 1;
            const applicant = await User.find({ username: { $regex: '.*' + buscar_free + '.*', $options: 'i' }, tipo_cuenta: 'Freelancer' }, function (error, applicant) {
                if (error) {
                    console.log('error en el find')
                }
            })
                .skip((xPage * page) - xPage).limit(xPage).exec((err, applicant) => {
                    User.count({tipo_cuenta: 'Freelancer'}, (err, count) => {
                        if (err) {
                            console.log('error en el conteo')
                        } else {
                            res.render('./users/candidatos', { applicant, current: page, pages: Math.ceil(count / xPage) })
                        }
                    })
                })
        }
    }
    if (req.user) {
        const tipo_cuenta = req.user.tipo_cuenta;
        const xPage = 6;
        const page = req.params.page || 1;
        const applicant = await User.find({ tipo_cuenta: 'Freelancer' }).skip((xPage * page) - xPage).limit(xPage).exec((error, applicant) => {
            User.count({tipo_cuenta: 'Freelancer'}, (error, count) => {
                if (error) {
                    console.log('error1')
                } else {
                    res.render('./users/candidatos', {
                        tipo_cuenta, applicant, current: page, pages: Math.ceil(count / xPage)
                    })
                }
            })
        })
    } else {
        const xPage = 4;
        const page = req.params.page || 1;
        const applicant = await User.find({ tipo_cuenta: 'Freelancer' }).skip((xPage * page) - xPage).limit(xPage).exec((error, applicant) => {
            User.count({tipo_cuenta: 'Freelancer'}, (error, count) => {
                if (error) {
                    console.log('error1')
                } else {
                    res.render('./users/candidatos', {
                        applicant, current: page, pages: Math.ceil(count / xPage)
                    })
                }
            })
        })
    }
}

//Vista de perfil de freelancer
userCtrl.renderPerfilUser = async (req, res) => {
    if (req.user) {
        if (req.user.tipo_cuenta === 'Empresa') {
            const empresa = req.user.tipo_cuenta;
            const user = await User.findById(req.params.id)
            res.render('./users/perfil-user', { empresa, user })
        }
    }
    const user = await User.findById(req.params.id)
    res.render('./users/perfil-user', { user })
};

//Vista de Formulario de editar perfil
userCtrl.renderEditPerfil = async (req, res) => {
    const user = req.user;
    res.render('./users/perfil-user-edit', {user})
}

//Actualizar Perfil de Usuario
userCtrl.editPerfil = async (req, res) => {
    console.log(req.body)
    const rrss = [req.body.facebook, req.body.twitter]
    console.log(rrss) 
    res.send('Enviado')
}

userCtrl.expeTrabajo = async (req, res) => {
    const expe_traba = {periodo: req.body.periodo_laboral, 
                    titulo_trabajo: req.body.titulo_trabajo,
                    nom_empresa: req.body.nom_empresa,
                    desc_trabajo: req.body.descripcion_trabajo,
                    deta_trabajo: req.body.detalles_trabajo }
    await User.findByIdAndUpdate(req.user.id, {$addToSet: {trabajos: expe_traba}})
    const user = await User.findById(req.user.id)
    res.render('./users/perfil-user-edit', {user})

}

userCtrl.expeEstudios = async  (req, res) => {
    const expe_estu = {periodo: req.body.periodo_estudio,
                        nom_academia: req.body.nom_estudio,
                        deta_estudio: req.body.detalles_estudio}
    await User.findByIdAndUpdate(req.user.id, {$addToSet: {estudios: expe_estu}})
    const user = await User.findById(req.user.id)
    res.render('./users/perfil-user-edit', {user})
}

//Exportando Modulo
module.exports = userCtrl;