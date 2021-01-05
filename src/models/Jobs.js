const {Schema, model} = require('mongoose');

const JobsSchema = new Schema({
    id_user: {type: String, required: true},
    titulo_trabajo: { type: String, required: true},
    email: {type: String, required: true},
    tipo_trabajo: {type: String, required: true},
    ubicacion: {type: String, required: true},
    salario: {type: Number, required: true},
    cat_trabajo: {type: String, required: true},
    etiqueta: { type: String },
    url: {type: String},
    descripcion: {type: String, required: true}
},
    {
        timestamps: true
    });

module.exports = model('Jobs', JobsSchema)
