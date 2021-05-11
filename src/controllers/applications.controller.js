//Creacion de controlador
const applicationsCtrl = {}
const paypal = require('paypal-rest-sdk')

//Importancion de modulos
const Applications = require('../models/Applications');
const Payment = require('../models/Payment');
const PaymentReport = require('../models/PaymentReport');

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

applicationsCtrl.newPay = async (req, res) => {
    const { id_applicant,salario, email_applicant, name_applicant,id_jobs,email } = req.body;

    const newPayment = new Payment({id_jobs,id_applicant,email_applicant,monto_pago:salario,email_employe:email,payed_user:name_applicant});

    var price = parseFloat(salario);
    var tempTotal= (price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://freelance26.herokuapp.com/user/sucess",
            "cancel_url": "http://freelance26.herokuapp.com/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Pago",
                    "sku": "001",
                    "price": tempTotal,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": tempTotal
            },
            "description": "Pago servicio freelance"
        }]
    };

    paypal.payment.create(create_payment_json,  function  (error, payment) {
        if (error) {
            throw error;
        } else {
            for(let i = 0;i < payment.links.length;i++){
              if(payment.links[i].rel === 'approval_url'){
                res.redirect(payment.links[i].href);
                
              }
              console.log('EXITO11')
            }
            newPayment.save();

        }
      });
  
      

    
    
};


applicationsCtrl.newReport = async (req, res) => {
    console.log(req.body);
    const { id_payment,token, id_payer,email, monto,id,tipo_cuenta } = req.body;

    var monto_pagado = parseFloat(monto);
    var montoTotal = (monto_pagado).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

    const newPayment = new PaymentReport({id_payment,token,id_payer,monto:montoTotal,email,id_user:id,tipo_cuenta});

        await newPayment.save();
        req.flash('success_msg', 'Anuncio Publicado Correctamente')
        res.redirect('/')
};


module.exports = applicationsCtrl;