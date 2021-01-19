const {Schema, model} = require('mongoose');
const bcryptj = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate-v2')

const UserSchema = new Schema({
    username: {type: String, required: true},
    nombre_empresa: {type: String},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    tipo_cuenta: {type: String, required: true},
    ciudad: {type: String, required: true},
    pais: {type: String, required: true},
    acerca: {type: String},
    cargo: {type: String},
    direccion: {type: String},
    salario: {type: Number},
    rrss: {type: Object},
    trabajos: {type: Object},
    estudios: {type: Object},

},
    {
        timestamps: true
    });

UserSchema.methods.encryptPassword = async password => {
    const salt = await bcryptj.genSalt(10);
    return await bcryptj.hash(password, salt);
}

UserSchema.methods.matchPassword = async function(password) {
    return await bcryptj.compare(password, this.password)
}

UserSchema.plugin(mongoosePaginate);

module.exports = model('Users', UserSchema)