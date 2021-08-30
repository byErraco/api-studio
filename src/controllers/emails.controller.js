const  nodemailer  =  require ( 'nodemailer' );
const multer = require('multer');
const Email = require('../../utils/email');

const pug = require('pug');
const htmlToText = require('html-to-text');


const emailCtrl = {}


const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/brief');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    // cb(null, `service-${req.body.name}-${Date.now()}.${ext}`);
    cb(null, `service-${Date.now()}.${ext}`);


  },
});

const multerFilter = (req, file, cb) => {
  console.log(file);
  if (file.mimetype.startsWith('image')) {
  // if (file.mimetype.startsWith('application')) {
      console.log('yes')
    cb(null, true);
  } else {
    cb( console.log('error, no es una imagen'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

emailCtrl.uploadServiceImages = upload.single('file_upload_1');
emailCtrl.enviarBrief = async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    const {descripcionNegocio, direccionNegocio, telefonoNegocio, redFacebook,
    redInstagram, redYoutube, redTwitter, redOtra, enlaceWeb, nombreDeUsuarioWeb,contraseñaWeb,
    nombredominioPropuesto,enlaceHostingWeb, userCorreoHostingWeb, passwordHostingWeb, webAnteriorEnlace,
    webAnteriorLikeDislike, enlaceWebAutoadministrable, usuarioWebAutoadministrable, contraseñaWebautoadministrable,enlaceWebSimilar,
    enlaceWebSimilarLike, color_one,color_two,color_three, ideasWeb
    } = req.body;
    const html = pug.renderFile(`${__dirname}/../../views/email/welcome.pug`, {

    //   firstName: 'test',
    //   subject: 'this is a test',
    descripcionNegocio, direccionNegocio, telefonoNegocio, redFacebook,
    redInstagram, redYoutube, redTwitter, redOtra, enlaceWeb, nombreDeUsuarioWeb,contraseñaWeb,
    nombredominioPropuesto,enlaceHostingWeb, userCorreoHostingWeb, passwordHostingWeb, webAnteriorEnlace,
    webAnteriorLikeDislike, enlaceWebAutoadministrable, usuarioWebAutoadministrable, contraseñaWebautoadministrable,enlaceWebSimilar,
    enlaceWebSimilarLike, color_one,color_two,color_three, ideasWeb
    });

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'studio73pty.noreply@gmail.com',
            pass: 'pfiakggdypqridiq'
        },
        tls:{
            rejectUnauthorized: false
        }

    })

    try {
        const info = await transporter.sendMail({
            from: "'Studio73pty' <test_web@studio73pty.com>",
            // to: "info@studio73pty.com",
            to: 'pamcumares@gmail.com',

            subject:'Formulario de contacto',
            html: html,
            text: htmlToText.fromString(html),
        })
     
        console.log('message sent', info.messageId)
          res.status(200).json({
            status: 'success',
            message: 'Correo enviado correctamente.' 
        });
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: 'error',
            message: 'Intente de nuevo.' 
        });
    }
};

module.exports = emailCtrl;
