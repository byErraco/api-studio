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
const paypal = require('paypal-rest-sdk')


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
userCtrl.renderMembershipSucess = (req, res) => {
    res.render('users/sucess')
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
                    
                    
                    if (user.isNewUser && user.tipo_cuenta == 'Freelancer'){
                        res.redirect('/user/membresia')
                        console.log("FUNCIONA")
                    } else {
                        if (user.isNewUser && user.tipo_cuenta == 'Empresa'){
                            res.redirect('/user/membresia')
                            console.log("FUNCIONA")
                        }
                       
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
    const  {cargo,direccion,salario,acerca,pais,tipoempresa,userfacebook,usertwitter,usergoogle,userlinkedin,skill_,skill_1,skill_2,skill_3} = req.body

    await User.findByIdAndUpdate(req.user.id,{$set:{cargo:cargo,direccion:direccion,salario:salario,acerca:acerca,pais:pais,
        tipoempresa:tipoempresa,userfacebook:userfacebook,usertwitter:usertwitter,usergoogle:usergoogle,userlinkedin:userlinkedin,
        skill_:skill_,skill_1:skill_1,skill_2:skill_2,skill_3:skill_3}})
    const user = await User.findById(req.user.id)
    res.render('./users/perfil-user-edit', {user})
     
    
}
userCtrl.editPic = async (req, res) => {
    const imgUrl = randomNumber();
    const imageTempPath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const targetPath = path.resolve(`src/public/uploads/${imgUrl}${ext}`)

    const cvUrl = randomNumber();
    const cvTempPath = req.file.path;
    const extt = path.extname(req.file.originalname).toLowerCase();
    const targetPath_ = path.resolve(`src/public/uploads/${cvUrl}${extt}`)



    if (ext === '.png' || ext === '.jpeg' ||ext === '.jpg' || ext === '.gif' ){
        await fs.rename(imageTempPath, targetPath);
        // const newImg = {
        //     filename: imgUrl + ext
        // }
        const newImg = imgUrl+ext
        console.log(typeof(newImg))
        console.log(newImg +'ohshit')

        //const userpic = JSON.stringify(newImg);
        console.log(typeof(userpic))
        //console.log(userpic)
        
        const imageSaved = await User.findByIdAndUpdate(req.user.id,{$set:{filename:newImg}})
       // console.log(typeof(userpic))
    
        // await User.findByIdAndUpdate(req.user.id,{$addToSet:{ filename:newImg}})
        console.log(typeof(newImg))
        console.log(newImg +'ohshit')
        console.log(imageSaved+'ohshit2')
        console.log(typeof(imageSaved))
    } else if(extt === '.pdf') {
        // await fs.unlink(imageTempPath);
        // res.status(500).json({error: 'Solo imagenes son admitidas'});

            await fs.rename(cvTempPath, targetPath_);
           
            const newCv = cvUrl+extt
         
    
          
            
            const cvSaved = await User.findByIdAndUpdate(req.user.id,{$set:{cvfilename:newCv}})
         
            console.log(typeof(newCv))
            console.log(newCv )
            console.log(cvSaved)
            console.log(typeof(cvSaved))
            console.log('aaaaaaa')
       
    } else {
         await fs.unlink(imageTempPath);
        res.status(500).json({error: 'Solo imagenes son admitidas'});
    }
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


userCtrl.descargarCv = async (req,res) => {
    const  idUser = await User.findByIdAndUpdate(req.user.id)
    console.log(idUser)
}


userCtrl.paymentMembership = async(req, res) => {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:4000/user/sucess",
            "cancel_url": "http://localhost:4000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Red Sox Hat",
                    "sku": "001",
                    "price": "25.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "25.00"
            },
            "description": "Hat for the best team ever"
        }]
    };
    
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
          throw error;
      } else {
          for(let i = 0;i < payment.links.length;i++){
            if(payment.links[i].rel === 'approval_url'){
              res.redirect(payment.links[i].href);
            }
          }
      }
    });
}


//Exportando Modulo
module.exports = userCtrl;


