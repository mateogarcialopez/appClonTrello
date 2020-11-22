const mongoose = require('mongoose');
const { schema } = require('./user.model');
const Schema = mongoose.Schema;

let noteModel = new Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'users' }, //nombre de la coleccion en mongo
    img: { type: String, default: null }
});

module.exports = mongoose.model('notes', noteModel);