//Modulos requeridos
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer')


//Controlador de Email
const { enviarEmaildeContacto } = require('../controllers/emails.controller');

//Ruta de creacion de aplicacion a anuncio
//router.post('/formulario-contacto', enviarEmaildeContacto, crearMensajeDeContacto)
router.post('/send-mail', async (req,res) => {
    const { name, email, phone, message } = req.body;

    contentHTML = `
        <h1>Informacion del usuario</h1>
        <ul>
            <li>Nombre de usuario: ${name}</li>
            <li>Correo electrónico: ${email}</li>
            <li>Número de contacto: ${phone}</li>
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

    try {
        const info = await transporter.sendMail({
            from: "'Studio73pty Server' <test_web@studio73pty.com>",
            to: "studio73pty@gmail.com",
            subject:'Formulario de contacto',
    
            html: contentHTML
        })
     
        console.log('message sent', info.messageId)
        res.redirect('https://studio73pty.studio73pty.com/sucess.html')
        
    } catch (error) {
        console.log(error)
    }
    
    
})

router.post('/send-mail-user/', async (req,res) => {
    

    const { username, email, message, email_user } = req.body;
    console.log(username)
    console.log(email_user)


    contentHTML = `
        <h1>Información de usuario</h1>
        <ul>
            <li>Nombre de usuario: ${username}</li>
        </ul>
        <p>${message}</p>
    `;
    console.log(contentHTML)
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
    try {
        const info = await transporter.sendMail({
            from: "'Studio73pty Server' <test_web@studio73pty.com>",
            to: `${email_user}`,
            
            subject:'Alguien quiere contactar contigo!',
            //text:'hello world'
            html: contentHTML
        })
        res.redirect('/')
        
    } catch (error) {
        console.log(error)
    }
    
    
    
})

//Exportando modulo
module.exports = router;
