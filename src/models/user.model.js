const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};

const userModel = new Schema({
    nombre_completo: { type: String, required: [true, 'El nombre es requerido'] },
    email: { type: String, required: [true, 'El correo es requerido'], unique: true },
    contrasena: { type: String, required: [true, 'La contraseña es requerida'] },
    rol: { type: String, default: 'USER_ROLE', enum: rolesValidos },
    estado: { type: Boolean, default: true },
    google: { type: Boolean, default: false },
    fecha: { type: Date, default: Date.now() }
}, {
    timestamps: true
});

userModel.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.contrasena;

    return userObject;
}

module.exports = mongoose.model('users', userModel);
