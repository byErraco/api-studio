//Creacion de controlador
const applicationsCtrl = {}

//Importancion de modulos
const Applications = require('../models/Applications');
const Jobs = require('../models/Jobs');
const User = require('../models/Users');
const nodemailer = require('nodemailer')

//Vista de creacion de aplicacion
applicationsCtrl.newApplicantions = async (req, res) => {
    if (req.user) {
        console.log(1)
        if (req.user.tipo_cuenta === 'Freelancer') {
            console.log(2)
            const appliJobs = await Applications.findOne({ id_jobs: req.body.id_anuncio, id_applicant: req.user.id })
            if (appliJobs !== null) {
                console.log(appliJobs)
                req.flash('error_msg', 'Ya te has postulado para este anuncio')
                res.redirect('/lista-trabajos');
                console.log(3)
            } else {
                const { id_jobs, id_applicant, name_applicant, email_applicant, phone_applicant, message,email_user } = req.body;
                const profile_img = await User.findOne({profile_img: req.user.filename});
                console.log(profile_img)
                console.log('fotofoto')
                const newApplicant = new Applications({ id_jobs, id_applicant, name_applicant, email_applicant, phone_applicant, message,profile_img:req.user.filename });
                await newApplicant.save();
                if(newApplicant){
                    contentHTML = `
                    <h1>Información del usuario</h1>
                    <ul>
                        <li>Nombre de usuario: ${name_applicant}</li>
                       
                        <li>Número de contacto: ${phone_applicant}</li>
                        
                    </ul>
                    <p>${message}</p>
                `;
                console.log(contentHTML)
                console.log("Contacto");
                const transporter = nodemailer.createTransport({
                    host: 'mail.studio73pty.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'test_web@studio73pty.com',
                        pass: '123456qwerty'
                    },
                    tls:{
                        rejectUnauthorized: false
                    }
                })
                console.log(email_user);

                    try {
                        const info = await transporter.sendMail({
                            from: "'Studio73pty Server' <test_web@studio73pty.com>",
                            to: email_user,
                            subject:'Webiste contact form',
                            //text:'hello world'
                            html: contentHTML
                        })
                    
                        console.log('message sent', info.messageId)
                    //req.flash('success_msg', 'Solicitud Enviada')
                    res.redirect('/')
                        
                    } catch (error) {
                        
                    }

            
                }
                
            }
        } else {
            req.flash('error_msg', 'Accion solo permitida para los Freelancers');
            res.redirect('/')
        }
    }
};

module.exports = applicationsCtrl;