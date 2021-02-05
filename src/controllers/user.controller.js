//Creacion del controlador
const userCtrl = {};
const {randomNumber} = require('../helpers/libs');

const path = require('path');

//Importando modelo de Usuarios
const User = require('../models/Users')

//Importando modulo de autenticacon
const passport = require('passport');

const { application } = require('express');
const flash = require('connect-flash')
const multer = require('multer');
const  fs  = require('fs-extra');


//Vista de sección de elección
userCtrl.renderChooseSignupOption = (req, res) => {
    res.render('users/choose-signup-option')
}

//Vista de formulario de Signup 
userCtrl.renderSignupForm = (req, res) => {
    res.render('users/signup')
}
userCtrl.renderSignupFormE = (req, res) => {
    res.render('users/signup-enterprise')
}
userCtrl.renderMembership = (req, res) => {
    res.render('users/membresia')
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
            
            console.log(newUser)
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
var sum = 1;
//Inicio de Sesion 

//    userCtrl.login = passport.authenticate('local', {
   
//     failureRedirect: '/user/login',
//      successRedirect: '/user/edit-perfil',
//       failureFlash: true
//    }
//  );
userCtrl.login = (req,res,next) => {
    passport.authenticate("local",(err,user,info)=>{
        if (err) throw err;
        if (!user) res.send("No existe usuario")
        else {
            req.logIn(user, (err) => {
                
                if (err) throw err;
                console.log(user)
                User.findOne({'email': user.email},(err,user)=>{
                    
                    
                    if (user.isNewUser){
                        res.redirect('/user/membresia')
                        console.log("FUNCIONA")
                    } else {
                        res.redirect('/')
                    }
                })

            })
        }
    })(req,res,next)
}


// userCtrl.login = passport.authenticate('local', {
//     if()
// })

// userCtrl.login = passport.authenticate('local', {
        
//          failureRedirect: '/user/login'
//         // successRedirect: '/',
//         // successRedirect: '/user/edit-perfil',
//         // failureFlash: true
//           }),(req,res) => {
//               if (req.User.email === true) {
//                   res.redirect('/')
//               }
//           };


// userCtrl.login= passport.authenticate('local',{
//     failureRedirect:'/',
    
// }),(req,res)=>{
//     //const cargoUser = await User.findOne(cargo = ''));
//     if (req.User.tipo_cuenta === 'Empresa') {
//         console.log("Redirect")
//         res.redirect('/');
//     }
//     if (req.User.tipo_cuenta === 'Freelancer') {
//         console.log("Redirect2")
//         res.redirect('user/edit-perfil');
//     }
// }


// userCtrl.get('/', function(req, res, next){
//     passport.authenticate('local',function(err,user,info){
//         if(err) {return next(err);}

//         if(!user) {return res.redirect('user/login');}
//         req.logIn(user, function(err){
//             if(err){ return next(err);}
//             return res.redirect('/')
//         })
//     }) (req,res,next);
// })

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
    const  {cargo,direccion,salario,acerca,pais,tipoempresa,userfacebook,usertwitter,usergoogle,userlinkedin} = req.body

    await User.findByIdAndUpdate(req.user.id,{$set:{cargo:cargo,direccion:direccion,salario:salario,acerca:acerca,pais:pais,tipoempresa:tipoempresa,userfacebook:userfacebook,usertwitter:usertwitter,usergoogle:usergoogle,userlinkedin:userlinkedin}})
    const user = await User.findById(req.user.id)
    res.render('./users/perfil-user-edit', {user})
     
    
}
userCtrl.editPic = async (req, res) => {
    const imgUrl = randomNumber();
    const imageTempPath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const targetPath = path.resolve(`src/public/uploads/${imgUrl}${ext}`)



    if (ext === '.png' || ext === '.jpeg' ||ext === '.jpg' || ext === '.gif' ){
        await fs.rename(imageTempPath, targetPath);
        const newImg = {
            filename: imgUrl + ext
        }
        console.log('aca')
        const imageSaved = await User.findByIdAndUpdate(req.user.id,{$set:{filename:newImg}})
        
        // await User.findByIdAndUpdate(req.user.id,{$addToSet:{ filename:newImg}})
        console.log(newImg)
    } else {
        await fs.unlink(imageTempPath);
        res.status(500).json({error: 'Solo imagenes son admitidas'});
    }
    

    console.log(imgUrl)

    const user = await User.findById(req.user.id)
    res.render('./users/perfil-user-edit', {user})
     
    
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