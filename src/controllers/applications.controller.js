//Creacion de controlador
const applicationsCtrl = {}

//Importancion de modulos
const Applications = require('../models/Applications');
const Jobs = require('../models/Jobs');
const User = require('../models/Users');

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
                const { id_jobs, id_applicant, name_applicant, email_applicant, phone_applicant, message } = req.body;
                const profile_img = await User.findOne({profile_img: req.user.filename});
                console.log(profile_img)
                console.log('fotofoto')
                const newApplicant = new Applications({ id_jobs, id_applicant, name_applicant, email_applicant, phone_applicant, message,profile_img:req.user.filename });
                await newApplicant.save();
                //req.flash('success_msg', 'Solicitud Enviada')
                res.redirect('/')
            }
        } else {
            req.flash('error_msg', 'Accion solo permitida para los Freelancers');
            res.redirect('/')
        }
    }
};

module.exports = applicationsCtrl;